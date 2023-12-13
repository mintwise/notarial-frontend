import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



@NgModule({
  declarations: [
    HeaderComponent,
    PdfViewerComponent,
  ],
  exports: [
    HeaderComponent,
    PdfViewerComponent,
  ],
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,

  ]
})
export class SharedModule { }
