1. Аренда облачного сервера
2. Установить Docker
3. Склонируйте репозиторий GitHub с HTML-файлами сайта заглушки 
4. Создайте Dockerfile в директории с репозиторием и добавте слледующее содержимое:
   FROM nginx
   COPY . /usr/share/nginx/html
   Этот Dockerfile базируется на образе Nginx и копирует содержимое текущей директории в директорию /usr/share/nginx/html внутри контейнера.
6. Соберите Docker-образ из Dockerfile:
   docker build -t my_nginx_image .
   Здесь my_nginx_image - это имя образа, которое вы можете заменить на свое.
7. Создайте Docker том, который будет использоваться для подключения к контейнеру Nginx. Выполните команду:
    docker volume create --name=site_volume

На GitHub:

Создайте файл .github/workflows/deploy.yml в корневой директории вашего репозитория. Откройте файловый редактор и добавьте следующий код:

name: Update Website

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: SCP files to remote server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_IP }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.DEPLOY_KEY }}
        source: .
        target: /usr/share/nginx/html
 
    - name: SSH to remote server and update code
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_IP }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          ssh-keyscan localhost >> ~/.ssh/known_hosts
          docker stop nginx_container
          docker rm nginx_container
          git pull
          docker run -d -p 80:80 --name nginx_container -v /usr/share/nginx/html:/usr/share/nginx/html nginx
    
 
