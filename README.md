# Sistema de Gestión de Películas y Directores

Este proyecto es una aplicación web Angular que consume una API ASP.NET Core para gestionar películas y directores.

## Características

- **CRUD completo para Películas**: Crear, leer, actualizar y eliminar películas
- **CRUD completo para Directores**: Crear, leer, actualizar y eliminar directores
- **Interfaz moderna**: Usando Bootstrap 5 para un diseño responsivo
- **Validaciones**: Validación de formularios en el frontend
- **Dockerizado**: Listo para ejecutar con Docker Compose

## Modelos de Datos

### Movie
```typescript
{
  id: number;
  name: string;
  releaseYear: string;
  gender: string;
  duration: string;
  fkDirector: number;
}
```

### Director
```typescript
{
  id: number;
  name: string;
  nationality: string;
  ager: number;
  active: boolean;
}
```

## Requisitos

- Docker y Docker Compose
- Tu API ASP.NET Core ejecutándose en el puerto 5244

## Instalación y Ejecución

**IMPORTANTE**: Este frontend se conecta a tu API ASP.NET Core existente que debe estar corriendo en el puerto 5244.

### Opción 1: Desarrollo Local (Recomendado)

1. **Asegúrate de que tu API ASP.NET Core esté corriendo en el puerto 5244**

2. **Ejecuta el script de desarrollo local**
   ```bash
   ./start-local.sh
   ```

3. **O manualmente:**
   ```bash
   npm install
   npm run start:local
   ```

4. **Accede a la aplicación**
   - Frontend: http://localhost:4200
   - API: http://localhost:5244 (tu servidor existente)

### Opción 2: Con Docker

1. **Asegúrate de que tu API ASP.NET Core esté corriendo en el puerto 5244**

2. **Ejecuta el script de Docker**
   ```bash
   ./start-dev.sh
   ```

3. **O manualmente:**
   ```bash
   docker compose -f docker-compose-dev.yml up --build angular-app
   ```

4. **Accede a la aplicación**
   - Frontend: http://localhost:4200
   - API: http://localhost:5244 (tu servidor existente)

## API Endpoints Esperados

### Movies
- `GET /api/movie` - Obtener todas las películas
- `GET /api/movie/{id}` - Obtener película por ID
- `POST /api/movie` - Crear nueva película
- `PUT /api/movie/{id}` - Actualizar película
- `DELETE /api/movie/{id}` - Eliminar película

### Directors
- `GET /api/director` - Obtener todos los directores
- `GET /api/director/{id}` - Obtener director por ID
- `POST /api/director` - Crear nuevo director
- `PUT /api/director/{id}` - Actualizar director
- `DELETE /api/director/{id}` - Eliminar director

## Configuración de CORS en tu API ASP.NET Core

Asegúrate de que tu API tenga CORS configurado:

```csharp
// En tu Startup.cs o Program.cs
services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// En el pipeline
app.UseCors("AllowAngularApp");
```

## Comandos Útiles

```bash
# Desarrollo
npm start                    # Ejecutar en modo desarrollo
npm run build               # Construir para producción
npm test                    # Ejecutar pruebas

# Docker
docker-compose -f docker-compose-dev.yml up --build    # Ejecutar con Docker
docker-compose -f docker-compose-dev.yml down          # Detener contenedores
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
#   E x a m e n F r o n t - p d c s y s t e m s 
 
 