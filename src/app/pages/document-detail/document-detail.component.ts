import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadDocService } from 'src/app/services/upload-doc.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit{
  showModal = false;
  showRevModal = false;
  showStatus=false;
  showDelete = false;
  success=true;
  message: string = ''; 
  session = localStorage.getItem('rol');
  correo = localStorage.getItem('correo')
  public documento: any = [];
  public id: string = '';
  fileBase64: string = '';

  public uploadForm = this.fb.group({
    file: [null, Validators.required]
  });


  constructor( private route: ActivatedRoute, private router: Router, private documentService: UploadDocService, private fb: FormBuilder){
  }

  ngOnInit(): void {
    this.showModal=!this.showModal;
    var id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.getDocumentData(id);
    }
  }

  getDocumentData(id: string){
    this.documentService.listarDocumento(id).subscribe((data)=>{
      this.documento = data;
      this.showModal = !this.showModal;
    });
  }

  deleteDocument(id:string){

    this.showDelete = true;
      
    setTimeout(() => {
      // Ocultar el modal después de 3 segundos
      this.showDelete = false;
     }, 3000);

    this.documentService.eliminarDocumento(id).subscribe((data)=>{

      if(data){
        this.router.navigate(['/documents']); // Reemplaza '/otro-path' con tu ruta real
      }
    });
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

  updateDocument(id:string){
    //Abrir modal subida de archivo
    this.showRevModal = true; //crear variable para modal de subida de archivo

    let body = {
      id: id,
      correo: this.correo,
      base64: this.fileBase64,
    }

    this.documentService.actualizarDocumento(id, body).subscribe((data)=>{
      if( data ){
        //Actualizar página
        this.mostrarModal('Documento reemplazado con éxito',false);
        //Actualizar Documento
        this.getDocumentData(id);
        this.showRevModal = false; //cerrar modal cuando se recargue la página
      } else if( data === null ){
        this.mostrarModal('Error al reemplazar documento',true);
        this.limpiar();
      }
    });
  }

  

  descargarPdf(b64: string, nombre: string){
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
    link.download = nombre,'.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Libera el objeto URL creado
    URL.revokeObjectURL(url);
  }
  
  limpiar(){
    this.uploadForm.reset();
    this.fileBase64='';
  }

}

