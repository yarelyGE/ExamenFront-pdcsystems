import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Movie, MovieCreateRequest, MovieUpdateRequest } from '../models/movie.model';
import { Director } from '../models/director.model';

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
    this.loadDirectores();
  }

  loadMovies(): void {
    this.apiService.getData().subscribe(
      (response) => {
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
        this.directores = response;
        console.log('Directores cargados:', this.directores);
      },
      (error) => {
        console.error('Error al cargar directores:', error);
      }
    );
  }

  newMovie: any = {
    id: 0,
    name: '',
    fkDirector: 0,
    releaseYear: new Date().toISOString().split('T')[0],
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
      releaseYear: new Date().toISOString().split('T')[0],
      gender: '',
      duration: ''
    };
  }

  addMovie() {
    if (this.isValidMovie(this.newMovie)) {
      // Asegurar que la duración siempre se convierta correctamente
      let durationForAPI: string;
      
      if (typeof this.newMovie.duration === 'number') {
        durationForAPI = this.convertMinutesToTime(this.newMovie.duration);
        console.log(`🔄 Duración es número: ${this.newMovie.duration} min → ${durationForAPI}`);
      } else if (typeof this.newMovie.duration === 'string' && this.newMovie.duration.includes(':')) {
        durationForAPI = this.newMovie.duration;
        console.log(`🔄 Duración ya es TimeSpan: ${durationForAPI}`);
      } else if (typeof this.newMovie.duration === 'string' && !isNaN(Number(this.newMovie.duration))) {
        // Si es string pero contiene un número
        const minutes = Number(this.newMovie.duration);
        durationForAPI = this.convertMinutesToTime(minutes);
        console.log(`🔄 Duración es string numérico: "${this.newMovie.duration}" → ${minutes} min → ${durationForAPI}`);
      } else {
        durationForAPI = this.newMovie.duration.toString();
        console.log(`🔄 Duración fallback: ${durationForAPI}`);
      }

      const movieData: MovieCreateRequest = {
        name: this.newMovie.name.trim(),
        fkDirector: Number(this.newMovie.fkDirector),
        releaseYear: new Date(this.newMovie.releaseYear.toString()).toISOString(),
        gender: this.newMovie.gender.trim(),
        duration: durationForAPI
      };

      console.log('=== CREANDO PELÍCULA ===');
      console.log('Datos del formulario:', this.newMovie);
      console.log('Tipo de duración en formulario:', typeof this.newMovie.duration);
      console.log('Valor de duración en formulario:', this.newMovie.duration);
      console.log('Duración convertida para API:', durationForAPI);
      console.log('Datos a enviar a la API:', movieData);

      this.apiService.addMovie(movieData).subscribe({
        next: (response) => {
          console.log('✅ Película agregada exitosamente', response);
          this.loadMovies();
          this.resetForm();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error al agregar la película:', error);
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
          alert(`Error al agregar la película: ${error.status} - ${error.message || 'Error desconocido'}`);
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  editMovie(movie: Movie) {
    // Preparar los datos para el formulario de edición
    this.newMovie = {
      id: movie.id,
      name: movie.name,
      fkDirector: movie.fkDirector,
      // Convertir la fecha ISO a formato YYYY-MM-DD para el input date
      releaseYear: movie.releaseYear ? new Date(movie.releaseYear).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      gender: movie.gender,
      // Convertir duración de formato HH:MM:SS a minutos para el input
      duration: typeof movie.duration === 'string' && movie.duration.includes(':') 
        ? this.convertTimeToMinutes(movie.duration) 
        : movie.duration
    };
    this.editingMovie = movie;
    this.isEditMode = true;
    
    console.log('Editando película:', movie);
    console.log('Datos preparados para formulario:', this.newMovie);
  }

  updateMovieApi() {
    if (this.isValidMovie(this.newMovie) && this.editingMovie) {
      // Asegurar que la duración siempre se convierta correctamente
      let durationForAPI: string;
      
      if (typeof this.newMovie.duration === 'number') {
        durationForAPI = this.convertMinutesToTime(this.newMovie.duration);
        console.log(`🔄 Duración es número: ${this.newMovie.duration} min → ${durationForAPI}`);
      } else if (typeof this.newMovie.duration === 'string' && this.newMovie.duration.includes(':')) {
        durationForAPI = this.newMovie.duration;
        console.log(`🔄 Duración ya es TimeSpan: ${durationForAPI}`);
      } else if (typeof this.newMovie.duration === 'string' && !isNaN(Number(this.newMovie.duration))) {
        // Si es string pero contiene un número
        const minutes = Number(this.newMovie.duration);
        durationForAPI = this.convertMinutesToTime(minutes);
        console.log(`🔄 Duración es string numérico: "${this.newMovie.duration}" → ${minutes} min → ${durationForAPI}`);
      } else {
        durationForAPI = this.newMovie.duration.toString();
        console.log(`🔄 Duración fallback: ${durationForAPI}`);
      }

      const movieData: MovieUpdateRequest = {
        id: this.newMovie.id,
        name: this.newMovie.name.trim(),
        fkDirector: Number(this.newMovie.fkDirector),
        releaseYear: new Date(this.newMovie.releaseYear.toString()).toISOString(),
        gender: this.newMovie.gender.trim(),
        duration: durationForAPI
      };

      console.log('=== ACTUALIZANDO PELÍCULA ===');
      console.log('ID de la película:', this.newMovie.id);
      console.log('Datos originales:', this.editingMovie);
      console.log('Datos del formulario:', this.newMovie);
      console.log('Tipo de duración en formulario:', typeof this.newMovie.duration);
      console.log('Valor de duración en formulario:', this.newMovie.duration);
      console.log('Duración convertida para API:', durationForAPI);
      console.log('Datos a enviar a la API:', movieData);

      this.apiService.updateMovie(this.newMovie.id, movieData).subscribe({
        next: (response) => {
          console.log('✅ Película actualizada exitosamente', response);
          this.loadMovies();
          this.resetForm();
          this.closeModal();
          this.isEditMode = false;
          this.editingMovie = null;
        },
        error: (error) => {
          console.error('❌ Error al actualizar la película:', error);
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
          alert(`Error al actualizar la película: ${error.status} - ${error.message || 'Error desconocido'}`);
        }
      });
    } else {
      console.log('❌ Validación falló');
      console.log('Movie válida:', this.isValidMovie(this.newMovie));
      console.log('Editing movie existe:', !!this.editingMovie);
      console.log('Datos actuales:', this.newMovie);
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  deleteMovie(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.apiService.deleteMovie(id).subscribe(
        (response) => {
          console.log('Película eliminada exitosamente:', response);
          this.loadMovies();
        },
        (error) => {
          console.error('Error al eliminar la película:', error);
        }
      );
    }
  }

  isValidMovie(movie: any): boolean {
    // Validar nombre
    if (!movie.name || movie.name.trim() === '') {
      console.log('❌ Nombre inválido:', movie.name);
      return false;
    }

    // Validar director
    const fkDirector = Number(movie.fkDirector);
    if (!fkDirector || fkDirector <= 0) {
      console.log('❌ Director inválido:', movie.fkDirector);
      return false;
    }

    // Validar año
    const releaseYear = typeof movie.releaseYear === 'string' 
      ? new Date(movie.releaseYear).getFullYear() 
      : movie.releaseYear;
    if (!releaseYear || releaseYear < 1800 || releaseYear > new Date().getFullYear() + 10) {
      console.log('❌ Año inválido:', movie.releaseYear, releaseYear);
      return false;
    }
    
    // Validar género
    if (!movie.gender || movie.gender.trim() === '') {
      console.log('❌ Género inválido:', movie.gender);
      return false;
    }

    // Validar duración
    const duration = typeof movie.duration === 'string' 
      ? parseFloat(movie.duration) 
      : movie.duration;
    if (!duration || duration <= 0) {
      console.log('❌ Duración inválida:', movie.duration, duration);
      return false;
    }

    console.log('✅ Validación de película exitosa');
    return true;
  }

  closeModal() {
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

  convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0; // Siempre 0 segundos como especificaste
    
    // Formato HH:MM:SS para TimeSpan de .NET
    const timeString = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    console.log(`💫 Convirtiendo ${minutes} minutos a TimeSpan: ${timeString}`);
    return timeString;
  }

  convertTimeToMinutes(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const totalMinutes = hours * 60 + minutes;
    console.log(`💫 Convirtiendo TimeSpan ${timeString} a ${totalMinutes} minutos`);
    return totalMinutes;
  }
}
