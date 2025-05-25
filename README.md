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

- NestJS - Framework Node.js com suporte a TypeScript
- Docker - Conteinerização da aplicação
- Jest - Testes automatizados
- Mysql - Conexão com banco de dados MySQL
- TypeORM - ORM para interação com o banco de dados
- RabbitMQ - Mensageria
---

## 📦 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/andervieiradev/vehicle-service-nest-docker.git
cd vehicle-service-nest-docker
```

### 2. Ajustar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto copiando o modelo `.env.example`:

```bash
cp .env.example .env
```
Preencha as variáveis de ambiente conforme necessário, especialmente as configurações do banco de dados.

### 3. Execute via Docker Compose

```bash
docker-compose up --build
```

A aplicação estará disponível em:  
👉 `http://localhost:3000`

---

## 🧪 Testes

Para rodar os testes unitários com Jest:

```bash
docker-compose exec app npm run test
```

Para rodar os testes e2e com Jest:

```bash
docker-compose exec app npm run test:e2e
```

Poderá rodar o arquivo app.http para testar as rotas da API diretamente no VSCode ou qualquer outro editor que suporte arquivos HTTP.


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

## 📄 Mensageria

A aplicação utiliza RabbitMQ para enviar mensagens de eventos quando um veículo é criado. 

As mensagens são enviadas para a fila `vehicles`.

A fila é consumida pelo próprio serviço, que pode ser utilizado para processar eventos de forma assíncrona.

Ao processar a fila é exibido um log no console com os dados do veículo criado.

## 👨‍💻 Autor

**Anderson José Vieira dos Santos**  
[github.com/andervieiradev](https://github.com/andervieiradev)
