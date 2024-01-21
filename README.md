## Создать решение для работы сайта-заглушки внутри контейнера
___________________________________
1. Аренда облачного сервера
2. Установить Docker
3. Склонируйте репозиторий GitHub с HTML-файлами сайта заглушки
   
   'git clone <URL репозитория> '
   
5. Создайте Dockerfile в директории с репозиторием и добавте слледующее содержимое:
   
   `FROM nginx
   COPY . /usr/share/nginx/html`
   
   Этот Dockerfile базируется на образе Nginx и копирует содержимое текущей директории в директорию /usr/share/nginx/html внутри контейнера.
   
7. Соберите Docker-образ из Dockerfile в дирректории с файлами сайта (название репозитория):
   
  ` docker build -t my_nginx_image .`
  
   Здесь my_nginx_image - это имя образа, которое вы можете заменить на свое.
9. Создайте Docker том, который будет использоваться для подключения к контейнеру Nginx. Выполните команду:

   ` docker volume create --name=site_volume`

##На GitHub

1. Создайте секретные ключи в разделе Settings -> Secrets and variables ->Actions репозитория:

SERVER_IP - публичный IP удаленного сервера
SERVER_USERNAME - имя пользователя удаленного сервера
DEPLOY_KEY - публичнный SSH ключ 

        # на удаленном сервере 
        1. Генерируем SSH ключи `ssh-keygen -t rsa`
        
        2. Скопируйте публичный ключ в authorized_keys `cat ~/.ssh/id_rsa.pub >> 
        ~/.ssh/authorized_keys`
        
        3. Скопируйте приватный ключ в буфер обмена и добавте в секрет `nano ~/.ssh/id_rsa`

2. Создайте файл .github/workflows/deploy.yml в корневой директории вашего репозитория. 3. Откройте файловый редактор и добавьте следующий код:

'name: Update Website
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
          docker run -d -p 80:80 --name nginx_container -v /usr/share/nginx/html:/usr/share/nginx/html nginx`
    
 
