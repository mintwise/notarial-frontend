import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UploadDocService {
  private token= localStorage.getItem('token');
  constructor( private http: HttpClient) { }


  cargarDocumento( formData: any): Observable<any> {
    let body = new FormData();
    body.append('file', formData.file);
    
    let params = new HttpParams()
      .set('nameClient', formData.nameClient)
      .set('rutClient', formData.rutClient)
      .set('emailClient', formData.emailClient)
      .set('typeDocument', formData.typeDocument);

    return this.http.post(`${base_url}/notaria/document`, body,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      params: params
    }).pipe(
      map((resp: any) => {
        if (resp.status === 'success' && resp.data.document){
          return resp.data;
        }else{
          console.error('Error:', resp);
          return null
        }
      })
    );
  }

  obtenerDatos(): Observable<Document[]> {
    return this.http.get<any>(`${ base_url }/documents`,{
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
  listarDocumento(id:string){

    return this.http.get<any>(`${ base_url }/document/${id}`,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp) => {
        if (resp.status === 'success' && resp.data.document){
          if(resp.data.document.url != ''){
            return resp.data.document;
          }
        }else{
          console.error('Error:', resp);
          return null
        }
      })
    );
  }

  actualizarDocumento(id:string, formData: any): Observable<any>{

    let body = new FormData();
    body.append('file', formData.file);


    return this.http.post<any>(`${ base_url }/api/update-document-fea/?id=${id}`,body,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp) => {
        if (resp.status === 'success'){
          return resp;
        }else{
          console.error('Error:', resp);
          return null
        }
      })
    );
  }  
  eliminarDocumento(id:string){
    return this.http.delete<any>(`${ base_url }/document/${id}`,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map((resp) => {
        if (resp.status === 'success'){
          return resp.message;
        }else{
          console.error('Error:', resp);
          return null
        }
      })
    );
  }
}
