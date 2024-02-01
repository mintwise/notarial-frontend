import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentFEAComponent } from './document-fea/document-fea.component';
import { DocumentCertificationComponent } from './document-certification/document-certification.component';
import { DocumentCertificationActionComponent } from './document-certification-action/document-certification-action.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentPolizaUploadComponent } from './document-poliza-upload/document-poliza-upload.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { DocumentSignComponent } from './document-sign/document-sign.component';
import { DocumentSignActionComponent } from './document-sign-action/document-sign-action.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
          { path:'documents', component: DocumentsComponent },
          { path:'documents-fea', component: DocumentFEAComponent },
          { path:'document-certification', component: DocumentCertificationComponent },
          { path:'document-certification-action/:id', component: DocumentCertificationActionComponent },
          { path:'document-upload', component: DocumentUploadComponent },
          { path:'document-poliza-upload', component: DocumentPolizaUploadComponent },
          { path:'document-detail/:id', component: DocumentDetailComponent },
          { path:'document-sign', component: DocumentSignComponent },
          { path:'document-sign-action/:id', component: DocumentSignActionComponent },
          { path:'', redirectTo:'/documents', pathMatch:'full' },
        ]
      },
]

@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[ RouterModule ],
})

export class PagesRoutingModule {

}