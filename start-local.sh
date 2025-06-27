#!/bin/bash

echo "🚀 Iniciando Frontend Angular (Desarrollo Local)"
echo "=============================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado."
    exit 1
fi

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

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar la aplicación Angular
echo "🚀 Iniciando aplicación Angular..."
npm run start:local

echo "🎉 ¡Aplicación iniciada!"
echo "Frontend: http://localhost:4200"
echo "API: http://localhost:5244 (tu servidor existente)"
