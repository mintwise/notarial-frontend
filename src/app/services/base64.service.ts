import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  constructor(private http: HttpClient) { }

  // Función para convertir un Blob a Base64
  private blobToBase64(blob: Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const base64String = reader.result?.toString()?.split(',')[1];
        if (base64String !== undefined) {
          resolve(base64String);
        } else {
          reject(new Error('Error al leer el archivo como Base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo como Base64'));
      };
    });
  }

  // Método para obtener la URL como Base64
  getUrlAsBase64(url: string): Observable<string | null> {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        switchMap(blob => this.blobToBase64(blob)),
        catchError(error => {
          console.error('Error:', error);
          return of(null);
        })
      );
  }
}
