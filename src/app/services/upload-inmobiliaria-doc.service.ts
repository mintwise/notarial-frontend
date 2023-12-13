import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map , of} from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UploadInmobiliariaDoc {
  token = localStorage.getItem('token');
  constructor( private http: HttpClient) { }
  
  cargarDocumento( formData: any): Observable<any> {
    return this.http.post(`${base_url}/inmobiliaria/document`, formData,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {

        if (resp.status === 'success' && resp.data){
          return resp.data;
        }else{
          console.error('Error:', resp);
          return null
        }
      }),
      catchError(error=> of(false) )
    );
  }
  validarRut(rut: string): Observable<boolean> {
    return this.http.get(`${base_url}/get-clients-by-rut?rut=${rut}`,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {
        console.log('Respuesta del servicio:', resp);

        if (resp.status === 'success' && resp.data.types && resp.data.types.Contrato) {
          // Manejar el caso cuando el tipo es Conglomerado
          console.log('Es un Conglomerado. Datos del Conglomerado:', resp.data.types);
          return resp.data.types.Contrato;
        } else {
          console.log('Error en la respuesta del servicio:', resp);
          return false;
        }
      })
    );
  }
  listarDocumento(id:string){

    return this.http.get<any>(`${ base_url }/document/${id}`,{
      headers:{
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {
        if (resp.status === 'success' && resp.data.document){
          return resp.data.document;
        }else{
          console.error('Error:', resp);
          return null
        }
      }),
      catchError(error=> of(false) )
    );
  }
}
