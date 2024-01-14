import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UploadDocService } from 'src/app/services/upload-doc.service';
import { UploadInmobiliariaDoc } from 'src/app/services/upload-inmobiliaria-doc.service';

@Component({
  selector: 'app-document-poliza-upload',
  templateUrl: './document-poliza-upload.component.html',
  styleUrls: ['./document-poliza-upload.component.css']
})
export class DocumentPolizaUploadComponent implements OnInit{
  rutValido = true;
  roleUser= localStorage.getItem('rol');
  showModal = false;
  showStatus=false;
  loading = false;
  success=false;
  message='';
  public fileBase64='';
  public rut: string = '';
  public personas: any = []

  public uploadForm = this.fb.group({
    rut: ['', [ Validators.required ]],
    nombre_doc: ['', [ Validators.required ]],
    file: [null]
  });




  constructor( private fb: FormBuilder,
      private documentService: UploadDocService, private polizaService: UploadInmobiliariaDoc) {}


  ngOnInit(): void {
    this.cargarPersonas();
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

  cargarPersonas(){
    this.polizaService.personaContratos().subscribe((data)=>{
      this.personas = data;
    });
  }
  cargarDocumento() { 
    
    let body = {
      rutClient: this.uploadForm.get('rut')?.value,
      filenameDocument: this.uploadForm.get('nombre_doc')?.value,
      typeDocument: 'Poliza',
      base64Document: this.fileBase64,
    }
    this.loading=!this.loading;
    this.limpiar();
    this.polizaService.cargarDocumento(body).subscribe(
      mensaje => {
        
        if(mensaje='Conglomerado creado.'){
          this.loading=!this.loading;
          this.mostrarModal('¡Documento Cargado!',false)

        }
      },
      error => {
        console.error("Error al cargar el documento:", error)
        this.mostrarModal('Error al cargar documento.',true)
        this.loading=!this.loading;
      }
    );
  }

  validarRut(rut: string){
    this.polizaService.validarRut(rut).subscribe(
      (mensaje: boolean) => {
        
        if( mensaje === true ){
          //Si tiene
          this.rutValido = true;
        }else{
          //no tiene
          this.rutValido = false;
        }
      },
      
    );
  }
  limpiar(){
    this.uploadForm.controls['file'].reset(null);
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
  formatRut() {
    // Remover todos los caracteres no numéricos
    let cleanedRut = this.rut.replace(/[^0-9kK]+/g, '');

    // Separar los números antes del guión
    let part1 = cleanedRut.slice(0, -1);

    // Obtener el dígito verificador
    let verificador = cleanedRut.substr(-1);

    // Aplicar el formato con puntos y guión
    if (part1.length > 0) {
      part1 = part1.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Asignar el valor formateado nuevamente al input
    this.rut = part1 + '-' + verificador;
  }
}
