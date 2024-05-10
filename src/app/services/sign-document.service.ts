import { HttpClient, HttpParams } from '@angular/common/http';
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

    let body = new FormData();
    body.append('file', formData.file);
    
    let params = new HttpParams()
      .set('id', id);

    return this.http.post(`${base_url}/inmobiliaria/signDocument/`, body,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      params: params
    }).pipe(
      map((resp: any) => {
        if (resp.status === 'success') {
          // La solicitud fue exitosa
          return resp.status;
        } else {
          // Manejar otros escenarios según sea necesario
          throw new Error('La solicitud no fue exitosa');
        }
      })
    );

  }
}
