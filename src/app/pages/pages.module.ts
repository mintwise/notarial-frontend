import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentSignComponent } from './document-sign/document-sign.component';
import { DocumentSignActionComponent } from './document-sign-action/document-sign-action.component';
import { DocumentCertificationComponent } from './document-certification/document-certification.component';
import { DocumentCertificationActionComponent } from './document-certification-action/document-certification-action.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentPolizaUploadComponent } from './document-poliza-upload/document-poliza-upload.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { RouterModule } from '@angular/router';
import { DocumentFEAComponent } from './document-fea/document-fea.component';
import { DocumentsVehiculosMotorizadosComponent } from './documents-vehiculos-motorizados/documents-vehiculos-motorizados.component';



@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentSignComponent,
    DocumentSignActionComponent,
    DocumentCertificationComponent,
    DocumentCertificationActionComponent,
    DocumentUploadComponent,
    DocumentPolizaUploadComponent,
    DocumentDetailComponent,
    DocumentSignComponent,
    DocumentSignActionComponent,
    DocumentPolizaUploadComponent,
    DocumentCertificationComponent,
    DocumentCertificationActionComponent,
    PagesComponent,
    DocumentFEAComponent,
    DocumentsVehiculosMotorizadosComponent,
  ],
  exports: [
    DocumentsComponent,
    DocumentSignComponent,
    DocumentSignActionComponent,
    DocumentCertificationComponent,
    DocumentCertificationActionComponent,
    DocumentUploadComponent,
    DocumentPolizaUploadComponent,
    DocumentDetailComponent,
    DocumentSignComponent,
    DocumentSignActionComponent,
    DocumentPolizaUploadComponent,
    DocumentCertificationComponent,
    DocumentCertificationActionComponent,
    PagesComponent,
    DocumentFEAComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    SharedModule,
    NgxPaginationModule,  
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
