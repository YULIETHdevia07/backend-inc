# Documentación de modelos de tablas Prisma

## Descripción general

Este documento describe los modelos principales definidos en el archivo `schema.prisma`.

El sistema está dividido en dos módulos principales:

1. **Módulo PQR**
   - Gestión de solicitudes, mensajes, adjuntos, notificaciones y lectura de chats.

2. **Módulo Talento Humano**
   - Gestión de requisiciones de personal, estructura organizacional, cargos, asignaciones de usuarios a cargos, aprobaciones y confirmación de contratación.

---

# Modelo User

## Descripción

El modelo `User` representa a los usuarios registrados en el sistema.

Los usuarios tienen un rol general del sistema, pero los cargos organizacionales no se guardan directamente en este modelo.

La relación entre una persona y un cargo se maneja mediante el modelo `UserPositionAssignment`.

Esto permite manejar:

- Historial de cargos.
- Cambio de responsables.
- Múltiples cargos activos si la empresa lo requiere.
- Separación entre usuarios del sistema y cargos de la empresa.

## Campos principales

| Campo                               | Tipo                                  | Descripción                                                           |
| ----------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| id                                  | Int                                   | Identificador único del usuario                                       |
| name                                | String                                | Nombre del usuario                                                    |
| email                               | String                                | Correo electrónico único del usuario                                  |
| password                            | String                                | Contraseña encriptada del usuario                                     |
| role                                | Role                                  | Rol general del sistema: USER, ADMIN o AGENT                          |
| pqrsCreated                         | PQR[]                                 | PQR creadas por el usuario                                            |
| pqrsAssigned                        | PQR[]                                 | PQR asignadas al usuario cuando actúa como agente                     |
| pqrMessages                         | PqrMessage[]                          | Mensajes enviados por el usuario en chats de PQR                      |
| notifications                       | Notification[]                        | Notificaciones recibidas por el usuario                               |
| pqrChatReads                        | PqrChatRead[]                         | Registros de lectura de chats de PQR                                  |
| positionAssignments                 | UserPositionAssignment[]              | Asignaciones de cargos del usuario                                    |
| personnelRequisitions               | PersonnelRequisition[]                | Requisiciones de personal creadas por el usuario                      |
| assignedRequisitionApprovals        | PersonnelRequisitionApproval[]        | Aprobaciones de requisiciones asignadas al usuario                    |
| decidedRequisitionApprovals         | PersonnelRequisitionApproval[]        | Aprobaciones de requisiciones decididas por el usuario                |
| hiringConfirmations                 | PersonnelHiringConfirmation[]         | Confirmaciones de contratación creadas por el usuario                 |
| assignedHiringConfirmationApprovals | PersonnelHiringConfirmationApproval[] | Aprobaciones de confirmación de contratación asignadas al usuario     |
| decidedHiringConfirmationApprovals  | PersonnelHiringConfirmationApproval[] | Aprobaciones de confirmación de contratación decididas por el usuario |
| createdAt                           | DateTime                              | Fecha de creación del usuario                                         |
| updatedAt                           | DateTime                              | Fecha de última actualización del usuario                             |

---

# Modelo PQR

## Descripción

El modelo `PQR` representa las solicitudes creadas por los usuarios dentro del módulo de PQR.

Una PQR puede tener mensajes, archivos adjuntos por medio de los mensajes, notificaciones y registros de lectura del chat.

## Campos principales

| Campo         | Tipo           | Descripción                            |
| ------------- | -------------- | -------------------------------------- |
| id            | Int            | Identificador único de la PQR          |
| caseType      | PqrCaseType    | Tipo de caso de la PQR                 |
| description   | String         | Descripción de la solicitud            |
| status        | PqrStatus      | Estado actual de la PQR                |
| createdAt     | DateTime       | Fecha de creación de la PQR            |
| updatedAt     | DateTime       | Fecha de última actualización          |
| userId        | Int            | Usuario que creó la PQR                |
| user          | User           | Relación con el usuario creador        |
| assignedToId  | Int?           | Usuario agente asignado a la PQR       |
| assignedTo    | User?          | Relación con el agente asignado        |
| priority      | PqrPriority?   | Prioridad de la PQR                    |
| rating        | Int?           | Calificación dada por el usuario       |
| ratingComment | String?        | Comentario opcional de la calificación |
| ratedAt       | DateTime?      | Fecha de calificación                  |
| messages      | PqrMessage[]   | Mensajes asociados a la PQR            |
| notifications | Notification[] | Notificaciones relacionadas con la PQR |
| chatReads     | PqrChatRead[]  | Registros de lectura del chat          |

---

# Modelo PqrMessage

## Descripción

El modelo `PqrMessage` representa los mensajes enviados dentro del chat de una PQR.

Un mensaje pertenece a una PQR y a un usuario remitente. También puede tener archivos adjuntos.

## Campos principales

| Campo       | Tipo                   | Descripción                         |
| ----------- | ---------------------- | ----------------------------------- |
| id          | Int                    | Identificador único del mensaje     |
| content     | String?                | Contenido del mensaje               |
| createdAt   | DateTime               | Fecha de creación del mensaje       |
| pqrId       | Int                    | Identificador de la PQR relacionada |
| pqr         | PQR                    | Relación con la PQR                 |
| senderId    | Int                    | Usuario que envió el mensaje        |
| sender      | User                   | Relación con el usuario remitente   |
| attachments | PqrMessageAttachment[] | Archivos adjuntos del mensaje       |

---

# Modelo PqrChatRead

## Descripción

El modelo `PqrChatRead` representa la última lectura del chat de una PQR por parte de un usuario.

Sirve para saber si un usuario tiene mensajes pendientes por leer.

## Campos principales

| Campo      | Tipo     | Descripción                       |
| ---------- | -------- | --------------------------------- |
| id         | Int      | Identificador único del registro  |
| pqrId      | Int      | Identificador de la PQR           |
| userId     | Int      | Identificador del usuario         |
| lastReadAt | DateTime | Fecha y hora de la última lectura |
| pqr        | PQR      | Relación con la PQR               |
| user       | User     | Relación con el usuario           |

## Restricción única

```prisma
@@unique([pqrId, userId])
```

Esta restricción evita que un mismo usuario tenga más de un registro de lectura para la misma PQR.

---

# Modelo PqrMessageAttachment

## Descripción

El modelo `PqrMessageAttachment` representa los archivos adjuntos enviados dentro de los mensajes del chat de una PQR.

## Campos principales

| Campo        | Tipo              | Descripción                               |
| ------------ | ----------------- | ----------------------------------------- |
| id           | Int               | Identificador único del archivo adjunto   |
| fileName     | String            | Nombre generado para almacenar el archivo |
| originalName | String            | Nombre original del archivo               |
| fileUrl      | String            | Ruta o URL donde se almacena el archivo   |
| fileType     | PqrAttachmentType | Tipo de archivo adjunto                   |
| mimeType     | String            | Tipo MIME del archivo                     |
| fileSize     | Int               | Tamaño del archivo                        |
| createdAt    | DateTime          | Fecha de carga del archivo                |
| messageId    | Int               | Mensaje al que pertenece el archivo       |
| message      | PqrMessage        | Relación con el mensaje                   |

---

# Modelo Notification

## Descripción

El modelo `Notification` representa las notificaciones internas generadas para los usuarios.

Puede relacionarse con una PQR o con una requisición de personal, dependiendo del módulo que genere la notificación.

## Campos principales

| Campo                  | Tipo                  | Descripción                                       |
| ---------------------- | --------------------- | ------------------------------------------------- |
| id                     | Int                   | Identificador único de la notificación            |
| title                  | String                | Título de la notificación                         |
| message                | String                | Mensaje de la notificación                        |
| type                   | NotificationType      | Tipo de notificación                              |
| isRead                 | Boolean               | Indica si la notificación fue leída               |
| userId                 | Int                   | Usuario destinatario                              |
| pqrId                  | Int?                  | PQR relacionada, si aplica                        |
| personnelRequisitionId | Int?                  | Requisición de personal relacionada, si aplica    |
| createdAt              | DateTime              | Fecha de creación                                 |
| user                   | User                  | Relación con el usuario destinatario              |
| pqr                    | PQR?                  | Relación opcional con una PQR                     |
| personnelRequisition   | PersonnelRequisition? | Relación opcional con una requisición de personal |

---

# Modelo Department

## Descripción

El modelo `Department` representa los departamentos o áreas de la empresa.

Este modelo es clave para el flujo de aprobación de requisiciones porque permite definir:

1. A qué departamento pertenece una requisición.
2. Qué cargo es responsable de aprobar en ese departamento.
3. Cuál es el departamento superior al que debe subir la aprobación.

## Campos principales

| Campo                 | Tipo                           | Descripción                                        |
| --------------------- | ------------------------------ | -------------------------------------------------- |
| id                    | Int                            | Identificador único del departamento               |
| code                  | String                         | Código único del departamento                      |
| name                  | String                         | Nombre del departamento                            |
| isActive              | Boolean                        | Indica si el departamento está activo              |
| parentDepartmentId    | Int?                           | Departamento superior o padre                      |
| parentDepartment      | Department?                    | Relación con el departamento superior              |
| childDepartments      | Department[]                   | Departamentos hijos o dependientes                 |
| responsiblePositionId | Int?                           | Cargo responsable de aprobar por este departamento |
| responsiblePosition   | PositionProfile?               | Relación con el cargo responsable                  |
| positions             | PositionProfile[]              | Cargos que tienen este departamento como base      |
| requisitions          | PersonnelRequisition[]         | Requisiciones creadas para este departamento       |
| requisitionApprovals  | PersonnelRequisitionApproval[] | Aprobaciones generadas para este departamento      |
| createdAt             | DateTime                       | Fecha de creación                                  |
| updatedAt             | DateTime                       | Fecha de última actualización                      |

## Ejemplo de jerarquía

```txt
Producción
Responsable: Jefe de Producción
Padre: Dirección de Operaciones

Dirección de Operaciones
Responsable: Director de Operaciones
Padre: Gerencia

Gerencia
Responsable: Subgerente General
Padre: ninguno
```

Con esta estructura, una requisición de Producción sube así:

```txt
Jefe de Producción
↓
Director de Operaciones
↓
Subgerente General
```

---

# Modelo PositionProfile

## Descripción

El modelo `PositionProfile` representa los cargos o perfiles de cargo de la empresa.

Los cargos son un catálogo. No dependen directamente de una persona y no deben eliminarse cuando cambia el empleado que ocupa el cargo.

La relación entre un usuario y un cargo se maneja mediante `UserPositionAssignment`.

## Campos principales

| Campo                       | Tipo                                  | Descripción                                                                    |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| id                          | Int                                   | Identificador único del cargo                                                  |
| code                        | String                                | Código único del cargo o perfil                                                |
| name                        | String                                | Nombre del cargo                                                               |
| isActive                    | Boolean                               | Indica si el cargo está activo                                                 |
| homeDepartmentId            | Int?                                  | Departamento base del cargo                                                    |
| homeDepartment              | Department?                           | Relación con el departamento base                                              |
| responsibleForDepartments   | Department[]                          | Departamentos donde este cargo es responsable                                  |
| userAssignments             | UserPositionAssignment[]              | Usuarios asignados histórica o actualmente a este cargo                        |
| requisitions                | PersonnelRequisition[]                | Requisiciones donde se solicita este cargo                                     |
| requisitionApprovals        | PersonnelRequisitionApproval[]        | Aprobaciones de requisición donde este cargo debe aprobar                      |
| hiringConfirmationApprovals | PersonnelHiringConfirmationApproval[] | Aprobaciones de contratación donde este cargo debe aprobar                     |
| humanTalentAnalystConfigs   | HumanTalentWorkflowConfig[]           | Configuraciones donde este cargo actúa como primer VoBo de Talento Humano      |
| humanTalentChiefConfigs     | HumanTalentWorkflowConfig[]           | Configuraciones donde este cargo actúa como aprobación final de Talento Humano |
| createdAt                   | DateTime                              | Fecha de creación                                                              |
| updatedAt                   | DateTime                              | Fecha de última actualización                                                  |

---

# Modelo UserPositionAssignment

## Descripción

El modelo `UserPositionAssignment` representa la asignación de un usuario a un cargo.

Este modelo permite manejar:

1. Cargo actual de un usuario.
2. Historial de cargos.
3. Múltiples cargos activos si la empresa lo requiere.
4. Cambio de responsables sin modificar el catálogo de cargos.

## Campos principales

| Campo                       | Tipo                                  | Descripción                                                   |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| id                          | Int                                   | Identificador único de la asignación                          |
| userId                      | Int                                   | Usuario asignado al cargo                                     |
| user                        | User                                  | Relación con el usuario                                       |
| positionId                  | Int                                   | Cargo asignado                                                |
| position                    | PositionProfile                       | Relación con el cargo                                         |
| startDate                   | DateTime                              | Fecha de inicio de la asignación                              |
| endDate                     | DateTime?                             | Fecha de finalización de la asignación                        |
| isActive                    | Boolean                               | Indica si la asignación está activa                           |
| requisitionApprovals        | PersonnelRequisitionApproval[]        | Aprobaciones de requisición relacionadas con esta asignación  |
| hiringConfirmationApprovals | PersonnelHiringConfirmationApproval[] | Aprobaciones de contratación relacionadas con esta asignación |
| createdAt                   | DateTime                              | Fecha de creación                                             |
| updatedAt                   | DateTime                              | Fecha de actualización                                        |

## Ejemplo

```txt
Usuario: María Pérez
Cargo: Jefe de Producción
isActive: true
```

Con esto, el sistema sabe que cuando una requisición necesita aprobación del cargo `Jefe de Producción`, debe notificar al usuario que tenga activa esa asignación.

---

# Modelo City

## Descripción

El modelo `City` representa las ciudades disponibles para crear requisiciones de personal.

Esta tabla permite controlar desde la base de datos qué ciudades se muestran en el formulario.

## Campos principales

| Campo        | Tipo                   | Descripción                         |
| ------------ | ---------------------- | ----------------------------------- |
| id           | Int                    | Identificador único de la ciudad    |
| name         | String                 | Nombre de la ciudad                 |
| isActive     | Boolean                | Indica si la ciudad está activa     |
| requisitions | PersonnelRequisition[] | Requisiciones asociadas a la ciudad |
| createdAt    | DateTime               | Fecha de creación                   |
| updatedAt    | DateTime               | Fecha de actualización              |

---

# Modelo PersonnelRequisition

## Descripción

El modelo `PersonnelRequisition` representa una requisición de personal creada por un usuario.

Una requisición pertenece a un departamento, solicita un cargo, tiene una ciudad, un motivo, un salario propuesto y un estado.

El flujo de aprobación de la requisición se genera a partir del departamento seleccionado y su jerarquía organizacional.

## Campos principales

| Campo                  | Tipo                           | Descripción                                       |
| ---------------------- | ------------------------------ | ------------------------------------------------- |
| id                     | Int                            | Identificador único de la requisición             |
| requestDate            | DateTime                       | Fecha de solicitud                                |
| departmentId           | Int                            | Departamento para el cual se crea la requisición  |
| department             | Department                     | Relación con el departamento                      |
| positionId             | Int                            | Cargo solicitado                                  |
| position               | PositionProfile                | Relación con el cargo solicitado                  |
| reason                 | RequisitionReason              | Motivo de la requisición                          |
| otherReason            | String?                        | Descripción adicional cuando el motivo es `OTROS` |
| cityId                 | Int                            | Ciudad de la requisición                          |
| city                   | City                           | Relación con la ciudad                            |
| contractType           | ContractType?                  | Tipo principal de contratación                    |
| directContractType     | DirectContractType?            | Tipo de contrato directo                          |
| contractDurationMonths | Int?                           | Duración del contrato en meses cuando aplica      |
| internContractType     | InternContractType?            | Tipo de practicante cuando aplica                 |
| proposedSalary         | Decimal                        | Salario propuesto                                 |
| status                 | PersonnelRequisitionStatus     | Estado actual de la requisición                   |
| createdById            | Int                            | Usuario que creó la requisición                   |
| createdBy              | User                           | Relación con el usuario creador                   |
| approvals              | PersonnelRequisitionApproval[] | Pasos de aprobación de la requisición             |
| hiringConfirmation     | PersonnelHiringConfirmation?   | Confirmación de contratación asociada             |
| notifications          | Notification[]                 | Notificaciones relacionadas con la requisición    |
| createdAt              | DateTime                       | Fecha de creación                                 |
| updatedAt              | DateTime                       | Fecha de actualización                            |

## Estados principales

| Estado                                | Descripción                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------- |
| PENDIENTE_APROBACION                  | La requisición fue creada y está pendiente por iniciar o asignar aprobación |
| EN_APROBACION                         | La requisición está en flujo de aprobación jerárquica                       |
| PENDIENTE_CONFIRMACION_TALENTO_HUMANO | Ya fue aprobada por la jerarquía y espera confirmación de Talento Humano    |
| PENDIENTE_APROBACION_TALENTO_HUMANO   | La confirmación fue creada y espera aprobación final de Talento Humano      |
| APROBADA                              | La requisición fue aprobada completamente                                   |
| RECHAZADA                             | La requisición fue rechazada                                                |
| CANCELADA                             | La requisición fue cancelada                                                |

---

# Modelo PersonnelRequisitionApproval

## Descripción

El modelo `PersonnelRequisitionApproval` representa cada paso de aprobación jerárquica de una requisición de personal.

Estos pasos ya no dependen de roles como `JEFE_AREA`, `JEFE_DEPARTAMENTO` o `GERENTE_GENERAL`.

Ahora se generan desde la estructura organizacional:

```txt
Department
↓
responsiblePosition
↓
parentDepartment
↓
responsiblePosition
```

## Campos principales

| Campo                | Tipo                    | Descripción                                               |
| -------------------- | ----------------------- | --------------------------------------------------------- |
| id                   | Int                     | Identificador único del paso de aprobación                |
| requisitionId        | Int                     | Requisición relacionada                                   |
| requisition          | PersonnelRequisition    | Relación con la requisición                               |
| approvalOrder        | Int                     | Orden del paso dentro del flujo                           |
| departmentId         | Int?                    | Departamento que origina este paso de aprobación          |
| department           | Department?             | Relación con el departamento del paso                     |
| approverPositionId   | Int                     | Cargo que debe aprobar este paso                          |
| approverPosition     | PositionProfile         | Relación con el cargo aprobador                           |
| approverAssignmentId | Int?                    | Asignación usuario-cargo usada para resolver el aprobador |
| approverAssignment   | UserPositionAssignment? | Relación con la asignación del aprobador                  |
| approverUserId       | Int?                    | Usuario asignado para aprobar                             |
| approverUser         | User?                   | Relación con el usuario aprobador asignado                |
| decision             | ApprovalDecision?       | Decisión tomada: aprobada, rechazada o cancelada          |
| comment              | String?                 | Comentario opcional de la decisión                        |
| decidedById          | Int?                    | Usuario que tomó la decisión                              |
| decidedBy            | User?                   | Relación con el usuario que decidió                       |
| assignedAt           | DateTime                | Fecha en que se asignó el paso                            |
| decidedAt            | DateTime?               | Fecha en que se tomó la decisión                          |
| isCurrent            | Boolean                 | Indica si este paso es el paso activo actualmente         |
| createdAt            | DateTime                | Fecha de creación                                         |
| updatedAt            | DateTime                | Fecha de actualización                                    |

## Restricción única

```prisma
@@unique([requisitionId, approvalOrder])
```

Esta restricción evita que una misma requisición tenga dos pasos con el mismo orden.

## Ejemplo

Para una requisición de Producción:

```txt
approvalOrder: 1
department: Producción
approverPosition: Jefe de Producción
isCurrent: true
```

```txt
approvalOrder: 2
department: Dirección de Operaciones
approverPosition: Director de Operaciones
isCurrent: false
```

```txt
approvalOrder: 3
department: Gerencia
approverPosition: Subgerente General
isCurrent: false
```

Cuando aprueba el paso 1, el paso 1 pasa a `isCurrent: false` y el paso 2 pasa a `isCurrent: true`.

---

# Modelo HumanTalentWorkflowConfig

## Descripción

El modelo `HumanTalentWorkflowConfig` define qué cargos participan en el cierre de Talento Humano después de que una requisición fue aprobada por la jerarquía organizacional.

En el flujo actual se usa un solo registro activo:

```txt
Auxiliar de Talento Humano
↓
Jefe de Talento Humano
```

Este modelo evita dejar estos cargos quemados directamente en el código.

## Campos principales

| Campo             | Tipo            | Descripción                                                       |
| ----------------- | --------------- | ----------------------------------------------------------------- |
| id                | Int             | Identificador único de la configuración                           |
| name              | String          | Nombre de la configuración                                        |
| analystPositionId | Int             | Cargo que realiza el primer VoBo o confirmación de Talento Humano |
| analystPosition   | PositionProfile | Relación con el cargo del primer VoBo                             |
| chiefPositionId   | Int             | Cargo que realiza la aprobación final de Talento Humano           |
| chiefPosition     | PositionProfile | Relación con el cargo aprobador final                             |
| isActive          | Boolean         | Indica si esta configuración está activa                          |
| createdAt         | DateTime        | Fecha de creación                                                 |
| updatedAt         | DateTime        | Fecha de actualización                                            |

## Ejemplo

```txt
name: Flujo principal de Talento Humano
analystPosition: Auxiliar de Talento Humano
chiefPosition: Jefe de Talento Humano
isActive: true
```

---

# Modelo PersonnelHiringConfirmation

## Descripción

El modelo `PersonnelHiringConfirmation` representa la confirmación de contratación que realiza Talento Humano cuando una requisición ya fue aprobada por la jerarquía.

Aquí se registran los datos finales o confirmados de contratación, como tipo de contrato, duración y salario aprobado.

## Campos principales

| Campo                  | Tipo                                  | Descripción                                  |
| ---------------------- | ------------------------------------- | -------------------------------------------- |
| id                     | Int                                   | Identificador único de la confirmación       |
| requisitionId          | Int                                   | Requisición relacionada                      |
| requisition            | PersonnelRequisition                  | Relación con la requisición                  |
| contractType           | ContractType                          | Tipo principal de contratación confirmado    |
| directContractType     | DirectContractType?                   | Tipo de contrato directo confirmado          |
| contractDurationMonths | Int?                                  | Duración del contrato en meses cuando aplica |
| internContractType     | InternContractType?                   | Tipo de practicante cuando aplica            |
| approvedSalary         | Decimal                               | Salario aprobado                             |
| status                 | PersonnelHiringConfirmationStatus     | Estado de la confirmación                    |
| createdById            | Int                                   | Usuario que creó la confirmación             |
| createdBy              | User                                  | Relación con el usuario creador              |
| approvals              | PersonnelHiringConfirmationApproval[] | Pasos de aprobación de la confirmación       |
| createdAt              | DateTime                              | Fecha de creación                            |
| updatedAt              | DateTime                              | Fecha de actualización                       |

## Estados principales

| Estado               | Descripción                                               |
| -------------------- | --------------------------------------------------------- |
| PENDIENTE_APROBACION | La confirmación fue creada y está pendiente de aprobación |
| APROBADA             | La confirmación fue aprobada                              |
| RECHAZADA            | La confirmación fue rechazada                             |
| CANCELADA            | La confirmación fue cancelada                             |

---

# Modelo PersonnelHiringConfirmationApproval

## Descripción

El modelo `PersonnelHiringConfirmationApproval` representa los pasos de aprobación del cierre de contratación de Talento Humano.

Este flujo se genera a partir de `HumanTalentWorkflowConfig`.

En el flujo actual:

```txt
1. Auxiliar de Talento Humano
2. Jefe de Talento Humano
```

## Campos principales

| Campo                | Tipo                        | Descripción                                               |
| -------------------- | --------------------------- | --------------------------------------------------------- |
| id                   | Int                         | Identificador único del paso                              |
| hiringConfirmationId | Int                         | Confirmación de contratación relacionada                  |
| hiringConfirmation   | PersonnelHiringConfirmation | Relación con la confirmación                              |
| approvalOrder        | Int                         | Orden del paso dentro del flujo                           |
| approverPositionId   | Int                         | Cargo que debe aprobar este paso                          |
| approverPosition     | PositionProfile             | Relación con el cargo aprobador                           |
| approverAssignmentId | Int?                        | Asignación usuario-cargo usada para resolver el aprobador |
| approverAssignment   | UserPositionAssignment?     | Relación con la asignación del aprobador                  |
| approverUserId       | Int?                        | Usuario asignado para aprobar                             |
| approverUser         | User?                       | Relación con el usuario aprobador                         |
| decision             | ApprovalDecision?           | Decisión tomada                                           |
| comment              | String?                     | Comentario opcional de la decisión                        |
| decidedById          | Int?                        | Usuario que tomó la decisión                              |
| decidedBy            | User?                       | Relación con el usuario que decidió                       |
| assignedAt           | DateTime                    | Fecha en que se asignó el paso                            |
| decidedAt            | DateTime?                   | Fecha de decisión                                         |
| isCurrent            | Boolean                     | Indica si este paso está activo actualmente               |
| createdAt            | DateTime                    | Fecha de creación                                         |
| updatedAt            | DateTime                    | Fecha de actualización                                    |

## Restricción única

```prisma
@@unique([hiringConfirmationId, approvalOrder])
```

Esta restricción evita que una misma confirmación tenga dos pasos con el mismo orden.

---

# Relación general del flujo de requisiciones

## 1. Creación de requisición

Cuando un usuario crea una requisición, selecciona:

```txt
Departamento
Cargo solicitado
Ciudad
Motivo
Tipo de contrato
Salario propuesto
```

Se crea un registro en:

```txt
PersonnelRequisition
```

---

## 2. Generación del flujo de aprobación

El sistema toma el departamento de la requisición y sube por su jerarquía.

Ejemplo:

```txt
Producción
↓
Dirección de Operaciones
↓
Gerencia
```

Por cada nivel crea un registro en:

```txt
PersonnelRequisitionApproval
```

---

## 3. Resolución del usuario aprobador

Cada paso tiene un cargo aprobador.

Ejemplo:

```txt
Jefe de Producción
```

El sistema busca en:

```txt
UserPositionAssignment
```

qué usuario tiene activo ese cargo.

Así puede enviar la notificación al usuario correcto.

---

## 4. Confirmación de Talento Humano

Cuando termina la aprobación jerárquica, la requisición pasa a:

```txt
PENDIENTE_CONFIRMACION_TALENTO_HUMANO
```

Después el sistema consulta:

```txt
HumanTalentWorkflowConfig
```

y genera el flujo final de Talento Humano:

```txt
Auxiliar de Talento Humano
↓
Jefe de Talento Humano
```

Este flujo se guarda en:

```txt
PersonnelHiringConfirmationApproval
```

---

# Conclusión

Los modelos del módulo de Talento Humano permiten separar correctamente:

1. Los usuarios del sistema.
2. Los cargos de la empresa.
3. Las asignaciones de usuarios a cargos.
4. La jerarquía organizacional.
5. Las requisiciones de personal.
6. Las aprobaciones jerárquicas.
7. La confirmación final de contratación por Talento Humano.

La lógica ya no depende de roles organizacionales como `JEFE_AREA`, `JEFE_DEPARTAMENTO` o `GERENTE_GENERAL`.

Ahora el flujo depende de la estructura real de la empresa:

```txt
Departamento
↓
Cargo responsable
↓
Departamento superior
↓
Cargo responsable superior
↓
Talento Humano
```