import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignDocumentService } from 'src/app/services/sign-document.service';
import { UploadDocService } from 'src/app/services/upload-doc.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-sign-action',
  templateUrl: './document-sign-action.component.html',
  styleUrls: ['./document-sign-action.component.css']
})
export class DocumentSignActionComponent implements OnInit{
  showModal = false;
  showStatus = false;
  showFirModal=false;
  loading = false;
  success=true;
  message='';
  idBody='';
  public uploadForm = this.fb.group({
    file: [null]
  });
  public documento: any = [];
  public id: string = '';
  fileBase64: string = '';
  checkboxChecked=false;
  nombreUsuario = localStorage.getItem('nombre');
  correoUsuario = localStorage.getItem('correo');
  rutUsuario = localStorage.getItem('rut');
  stepFlag=false;

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private documentService: UploadDocService, private signService: SignDocumentService){
  }

 
  ngOnInit(): void {
    this.showModal=!this.showModal;
    var id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.getDocumentData(id);
      this.id=id;
    }
  }
  firmarDocumento() { 
    let body = {
      email: localStorage.getItem('correo'),
      signOne: this.fileBase64,
    }
    this.loading=!this.loading;
    this.limpiar();
    this.signService.firmarDocumento(this.idBody,body).subscribe(
      mensaje => {
        
        if( mensaje != ''){
          this.loading=!this.loading;
          this.mostrarModal('¡Firma Exitosa!',false);
          this.getDocumentData(this.id);
        }else{
          console.log("Mensaje del servidor:", mensaje);
        }

      },
      error => {
        console.error("Error al cargar el documento:", error)
        this.showFirModal=false
        this.mostrarModal('¡Error al cargar el documento!',true)
      }
    );
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type === 'image/png') {
      this.fileBase64 = await this.resizeAndConvertToBase64(file);
    } else if(file.type !== 'image/png'){
      this.limpiar(),
      this.mostrarModal('Debes adjuntar un archivo .png',true)
      console.error('Por favor, selecciona un archivo PNG.');
    }
  }

  private async resizeAndConvertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onload = (readerEvent: any) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.error('No se pudo obtener el contexto del lienzo.');
            resolve('');
            return;
          }

          const targetWidth = 1280;
          const targetHeight = 750;

          let newWidth = targetWidth;
          let newHeight = targetWidth / (img.width / img.height);

          if (newHeight > targetHeight) {
            newHeight = targetHeight;
            newWidth = newHeight * (img.width / img.height);
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };

        img.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

    limpiar(){
      this.uploadForm.reset();
      this.fileBase64='';
    }
    mostrarModal(message:string, bool: boolean) {
      this.showStatus = true;
      if(bool==true){
        this.success=false;
        this.message=message;
      }else if(bool == false){
        this.success=true;
        this.message=message;
      }
      setTimeout(() => {
        this.showStatus = false;
      }, 1500); // 3000 milisegundos = 3 segundos
    }
  getDocumentData(id: string){
    this.idBody=id;
    this.documentService.listarDocumento(id).subscribe((data)=>{
      this.documento = data;
      this.showModal = !this.showModal;
    });
  }

  cerrarModalFirma(){
    this.stepFlag=false;
    this.showFirModal=false;
    this.checkboxChecked=false;
  }

}