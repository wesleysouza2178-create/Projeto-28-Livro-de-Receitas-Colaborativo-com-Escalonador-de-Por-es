# Projeto 28 - Livro de Receitas Colaborativo com Escalonador de Porções

## Chave única oficial
P26-2B-8983-AF39-E3CF-C0B3

## Dados do aluno
- Nome: WESLEY DOS SANTOS DE SOUZA
- Turma: 2B
- RA: 2025104728
- E-mail: wesleysouza2178@gmail.com

## Descrição
Este projeto implementa um catálogo gastronômico em HTML5, CSS3 e JavaScript puro, com autenticação via Discord, busca por nome, tempo e ingrediente, cálculo dinâmico de porções e favoritos persistidos em Cloudflare D1.

## Funcionalidades
- Login via OAuth2 do Discord
- Busca por nome do prato, tempo de preparo e ingrediente
- Ajuste de porções com recálculo matemático das quantidades em tempo real
- Favoritos para formar um livro de receitas pessoal
- Backend serverless com Cloudflare Pages Functions
- Persistência em Cloudflare D1
- Documentação de agentes e skills no repositório

## Estrutura do projeto
- `public/` — interface em JavaScript vanilla
- `functions/` — endpoints serverless
- `src/` — lógica reutilizável e testes
- `schema.sql` — estrutura do banco D1
- `AGENTS.md` — documentação dos agentes
- `skills/` — skills e documentos de apoio
- `LICENSE` — licença MIT

## Execução local
1. Instale as dependências (se necessário): `npm install`
2. Inicie o servidor local: `npm run dev`
3. Acesse `http://localhost:4173`

## Variáveis de ambiente para deploy no Cloudflare
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`

## Documentação dos agentes
O repositório contém o arquivo `AGENTS.md` com a descrição dos agentes utilizados, os harness em que atuaram e as skills associadas.

## Licença
MIT

## Entrega
A aplicação foi montada para execução no Cloudflare Pages/Workers e em ambiente local para validação e demonstração.
