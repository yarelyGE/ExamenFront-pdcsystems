import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

interface Movie {
  id: number;
  name: string;
  fkDirector: number; 
  releaseYear: string | number;
  gender: string;
  duration: string | number;
}

interface Director {
  id: number;
  name: string;
  nationality: string; 
  ager: number;
  active: string;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  directores: Director[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMovies();
    this.loadDirectores(); // Cargar directores al iniciar el componente
  }

  loadMovies(): void {
    this.apiService.getData().subscribe(
      (response) => {
        // Convertir duración de formato HH:MM:SS a minutos para mostrar en el formulario
        this.movies = response.map((movie: any) => ({
          ...movie,
          duration: typeof movie.duration === 'string' && movie.duration.includes(':') 
            ? this.convertTimeToMinutes(movie.duration) 
            : movie.duration
        }));
        console.log('Películas cargadas:', this.movies);
      },
      (error) => {
        console.error('Error al cargar películas:', error);
      }
    );
  }

   loadDirectores(): void {
    this.apiService.getDirectores().subscribe(
      (response) => {
        this.directores = response; // Asignar la respuesta de la API al array movies
        console.log('Directores cargados:', this.directores);
      },
      (error) => {
        console.error('Error al cargar directores:', error);
      }
    );
  }

  newMovie: Movie = {
    id: 0,
    name: '',
    fkDirector: 0,
    releaseYear: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para input date
    gender: '',
    duration: ''
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
      name: '',
      fkDirector: 0,
      releaseYear: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para input date
      gender: '',
      duration: ''
    };
  }

  addMovie() {
    if (this.isValidMovie(this.newMovie)) {
      // Preparar los datos para enviar, convirtiendo duración a formato de tiempo
      const movieData = {
        name: this.newMovie.name,
        fkDirector: Number(this.newMovie.fkDirector), // Convertir a número
        releaseYear: new Date(this.newMovie.releaseYear.toString()).toISOString(),
        gender: this.newMovie.gender,
        duration: typeof this.newMovie.duration === 'number' 
          ? this.convertMinutesToTime(this.newMovie.duration) 
          : this.newMovie.duration
      };

      console.log('Datos a enviar:', movieData);
      console.log('Tipo de fkDirector:', typeof movieData.fkDirector);
      console.log('Año original:', this.newMovie.releaseYear);
      console.log('Año convertido (ISO):', movieData.releaseYear);
      console.log('Duración original:', this.newMovie.duration);
      console.log('Duración convertida:', movieData.duration);

      this.apiService.addMovie(movieData).subscribe({
        next: (response) => {
          console.log('Película agregada exitosamente', response);
          // Recargar la lista desde la API para incluir la nueva película
          this.loadMovies();
          this.resetForm();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al agregar la película', error);
          console.error('Status:', error.status);
          console.error('Error message:', error.error);
          alert(`Error al agregar la película: ${error.status} - ${error.message}`);
        }
      });
    } else {
      console.log('Validación falló:', {
        isValid: this.isValidMovie(this.newMovie),
        movieData: this.newMovie
      });
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  editMovie(movie: Movie) {
    this.newMovie = { ...movie };
    this.editingMovie = movie;
    this.isEditMode = true;
  }

  updateMovieApi() {
    if (this.isValidMovie(this.newMovie) && this.editingMovie) {
      // Preparar los datos para enviar, convirtiendo duración a formato de tiempo
      const movieData = {
        name: this.newMovie.name,
        fkDirector: Number(this.newMovie.fkDirector), // Convertir a número
        releaseYear: new Date(this.newMovie.releaseYear.toString()).toISOString(),
        gender: this.newMovie.gender,
        duration: typeof this.newMovie.duration === 'number' 
          ? this.convertMinutesToTime(this.newMovie.duration) 
          : this.newMovie.duration
      };

      console.log('Datos a enviar:', movieData);
      console.log('ID de la película:', this.newMovie.id);
      console.log('Tipo de fkDirector:', typeof movieData.fkDirector);
      console.log('Año original:', this.newMovie.releaseYear);
      console.log('Año convertido (ISO):', movieData.releaseYear);
      console.log('Duración original:', this.newMovie.duration);
      console.log('Duración convertida:', movieData.duration);

      this.apiService.updateMovie(this.newMovie.id, movieData).subscribe({
        next: (response) => {
          console.log('Película actualizada exitosamente', response);
          // Actualizar la película en la lista local
          const index = this.movies.findIndex(m => m.id === this.newMovie.id);
          if (index !== -1) {
            this.movies[index] = { ...this.newMovie };
          }
          // Recargar la lista desde la API para asegurar consistencia
          this.loadMovies();
          this.resetForm();
          this.closeModal();
          this.isEditMode = false;
          this.editingMovie = null;
        },
        error: (error) => {
          console.error('Error al actualizar la película', error);
          alert('Error al actualizar la película. Por favor, intenta de nuevo.');
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  deleteMovie(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.apiService.deleteMovie(id).subscribe(
        (response) => {
          console.log('Película eliminada exitosamente:', response);
          // Recargar la lista de películas después de eliminar
          this.loadMovies();
        },
        (error) => {
          console.error('Error al eliminar la película:', error);
        }
      );
    }
  }

  isValidMovie(movie: Movie): boolean {
    const releaseYear = typeof movie.releaseYear === 'string' 
      ? new Date(movie.releaseYear).getFullYear() 
      : movie.releaseYear;
    
    const duration = typeof movie.duration === 'string' 
      ? parseFloat(movie.duration) 
      : movie.duration;

    const fkDirector = Number(movie.fkDirector);

    return movie.name?.trim() !== '' &&
      fkDirector > 0 &&
      releaseYear > 1800 &&
      movie.gender?.trim() !== '' &&
      duration > 0;
  }

  getNextId(): number {
    if (this.movies.length === 0) return 1;
    return Math.max(...this.movies.map(m => m.id)) + 1;
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

  getDirectorName(directorId: number): string {
    const director = this.directores.find(d => d.id === directorId);
    return director ? director.name : 'Director no encontrado';
  }

  // Función para convertir minutos a formato HH:MM:SS
  convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0; // Asumimos 0 segundos
    
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Función para convertir formato HH:MM:SS a minutos (para mostrar en el formulario)
  convertTimeToMinutes(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours * 60 + minutes;
  }
}
