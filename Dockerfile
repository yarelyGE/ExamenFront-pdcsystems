# Dockerfile para desarrollo de Angular
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 4200

# Comando para desarrollo con hot reload
CMD ["npm", "start"]
