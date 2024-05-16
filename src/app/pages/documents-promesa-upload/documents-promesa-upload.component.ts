import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadDocService } from '../../services/upload-doc.service';

@Component({
  selector: 'app-documents-promesa-upload',
  templateUrl: './documents-promesa-upload.component.html',
  styleUrls: ['./documents-promesa-upload.component.css']
})
export class DocumentPromesaUploadComponent {
  roleUser= localStorage.getItem('rol');
  step=1;
  showModal = false;
  showStatus= false;
  loading = false;
  success=false;
  message='';
  file:any;
  formulario= FormGroup;
  public fileBase64='';
  public rut: string = '';
  public sessionRol = localStorage.getItem('rol');
  public formStep2 = this.fb.group
  public uploadForm = this.fb.group({
    rut: ['', [ Validators.required ]],
    nombre_client: ['', [ Validators.required ]],
    email_client: ['', [Validators.required, Validators.email]],
    nombre_doc: ['', [ Validators.required ]],
    tipo_doc: ['', [ Validators.required ]],
    file: [null, Validators.required]
  });




  constructor( private fb: FormBuilder,
      private documentService: UploadDocService) {}


      onFileSelected(event:any) {
        const reader = new FileReader();
        const file:File = event.target.files[0];

        if (file && file.type === 'application/pdf') {
          reader.onload = (event: any) => {
            this.file=file;
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


  
    nextStep(): void {
      this.step++;
    }
  
    prevStep(): void {
      this.step--;
    }

    onSubmit(): void{

    }

  cargarDocumento() { 
    
    let body = {
      nameResponsible: localStorage.getItem('nombre'),
      rutResponsible: localStorage.getItem('rut'),
      emailResponsible: localStorage.getItem('correo'),
      nameClient: this.uploadForm.get('nombre_client')?.value,
      rutClient: this.uploadForm.get('rut')?.value,
      emailClient: this.uploadForm.get('email_client')?.value,
      filenameDocument: this.uploadForm.get('nombre_doc')?.value,
      typeDocument: this.uploadForm.get('tipo_doc')?.value,
      file: this.file,
    }
    this.loading=!this.loading;
    this.limpiar();
    this.documentService.cargarDocumento(body).subscribe(
      mensaje => {
        
        if(mensaje='Documento agregado correctamente.'){
          this.loading=!this.loading;
          this.mostrarModal('¡Documento Cargado!',false)

        }
        console.log("Mensaje del servidor:", mensaje);
      },
      error => {
        console.error("Error al cargar el documento:", error)
        this.mostrarModal('Error al cargar documento.',true)
      }
    );
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
