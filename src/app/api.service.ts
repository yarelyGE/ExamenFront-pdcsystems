import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  getData(): Observable<any> {
    return this.http.get('http://localhost:5244/api/movie');
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`http://localhost:5244/api/movie/${id}`);
  }

 addMovie(movieData: any): Observable<any> {
    return this.http.post(`http://localhost:5244/api/movie`, movieData);
  }

  updateMovie(id: number, movieData: any): Observable<any> {
    return this.http.put(`http://localhost:5244/api/movie/${id}`, movieData);
  }




  getDirectores(): Observable<any> {
    return this.http.get('http://localhost:5244/api/director');
  }
}
