
# SpotInsights

Esse é um porjeto para a disciplina CES-22.



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