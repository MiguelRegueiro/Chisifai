#!/bin/bash
# Script para configurar el frontend

echo "Configurando el frontend de Chisifai..."

# Crear directorio del frontend si no existe
if [ ! -d "services/ui" ]; then
    mkdir -p services/ui
    cd services/ui
    npx create-react-app . --template redux
else
    cd services/ui
fi

# Copiar archivos de configuración
cp -f .env.example .env

# Instalar dependencias
npm install axios socket.io-client recharts react-leaflet leaflet @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom

echo "Frontend de Chisifai configurado correctamente!"
echo "Para iniciar el frontend, ejecute: cd services/ui && npm start"