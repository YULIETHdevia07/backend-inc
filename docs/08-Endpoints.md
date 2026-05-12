# Endpoints funcionales

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

# Crear PQR

## Endpoint protegido

```http
POST /api/pqrs
```

## Descripción

Endpoint privado encargado de registrar una nueva PQR asociada al usuario autenticado.

La ruta utiliza middleware JWT para validar la autenticación mediante token.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Body

```json
{
  "title": "Solicitud de prueba",
  "description": "Esta es una PQR creada desde Postman para probar el módulo."
}
```

---

## Respuesta exitosa

```json
{
  "message": "PQR creada correctamente",
  "pqr": {
    "id": 1,
    "title": "Solicitud de prueba",
    "description": "Esta es una PQR creada desde Postman para probar el módulo.",
    "status": "PENDIENTE",
    "response": null,
    "createdAt": "2026-05-12T00:00:00.000Z",
    "updatedAt": "2026-05-12T00:00:00.000Z",
    "userId": 1
  }
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al crear la PQR"
}
```

---

# Obtener PQR del usuario autenticado

## Endpoint protegido

```http
GET /api/pqrs/my
```

## Descripción

Endpoint privado encargado de obtener las PQR registradas por el usuario autenticado.

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
  "message": "PQR obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "title": "Solicitud de prueba",
      "description": "Esta es una PQR creada desde Postman para probar el módulo.",
      "status": "PENDIENTE",
      "response": null,
      "createdAt": "2026-05-12T00:00:00.000Z",
      "updatedAt": "2026-05-12T00:00:00.000Z",
      "userId": 1
    }
  ]
}
```

---