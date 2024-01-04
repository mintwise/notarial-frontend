import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})

export class PdfViewerComponent {
  @Input() pdfBase64: string = '';
  @Input() minHeight: string = '';
  @Input() height: string = '';

}
