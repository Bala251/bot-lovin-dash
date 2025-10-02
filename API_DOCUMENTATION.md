# 🔌 API Документация для Crypto Bot Dashboard

## Текущее состояние

На данный момент приложение использует **mock-данные** (тестовые данные, захардкоженные в коде). Для полноценной работы необходимо настроить бэкенд.

---

## 📊 Необходимые API эндпоинты

### 1. Статус бота
**Эндпоинт:** `GET /api/bot/status`

**Описание:** Получение текущего статуса бота

**Ответ:**
```json
{
  "isActive": true,
  "status": "running",
  "lastUpdate": "2025-01-15T15:30:00Z",
  "uptime": 86400
}
```

**Переменные:**
- `isActive` (boolean) - активен ли бот
- `status` (string) - статус: "running", "stopped", "error"
- `lastUpdate` (string ISO 8601) - время последнего обновления
- `uptime` (number) - время работы в секундах

---

### 2. Управление ботом
**Эндпоинт:** `POST /api/bot/toggle`

**Описание:** Включение/выключение бота

**Запрос:**
```json
{
  "action": "start"
}
```

**Переменные запроса:**
- `action` (string) - действие: "start" или "stop"

**Ответ:**
```json
{
  "success": true,
  "isActive": true,
  "message": "Бот успешно запущен"
}
```

---

### 3. Метрики
**Эндпоинт:** `GET /api/metrics`

**Описание:** Получение текущих метрик торговли

**Ответ:**
```json
{
  "balance": {
    "amount": 12450.50,
    "currency": "USDT",
    "balanceRub": 1182547.50
  },
  "profit": {
    "daily": 175.30,
    "percentage": 1.43
  },
  "trades": {
    "total": 42,
    "today": 8,
    "successful": 35,
    "failed": 7
  }
}
```

**Переменные:**
- `balance.amount` (number) - баланс в USDT
- `balance.currency` (string) - валюта баланса
- `balance.balanceRub` (number) - баланс в рублях
- `profit.daily` (number) - дневная прибыль
- `profit.percentage` (number) - процент прибыли
- `trades.total` (number) - всего сделок
- `trades.today` (number) - сделок сегодня
- `trades.successful` (number) - успешных сделок
- `trades.failed` (number) - неудачных сделок

---

### 4. График баланса
**Эндпоинт:** `GET /api/balance/history`

**Описание:** Получение истории изменения баланса

**Параметры запроса:**
- `period` (string, optional) - период: "24h", "7d", "30d", "all". По умолчанию: "24h"
- `interval` (string, optional) - интервал данных: "1h", "4h", "1d". По умолчанию: "4h"

**Пример запроса:**
```
GET /api/balance/history?period=24h&interval=4h
```

**Ответ:**
```json
{
  "period": "24h",
  "interval": "4h",
  "data": [
    {
      "timestamp": "2025-01-15T00:00:00Z",
      "time": "00:00",
      "balance": 10000.00
    },
    {
      "timestamp": "2025-01-15T04:00:00Z",
      "time": "04:00",
      "balance": 10150.00
    },
    {
      "timestamp": "2025-01-15T08:00:00Z",
      "time": "08:00",
      "balance": 10050.00
    }
  ],
  "summary": {
    "startBalance": 10000.00,
    "currentBalance": 10550.00,
    "change": 550.00,
    "changePercent": 5.50
  }
}
```

**Переменные:**
- `period` (string) - запрошенный период
- `interval` (string) - интервал данных
- `data` (array) - массив точек данных
  - `timestamp` (string ISO 8601) - временная метка
  - `time` (string) - время в читаемом формате
  - `balance` (number) - баланс на момент времени
- `summary` (object) - сводная информация
  - `startBalance` (number) - начальный баланс
  - `currentBalance` (number) - текущий баланс
  - `change` (number) - изменение
  - `changePercent` (number) - процент изменения

---

### 5. История сделок
**Эндпоинт:** `GET /api/trades/history`

**Описание:** Получение истории сделок

**Параметры запроса:**
- `limit` (number, optional) - количество сделок. По умолчанию: 50
- `offset` (number, optional) - смещение для пагинации. По умолчанию: 0
- `status` (string, optional) - фильтр по статусу: "all", "profit", "loss". По умолчанию: "all"

**Пример запроса:**
```
GET /api/trades/history?limit=20&offset=0&status=all
```

**Ответ:**
```json
{
  "total": 156,
  "limit": 20,
  "offset": 0,
  "trades": [
    {
      "id": "trade_123456",
      "pair": "BTC/USDT",
      "type": "sell",
      "amount": 0.025,
      "price": 45200.00,
      "priceFormatted": "$45,200",
      "profit": 85.00,
      "profitFormatted": "+$85",
      "isProfit": true,
      "timestamp": "2025-01-15T15:30:00Z",
      "date": "15.01.2025",
      "time": "15:30",
      "status": "completed"
    },
    {
      "id": "trade_123457",
      "pair": "ETH/USDT",
      "type": "buy",
      "amount": 1.5,
      "price": 2850.00,
      "priceFormatted": "$2,850",
      "profit": 45.00,
      "profitFormatted": "+$45",
      "isProfit": true,
      "timestamp": "2025-01-15T14:20:00Z",
      "date": "15.01.2025",
      "time": "14:20",
      "status": "completed"
    }
  ]
}
```

**Переменные:**
- `total` (number) - общее количество сделок
- `limit` (number) - запрошенный лимит
- `offset` (number) - смещение
- `trades` (array) - массив сделок
  - `id` (string) - уникальный ID сделки
  - `pair` (string) - торговая пара (например, "BTC/USDT")
  - `type` (string) - тип сделки: "buy" или "sell"
  - `amount` (number) - количество
  - `price` (number) - цена
  - `priceFormatted` (string) - цена в отформатированном виде
  - `profit` (number) - прибыль/убыток
  - `profitFormatted` (string) - прибыль в отформатированном виде
  - `isProfit` (boolean) - прибыльная ли сделка
  - `timestamp` (string ISO 8601) - временная метка
  - `date` (string) - дата в читаемом формате
  - `time` (string) - время в читаемом формате
  - `status` (string) - статус: "completed", "pending", "cancelled"

---

### 6. Обновление данных
**Эндпоинт:** `POST /api/refresh`

**Описание:** Принудительное обновление всех данных

**Запрос:**
```json
{
  "components": ["status", "metrics", "balance", "trades"]
}
```

**Переменные запроса:**
- `components` (array, optional) - список компонентов для обновления. Если не указано, обновляются все

**Ответ:**
```json
{
  "success": true,
  "updatedAt": "2025-01-15T15:30:00Z",
  "components": {
    "status": true,
    "metrics": true,
    "balance": true,
    "trades": true
  }
}
```

---

## 🔒 Аутентификация

Все запросы к API должны содержать токен аутентификации в заголовке:

```
Authorization: Bearer YOUR_API_TOKEN
```

---

## 🌐 Курс валют

Для конвертации USDT в рубли используется API курсов валют:

**Эндпоинт:** `GET /api/exchange-rate`

**Ответ:**
```json
{
  "base": "USD",
  "target": "RUB",
  "rate": 95.00,
  "timestamp": "2025-01-15T15:30:00Z"
}
```

---

## ⚠️ Обработка ошибок

Все ошибки возвращаются в следующем формате:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки",
    "details": {}
  }
}
```

**Коды ошибок:**
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера
- `503` - Сервис недоступен

---

## 📡 WebSocket (опционально)

Для получения данных в реальном времени можно использовать WebSocket:

**URL:** `wss://your-api.com/ws`

**Подписка на события:**
```json
{
  "action": "subscribe",
  "channels": ["bot_status", "metrics", "trades"]
}
```

**Получение обновлений:**
```json
{
  "channel": "trades",
  "event": "new_trade",
  "data": {
    "id": "trade_123458",
    "pair": "BTC/USDT",
    "type": "buy",
    "amount": 0.1,
    "price": 45300.00,
    "timestamp": "2025-01-15T15:35:00Z"
  }
}
```

---

## 🚀 Интеграция с Lovable Cloud

Для быстрой настройки бэкенда рекомендуется использовать **Lovable Cloud**:

1. **База данных** - автоматически создаются таблицы для:
   - Статусов бота
   - Метрик
   - Истории баланса
   - Истории сделок

2. **Edge Functions** - серверные функции для:
   - Управления ботом
   - Получения данных
   - Обработки WebSocket соединений
   - Интеграции с внешними API

3. **Аутентификация** - встроенная система авторизации

4. **Storage** - хранение логов и конфигураций

---

## 📝 Примеры использования

### React Hook для получения данных

```typescript
import { useEffect, useState } from 'react';

interface Metrics {
  balance: { amount: number; currency: string; balanceRub: number };
  profit: { daily: number; percentage: number };
  trades: { total: number; today: number; successful: number; failed: number };
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/metrics', {
        headers: {
          'Authorization': `Bearer ${YOUR_TOKEN}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
};
```

---

## 🔗 Следующие шаги

1. **Выберите способ реализации бэкенда:**
   - Lovable Cloud (рекомендуется) - быстрая настройка без внешних сервисов
   - Собственный бэкенд (Node.js, Python, etc.)
   - Интеграция с существующим API

2. **Настройте базу данных** для хранения:
   - Конфигурации бота
   - Истории сделок
   - Метрик и статистики
   - Логов

3. **Реализуйте аутентификацию** для защиты API

4. **Интегрируйте с биржей** (Binance, Bybit, etc.) для реальных данных

5. **Настройте мониторинг** и логирование ошибок
