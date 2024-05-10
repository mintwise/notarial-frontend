import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  token= localStorage.getItem('token');
  constructor( private http: HttpClient) { }

  
  certificarDocumento( id:string ,formData: any): Observable<any> {
    
    let body = new FormData();
    body.append('file', formData.file);

    return this.http.post(`${base_url}/notaria/certificate/${id}`, body,{
      headers:{
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {
        if (resp.status === 'success') {
          // La solicitud fue exitosa
          return resp;
        } else {
          // Manejar otros escenarios según sea necesario
          throw new Error('La solicitud no fue exitosa');
        }
      })
    );

  }

  obtenerConglomerado( id:string ): Observable<any> {

    return this.http.post(`${base_url}/notaria/conglomeradoTemplate/${id}`,null,{
      headers:{ 
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {
        if (/**resp.status === 'success' &&*/ resp.data.base64conglomerado) {
          return resp.data.base64conglomerado;
        } else {
          console.error('Error en la respuesta del servicio:', resp);
          return null;
        }
      })
    );

  }

}
