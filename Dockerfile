# Usando a imagem do Node.js
FROM node:18-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do repositório para o contêiner
COPY . /app

# Instalar dependências
RUN npm install

# Expor a porta 3000
EXPOSE 3000

# Rodar o comando para iniciar o servidor
CMD ["npm", "run", "dev"]
