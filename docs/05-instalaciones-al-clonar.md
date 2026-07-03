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

# 3. Configurar variables de entorno

Crear un archivo:

```txt
.env
```

## Ejemplo

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/backend_inc"
JWT_SECRET="secret_key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## Descripción

Las variables de entorno permiten configurar datos importantes del proyecto sin escribirlos directamente en el código.

La variable:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/backend_inc"
```

se utiliza para conectar el backend con la base de datos MySQL. En esta variable se especifica el usuario, la contraseña, el servidor, el puerto y el nombre de la base de datos.

La variable:

```env
JWT_SECRET="secret_key"
```

se utiliza para firmar y validar los tokens de autenticación JWT. Esta clave permite proteger las sesiones de los usuarios dentro del sistema.

La variable:

```env
PORT=3000
```

indica el puerto en el que se ejecutará el servidor backend.

La variable:

```env
FRONTEND_URL="http://localhost:5173"
```

indica la dirección donde se ejecuta el frontend. Esta variable se utiliza principalmente para permitir la comunicación entre el frontend y el backend, por ejemplo, en la configuración de CORS.

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

## Opción 1: Crear la base de datos con migraciones (Recomendado)

### Comando

```bash
npx prisma migrate dev
```

### Descripción

Aplica todas las migraciones almacenadas en `prisma/migrations`, crea o actualiza la base de datos y mantiene un historial de los cambios realizados. Esta es la opción recomendada para trabajar en equipo.

---

## Opción 2: Crear la base de datos directamente desde el esquema

### Comando

```bash
npx prisma db push
```

### Descripción

Sincroniza la base de datos directamente con el archivo:

```txt
prisma/schema.prisma
```

Crea o actualiza las tablas sin utilizar las migraciones. Es útil para crear la base de datos rápidamente durante el desarrollo o para pruebas, pero **no genera un historial de migraciones**, por lo que no se recomienda para proyectos colaborativos.

---

# 6. Ejecutar seed de Prisma

## Comando

```bash
npx prisma db seed
```

## Descripción

Este comando ejecuta el archivo de seed configurado en Prisma.

El seed se usa para insertar datos iniciales necesarios para que el sistema funcione correctamente.

En este proyecto carga información base como:

- Ciudades
- Departamentos o áreas
- Perfiles de cargo
- Pasos de aprobación de requisiciones
- Pasos de VoBo de contratación

Este comando debe ejecutarse después de las migraciones, porque primero deben existir las tablas en la base de datos.

---

# 7. Iniciar el servidor

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