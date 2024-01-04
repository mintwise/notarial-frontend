import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadDocService } from 'src/app/services/upload-doc.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit{
  showModal = false;
  showDelete = false;
  session = localStorage.getItem('rol')
  public documento: any = [];
  public id: string = '';
  constructor( private route: ActivatedRoute, private router: Router, private documentService: UploadDocService){
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

}
