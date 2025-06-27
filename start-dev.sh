#!/bin/bash

echo "🚀 Iniciando Sistema de Gestión de Películas y Directores"
echo "=================================================="

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Verificar si docker-compose está disponible
if ! command -v docker compose &> /dev/null; then
    echo "❌ Error: docker compose no está instalado."
    exit 1
fi

echo "✅ Docker está corriendo"

# Verificar si la API está corriendo
echo "🔍 Verificando que tu API esté corriendo en http://localhost:5244..."
if ! curl -s http://localhost:5244 > /dev/null 2>&1; then
    echo "⚠️  Advertencia: No se puede conectar a la API en http://localhost:5244"
    echo "   Asegúrate de que tu proyecto ASP.NET Core esté corriendo antes de continuar."
    read -p "¿Quieres continuar de todos modos? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelado. Inicia tu API primero."
        exit 1
    fi
else
    echo "✅ API detectada en http://localhost:5244"
fi

# Construir y ejecutar solo el contenedor de Angular
echo "🔨 Construyendo e iniciando contenedor de Angular..."
docker compose -f docker-compose-dev.yml up --build angular-app

echo "🎉 ¡Aplicación iniciada!"
echo "Frontend: http://localhost:4200"
echo "API: http://localhost:5244 (tu servidor existente)"
echo ""
echo "Para detener la aplicación, presiona Ctrl+C"
