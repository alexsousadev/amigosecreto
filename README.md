# Projeto Amigo Secreto

Este projeto é uma API desenvolvida com o framework NestJS, que permite dar uma brincada com Amigo Secreto. A API oferece funcionalidades para registro, login e gerenciamento de grupos e participantes.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações Node.js escaláveis.
- **Prisma**: ORM para facilitar a interação com o banco de dados.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
- **Zod**: Biblioteca para validação de esquemas de dados.
- **Bcryptjs**: Biblioteca para hashing de senhas.
- **JWT**: Para autenticação baseada em tokens.

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```bash
pnpm install
```

## Configuração do Banco de Dados

Crie um arquivo `.env` na raiz do projeto e adicione a seguinte variável de ambiente:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=3000
```

Substitua `USER`, `PASSWORD`, `HOST`, `PORT` e `DATABASE` pelos valores correspondentes ao seu banco de dados PostgreSQL.

## Execução do Projeto

Para iniciar o projeto em modo de desenvolvimento, utilize o comando:

```bash
pnpm run start:dev
```

## Endpoints

### Participantes

- **GET /participantes**: Retorna todos os participantes.
- **POST /registro**: Registra um novo participante.
- **POST /login**: Realiza o login de um participante.

### Grupos

- **GET /grupos**: Retorna todos os grupos.
- **POST /grupos**: Cria um novo grupo.
- **POST /grupos/:id/participantes/:idParticipante**: Adiciona um participante a um grupo.
- **POST /grupos/:id/matches**: Gera um amigo oculto para o grupo especificado.
- **POST /grupos/:id/participantes/:idParticipante**: Adiciona um participante ao grupo especificado.
- **DELETE /grupos/:id**: Deleta o grupo especificado.
