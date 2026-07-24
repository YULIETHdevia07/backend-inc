import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| DEPARTAMENTOS Y ÁREAS
|--------------------------------------------------------------------------
|
| Se utilizan los códigos oficiales ORG-TH cuando están disponibles.
| Para las áreas que todavía no tienen código oficial se usan códigos
| internos temporales.
|
*/

const departments = [
    {
        code: "ORG-TH-0001",
        name: "Gerencia",
    },
    {
        code: "ORG-TH-0003",
        name: "Dirección de Operaciones",
    },
    {
        code: "ORG-TH-0012",
        name: "Producción",
    },
    {
        code: "ORG-TH-0008",
        name: "Aseguramiento de Calidad",
    },
    {
        code: "ORG-TH-0010",
        name: "Control de Calidad",
    },
    {
        code: "ORG-TH-0013",
        name: "Planeación y Distribución",
    },
    {
        code: "ORG-TH-0011",
        name: "Mantenimiento",
    },
    {
        code: "ORG-TH-0009",
        name: "Investigación & Desarrollo",
    },
    {
        code: "PLANEACION_CONTROL_PRODUCCION",
        name: "Planeación y Control de la Producción",
    },
    {
        code: "ORG-TH-0015",
        name: "Sistema de Gestión Integral SST-GA",
    },
    {
        code: "ORG-TH-0014",
        name: "Asuntos Regulatorios",
    },
    {
        code: "ORG-TH-0004",
        name: "Dirección Comercial",
    },
    {
        code: "NUEVOS_NEGOCIOS",
        name: "Nuevos Negocios",
    },
    {
        code: "VENTAS_FARMA_CONSUMO",
        name: "Ventas Farma y Consumo",
    },
    {
        code: "MERCADEO_PRODUCTO",
        name: "Mercadeo / Producto",
    },
    {
        code: "ORG-TH-0002",
        name: "Gerencia Financiera",
    },
    {
        code: "CONTABILIDAD",
        name: "Contabilidad",
    },
    {
        code: "ORG-TH-0006",
        name: "Suministros",
    },
    {
        code: "ORG-TH-0005",
        name: "Talento Humano",
    },
    {
        code: "ORG-TH-0007",
        name: "Tecnología e Inteligencia de Negocios",
    },
];

/*
|--------------------------------------------------------------------------
| CARGOS APROBADORES
|--------------------------------------------------------------------------
|
| Cada cargo tiene relacionado el departamento o área al cual pertenece.
|
*/

const positionProfiles = [
    {
        code: "SUBGERENTE_GENERAL",
        name: "Subgerente General",
        homeDepartmentCode: "ORG-TH-0001",
    },
    {
        code: "DPC-TH-0002",
        name: "Director de Operaciones",
        homeDepartmentCode: "ORG-TH-0003",
    },
    {
        code: "DPC-TH-0008",
        name: "Jefe de Producción",
        homeDepartmentCode: "ORG-TH-0012",
    },
    {
        code: "DPC-TH-0005",
        name: "Jefe de Aseguramiento de Calidad",
        homeDepartmentCode: "ORG-TH-0008",
    },
    {
        code: "DPC-TH-0006",
        name: "Jefe de Control de Calidad",
        homeDepartmentCode: "ORG-TH-0010",
    },
    {
        code: "DPC-TH-0009",
        name: "Jefe de Planeación y Distribución",
        homeDepartmentCode: "ORG-TH-0013",
    },
    {
        code: "DPC-TH-0007",
        name: "Jefe de Mantenimiento",
        homeDepartmentCode: "ORG-TH-0011",
    },
    {
        code: "DPC-TH-0004",
        name: "Jefe de Investigación & Desarrollo",
        homeDepartmentCode: "ORG-TH-0009",
    },
    {
        code: "DPC-TH-0132",
        name: "Coordinador de Planeación y Control de la Producción",
        homeDepartmentCode: "PLANEACION_CONTROL_PRODUCCION",
    },
    {
        code: "DPC-TH-0028",
        name: "Coordinador de Sistemas de Gestión Integral SST-GA",
        homeDepartmentCode: "ORG-TH-0015",
    },
    {
        code: "DPC-TH-0076",
        name: "Coordinador de Asuntos Regulatorios",
        homeDepartmentCode: "ORG-TH-0014",
    },
    {
        code: "DPC-TH-0073",
        name: "Gerente Ejecutivo",
        homeDepartmentCode: "ORG-TH-0004",
    },
    {
        code: "DPC-TH-0012",
        name: "Jefe de Nuevos Negocios",
        homeDepartmentCode: "NUEVOS_NEGOCIOS",
    },
    {
        code: "DPC-TH-0060",
        name: "Jefe Nacional de Ventas Farma y Consumo",
        homeDepartmentCode: "VENTAS_FARMA_CONSUMO",
    },
    {
        code: "DPC-TH-0059",
        name: "Jefe de Producto",
        homeDepartmentCode: "MERCADEO_PRODUCTO",
    },
    {
        code: "GERENTE_FINANCIERO",
        name: "Gerente Financiero",
        homeDepartmentCode: "ORG-TH-0002",
    },
    {
        code: "JEFE_CONTABILIDAD",
        name: "Jefe de Contabilidad",
        homeDepartmentCode: "CONTABILIDAD",
    },
    {
        code: "DPC-TH-0033",
        name: "Jefe de Suministros",
        homeDepartmentCode: "ORG-TH-0006",
    },
    {
        code: "DPC-TH-0003",
        name: "Jefe de Talento Humano",
        homeDepartmentCode: "ORG-TH-0005",
    },
    {
        code: "DPC-TH-0169",
        name: "Jefe de Tecnología e Inteligencia de Negocio",
        homeDepartmentCode: "ORG-TH-0007",
    },

    /*
    |--------------------------------------------------------------------------
    | CARGOS DEL FLUJO DE TALENTO HUMANO
    |--------------------------------------------------------------------------
    */

    {
        code: "DPC-TH-0080",
        name: "Auxiliar de Talento Humano",
        homeDepartmentCode: "ORG-TH-0005",
    },
];

/*
|--------------------------------------------------------------------------
| ESTRUCTURA JERÁRQUICA
|--------------------------------------------------------------------------
|
| responsiblePositionCode:
| Cargo que aprueba directamente las solicitudes del departamento.
|
| parentDepartmentCode:
| Departamento superior al cual debe subir posteriormente la solicitud.
|
*/

const departmentStructure = [
    {
        departmentCode: "ORG-TH-0001",
        parentDepartmentCode: null,
        responsiblePositionCode: "SUBGERENTE_GENERAL",
    },
    {
        departmentCode: "ORG-TH-0003",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "DPC-TH-0002",
    },
    {
        departmentCode: "ORG-TH-0012",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0008",
    },
    {
        departmentCode: "ORG-TH-0008",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0005",
    },
    {
        departmentCode: "ORG-TH-0010",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0006",
    },
    {
        departmentCode: "ORG-TH-0013",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0009",
    },
    {
        departmentCode: "ORG-TH-0011",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0007",
    },
    {
        departmentCode: "ORG-TH-0009",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0004",
    },
    {
        departmentCode: "PLANEACION_CONTROL_PRODUCCION",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0132",
    },
    {
        departmentCode: "ORG-TH-0015",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0028",
    },
    {
        departmentCode: "ORG-TH-0014",
        parentDepartmentCode: "ORG-TH-0003",
        responsiblePositionCode: "DPC-TH-0076",
    },
    {
        departmentCode: "ORG-TH-0004",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "DPC-TH-0073",
    },
    {
        departmentCode: "NUEVOS_NEGOCIOS",
        parentDepartmentCode: "ORG-TH-0004",
        responsiblePositionCode: "DPC-TH-0012",
    },
    {
        departmentCode: "VENTAS_FARMA_CONSUMO",
        parentDepartmentCode: "ORG-TH-0004",
        responsiblePositionCode: "DPC-TH-0060",
    },
    {
        departmentCode: "MERCADEO_PRODUCTO",
        parentDepartmentCode: "ORG-TH-0004",
        responsiblePositionCode: "DPC-TH-0059",
    },
    {
        departmentCode: "ORG-TH-0002",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "GERENTE_FINANCIERO",
    },
    {
        departmentCode: "CONTABILIDAD",
        parentDepartmentCode: "ORG-TH-0002",
        responsiblePositionCode: "JEFE_CONTABILIDAD",
    },
    {
        departmentCode: "ORG-TH-0006",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "DPC-TH-0033",
    },
    {
        departmentCode: "ORG-TH-0005",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "DPC-TH-0003",
    },
    {
        departmentCode: "ORG-TH-0007",
        parentDepartmentCode: "ORG-TH-0001",
        responsiblePositionCode: "DPC-TH-0169",
    },
];

const main = async () => {
    /*
    |--------------------------------------------------------------------------
    | CREAR O ACTUALIZAR DEPARTAMENTOS
    |--------------------------------------------------------------------------
    */

    for (const department of departments) {
        await prisma.department.upsert({
            where: {
                code: department.code,
            },
            update: {
                name: department.name,
                isActive: true,
            },
            create: {
                code: department.code,
                name: department.name,
                isActive: true,
            },
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR O ACTUALIZAR CARGOS
    |--------------------------------------------------------------------------
    */

    for (const position of positionProfiles) {
        const homeDepartment = await prisma.department.findUnique({
            where: {
                code: position.homeDepartmentCode,
            },
        });

        if (!homeDepartment) {
            throw new Error(
                `No se encontró el departamento base ${position.homeDepartmentCode} para el cargo ${position.code}`,
            );
        }

        await prisma.positionProfile.upsert({
            where: {
                code: position.code,
            },
            update: {
                name: position.name,
                homeDepartmentId: homeDepartment.id,
                isActive: true,
            },
            create: {
                code: position.code,
                name: position.name,
                homeDepartmentId: homeDepartment.id,
                isActive: true,
            },
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CONFIGURAR JERARQUÍA Y APROBADORES
    |--------------------------------------------------------------------------
    */

    for (const item of departmentStructure) {
        const department = await prisma.department.findUnique({
            where: {
                code: item.departmentCode,
            },
        });

        if (!department) {
            throw new Error(
                `No se encontró el departamento ${item.departmentCode}`,
            );
        }

        const parentDepartment = item.parentDepartmentCode
            ? await prisma.department.findUnique({
                where: {
                    code: item.parentDepartmentCode,
                },
            })
            : null;

        if (item.parentDepartmentCode && !parentDepartment) {
            throw new Error(
                `No se encontró el departamento padre ${item.parentDepartmentCode}`,
            );
        }

        const responsiblePosition =
            await prisma.positionProfile.findUnique({
                where: {
                    code: item.responsiblePositionCode,
                },
            });

        if (!responsiblePosition) {
            throw new Error(
                `No se encontró el cargo responsable ${item.responsiblePositionCode}`,
            );
        }

        await prisma.department.update({
            where: {
                id: department.id,
            },
            data: {
                parentDepartmentId: parentDepartment?.id ?? null,
                responsiblePositionId: responsiblePosition.id,
            },
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CONFIGURAR FLUJO DE TALENTO HUMANO
    |--------------------------------------------------------------------------
    */

    const auxiliaryHumanTalentPosition =
        await prisma.positionProfile.findUnique({
            where: {
                code: "DPC-TH-0080",
            },
        });

    const chiefHumanTalentPosition =
        await prisma.positionProfile.findUnique({
            where: {
                code: "DPC-TH-0003",
            },
        });

    if (!auxiliaryHumanTalentPosition) {
        throw new Error(
            "No se encontró el cargo Auxiliar de Talento Humano DPC-TH-0080.",
        );
    }

    if (!chiefHumanTalentPosition) {
        throw new Error(
            "No se encontró el cargo Jefe de Talento Humano DPC-TH-0003.",
        );
    }

    await prisma.humanTalentWorkflowConfig.upsert({
        where: {
            id: 1,
        },
        update: {
            name: "Flujo principal de Talento Humano",
            analystPositionId: auxiliaryHumanTalentPosition.id,
            chiefPositionId: chiefHumanTalentPosition.id,
            isActive: true,
        },
        create: {
            id: 1,
            name: "Flujo principal de Talento Humano",
            analystPositionId: auxiliaryHumanTalentPosition.id,
            chiefPositionId: chiefHumanTalentPosition.id,
            isActive: true,
        },
    });

    console.log(
        "Seed de estructura organizacional ejecutado correctamente.",
    );
};

main()
    .catch((error) => {
        console.error(
            "Error ejecutando el seed de estructura organizacional:",
            error,
        );

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });