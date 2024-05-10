import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Base64Service } from 'src/app/services/base64.service';
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
  showCerModal =false;
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
  file: any;
  stepFlag=false;
  constructor( private fb: FormBuilder, private fileConverter: Base64Service, private route: ActivatedRoute, private router: Router, private documentService: UploadDocService, private signService: SignDocumentService, private certificateService: CertificateService){
  }

  ngOnInit(): void {
    this.showModal=true;
    var id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.obtenerConglomerado(id);
      this.id = id;
      this.getDocumentData(id);
    }
  }
  certificarDocumento() { 
    let body = {
      file: this.file,
    }
    this.loading=true;
    this.limpiar();
    this.certificateService.certificarDocumento(this.idBody,body).subscribe(
      resp => {
        
        if( resp.status === 'success'){
          console.log('exitoso')
          this.loading=false;
          this.showCerModal =false;
          this.mostrarModal('¡Documento Certificado!',false);
          this.getDocumentData(this.id);
        }else{
          this.loading=false;
          this.showCerModal = false;
          console.log("Mensaje del servidor:", resp);
        }
      },
      error => {
        this.showCerModal = false;
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
        this.file=file;
      };
      reader.readAsDataURL(file);
    } else if (file.type !== 'application/pdf') {
      this.limpiar();
      //modal de error de carga
      this.mostrarModal('El documento debe ser en formato PDF.',true)
      console.error('Por favor, selecciona un archivo PDF.');
    }
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
    link.download = this.documento.filenameDocument+'.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Libera el objeto URL creado
    URL.revokeObjectURL(url);
    this.stepFlag=true;
  }

  volverInicio(){
    const rutaDestino = '/documents';
    this.router.navigate([rutaDestino]);
  }
}


