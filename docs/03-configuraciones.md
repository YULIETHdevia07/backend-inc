# 1. Configuración de módulos ECMAScript

## Archivo `package.json`

Se modificó:

```json
"type": "commonjs"
```

por:

```json
"type": "module"
```

### Descripción

Esta configuración permite utilizar la sintaxis moderna de JavaScript:

```ts
import/export
```

compatible con Prisma y TypeScript modernos.

---

# 2. Creación de `app.ts`

## Archivo creado

```txt
src/app.ts
```

### Descripción

Este archivo contiene la configuración principal de Express:

- Inicialización de Express
- Configuración de middlewares
- Configuración de CORS
- Registro de rutas
- Exportación de la aplicación

---

# 3. Creación de `server.ts`

## Archivo creado

```txt
src/server.ts
```

### Descripción

Este archivo es el punto de entrada del backend.

Se encarga de:

- Importar la aplicación Express
- Definir el puerto del servidor
- Ejecutar el servidor backend

---

# 4. Configuración de scripts

## Archivo modificado

```txt
package.json
```

### Script agregado

```json
"scripts": {
  "dev": "tsx watch src/server.ts"
}
```

### Descripción

Este script permite ejecutar el backend en modo desarrollo mediante el comando:

```bash
npm run dev
```

El servidor se reinicia automáticamente al detectar cambios en el proyecto.

---



---

# 5. Creación de Prisma Client

## Archivo creado

```txt
src/prisma/client.ts
```

### Descripción

Se creó la instancia principal de Prisma Client para permitir la conexión y consultas a MySQL desde cualquier parte del backend.

---

# 6. Creación de controlador de usuarios

## Archivo creado

```txt
src/controllers/user.controller.ts
```

### Descripción

Se creó el controlador inicial de usuarios.

Actualmente contiene:

- Endpoint para obtener usuarios
- Respuesta JSON de prueba
- Configuración inicial de Request y Response con TypeScript

---

# 7. Creación de rutas de usuarios

## Archivo creado

```txt
src/routes/user.routes.ts
```

### Descripción

Se creó el archivo encargado de manejar las rutas relacionadas con usuarios.

Actualmente incluye:

```txt
GET /users
```

---

# 8 Creación de rutas principales

## Archivo creado

```txt
src/routes/index.ts
```

### Descripción

Este archivo centraliza todas las rutas del backend.

Actualmente incluye:

| Ruta | Descripción |
|---|---|
| /api/health | Verificación del estado de la API |
| /api/users | Rutas relacionadas con usuarios |

---


---

# 9. Implementación de autenticación JWT

## Descripción

Se implementó el sistema de autenticación mediante JSON Web Token (JWT) para permitir el acceso seguro a rutas privadas del backend.

El sistema permite:

- Validar credenciales de usuario
- Generar tokens JWT
- Proteger endpoints privados
- Obtener información del usuario autenticado
- Validar sesiones seguras

---

# 10. Creación del middleware JWT

## Archivo creado

```txt
src/middlewares/auth.middleware.ts
```

### Descripción

Se creó el middleware encargado de proteger rutas privadas del backend.

Funciones principales:

- Leer token desde los headers
- Validar token JWT
- Verificar autenticación
- Denegar acceso no autorizado
- Adjuntar usuario autenticado al request

---

## Utilizacion en postma

```http
Authorization: Bearer TOKEN
```

---

## Respuesta si no existe token

```json
{
  "message": "Acceso denegado. Token no proporcionado."
}
```

---

## Respuesta si el token es inválido

```json
{
  "message": "Token inválido o expirado."
}
```

---

# 11. Protección de rutas privadas

## Middleware aplicado

```ts
authMiddleware
```

### Descripción

El middleware se implementó en rutas privadas para validar autenticación antes de ejecutar el controlador.

Ejemplo:

```ts
router.get("/", authMiddleware, getProfile);
```

### Función del controlador Profile

El controlador `getProfile` se creó para manejar la funcionalidad de perfil del usuario autenticado dentro del backend.

Su función principal en el proyecto será permitir que el sistema identifique quién es el usuario que inició sesión mediante el token JWT y devolver su información de forma segura.

En el proyecto tendrá funciones importantes como:

- Obtener los datos del usuario autenticado
- Validar que el usuario tenga sesión activa
- Proteger información privada
- Permitir acceso únicamente a usuarios autenticados
- Servir como base para futuras funcionalidades privadas

Este controlador será fundamental porque muchas funcionalidades futuras dependerán del usuario autenticado, por ejemplo:

- Perfil de usuario
- Edición de perfil
- Configuraciones de cuenta
- Panel privado
- Historial del usuario
- Roles y permisos
- Favoritos
- Publicaciones propias
- Gestión de datos personales

---

### Proceso que realiza actualmente

El controlador actualmente realiza el siguiente proceso:

1. Leer el usuario autenticado desde el token JWT.
2. Obtener el `id` del usuario autenticado.
3. Consultar el usuario en MySQL mediante Prisma.
4. Retornar únicamente información segura.
5. Evitar exponer la contraseña.
6. Manejar errores y accesos no autorizados.

---

# 12. Endpoints funcionales

Actualmente el backend cuenta con endpoints funcionales para validación, autenticación y manejo seguro de usuarios mediante JWT.

---

## Health Check

```http
GET /api/health
```

### Descripción

Endpoint utilizado para verificar el correcto funcionamiento de la API.

---

### Respuesta exitosa

```json
{
  "message": "API funcionando correctamente"
}
```

---

# Obtener usuarios

## Endpoint

```http
GET /api/users
```

### Descripción

Endpoint encargado de obtener los usuarios registrados en la base de datos mediante Prisma ORM.

---

### Respuesta exitosa

```json
[
  {
    "id": 1,
    "name": "Juan",
    "email": "juan@gmail.com"
  }
]
```

---

# Registrar usuario

## Endpoint

```http
POST /api/users/register
```

### Descripción

Endpoint encargado del registro de nuevos usuarios.

Funciones implementadas:

- Validación de campos
- Verificación de email existente
- Encriptación de contraseña con bcrypt
- Registro en MySQL mediante Prisma
- Protección de contraseña en respuestas

---

## Body

```json
{
  "name": "Juan",
  "email": "juan@gmail.com",
  "password": "123456"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@gmail.com"
  }
}
```

---

## Respuesta si el usuario ya existe

```json
{
  "message": "El usuario ya existe"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al registrar usuario"
}
```

---

# Login de usuario JWT

## Endpoint

```http
POST /api/users/login
```

### Descripción

Endpoint encargado de autenticar usuarios registrados mediante JWT.

Funciones implementadas:

- Validación de email
- Validación de contraseña
- Comparación segura con bcrypt
- Generación de token JWT
- Retorno del usuario autenticado
- Protección de credenciales sensibles

---

## Body

```json
{
  "email": "juan@gmail.com",
  "password": "123456"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Login exitoso",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@gmail.com"
  }
}
```

---

## Respuesta credenciales inválidas

```json
{
  "message": "Credenciales inválidas"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al iniciar sesión"
}
```

---

# Perfil autenticado

## Endpoint protegido

```http
GET /api/profile
```

### Descripción

Endpoint privado encargado de obtener la información del usuario autenticado mediante token JWT.

La ruta utiliza middleware JWT para restringir el acceso únicamente a usuarios autenticados.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Respuesta exitosa

```json
{
  "message": "Perfil obtenido correctamente.",
  "user": {
    "id": 5,
    "name": "Marlon",
    "email": "marlon@gmail.com"
  }
}
```

---

## Respuesta sin token

```json
{
  "message": "Acceso denegado. Token no proporcionado."
}
```

---

## Respuesta token inválido

```json
{
  "message": "Token inválido o expirado."
}
```

---