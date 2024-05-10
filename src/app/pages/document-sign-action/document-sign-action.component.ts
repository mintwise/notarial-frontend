import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignDocumentService } from 'src/app/services/sign-document.service';
import { UploadDocService } from 'src/app/services/upload-doc.service';
import { FormsModule } from '@angular/forms';
import { Base64Service } from 'src/app/services/base64.service';

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
  pdf: (() => string) | undefined ;
  file: any;
  public uploadForm = this.fb.group({
    file: [null, Validators.required]
  });
  public documento: any = [];
  public id: string = '';
  fileBase64: string = '';
  checkboxChecked=false;
  nombreUsuario = localStorage.getItem('nombre');
  correoUsuario = localStorage.getItem('correo');
  rutUsuario = localStorage.getItem('rut');
  stepFlag=false;

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private documentService: UploadDocService, private signService: SignDocumentService, private fileConverter: Base64Service){
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
      file: this.file,
    }
    this.loading=!this.loading;
    this.limpiar();
    this.signService.firmarDocumento(this.idBody,body).subscribe(
      resp => {
        
        if( resp === 'success'){
          this.loading=!this.loading;
          this.cerrarModalFirma();
          this.mostrarModal('¡Firma Exitosa!',false);
          this.getDocumentData(this.id);
        }else{
          console.log("Mensaje del servidor:", resp);
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
      this.file=file;
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
    getDocumentData(id: string) {
      this.idBody = id;
      this.documentService.listarDocumento(id).subscribe((data) => {
        this.documento = data;
        if (this.documento) {
          this.fileConverter.getUrlAsBase64(this.documento.url).subscribe((data) => {
            if (typeof data === 'string') {
              // Si data es una cadena, asignarla a fileBase64
              this.fileBase64 = data;
            } else if (data === null) {
              // Si data es null, asignar un valor predeterminado o manejar el caso según lo necesites
              this.fileBase64 = ''; // o cualquier otro valor predeterminado que desees
            } else {
              // Si data es undefined u otro tipo, manejarlo según lo necesites
              console.error('El valor recibido no es válido.');
            }
          });
        }
        this.showModal = false;
      });
    }

  cerrarModalFirma(){
    this.stepFlag=false;
    this.showFirModal=false;
    this.checkboxChecked=false;
  }

  volverInicio(){
    const rutaDestino = '/documents';
    this.router.navigate([rutaDestino]);
  }

}