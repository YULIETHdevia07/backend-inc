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
   "caseType": "SAP",
  "description": "Esta es una PQR creada desde Postman para probar el módulo."
}
```

---

# Tipos de caso disponibles

```txt
SAP
DANO_EQUIPO
INSTALACION
OTRO
```

---

## Respuesta exitosa

```json
{
  "message": "PQR creada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
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

## Respuesta si `caseType` y `description` no son enviados

```json
{
  "message": "El tipo de caso y la descripción son obligatorios"
}
```

---

## Respuesta si el `caseType` no es válido

```json
{
  "message": "Tipo de caso no válido",
  "allowedCaseTypes": [
    "SAP",
    "DANO_EQUIPO",
    "INSTALACION",
    "OTRO"
  ]
}
```

---

## Respuesta si la descripción supera los 500 caracteres

```json
{
  "message": "La respuesta no puede superar los 500 caracteres"
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

# Obtener todas las PQR

## Endpoint protegido para ADMIN

```http
GET /api/pqrs
```

## Descripción

Endpoint privado encargado de obtener todas las PQR registradas en el sistema.

Esta ruta está protegida por autenticación JWT y validación de rol, por lo tanto, solo puede ser utilizada por usuarios con rol `ADMIN`.

El administrador podrá visualizar todas las solicitudes creadas por los usuarios, incluyendo la información básica del usuario que creó cada PQR.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

- ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Todas las PQR obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "title": "Solicitud de prueba",
      "description": "Esta es una PQR creada desde Postman.",
      "status": "PENDIENTE",
      "response": null,
      "createdAt": "2026-05-12T00:00:00.000Z",
      "updatedAt": "2026-05-12T00:00:00.000Z",
      "userId": 1,
      "user": {
        "id": 1,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      }
    }...
  ]
}
```

---

## Respuesta si el usuario no es ADMIN

```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

---

## Respuesta si no hay token

```json
{
  "message": "Acceso denegado. Token no proporcionado."
}
```

---

# Cambiar estado de una PQR

## Endpoint protegido para ADMIN

```http
PATCH /api/pqrs/:id/status
```

## Ejemplo

```http
PATCH /api/pqrs/1/status
```

## Descripción

Endpoint privado encargado de cambiar el estado de una PQR existente.

Esta ruta solo puede ser utilizada por usuarios autenticados con rol `ADMIN`.

Permite actualizar el seguimiento de una solicitud según el proceso de atención.

Funcionamiento interno:

- Obtiene el id desde los parámetros de la URL.
- Convierte el id a número.
- Valida que el id sea válido.
- Verifica que el estado enviado esté dentro de los estados permitidos.
- Consulta si la PQR existe en la base de datos.
  Si existe, actualiza el estado de la PQR.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

- ADMIN

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | number | Identificador de la PQR que se desea actualizar |

---

## Estados permitidos

- PENDIENTE
- EN_PROCESO
- RESPONDIDA
- CERRADA

---

## Body

```json
{
  "status": "EN_PROCESO"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Estado de la PQR actualizado correctamente",
  "pqr": {
    "id": 1,
    "title": "Solicitud de prueba",
    "description": "Esta es una PQR creada desde Postman.",
    "status": "EN_PROCESO",
    "response": null,
    "createdAt": "2026-05-12T00:00:00.000Z",
    "updatedAt": "2026-05-12T00:00:00.000Z",
    "userId": 1
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía estado

```json
{
  "message": "El estado es obligatorio"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si el estado no es válido

```json
{
  "message": "Estado no válido",
  "allowedStatus": [
    "PENDIENTE",
    "EN_PROCESO",
    "RESPONDIDA",
    "CERRADA"
  ]
}
```

---

## Respuesta si el usuario no es ADMIN

```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

---

# Responder una PQR

## Endpoint protegido para ADMIN

```http
PATCH /api/pqrs/:id/respond
```

## Ejemplo

```http
PATCH /api/pqrs/1/respond
```

## Descripción

Endpoint privado encargado de permitir que el administrador responda una PQR.

Cuando el administrador responde una PQR, el sistema guarda la respuesta en el campo `response` y cambia automáticamente el estado de la solicitud a `RESPONDIDA`.

Esta ruta solo puede ser utilizada por usuarios autenticados con rol `ADMIN`.

Funcionamiento interno:

- Obtiene el id desde los parámetros de la URL.
- Convierte el id a número.
- Valida que el id sea válido.
- Valida que el campo response no esté vacío.
- Valida que la respuesta no contenga únicamente espacios.
- Consulta si la PQR existe en la base de datos.
  Si existe, guarda la respuesta limpia.
- Cambia automáticamente el estado de la PQR a RESPONDIDA.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

- ADMIN

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | number | Identificador de la PQR que se desea responder |

---

## Body

```json
{
  "response": "Su solicitud fue revisada. Se realizará el seguimiento correspondiente desde el área encargada."
}
```

---

## Respuesta exitosa

```json
{
  "message": "PQR respondida correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "Esta es una PQR creada desde Postman.",
    "status": "RESPONDIDA",
    "response": "Su solicitud fue revisada. Se realizará el seguimiento correspondiente desde el área encargada.",
    "createdAt": "2026-05-12T00:00:00.000Z",
    "updatedAt": "2026-05-12T00:00:00.000Z",
    "userId": 1
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía respuesta

```json
{
  "message": "La respuesta es obligatoria"
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si el usuario no es ADMIN

```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si la descripción supera los 500 caracteres

```json
{
  "message": "La respuesta no puede superar los 500 caracteres"
}
```

---

# Resumen actualizado de endpoints funcionales

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | /api/health | Verifica el funcionamiento de la API | Público |
| GET | /api/users | Obtiene los usuarios registrados | Según configuración |
| POST | /api/users/register | Registra un nuevo usuario | Público |
| POST | /api/users/login | Inicia sesión y genera token JWT | Público |
| GET | /api/profile | Obtiene el perfil del usuario autenticado | Usuario autenticado |
| POST | /api/pqrs | Crea una nueva PQR | USER / ADMIN |
| GET | /api/pqrs/my | Obtiene las PQR del usuario autenticado | USER / ADMIN |
| GET | /api/pqrs | Obtiene todas las PQR del sistema | ADMIN |
| PATCH | /api/pqrs/:id/status | Cambia el estado de una PQR | ADMIN |
| PATCH | /api/pqrs/:id/respond | Responde una PQR | ADMIN |