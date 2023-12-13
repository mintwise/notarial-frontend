import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor( private http: HttpClient) { }


    validarToken():Observable<boolean> {
      const token = localStorage.getItem('token') || '';

      return this.http.get(`${base_url}/api/validate-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).pipe(
        map(resp=>true),
        catchError(error=> of(false) )
      );
    }

    login(formData: any): Observable<boolean> {
      return this.http.post(`${base_url}/login`, formData)
        .pipe(
          map((resp: any) => {
            if (resp.status === 'success' && resp.data) {
              const userData = resp.data;
  
              // Almacenar los campos en el localStorage
              localStorage.setItem('rut', userData.rut);
              localStorage.setItem('nombre', userData.name);
              localStorage.setItem('correo', userData.email);
              localStorage.setItem('rol', userData.role);
              localStorage.setItem('token', userData.token);
  
              return true;
            } else {
              console.error('Error:', resp);
              return false;
            }
          })
        );
    }
}