import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UploadDocService } from 'src/app/services/upload-doc.service';

@Component({
  selector: 'app-document-sign',
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.css']
})
export class DocumentSignComponent implements OnInit{
  public documentos: any = []
  public documentosPendientes: any = []
  showModal = false;
  showStatus = false;
  searchText: string = '';
  searchForm: FormGroup;

  filteredDocumentos: any = []; // Almacena los datos filtrados
  currentPage: number = 1;
  totalDocumentos: number = this.documentos.length;
  constructor( 
      private documentService: UploadDocService,
      private router: Router,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder){
        this.searchForm = this.formBuilder.group({
          rutClient: ['', Validators.required]
        });
      }
  ngOnInit(): void {
    this.showModal=!this.showModal;
    this.obtenerDocumentos();
  }
  search() {
    this.documentos = this.filterTableData();
    // Puedes asignar los documentos filtrados a otra variable si es necesario
  }
  filterTableData() {
    const searchTerm = this.searchForm.get('rutClient')?.value.toLowerCase();
    // Filtrar documentos basado en el rutClient
    if (searchTerm.trim() === '') {
      // Si el campo de búsqueda está vacío, mostrar todos los documentos
      // Puedes ajustar esta lógica según tus necesidades
      return this.documentos;
    } else {
      return this.documentos.filter((doc:any) => doc.rutClient.toLowerCase().includes(searchTerm));
    }
  }
  formatRut() {
    // Lógica para formatear el Rut de Chile
    const rut = this.searchForm.get('rutClient')?.value;
    if (rut) {
      // Limpiar caracteres no válidos
      const cleanedRut = rut.replace(/[^\dkK]+/g, '');
  
      // Dividir el rut en parte numérica y dígito verificador
      const rutNumber = cleanedRut.slice(0, -1);
      const rutVerifier = cleanedRut.slice(-1);
  
      // Formatear parte numérica con puntos
      const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
      // Unir las partes con guion y actualizar el valor del formulario
      const formattedRut = `${formattedNumber}-${rutVerifier}`;
      this.searchForm.patchValue({ rutClient: formattedRut });
    }
  }
  obtenerDocumentos(){
    this.documentService.obtenerDatos().subscribe((data)=>{
      this.documentosPendientes = data.filter((documento:any) =>
        documento.state === 'Pendiente Firma' ||
        documento.state === 'Pendiente Firma 1' ||
        documento.state === 'Pendiente Firma 2'
      )
      // Ordenar la data filtrada por fecha (createdAt) en orden descendente
      this.documentos = this.documentosPendientes.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.showModal = !this.showModal;

    });
  }
  getPaginationClass(page: number): string {
    // Aquí puedes definir la lógica para asignar clases según tu diseño
    // Por ejemplo, puedes tener una lógica para resaltar la página actual
    return `flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition duration-300 ease-in-out ${page === this.currentPage ? 'font-bold' : ''}`;
  }
  cambiarPagina(page: number): void {
    this.currentPage = page;
  }
  idDoc(id:string){
    this.router.navigate(['/document-sign-action',id])
  }
}


