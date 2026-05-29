# Prueba temporal del socket

## Archivo creado

```txt
test-socket.ts
```

## Descripción

Se creó el archivo temporal `test-socket.ts` con el propósito de probar el funcionamiento de Socket.IO antes de conectarlo con el frontend.

Este archivo permite simular un cliente conectado al backend y validar que el chat de PQR funcione correctamente en tiempo real.

---

# 1. Objetivo de la prueba

El objetivo principal de esta prueba es verificar que el backend pueda:

* Conectar un usuario mediante Socket.IO.
* Recibir y validar el token JWT.
* Unir al usuario a la sala de una PQR específica.
* Enviar un mensaje de prueba.
* Recibir el mensaje en tiempo real.
* Guardar el mensaje correctamente en la base de datos.
* Consultar posteriormente el mensaje desde el historial de la PQR.

---

# 2. Funcionamiento del archivo

El archivo `test-socket.ts` realiza el siguiente proceso:

1. Importa el cliente de Socket.IO.
2. Define un token JWT válido.
3. Define el id de una PQR existente.
4. Se conecta al backend mediante Socket.IO.
5. Envía el token JWT en la propiedad `auth`.
6. Al conectarse, emite el evento `join_pqr`.
7. Cuando el backend confirma la unión a la sala, envía un mensaje de prueba.
8. Escucha el evento `new_pqr_message`.
9. Muestra en consola el mensaje recibido.
10. Permite validar si el mensaje fue guardado correctamente en la base de datos.

---

# 3. Comando ejecutado

Para ejecutar el archivo temporal de prueba se utilizó el siguiente comando:

```bash
npx tsx test-socket.ts
```

Este comando permite ejecutar el archivo TypeScript sin necesidad de compilarlo manualmente.

---

# 4. Datos que se deben modificar antes de ejecutar

Antes de ejecutar la prueba, se deben reemplazar estos valores:

```ts
const TOKEN = "PEGA_AQUI_TU_TOKEN";
const PQR_ID = 1;
```

El campo `TOKEN` debe contener un token JWT válido generado desde el login del sistema.

El campo `PQR_ID` debe contener el id real de una PQR existente en la base de datos.

Ejemplo:

```ts
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const PQR_ID = 4;
```

---

# 5. Resultado esperado

Al ejecutar la prueba, se espera ver en consola una respuesta similar a la siguiente:

```txt
Conectado al socket: abc123
Unido al chat: { message: 'Te uniste al chat de la PQR', pqrId: 1 }
Nuevo mensaje recibido:
{
  id: 1,
  content: 'Hola, este es un mensaje de prueba desde Socket.IO.',
  createdAt: '2026-05-28T20:30:00.000Z',
  pqrId: 1,
  senderId: 2,
  sender: {
    id: 2,
    name: 'Juan',
    email: 'juan@gmail.com',
    role: 'USER'
  }
}
```

---

# 6. Validación en la base de datos

Después de ejecutar la prueba, el mensaje debe quedar almacenado en la tabla `PqrMessage`.

También se puede validar desde el endpoint REST del historial de mensajes:

```http
GET /api/pqrs/:id/messages
```

Ejemplo:

```http
GET /api/pqrs/1/messages
```

Con el header:

```http
Authorization: Bearer TOKEN
```

La respuesta debe mostrar el mensaje enviado desde `test-socket.ts`.

---

# 7. Errores comunes durante la prueba

## Token inválido o expirado

Este error aparece cuando el token JWT no es válido o ya expiró.

```json
{
  "message": "Token inválido o expirado"
}
```

Para solucionarlo, se debe iniciar sesión nuevamente y copiar un token actualizado.

---

## La PQR no existe

Este error aparece cuando el valor de `PQR_ID` no corresponde a una PQR registrada en la base de datos.

```json
{
  "message": "La PQR no existe"
}
```

Para solucionarlo, se debe crear una PQR o consultar un id real existente.

---

## No puedes acceder a esta PQR

Este error aparece cuando el usuario autenticado no tiene permiso para ingresar al chat de esa PQR.

```json
{
  "message": "No puedes acceder a esta PQR"
}
```

Puede ocurrir si:

* El usuario no creó la PQR.
* El agente no tiene asignada la PQR.
* El token pertenece a otro usuario.

---

# 8. Resultado general de la prueba

Con esta prueba se verificó que el backend permite:

1. Conectar usuarios autenticados mediante Socket.IO.
2. Validar JWT en la conexión del socket.
3. Unir usuarios a una sala específica de PQR.
4. Enviar mensajes en tiempo real.
5. Guardar cada mensaje en MySQL mediante Prisma.
6. Recibir el mensaje nuevo mediante el evento `new_pqr_message`.
7. Consultar posteriormente el historial desde la API REST.

---

# 9. Resumen de eventos Socket.IO utilizados

| Evento           | Descripción                                             |
| ---------------- | ------------------------------------------------------- |
| connect          | Confirma la conexión del cliente al socket              |
| join_pqr         | Une al usuario a la sala de una PQR                     |
| joined_pqr       | Confirma que el usuario ingresó al chat                 |
| send_pqr_message | Envía un mensaje dentro de una PQR                      |
| new_pqr_message  | Recibe un nuevo mensaje en tiempo real                  |
| socket_error     | Informa errores de autenticación, permisos o validación |
| connect_error    | Informa errores al intentar conectarse                  |
| disconnect       | Detecta la desconexión del usuario                      |

---


El archivo `test-socket.ts` es temporal y se utiliza únicamente para pruebas durante el desarrollo.

Cuando el frontend implemente la conexión con `socket.io-client`, este archivo puede eliminarse o conservarse como referencia técnica para futuras pruebas del chat en tiempo real.
