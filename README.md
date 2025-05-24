# 🚗 Vehicle CRUD API - NestJS + Docker

Este projeto é um desafio técnico com foco em desenvolvimento backend utilizando **Node.js com NestJS**, seguindo boas práticas de arquitetura, modularização e organização de código.

A aplicação expõe uma **API RESTful** para gerenciamento de veículos, permitindo operações de **CRUD** com os seguintes atributos:

- `id`
- `placa`
- `chassi`
- `renavam`
- `modelo`
- `marca`
- `ano`

---

## ✅ Tecnologias e ferramentas utilizadas

- [NestJS](https://nestjs.com/) - Framework Node.js com suporte a TypeScript
- [Docker](https://www.docker.com/) - Conteinerização da aplicação
- [Jest](https://jestjs.io/) - Testes automatizados
- [PostgreSQL](https://www.postgresql.org/) ou [SQLite](https://www.sqlite.org/) - Banco de dados relacional
- (Opcional) Kafka / RabbitMQ / SQS - Mensageria para microserviços

---

## 📦 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/andervieiradev/vehicle-service-nest-docker.git
cd vehicle-service-nest-docker
```

### 2. Execute via Docker Compose

```bash
docker-compose up --build
```

A aplicação estará disponível em:  
👉 `http://localhost:3000`

---

## 🧪 Testes

Para rodar os testes unitários com Jest:

```bash
docker exec -it vehicle-service-nest-docker npm run test
```

---

## 📌 Endpoints principais

| Método | Rota               | Descrição                     |
|--------|--------------------|-------------------------------|
| GET    | `/vehicles`        | Lista todos os veículos       |
| GET    | `/vehicles/:id`    | Detalha um veículo específico |
| POST   | `/vehicles`        | Cria um novo veículo          |
| PUT    | `/vehicles/:id`    | Atualiza um veículo existente |
| DELETE | `/vehicles/:id`    | Remove um veículo             |

---

## 👨‍💻 Autor

**Anderson José Vieira dos Santos**  
[github.com/andervieiradev](https://github.com/andervieiradev)
