import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Contraseña encriptada por defecto para los usuarios de prueba.
const defaultPasswordHash =
    "$2a$12$Pcuc4uRUqBmV4EPN1JMkMem.J6.QVtDYGoKJApbVtp7LKdQHvFqki";

// Usuarios de prueba con su cargo activo.
const testUsers = [
    {
        name: "Usuario Subgerente General",
        email: "subgerente.general@incobra.com",
        role: Role.USER,
        positionCode: "SUBGERENTE_GENERAL",
    },
    {
        name: "Usuario Director de Operaciones",
        email: "director.operaciones@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0002",
    },
    {
        name: "Usuario Jefe de Producción",
        email: "jefe.produccion@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0008",
    },
    {
        name: "Usuario Jefe de Aseguramiento de Calidad",
        email: "jefe.aseguramiento@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0005",
    },
    {
        name: "Usuario Jefe de Control de Calidad",
        email: "jefe.controlcalidad@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0006",
    },
    {
        name: "Usuario Jefe de Planeación y Distribución",
        email: "jefe.planeacion@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0009",
    },
    {
        name: "Usuario Jefe de Investigación y Desarrollo",
        email: "jefe.investigacion@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0004",
    },
    {
        name: "Usuario Jefe de Mantenimiento",
        email: "jefe.mantenimiento@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0007",
    },
    // {
    //     name: "Usuario Secretaria Dirección de Operaciones",
    //     email: "secretaria.operaciones@incobra.com",
    //     role: Role.USER,
    //     positionCode: "DPC-TH-0139",
    // },
    {
        name: "Usuario Coordinador Planeación Producción",
        email: "coordinador.planeacionproduccion@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0132",
    },
    {
        name: "Usuario Coordinador SST-GA",
        email: "coordinador.sstga@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0028",
    },
    {
        name: "Usuario Gerente Ejecutivo",
        email: "gerente.ejecutivo@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0073",
    },
    {
        name: "Usuario Jefe de Nuevos Negocios",
        email: "jefe.nuevosnegocios@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0012",
    },
    {
        name: "Usuario Gerente Financiero",
        email: "gerente.financiero@incobra.com",
        role: Role.USER,
        positionCode: "GERENTE_FINANCIERO",
    },
    {
        name: "Usuario Jefe de Contabilidad",
        email: "jefe.contabilidad@incobra.com",
        role: Role.USER,
        positionCode: "JEFE_CONTABILIDAD",
    },
    {
        name: "Usuario Jefe de Suministros",
        email: "jefe.suministros@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0033",
    },
    {
        name: "Usuario Jefe de Talento Humano",
        email: "jefe.talentohumano@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0003",
    },
    {
        name: "Usuario Auxiliar de Talento Humano",
        email: "auxiliar.talentohumano@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0080",
    },
    {
        name: "Usuario Jefe de Tecnología",
        email: "jefe.tecnologia@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0169",
    },
    {
        name: "Usuario Jefe Nacional Ventas Farma",
        email: "jefe.ventasfarma@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0060",
    },
    // {
    //     name: "Usuario Asistente Comercial",
    //     email: "asistente.comercial@incobra.com",
    //     role: Role.USER,
    //     positionCode: "ASISTENTE_COMERCIAL",
    // },
    {
        name: "Usuario Jefe de Producto",
        email: "jefe.producto@incobra.com",
        role: Role.USER,
        positionCode: "DPC-TH-0059",
    },
];

// Ejecuta la creación de usuarios de prueba y sus asignaciones de cargo.
const main = async () => {
    for (const testUser of testUsers) {
        const position = await prisma.positionProfile.findUnique({
            where: {
                code: testUser.positionCode,
            },
        });

        if (!position) {
            throw new Error(
                `No se encontró el cargo con código ${testUser.positionCode}. Primero ejecuta el seed de estructura organizacional.`
            );
        }

        const user = await prisma.user.upsert({
            where: {
                email: testUser.email,
            },
            update: {
                name: testUser.name,
                password: defaultPasswordHash,
                role: testUser.role,
            },
            create: {
                name: testUser.name,
                email: testUser.email,
                password: defaultPasswordHash,
                role: testUser.role,
            },
        });

        const activeAssignment = await prisma.userPositionAssignment.findFirst({
            where: {
                userId: user.id,
                positionId: position.id,
                isActive: true,
            },
        });

        if (activeAssignment) {
            await prisma.userPositionAssignment.update({
                where: {
                    id: activeAssignment.id,
                },
                data: {
                    endDate: null,
                    isActive: true,
                },
            });
        } else {
            await prisma.userPositionAssignment.create({
                data: {
                    userId: user.id,
                    positionId: position.id,
                    isActive: true,
                },
            });
        }
    }

    console.log("Seed de usuarios de prueba ejecutado correctamente.");
};

main()
    .catch((error) => {
        console.error("Error ejecutando el seed de usuarios de prueba:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });