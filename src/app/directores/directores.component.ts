import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Director, DirectorCreateRequest, DirectorUpdateRequest } from '../models/director.model';

@Component({
  selector: 'app-directores',
  templateUrl: './directores.component.html',
  styleUrls: ['./directores.component.css']
})
export class DirectoresComponent implements OnInit {
  directores: Director[] = [];
  
  newDirector: any = {
    id: 0,
    name: '',
    nationality: '',
    ager: 0,
    active: true
  };

  editingDirector: Director | null = null;
  isEditMode = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDirectores();
  }

  loadDirectores(): void {
    this.apiService.getDirectores().subscribe(
      (response: Director[]) => {
        this.directores = response;
        console.log('Directores cargados:', this.directores);
      },
      (error: any) => {
        console.error('Error al cargar directores:', error);
      }
    );
  }

  openModal() {
    this.resetForm();
    this.isEditMode = false;
  }

  resetForm() {
    this.newDirector = {
      id: 0,
      name: '',
      nationality: '',
      ager: 0,
      active: true
    };
  }

  addDirector() {
    if (this.isValidDirector(this.newDirector)) {
      const directorData: DirectorCreateRequest = {
        name: this.newDirector.name.trim(),
        nationality: this.newDirector.nationality.trim(),
        ager: Number(this.newDirector.ager),
        active: Boolean(this.newDirector.active)
      };

      console.log('=== CREANDO DIRECTOR ===');
      console.log('Datos del formulario:', this.newDirector);
      console.log('Datos a enviar a la API:', directorData);

      this.apiService.addDirector(directorData).subscribe({
        next: (response: Director) => {
          console.log('✅ Director agregado exitosamente', response);
          this.loadDirectores();
          this.resetForm();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('❌ Error al agregar el director:', error);
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
          alert(`Error al agregar el director: ${error.status} - ${error.message || 'Error desconocido'}`);
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  editDirector(director: Director) {
    // Preparar los datos para el formulario de edición
    this.newDirector = {
      id: director.id,
      name: director.name,
      nationality: director.nationality,
      ager: director.ager,
      active: director.active
    };
    this.editingDirector = director;
    this.isEditMode = true;
    
    console.log('Editando director:', director);
    console.log('Datos preparados para formulario:', this.newDirector);
  }

  updateDirectorApi() {
    if (this.isValidDirector(this.newDirector) && this.editingDirector) {
      const directorData: DirectorUpdateRequest = {
        id: this.newDirector.id, // ¡IMPORTANTE! Tu API necesita el ID en el objeto
        name: this.newDirector.name.trim(),
        nationality: this.newDirector.nationality.trim(),
        ager: Number(this.newDirector.ager),
        active: Boolean(this.newDirector.active)
      };

      console.log('=== ACTUALIZANDO DIRECTOR ===');
      console.log('ID del director:', this.newDirector.id);
      console.log('Datos originales:', this.editingDirector);
      console.log('Datos del formulario:', this.newDirector);
      console.log('Datos a enviar a la API:', directorData);

      this.apiService.updateDirector(this.newDirector.id, directorData).subscribe({
        next: (response: Director) => {
          console.log('✅ Director actualizado exitosamente', response);
          this.loadDirectores();
          this.resetForm();
          this.closeModal();
          this.isEditMode = false;
          this.editingDirector = null;
        },
        error: (error: any) => {
          console.error('❌ Error al actualizar el director:', error);
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
          alert(`Error al actualizar el director: ${error.status} - ${error.message || 'Error desconocido'}`);
        }
      });
    } else {
      console.log('❌ Validación falló');
      console.log('Director válido:', this.isValidDirector(this.newDirector));
      console.log('Editing director existe:', !!this.editingDirector);
      console.log('Datos actuales:', this.newDirector);
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  deleteDirector(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este director?')) {
      this.apiService.deleteDirector(id).subscribe(
        (response: any) => {
          console.log('Director eliminado exitosamente:', response);
          this.loadDirectores();
        },
        (error: any) => {
          console.error('Error al eliminar el director:', error);
          alert('Error al eliminar el director. Puede que tenga películas asociadas.');
        }
      );
    }
  }

  isValidDirector(director: any): boolean {
    // Validar nombre
    if (!director.name || director.name.trim() === '') {
      console.log('❌ Nombre de director inválido:', director.name);
      return false;
    }

    // Validar nacionalidad
    if (!director.nationality || director.nationality.trim() === '') {
      console.log('❌ Nacionalidad inválida:', director.nationality);
      return false;
    }

    // Validar edad
    const age = Number(director.ager);
    if (!age || age <= 0 || age >= 120) {
      console.log('❌ Edad inválida:', director.ager, age);
      return false;
    }

    console.log('✅ Validación de director exitosa');
    return true;
  }

  closeModal() {
    const modalElement = document.getElementById('directorModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
