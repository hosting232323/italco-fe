# Stage base
FROM node:20

# Setta la working directory
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il codice
COPY . .

# Build del frontend
RUN npm run build

# Espone la porta del dev server (o build serve)
EXPOSE 3000

# Comando di default: serve il frontend
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "3000"]
