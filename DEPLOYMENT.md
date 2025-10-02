# 📦 Инструкция по развертыванию Crypto Bot Dashboard в Docker

## Оглавление
1. [Предварительные требования](#предварительные-требования)
2. [Быстрый старт](#быстрый-старт)
3. [Подробная инструкция](#подробная-инструкция)
4. [Настройка и конфигурация](#настройка-и-конфигурация)
5. [Подключение домена и настройка HTTPS](#-подключение-домена-и-настройка-https)
6. [Управление контейнером](#управление-контейнером)
7. [Решение проблем](#решение-проблем)
8. [Производственное развертывание](#производственное-развертывание)
9. [Мониторинг](#мониторинг)

---

## Предварительные требования

### 1. Установите Docker
**На Ubuntu/Debian:**
```bash
# Обновите систему
sudo apt update
sudo apt upgrade -y

# Установите зависимости
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавьте официальный GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавьте репозиторий Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установите Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Добавьте текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Перезагрузите сессию или выполните
newgrp docker
```

**На CentOS/RHEL:**
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**На Windows:**
- Скачайте и установите [Docker Desktop для Windows](https://www.docker.com/products/docker-desktop)
- После установки перезагрузите компьютер

**На macOS:**
- Скачайте и установите [Docker Desktop для Mac](https://www.docker.com/products/docker-desktop)

### 2. Установите Docker Compose
```bash
# На Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверьте установку
docker-compose --version
```

### 3. Проверьте установку
```bash
docker --version
docker-compose --version
```

---

## Быстрый старт

```bash
# 1. Клонируйте репозиторий (или скопируйте файлы проекта)
git clone <ваш-репозиторий>
cd <папка-проекта>

# 2. Соберите и запустите контейнер
docker-compose up -d --build

# 3. Откройте в браузере
# http://localhost:3000
```

---

## Подробная инструкция

### Шаг 1: Подготовка проекта

1. **Убедитесь, что у вас есть все необходимые файлы:**
   - `Dockerfile` - конфигурация Docker образа
   - `docker-compose.yml` - конфигурация Docker Compose
   - `nginx.conf` - конфигурация веб-сервера Nginx
   - `.dockerignore` - файлы, которые не нужно копировать в образ

2. **Структура проекта должна выглядеть так:**
   ```
   crypto-bot-dashboard/
   ├── src/
   ├── public/
   ├── Dockerfile
   ├── docker-compose.yml
   ├── nginx.conf
   ├── .dockerignore
   ├── package.json
   └── ...другие файлы
   ```

### Шаг 2: Сборка Docker образа

#### Вариант A: Используя Docker Compose (рекомендуется)
```bash
# Сборка и запуск в фоновом режиме
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f
```

#### Вариант B: Используя Docker напрямую
```bash
# Сборка образа
docker build -t crypto-bot-dashboard:latest .

# Запуск контейнера
docker run -d \
  --name crypto-bot-dashboard \
  -p 3000:80 \
  --restart unless-stopped \
  crypto-bot-dashboard:latest
```

### Шаг 3: Проверка работы

```bash
# Проверьте статус контейнера
docker ps

# Проверьте логи
docker logs crypto-bot-dashboard

# Откройте в браузере
# http://localhost:3000
```

---

## Настройка и конфигурация

### Изменение порта

**В docker-compose.yml:**
```yaml
ports:
  - "8080:80"  # Изменить 3000 на желаемый порт
```

**При использовании docker run:**
```bash
docker run -d -p 8080:80 crypto-bot-dashboard:latest
```

### Переменные окружения

Создайте файл `.env` в корне проекта:
```env
NODE_ENV=production
API_URL=https://your-api.com
```

Обновите `docker-compose.yml`:
```yaml
services:
  crypto-bot-app:
    env_file:
      - .env
```

## 🌐 Подключение домена и настройка HTTPS

### Шаг 1: Получение домена

#### Где купить домен:
1. **Регистраторы доменов:**
   - [REG.RU](https://www.reg.ru/) - популярный российский регистратор
   - [Timeweb](https://timeweb.com/) - хостинг + домены
   - [Namecheap](https://www.namecheap.com/) - международный регистратор
   - [Cloudflare](https://www.cloudflare.com/products/registrar/) - с защитой от DDoS

2. **Выбор домена:**
   - `.ru` - для российской аудитории (от 200₽/год)
   - `.com` - для международной аудитории (от $10/год)
   - `.io`, `.dev` - для IT-проектов (от $20/год)

3. **Стоимость:** от 200₽ до 2000₽ в год в зависимости от зоны

### Шаг 2: Подготовка сервера

```bash
# Установите Nginx на хост-машину (не в Docker!)
sudo apt update
sudo apt install nginx -y

# Убедитесь, что порты 80 и 443 открыты
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Шаг 3: Настройка DNS

1. **Войдите в панель управления вашего регистратора доменов**
2. **Найдите раздел "DNS-записи" или "Управление DNS"**
3. **Добавьте A-записи:**

```
Тип    Имя    Значение           TTL
A      @      ВАШ_IP_АДРЕС       3600
A      www    ВАШ_IP_АДРЕС       3600
```

**Как узнать IP-адрес вашего сервера:**
```bash
curl ifconfig.me
# или
hostname -I
```

4. **Дождитесь распространения DNS (от 5 минут до 48 часов)**

Проверить DNS можно на [WhatsMyDNS.net](https://www.whatsmydns.net/)

### Шаг 4: Настройка Nginx на хосте

Создайте конфигурацию для вашего домена:

```bash
# Создайте файл конфигурации
sudo nano /etc/nginx/sites-available/crypto-bot
```

Вставьте следующую конфигурацию (замените `yourdomain.com`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Размер загружаемых файлов
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте конфигурацию:

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/crypto-bot /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx
```

### Шаг 5: Установка SSL-сертификата (HTTPS)

#### Автоматическая настройка с Certbot (рекомендуется):

```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получите и установите SSL-сертификат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Следуйте инструкциям на экране:
# 1. Введите email для уведомлений
# 2. Согласитесь с условиями использования
# 3. Выберите опцию 2 (перенаправление HTTP -> HTTPS)
```

#### Автоматическое обновление сертификата:

```bash
# Certbot автоматически настраивает обновление
# Проверьте таймер обновления:
sudo systemctl status certbot.timer

# Тестовое обновление (без реального обновления):
sudo certbot renew --dry-run
```

#### Ручная настройка SSL (если Certbot не сработал):

```bash
# Отредактируйте конфигурацию
sudo nano /etc/nginx/sites-available/crypto-bot
```

Добавьте SSL-блок:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL-сертификаты от Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;

    # Настройки SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (опционально, но рекомендуется)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Перезапустите Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Шаг 6: Проверка работы

1. **Проверьте HTTP:** http://yourdomain.com
2. **Проверьте HTTPS:** https://yourdomain.com
3. **Проверьте перенаправление:** HTTP должен автоматически перенаправлять на HTTPS

**Тестирование SSL:**
```bash
# Проверьте качество SSL-конфигурации
curl -I https://yourdomain.com
```

Или используйте онлайн-инструменты:
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [WhyNoPadlock](https://www.whynopadlock.com/)

### Шаг 7: Настройка Docker Compose (опционально)

Если хотите использовать другой порт внутри Docker:

```yaml
# docker-compose.yml
services:
  crypto-bot-app:
    ports:
      - "127.0.0.1:3000:80"  # Доступен только localhost
```

### Использование Cloudflare (дополнительно)

**Преимущества:**
- Бесплатный SSL-сертификат
- Защита от DDoS
- CDN для ускорения загрузки
- Кэширование контента

**Настройка:**

1. Зарегистрируйтесь на [Cloudflare](https://www.cloudflare.com/)
2. Добавьте свой домен
3. Измените NS-записи у вашего регистратора на NS-серверы Cloudflare
4. В Cloudflare панели:
   - DNS → Добавьте A-запись с вашим IP
   - SSL/TLS → Выберите режим "Full" или "Full (strict)"
   - Speed → Включите Auto Minify

### Полная схема работы

```
Пользователь → yourdomain.com (DNS)
                      ↓
              Cloudflare (опционально)
                      ↓
              Ваш сервер (IP)
                      ↓
              Nginx (порт 80/443)
                      ↓
              Docker контейнер (порт 3000)
                      ↓
              Приложение Crypto Bot
```

### Масштабирование

Запуск нескольких экземпляров:
```bash
docker-compose up -d --scale crypto-bot-app=3
```

---

## Управление контейнером

### Основные команды

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Обновление (пересборка)
docker-compose up -d --build --force-recreate

# Просмотр использования ресурсов
docker stats crypto-bot-dashboard

# Вход в контейнер
docker exec -it crypto-bot-dashboard sh
```

### Обновление приложения

```bash
# 1. Остановите контейнер
docker-compose down

# 2. Обновите код (git pull или скопируйте файлы)
git pull origin main

# 3. Пересоберите и запустите
docker-compose up -d --build
```

### Резервное копирование

```bash
# Создайте бэкап образа
docker save crypto-bot-dashboard:latest | gzip > crypto-bot-backup.tar.gz

# Восстановление из бэкапа
docker load < crypto-bot-backup.tar.gz
```

---

## Решение проблем

### Контейнер не запускается

```bash
# Проверьте логи
docker logs crypto-bot-dashboard

# Проверьте, что порт не занят
sudo netstat -tulpn | grep :3000

# Удалите старые контейнеры и пересоберите
docker-compose down -v
docker-compose up -d --build
```

### Ошибки сборки

```bash
# Очистите Docker кэш
docker builder prune -a

# Пересоберите без кэша
docker-compose build --no-cache
```

### Проблемы с правами доступа

```bash
# Убедитесь, что пользователь в группе docker
sudo usermod -aG docker $USER
newgrp docker

# Или запускайте с sudo
sudo docker-compose up -d
```

### Высокое использование ресурсов

```bash
# Ограничьте память в docker-compose.yml
services:
  crypto-bot-app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### Очистка неиспользуемых ресурсов

```bash
# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune -a

# Удалить все неиспользуемые ресурсы
docker system prune -a --volumes
```

---

## Производственное развертывание

### Использование Docker Swarm

```bash
# Инициализация Swarm
docker swarm init

# Развертывание стека
docker stack deploy -c docker-compose.yml crypto-bot

# Масштабирование
docker service scale crypto-bot_crypto-bot-app=3
```

### Использование Kubernetes

Создайте `k8s-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crypto-bot-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: crypto-bot
  template:
    metadata:
      labels:
        app: crypto-bot
    spec:
      containers:
      - name: crypto-bot
        image: crypto-bot-dashboard:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: crypto-bot-service
spec:
  selector:
    app: crypto-bot
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

Разверните:
```bash
kubectl apply -f k8s-deployment.yaml
```

---

## Мониторинг

### Настройка логирования

```yaml
# В docker-compose.yml
services:
  crypto-bot-app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Интеграция с Prometheus

Добавьте nginx-prometheus-exporter в `docker-compose.yml`:
```yaml
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    ports:
      - "9113:9113"
    command:
      - -nginx.scrape-uri=http://crypto-bot-app/nginx_status
```

---

## Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/ru/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## Поддержка

При возникновении проблем:
1. Проверьте логи: `docker logs crypto-bot-dashboard`
2. Проверьте статус: `docker ps -a`
3. Попробуйте пересобрать: `docker-compose up -d --build --force-recreate`
