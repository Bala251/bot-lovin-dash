# 📦 Инструкция по развертыванию Crypto Bot Dashboard в Docker

## Оглавление
1. [Предварительные требования](#предварительные-требования)
2. [Быстрый старт](#быстрый-старт)
3. [Подробная инструкция](#подробная-инструкция)
4. [Настройка и конфигурация](#настройка-и-конфигурация)
5. [Управление контейнером](#управление-контейнером)
6. [Решение проблем](#решение-проблем)

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

### Использование собственного домена

1. **Настройте reverse proxy (например, Nginx на хосте):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

2. **Для HTTPS с Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
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
