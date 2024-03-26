# Zdefiniuj obraz bazowy z Node.js
FROM node:18.13

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę kodu źródłowego aplikacji
COPY . .

# Zbuduj aplikację
RUN npm run build

# Zdefiniuj obraz bazowy dla serwera
FROM nginx:1.19.0-alpine

# Skopiuj pliki statyczne do serwera
COPY --from=0 /app/dist/angular/browser /usr/share/nginx/html

# Ustaw port serwera
EXPOSE 80

# Uruchom serwer
CMD ["nginx", "-g", "daemon off;"]