1. Iniciar o Banco de Dados
  cd "...\backend"
  docker-compose up -d

2. Iniciar o Backend
  cd "...\backend"
  .\mvnw.cmd spring-boot:run

3. Iniciar o Frontend
  cd "...\frontend"
  npm install
  npm run dev
