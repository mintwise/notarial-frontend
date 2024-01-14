import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CertificateService } from 'src/app/services/certificate.service';
import { SignDocumentService } from 'src/app/services/sign-document.service';
import { UploadDocService } from 'src/app/services/upload-doc.service';

@Component({
  selector: 'app-document-certification-action',
  templateUrl: './document-certification-action.component.html',
  styleUrls: ['./document-certification-action.component.css']
})
export class DocumentCertificationActionComponent implements OnInit{
  showModal = false;
  showStatus = false;
  showCerModal =true;
  loading = false;
  success=true;
  message='';
  idBody='';
  public uploadForm = this.fb.group({
    file: [null, Validators.required]
  });
  public base64CongTemp:string = '';
  public documento: any = [];
  public id: string = '';
  fileBase64: string = '';
  stepFlag=false;
  constructor( private fb: FormBuilder, private route: ActivatedRoute, private documentService: UploadDocService, private signService: SignDocumentService, private certificateService: CertificateService){
  }

  ngOnInit(): void {
    this.showModal=!this.showModal;
    var id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.obtenerConglomerado(id);
      this.id = id;
      this.getDocumentData(id);
    }
  }
  certificarDocumento() { 
    let body = {
      base64: this.fileBase64,
    }
    this.loading=!this.loading;
    this.limpiar();
    this.certificateService.certificarDocumento(this.idBody,body).subscribe(
      resp => {
        
        if( resp.status === 'success'){
          this.loading=!this.loading;
          this.mostrarModal('¡Documento Certificado!',false)

        }else{
          console.log("Mensaje del servidor:", resp);
        }
      },
      error => {
        console.error("Error al cargar el documento:", error)
        this.mostrarModal('¡Error al Certificar el documento!',true)
      }
    );
  }

  onFileSelected(event:any) {
    const reader = new FileReader();
    const file:File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      reader.onload = (event: any) => {
        const base64String = event.target.result.split(',')[1];
        this.fileBase64 = base64String;
      };
      reader.readAsDataURL(file);
    } else if (file.type !== 'application/pdf') {
      this.limpiar();
      //modal de error de carga
      this.mostrarModal('El documento debe ser en formato PDF.',true)
      console.error('Por favor, selecciona un archivo PDF.');
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

  obtenerConglomerado(id:string) {
    this.certificateService.obtenerConglomerado(id)
    /*
    .pipe(
      map((resp: any) => {
        console.log('Dentro de map:', resp);
        if (resp.status === 'success' && resp.data.document) {
          console.log('Respuesta del servicio:', resp);
          this.base64CongTemp = resp.data.document.base64Document
        } else {
          console.error('Error en la respuesta del servicio:', resp);
        }
      })
    )*/
    .subscribe(
    (data) => {
      this.base64CongTemp = data;
    },
    (error) => {
      console.error('Error al obtener el conglomerado', error);
    }
  );
    
  }
  descargarPdf(b64: string){
    let base64PDF=b64;
    // Decodifica el base64 y crea un Blob con el contenido
    const binaryPDF = atob(base64PDF);
    const arrayBuffer = new ArrayBuffer(binaryPDF.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < binaryPDF.length; i++) {
      uint8Array[i] = binaryPDF.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
  
    // Crea un objeto URL para el Blob y abre una nueva ventana para descargar el PDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.documento.filenameDocument,'.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Libera el objeto URL creado
    URL.revokeObjectURL(url);
    this.stepFlag=true;
  }

}

