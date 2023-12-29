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

}
