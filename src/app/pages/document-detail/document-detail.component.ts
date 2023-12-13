import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadDocService } from 'src/app/services/upload-doc.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit{
  showModal = false;
  public documento: any = [];
  public id: string = '';
  constructor( private route: ActivatedRoute, private documentService: UploadDocService){
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
      console.log('data', this.documento)
    });
  }
}
