import { HttpClient, HttpParams } from '@angular/common/http';
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
    console.log(formData);
    let body = new FormData();
    body.append('file', formData.file);

    let params = new HttpParams()
      .set('rutClient', formData.rutClient)
      .set('typeDocument', formData.typeDocument);

    return this.http.post(`${base_url}/inmobiliaria/document`, body,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      params: params
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

  personaContratos(): Observable<Document[]> {
    return this.http.get<any>(`${ base_url }/list-document-contrato`,{
      headers:{
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp) => {
          if (resp.status === 'success' && resp.data.documents){
            return resp.data.documents;
          }else{
            console.error('Error:', resp);
            return null
          }
      })
    );
  }
  validarRut(rut: string): Observable<boolean> {
    return this.http.get(`${base_url}/get-clients-by-rut?rut=${rut}`,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {

        if (resp.status === 'success' && resp.data.types && resp.data.types.Contrato) {
          // Manejar el caso cuando el tipo es Conglomerado
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
