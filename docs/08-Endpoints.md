# Endpoints funcionales

Actualmente el backend cuenta con endpoints funcionales para validación, autenticación, manejo seguro de usuarios mediante JWT, administración de PQR y consulta del historial de mensajes del chat.

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

# Registrar usuario

## Endpoint

```http
POST /api/auth/register
```

## Descripción

Endpoint encargado del registro de nuevos usuarios.

Funciones implementadas:

* Limpieza y normalización de datos.
* Validación de campos obligatorios.
* Validación de nombre.
* Validación de formato de correo electrónico.
* Validación de longitud mínima de contraseña.
* Verificación de email existente.
* Encriptación segura de contraseña con bcrypt.
* Registro en MySQL mediante Prisma.
* Protección de contraseña en respuestas.

---

## Validaciones implementadas

### Nombre

* Es obligatorio.
* Solo permite letras.
* Debe tener mínimo 3 caracteres.
* Se eliminan espacios innecesarios.

### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte automáticamente a minúsculas.
* Se eliminan espacios innecesarios.
* No puede estar registrado previamente.

### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se eliminan espacios innecesarios.
* Se almacena encriptada mediante bcrypt.

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
    "email": "juan@gmail.com",
    "role": "USER"
  }
}
```

---

## Respuesta si faltan campos

```json
{
  "message": "Todos los campos son obligatorios"
}
```

---

## Respuesta si el nombre contiene caracteres inválidos

```json
{
  "message": "El nombre solo puede contener letras"
}
```

---

## Respuesta si el nombre tiene menos de 3 caracteres

```json
{
  "message": "El nombre debe tener mínimo 3 caracteres"
}
```

---

## Respuesta si el correo no tiene formato válido

```json
{
  "message": "El correo electrónico no tiene un formato válido"
}
```

---

## Respuesta si la contraseña tiene menos de 6 caracteres

```json
{
  "message": "La contraseña debe tener mínimo 6 caracteres"
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

# Carga masiva de usuarios

## Endpoint

```http
POST /api/auth/register/bulk
```

## Descripción

Endpoint encargado de registrar usuarios mediante carga masiva desde un archivo Excel.

Esta funcionalidad permite subir un archivo con varios usuarios y procesarlos de forma automática. El sistema lee el archivo, valida la información de cada fila y registra los usuarios en la base de datos.

En esta carga masiva, el administrador puede definir el rol de cada usuario mediante la columna `role`.

---

## Tipo de envío requerido

Este endpoint no recibe datos en formato JSON.

Debe enviarse mediante:

```txt
multipart/form-data
```

---

## Formato del archivo Excel

El archivo debe tener las siguientes columnas en la primera fila:

```txt
nombre | correo | contraseña | rol
```

### Ejemplo

| name       | email                                   | contraseña | rol |
| ---------- | --------------------------------------- | -------- | ----- |
| Juan Pérez | [juan@gmail.com](mailto:juan@gmail.com) | 123456   | USER  |
| Ana María  | [ana@gmail.com](mailto:ana@gmail.com)   | 123456   | AGENT |
| José Peña  | [jose@gmail.com](mailto:jose@gmail.com) | 123456   | ADMIN |

---

## Campo requerido

| Campo | Tipo | Obligatorio | Descripción                                |
| ----- | ---- | ----------- | ------------------------------------------ |
| file  | File | Sí          | Archivo Excel con los usuarios a registrar |

---

## Ejemplo en Postman

```txt
Método: POST
URL: http://localhost:4000/api/auth/register/bulk
Body: form-data
Key: file
Type: File
Value: usuarios.xlsx
```

---

## Validaciones implementadas

### Archivo

* El archivo es obligatorio.
* Debe ser un archivo Excel.
* Solo se permiten archivos con extensión `.xlsx` o `.xls`.
* Debe contener al menos una hoja.
* Debe contener usuarios para registrar.
* Debe tener las columnas requeridas: `nombre`, `correo`, `contraseña` y `rol`.

### Nombre

* Es obligatorio.
* Solo permite letras, espacios, tildes y la letra ñ.
* Debe tener mínimo 3 caracteres.
* Se eliminan espacios innecesarios al inicio y al final.

### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte automáticamente a minúsculas.
* Se eliminan espacios innecesarios al inicio y al final.
* No puede estar repetido dentro del archivo.
* No puede estar registrado previamente en la base de datos.

### Rol

* Es obligatorio.
* Se convierte automáticamente a mayúsculas.
* Debe corresponder a uno de los roles permitidos.

Roles permitidos:

```txt
USER
ADMIN
AGENT
```

### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se almacena encriptada mediante bcrypt.

---

## Respuesta exitosa

```json
{
  "message": "Carga masiva procesada correctamente",
  "result": {
    "totalRows": 2,
    "totalCreated": 2,
    "totalRowsWithErrors": 0,
    "totalErrors": 0,
    "createdUsers": [
      {
        "id": 32,
        "name": "lolauno",
        "email": "louno@gmail.com",
        "role": "USER"
      },
      {
        "id": 31,
        "name": "pello",
        "email": "pellouno@gmail.com",
        "role": "AGENT"
      }
    ],
    "errors": [],
    "message": "Todos los usuarios fueron registrados correctamente."
  }
}
```

---

## Respuesta si no se envía archivo

```json
{
  "message": "Debe subir un archivo Excel"
}
```

---

## Respuesta si el tipo de archivo no es válido

```json
{
  "message": "Solo se permiten archivos Excel"
}
```

---

## Respuesta si el archivo no contiene encabezados

```json
{
  "message": "El archivo Excel no contiene encabezados"
}
```

## Respuesta si faltan columnas requeridas

```json
{
  "message": "El archivo Excel no tiene las columnas requeridas: role. Las columnas obligatorias son: name, email, password y role."
}
```

---
## Respuesta si el archivo no contiene hojas

```json
{
  "message": "El archivo Excel no contiene hojas"
}
```

## Respuesta si no se puede leer la hoja

```json
{
  "message": "No se pudo leer la hoja del archivo Excel"
}
```

## Respuesta si el archivo no contiene usuarios

```json
{
  "message": "El archivo Excel no contiene usuarios para registrar"
}
```

## Respuesta si una fila tiene campos incompletos

```json
{
  "row": 2,
  "email": "ana@gmail.com",
  "message": "Todos los campos son obligatorios"
}
```

## Respuesta si el nombre contiene caracteres inválidos

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "name",
    "message": "El nombre solo puede contener letras"
  }
]
}
```

## Respuesta si el correo no tiene formato válido

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "El correo electrónico no tiene un formato válido"
  }
]
}
```

## Respuesta si el rol no es válido

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "role",
    "message": "Rol no válido. Los roles permitidos son USER, ADMIN y AGENT"
  }
]
}
```

## Respuesta si el correo está duplicado dentro del archivo

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "Correo duplicado dentro del archivo"
  }
]
}
```

## Respuesta si el usuario ya existe

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "El usuario ya existe"
  }
]
}
```

## Respuesta si la contraseña tiene menos de 6 caracteres

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "password",
    "message": "La contraseña debe tener mínimo 6 caracteres"
  }
]
}
```

## Respuesta en caso de error

```json
{
  "message": "Error al procesar la carga masiva de usuarios"
}
```

---

# Obtener usuarios

## Endpoint protegido para ADMIN

```http
GET /api/users
```

## Descripción

Endpoint privado encargado de obtener todos los usuarios registrados en el sistema.

Esta ruta permite al administrador visualizar los usuarios existentes y sus roles actuales.

Por seguridad, la respuesta no debe incluir la contraseña del usuario.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Usuarios obtenidos correctamente",
  "users": [
    {
      "id": 1,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    }
  ]
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

## Respuesta en caso de error

```json
{
  "message": "Error al obtener los usuarios"
}
```

---

# Cambiar rol de usuario

## Endpoint protegido para ADMIN

```http
PATCH /api/users/:id/role
```

## Ejemplo

```http
PATCH /api/users/2/role
```

## Descripción

Endpoint privado encargado de cambiar el rol de un usuario registrado en el sistema.

Esta ruta solo puede ser utilizada por usuarios autenticados con rol `ADMIN`.

Permite asignar roles según la función que tendrá cada usuario dentro del sistema.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

* ADMIN

---

## Parámetros

| Parámetro | Tipo   | Descripción                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| id        | number | Identificador del usuario al que se le desea cambiar el rol |

---

## Roles permitidos

```txt
USER
ADMIN
AGENT
```

---

## Body

```json
{
  "role": "AGENT"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Rol del usuario actualizado correctamente",
  "user": {
    "id": 2,
    "name": "Carlos",
    "email": "carlos@gmail.com",
    "role": "AGENT"
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id del usuario no es válido"
}
```

---

## Respuesta si no se envía el rol

```json
{
  "message": "El rol es obligatorio"
}
```

---

## Respuesta si el rol no es válido

```json
{
  "message": "Rol no válido",
  "allowedRoles": [
    "USER",
    "ADMIN",
    "AGENT"
  ]
}
```

---

## Respuesta si el usuario no existe

```json
{
  "message": "El usuario no existe"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al actualizar el rol del usuario"
}
```

---

# Login de usuario JWT

## Endpoint

```http
POST /api/users/login
```

## Descripción

Endpoint encargado de autenticar usuarios registrados mediante JWT.

Funciones implementadas:

* Validación de email.
* Validación de contraseña.
* Comparación segura con bcrypt.
* Generación de token JWT.
* Retorno del usuario autenticado.
* Protección de credenciales sensibles.

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
    "email": "juan@gmail.com",
    "role": "USER"
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

## Descripción

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
    "email": "marlon@gmail.com",
    "role": "USER"
  }
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
Content-Type: application/json
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
  "message": "La descripción no puede superar los 500 caracteres"
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
      "caseType": "SAP",
      "description": "Esta es una PQR creada desde Postman para probar el módulo.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
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

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Todas las PQR obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "Esta es una PQR creada desde Postman.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 1,
      "assignedToId": 2,
      "user": {
        "id": 1,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      },
      "assignedTo": {
        "id": 2,
        "name": "Agente María",
        "email": "agente@gmail.com",
        "role": "AGENT"
      }
    }
  ]
}
```

---

# Obtener PQR disponibles para AGENT

## Endpoint protegido para ADMIN / AGENT

```http
GET /api/pqrs/available
```

## Descripción

Endpoint privado encargado de obtener las PQR que aún no tienen responsable asignado.

Una PQR disponible debe cumplir con las siguientes condiciones:

* No tener responsable asignado.
* Tener el campo `assignedToId` en `null`.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Respuesta exitosa

```json
{
  "message": "PQR disponibles obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "No puedo ingresar al sistema.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 3,
      "assignedToId": null,
      "user": {
        "id": 3,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      }
    }
  ]
}
```

---

# Tomar una PQR disponible

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/take
```

## Ejemplo

```http
PATCH /api/pqrs/1/take
```

## Descripción

Endpoint privado encargado de permitir que un usuario con rol `AGENT` tome una PQR disponible para atenderla.

Cuando el agente toma una PQR, el sistema guarda el id del usuario autenticado en el campo `assignedToId`.

Este endpoint no requiere body, porque el usuario responsable se obtiene desde el token JWT.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Respuesta exitosa

```json
{
  "message": "PQR tomada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "No puedo ingresar al sistema.",
    "status": "EN_PROCESO",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
    "userId": 3,
    "assignedToId": 5,
    "user": {
      "id": 3,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    },
    "assignedTo": {
      "id": 5,
      "name": "Carlos Agente",
      "email": "carlos@gmail.com",
      "role": "AGENT"
    }
  }
}
```

---

# Obtener PQR asignadas al AGENT autenticado

## Endpoint protegido para ADMIN / AGENT

```http
GET /api/pqrs/assigned/my
```

## Descripción

Endpoint privado encargado de obtener las PQR que fueron tomadas o asignadas al usuario autenticado.

Esta ruta permite que un usuario con rol `AGENT` consulte únicamente las PQR que tiene bajo su responsabilidad.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Respuesta exitosa

```json
{
  "message": "PQR asignadas obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "No puedo ingresar al sistema.",
      "status": "EN_PROCESO",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 3,
      "assignedToId": 5,
      "user": {
        "id": 3,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      },
      "assignedTo": {
        "id": 5,
        "name": "Carlos Agente",
        "email": "carlos@gmail.com",
        "role": "AGENT"
      }
    }
  ]
}
```

---

# Cambiar estado de una PQR

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/status
```

## Ejemplo

```http
PATCH /api/pqrs/1/status
```

## Descripción

Endpoint privado encargado de cambiar el estado de una PQR existente.

Permite actualizar el seguimiento de una solicitud según el proceso de atención.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Parámetros

| Parámetro | Tipo   | Descripción                                     |
| --------- | ------ | ----------------------------------------------- |
| id        | number | Identificador de la PQR que se desea actualizar |

---

## Estados permitidos

- PENDIENTE
- EN_PROCESO
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
    "caseType": "SAP",
    "description": "Esta es una PQR creada desde Postman.",
    "status": "EN_PROCESO",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
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
    "CERRADA"
  ]
}
```

---

# Cambiar prioridad de una PQR

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/priority
```

## Ejemplo

```http
PATCH /api/pqrs/1/priority
```

## Descripción

Endpoint privado encargado de cambiar la prioridad de una PQR existente.

Esta ruta permite que un usuario con rol `ADMIN` o `AGENT` actualice la prioridad de una PQR, siempre que cumpla con las validaciones correspondientes.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
Content-Type: application/json
```

---

## Acceso permitido

- ADMIN
- AGENT

---

## Parámetros

| Parámetro | Tipo   | Descripción                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| id        | number | Identificador de la PQR a la que se desea cambiar la prioridad |

---

## Prioridades permitidas

- BAJA
- MEDIA
- ALTA
- URGENTE

---

## Body

```json
{
  "priority": "ALTA"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Prioridad de la PQR actualizada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "La plataforma presenta errores al cargar los reportes.",
    "status": "EN_PROCESO",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
    "userId": 2,
    "assignedToId": 3,
    "priority": "ALTA",
    "rating": null,
    "ratingComment": null,
    "ratedAt": null
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

## Respuesta si no se envía prioridad

```json
{
  "message": "La prioridad es obligatoria"
}
```

---

## Respuesta si la prioridad no es válida

```json
{
  "message": "Prioridad no válida",
  "allowedPriorities": [
    "BAJA",
    "MEDIA",
    "ALTA",
    "URGENTE"
  ]
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

## Respuesta si la PQR está cerrada

```json
{
  "message": "No se puede cambiar la prioridad de una PQR cerrada"
}
```

---

## Respuesta si el AGENT intenta cambiar una PQR no asignada a él

```json
{
  "message": "Solo puedes cambiar la prioridad de las PQR asignadas a ti"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al actualizar la prioridad de la PQR"
}
```

---

# Obtener historial de mensajes de una PQR

## Endpoint protegido

```http
GET /api/pqrs/:id/messages
```

## Descripción

Endpoint protegido encargado de obtener el historial de mensajes de una PQR.

Este endpoint se utiliza para cargar los mensajes anteriores cuando el usuario abre el detalle de una PQR.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

* USER dueño de la PQR.
* AGENT asignado a la PQR.
* ADMIN según reglas del sistema.

---

## Parámetros

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| id        | number | Identificador de la PQR |

---

## Respuesta exitosa sin mensajes

```json
{
  "message": "Mensajes obtenidos correctamente",
  "messages": []
}
```

---

## Respuesta exitosa con mensajes

```json
{
  "message": "Mensajes obtenidos correctamente",
  "messages": [
    {
      "id": 1,
      "content": "Hola, este es un mensaje de prueba desde Socket.IO.",
      "createdAt": "2026-05-28T20:30:00.000Z",
      "pqrId": 1,
      "senderId": 2,
      "sender": {
        "id": 2,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      }
    }
  ]
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

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si el USER no es dueño de la PQR

```json
{
  "message": "Solo puedes ver los mensajes de tus PQR"
}
```

---

## Respuesta si el AGENT no tiene asignada la PQR

```json
{
  "message": "Solo puedes ver los mensajes de las PQR asignadas a ti"
}
```

---

# Calificar una PQR cerrada

## Endpoint protegido para USER

```http
PATCH /api/pqrs/:id/rate
```

## Ejemplo

```http
PATCH /api/pqrs/1/rate
```

## Descripción

Endpoint privado encargado de permitir que un usuario califique una PQR creada por él, siempre que la PQR se encuentre en estado `CERRADA`.

Esta ruta permite registrar una calificación del servicio recibido y, de manera opcional, un comentario sobre la atención brindada.

---

## Header requerido

```http
Authorization: Bearer TOKEN_USER
Content-Type: application/json
```

---

## Acceso permitido

* USER
  
---

## Parámetros

| Parámetro | Tipo   | Descripción                                    |
| --------- | ------ | ---------------------------------------------- |
| id        | number | Identificador de la PQR que se desea calificar |

---

## Body

```json
{
  "rating": 5,
  "ratingComment": "La atención fue rápida y clara."
}
```

---

## Campos del body

| Campo         | Tipo   | Obligatorio | Descripción                                                           |
| ------------- | ------ | ----------- | --------------------------------------------------------------------- |
| rating        | number | Sí          | Calificación asignada por el usuario. Debe estar entre 1 y 5          |
| ratingComment | string | No          | Comentario opcional sobre la atención recibida. Máximo 300 caracteres |

---

## Respuesta exitosa

```json
{
  "message": "PQR calificada correctamente",
  "pqr": {
    "id": 4,
    "caseType": "OTRO",
    "description": "La plataforma muestra errores constantes durante el proceso de registro.",
    "status": "CERRADA",
    "createdAt": "2026-05-28T10:30:00.000Z",
    "updatedAt": "2026-05-28T22:19:48.774Z",
    "userId": 2,
    "assignedToId": null,
    "priority": "MEDIA",
    "rating": 5,
    "ratingComment": "La atención fue rápida y clara.",
    "ratedAt": "2026-05-28T22:19:48.773Z"
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

## Respuesta si no se envía calificación

```json
{
  "message": "La calificación es obligatoria"
}
```

---

## Respuesta si la calificación no está entre 1 y 5

```json
{
  "message": "La calificación debe estar entre 1 y 5"
}
```

---

## Respuesta si el comentario supera los 300 caracteres

```json
{
  "message": "El comentario no puede superar los 300 caracteres"
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

## Respuesta si la PQR no pertenece al usuario autenticado

```json
{
  "message": "Solo puedes calificar las PQR creadas por ti"
}
```

---

## Respuesta si la PQR no está cerrada

```json
{
  "message": "Solo puedes calificar una PQR cerrada"
}
```

---

## Respuesta si la PQR ya fue calificada

```json
{
  "message": "Esta PQR ya fue calificada"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al calificar la PQR"
}
```

---

# Resumen actualizado de endpoints funcionales

| Método | Endpoint                | Descripción                                         | Acceso               |
| ------ | ----------------------- | --------------------------------------------------- | -------------------- |
| GET    | /api/health             | Verifica el funcionamiento de la API                | Público              |
| GET    | /api/users              | Obtiene todos los usuarios registrados              | ADMIN                |
| POST   | /api/auth/register      | Registra un nuevo usuario                           | Público              |
| POST   | /api/auth/register/bulk | Registra usuarios mediante carga masiva desde Excel | ADMIN                |
| POST   | /api/auth/login         | Inicia sesión y genera token JWT                    | Público              |
| GET    | /api/profile            | Obtiene el perfil del usuario autenticado           | Usuario autenticado  |
| POST   | /api/pqrs               | Crea una nueva PQR                                  | USER / ADMIN         |
| GET    | /api/pqrs/my            | Obtiene las PQR del usuario autenticado             | USER / ADMIN         |
| GET    | /api/pqrs               | Obtiene todas las PQR del sistema                   | ADMIN                |
| GET    | /api/pqrs/available     | Obtiene las PQR pendientes sin responsable          | ADMIN / AGENT        |
| GET    | /api/pqrs/assigned/my   | Obtiene las PQR asignadas al AGENT autenticado      | ADMIN / AGENT        |
| PATCH  | /api/pqrs/:id/take      | Permite que un AGENT tome una PQR disponible        | ADMIN / AGENT        |
| PATCH  | /api/pqrs/:id/status    | Cambia el estado de una PQR                         | ADMIN / AGENT        |
| PATCH  | /api/users/:id/role     | Cambia el rol de un usuario                         | ADMIN                |
| PATCH  | /api/pqrs/:id/priority  | Cambia la prioridad de una PQR                      | ADMIN / AGENT        |
| GET    | /api/pqrs/:id/messages  | Obtiene el historial de mensajes de una PQR         | USER / AGENT / ADMIN |
| PATCH  | /api/pqrs/:id/rate      | Permite calificar una PQR cerrada                   | USER                 |

---

# Eventos Socket.IO funcionales

| Evento           | Descripción                                             | Uso     |
| ---------------- | ------------------------------------------------------- | ------- |
| connection       | Conecta un usuario autenticado al socket                | Backend |
| join_pqr         | Une al usuario a la sala de una PQR                     | Cliente |
| joined_pqr       | Confirma que el usuario ingresó al chat                 | Backend |
| send_pqr_message | Envía un mensaje dentro de una PQR                      | Cliente |
| new_pqr_message  | Recibe un nuevo mensaje en tiempo real                  | Backend |
| socket_error     | Informa errores de autenticación, permisos o validación | Backend |
| disconnect       | Detecta la desconexión del usuario                      | Backend |

---

# Nota importante

El endpoint antiguo:

```http
PATCH /api/pqrs/:id/respond
```

fue eliminado de la documentación porque el campo `response` ya no existe en el modelo `PQR`.

La respuesta única fue reemplazada por una conversación tipo chat almacenada en la tabla `PqrMessage` y transmitida en tiempo real mediante Socket.IO.
