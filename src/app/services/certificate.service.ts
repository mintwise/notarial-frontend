import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    return this.http.post(`${base_url}/notaria/certificate/${id}`, formData,{
      headers:{
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => resp.message)
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
