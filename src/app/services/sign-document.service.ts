import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class SignDocumentService {
   token= localStorage.getItem('token');
  constructor( private http: HttpClient) { }


  firmarDocumento( id:string ,formData: any): Observable<any> {

    return this.http.post(`${base_url}/inmobiliaria/signDocument/${id}`, formData,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp: any) => {
        if (resp && resp.status === 'success') {
          // La solicitud fue exitosa
          return resp.data.signTemplate.base64Document;
        } else {
          // Manejar otros escenarios según sea necesario
          throw new Error('La solicitud no fue exitosa');
        }
      })
    );

  }
}
