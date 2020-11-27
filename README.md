# Gerenciador de estabelecimentos - Backend

- [Especificações](#Especificações)
- [Descrição](#descri%c3%a7%c3%a3o)
- [Executando o projeto (desenvolvimento)](#rodando-o-projeto-desenvolvimento)

## Descrição

Api de um projeto de gerenciamento de estabelecimentos desenvolvido utilizando tecnologias NodeJS, e Knex.JS. Link para o projeto web que consumirá essa API:
[Projeto Web](https://github.com/felipeosilva/gerenciador-estabelecimento-web)
## Demonstração

   #### Rotas
    Sessão
     - POST:  /login (realiza autenticação do usuário)
     
     Usuário
     - POST: /users (realiza cadastro de um novo usuário)
     
     Estabelecimentos
      - GET:     /establishments (lista todas os estabelecimentos) 
      - GET:     /establishments/?lat={value}&lng={value}(lista todas os estabelecimentos, baseado na localização) 
      - POST:    /establishments (cadastra um novo estabelecimento) 
      - DELETE:  /establishments/{id} (deleta um estabelecimento)
      - PUT      /establishments/{id} (edita um estabelecimento)
      
## Especificações

Especificações do projeto

- Node >= 12
- yarn >= 1.22

## Rodando o projeto (desenvolvimento)

### Instalação na máquina local

```bash
# Clonar repositório
$ git clone https://github.com/felipeosilva/gerenciador-estabelecimento-backend.git

# Pasta do clone
$ cd gerenciador-estabelecimento-backend

# Instalar todas as dependências
$ yarn install

# Somente necessário executar esse comando uma vez, ou caso venha a apagar o banco de dados
$ yarn knex:migrate

# Comando para executar a aplicação, projeto rodando em localhost:3333
$ yarn dev
```
