import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: string;
  duration: number;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
data: any;

     constructor(private apiService: ApiService) { }

     ngOnInit(): void {
       this.apiService.getData().subscribe(
         (response) => {
           this.data = response; 
           console.log(this.data);
         },
         (error) => {
           console.error(error);
         }
       );
     }

  movies: Movie[] = [
    { id: 1, title: 'El Padrino', director: 'Francis Ford Coppola', year: 1972, genre: 'Drama', duration: 175 },
    { id: 2, title: 'Pulp Fiction', director: 'Quentin Tarantino', year: 1994, genre: 'Crimen', duration: 154 },
    { id: 3, title: 'El Señor de los Anillos', director: 'Peter Jackson', year: 2001, genre: 'Fantasía', duration: 178 }
  ];

  newMovie: Movie = {
    id: 0,
    title: '',
    director: '',
    year: new Date().getFullYear(),
    genre: '',
    duration: 0
  };

  editingMovie: Movie | null = null;
  isEditMode = false;


  openModal() {
    this.resetForm();
    this.isEditMode = false;
  }

  resetForm() {
    this.newMovie = {
      id: 0,
      title: '',
      director: '',
      year: new Date().getFullYear(),
      genre: '',
      duration: 0
    };
  }

  addMovie() {
    if (this.isValidMovie(this.newMovie)) {
      this.newMovie.id = this.getNextId();
      this.movies.push({ ...this.newMovie });
      this.resetForm();
      this.closeModal();
    }
  }

  editMovie(movie: Movie) {
    this.newMovie = { ...movie };
    this.editingMovie = movie;
    this.isEditMode = true;
  }

  updateMovie() {
    if (this.editingMovie && this.isValidMovie(this.newMovie)) {
      const index = this.movies.findIndex(m => m.id === this.editingMovie!.id);
      if (index !== -1) {
        this.movies[index] = { ...this.newMovie };
      }
      this.resetForm();
      this.isEditMode = false;
      this.editingMovie = null;
      this.closeModal();
    }
  }

  deleteMovie(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.movies = this.movies.filter(movie => movie.id !== id);
    }
  }

  isValidMovie(movie: Movie): boolean {
    return movie.title.trim() !== '' && 
           movie.director.trim() !== '' && 
           movie.year > 1800 && 
           movie.genre.trim() !== '' && 
           movie.duration > 0;
  }

  getNextId(): number {
    return this.movies.length > 0 ? Math.max(...this.movies.map(m => m.id)) + 1 : 1;
  }

  closeModal() {
    // Esta función cerrará el modal programáticamente
    const modalElement = document.getElementById('movieModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
