
# SpotInsights

Esse é um projeto para a disciplina CES-22.



## Instalação de Dependências

O projeto é feito em Django como backend e React no frontend. Para isso, usamos
simultaneamente Python e JS.

#### 1. DJango 

Instalar dependências de Python. Primeiro, começamos criando um novo ambiente
e instalando as dependências.

```bash 
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
```

Em seguida, migramos os apps do Django para o banco de dados SQLite.

```bash 
  python manage.py migrate
```

Por fim, iniciamos o server pelo comando abaixo.
```bash 
  python manage.py runserver
```

#### 2. React

Para instalar as dependências do Node
```bash 
  cd frontend/
  npm install
```

Para executar o webpack para escutar por modificações nos arquivos JS em tempo
real, executamos o comando em modo dev.
```bash 
  npm run dev
```


## API Reference

#### Status de autenticação com Spotify

```http
  GET /spotify/is-authenticated
```

#### URL para autenticação

```http
  GET /spotify/get-auth-url
```

#### Música que está tocando no momento

```http
  GET /spotify/current-song
```

#### Músicas mais ouvidas pelo usuário

```http
  GET /spotify/top-tracks
```

| Query Parameter | Tipo     | Descrição                       |
| :-------- | :------- | :-------------------------------- |
| `limit`   | `inteiro`| _Opcional_. Número máximo de itens a serem exibidos|

#### Criar playlist com as músicas mais ouvidas

```http
  POST /spotify/recibofy
```

| Query Parameter | Tipo     | Descrição                       |
| :-------- | :------- | :-------------------------------- |
| `limit`   | `inteiro`| _Opcional_. Número máximo de itens a serem exibidos|
