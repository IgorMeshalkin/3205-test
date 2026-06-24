# 3205 Test Project

Тестовое задание, реализованное в виде fullstack-приложения для проверки валидности URL.

## Технологический стек

**Backend (3205-api):**
- NestJS
- Swagger/OpenAPI
- TypeScript

**Frontend (3205-web):**
- React 19
- Redux Toolkit
- React Router
- Vite
- TypeScript
- Sass

## Быстрый старт

### Запуск через Docker Compose (рекомендуется)

```bash
docker-compose up --build
```

После запуска приложение будет доступно:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger документация: http://localhost:8080/api

### Локальная разработка

**Backend:**
```bash
cd 3205-api
npm install
npm run start:dev
```

**Frontend:**
```bash
cd 3205-web
npm install
npm run dev
```

## Особенности

⚠️ `.env` файлы **намеренно оставлены в репозитории** для упрощения запуска тестового проекта.

## Функциональность

- Создание и управление заданиями
- Асинхронная проверка URL
- Режим реального времени обновления активных заданий
- Детальный просмотр информации о заданиях
- Отслеживание статусов выполнения
