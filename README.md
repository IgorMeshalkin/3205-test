# 3205 Test Project

Тестовое задание, реализованное в виде fullstack-приложения для проверки валидности URL.

<br/>

## Техническое задание

Приложение написано в строгом соответствии с [Техническим заданием](https://docs.google.com/document/d/19szbENkvcJS5oY0OcwxL6HVwwyAv44EmaIvO_ccKKmQ/edit?tab=t.0).

<br/>

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

<br/>

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

<br/>

## Особенности

⚠️ `.env` файлы **намеренно оставлены в репозитории** для упрощения запуска тестового проекта.

<br/>

## Функциональность

- Создание и управление заданиями
- Асинхронная проверка URL
- Режим реального времени обновления активного задания
- Детальный просмотр информации о заданиях
- Отслеживание статусов выполнения

  <br/>

## Внешний вид
<img width="1897" height="929" alt="Screenshot from 2026-06-24 20-42-03" src="https://github.com/user-attachments/assets/f7ee98b2-3d88-45ac-971c-bbfbd4295ca4" />
<img width="1897" height="929" alt="Screenshot from 2026-06-24 20-42-40" src="https://github.com/user-attachments/assets/de3fd12e-a33f-4580-b48d-5dfa2e83209c" />
<img width="1897" height="929" alt="image" src="https://github.com/user-attachments/assets/14f2f069-69aa-4209-ae89-adecad5daf36" />



