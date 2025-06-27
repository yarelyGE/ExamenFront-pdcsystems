import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieCreateRequest, MovieUpdateRequest } from './models/movie.model';
import { Director, DirectorCreateRequest, DirectorUpdateRequest } from './models/director.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = '/api'; // Usar proxy para evitar CORS

  constructor(private http: HttpClient) { }
  
  // =============== MOVIES CRUD ===============
  
  getData(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movie`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }

  addMovie(movieData: MovieCreateRequest): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movie`, movieData);
  }

  updateMovie(id: number, movieData: MovieUpdateRequest): Observable<Movie> {
    console.log('🔄 API Service - Actualizando película:', id, movieData);
    console.log('🔄 URL:', `${this.apiUrl}/movie/${id}`);
    return this.http.put<Movie>(`${this.apiUrl}/movie/${id}`, movieData);
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movie/${id}`);
  }

  // =============== DIRECTORS CRUD ===============

  getDirectores(): Observable<Director[]> {
    return this.http.get<Director[]>(`${this.apiUrl}/director`);
  }

  getDirectorById(id: number): Observable<Director> {
    return this.http.get<Director>(`${this.apiUrl}/director/${id}`);
  }

  addDirector(directorData: DirectorCreateRequest): Observable<Director> {
    return this.http.post<Director>(`${this.apiUrl}/director`, directorData);
  }

  updateDirector(id: number, directorData: DirectorUpdateRequest): Observable<Director> {
    console.log('🔄 API Service - Actualizando director:', id, directorData);
    console.log('🔄 URL:', `${this.apiUrl}/director/${id}`);
    return this.http.put<Director>(`${this.apiUrl}/director/${id}`, directorData);
  }

  deleteDirector(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/director/${id}`);
  }
}
