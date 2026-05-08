# Configuración del Proyecto Clonado

Esta guía explica cómo configurar y ejecutar el backend localmente después de clonar el repositorio.

---

# 1. Clonar el repositorio

```bash
git clone + url
```

---

# 2. Instalar dependencias

```bash
npm install
```

## Descripción

Este comando instalará automáticamente todas las dependencias definidas en:

```txt
package.json
```

Incluyendo:

- Express
- Prisma
- TypeScript
- JWT
- Cors
- Dotenv
- TSX
- Tipados de TypeScript

---

# .3. Configurar variables de entorno

Crear un archivo:

```txt
.env
```

## Ejemplo

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/backend_inc"
JWT_SECRET="secret_key"
PORT=3000
```

---

# 4. Generar Prisma Client

## Comando

```bash
npx prisma generate
```

## Descripción

Genera automáticamente el cliente de Prisma necesario para conectarse a la base de datos.

---

# 5. Ejecutar migraciones

## Comando

```bash
npx prisma migrate dev
```

## Descripción

Sincroniza la base de datos con el archivo:

```txt
prisma/schema.prisma
```

---

# 6. Iniciar el servidor

## Comando

```bash
npm run dev
```

---

# Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- MySQL
- Git
- npm

---

# Scripts Disponibles

| Script | Descripción |
|---|---|
| npm run dev | Ejecuta el servidor en desarrollo |
| npx prisma studio | Abre interfaz visual de Prisma |
| npx prisma generate | Genera Prisma Client |
| npx prisma migrate dev | Ejecuta migraciones |