import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Departamentos o áreas que participan en el flujo de aprobación.
const departments = [
    { code: "GERENCIA", name: "Gerencia" },
    { code: "DIRECCION_OPERACIONES", name: "Dirección de Operaciones" },
    { code: "PRODUCCION", name: "Producción" },
    { code: "ASEGURAMIENTO_CALIDAD", name: "Aseguramiento de Calidad" },
    { code: "CONTROL_CALIDAD", name: "Control de Calidad" },
    { code: "PLANEACION_DISTRIBUCION", name: "Planeación y Distribución" },
    { code: "INVESTIGACION_DESARROLLO", name: "Investigación & Desarrollo" },
    { code: "MANTENIMIENTO", name: "Mantenimiento" },
    // { code: "SECRETARIA_DIRECCION_OPERACIONES", name: "Secretaría de Dirección de Operaciones" },
    { code: "PLANEACION_CONTROL_PRODUCCION", name: "Planeación y Control de la Producción" },
    { code: "SST_GA", name: "Sistema de Gestión Integral SST-GA" },
    { code: "DIRECCION_COMERCIAL", name: "Dirección Comercial" },
    { code: "NUEVOS_NEGOCIOS", name: "Nuevos Negocios" },
    { code: "GERENCIA_FINANCIERA", name: "Gerencia Financiera" },
    { code: "CONTABILIDAD", name: "Contabilidad" },
    { code: "SUMINISTROS", name: "Suministros" },
    { code: "TALENTO_HUMANO", name: "Talento Humano" },
    { code: "TECNOLOGIA", name: "Tecnología e Inteligencia de Negocio" },
    { code: "VENTAS_FARMA_CONSUMO", name: "Ventas Farma y Consumo" },
    // { code: "EQUIPO_SOPORTE_COMERCIAL", name: "Equipo Soporte Comercial" },
    { code: "MERCADEO_PRODUCTO", name: "Mercadeo / Producto" },
];

// Cargos aprobadores usados por la jerarquía enviada por Talento Humano.
const positionProfiles = [
    {
        code: "SUBGERENTE_GENERAL",
        name: "Subgerente General",
        homeDepartmentCode: "GERENCIA",
    },
    {
        code: "DPC-TH-0002",
        name: "Director de Operaciones",
        homeDepartmentCode: "DIRECCION_OPERACIONES",
    },
    {
        code: "DPC-TH-0008",
        name: "Jefe de Producción",
        homeDepartmentCode: "PRODUCCION",
    },
    {
        code: "DPC-TH-0005",
        name: "Jefe de Aseguramiento de Calidad",
        homeDepartmentCode: "ASEGURAMIENTO_CALIDAD",
    },
    {
        code: "DPC-TH-0006",
        name: "Jefe de Control de Calidad",
        homeDepartmentCode: "CONTROL_CALIDAD",
    },
    {
        code: "DPC-TH-0009",
        name: "Jefe de Planeación y Distribución",
        homeDepartmentCode: "PLANEACION_DISTRIBUCION",
    },
    {
        code: "DPC-TH-0004",
        name: "Jefe de Investigación & Desarrollo",
        homeDepartmentCode: "INVESTIGACION_DESARROLLO",
    },
    {
        code: "DPC-TH-0007",
        name: "Jefe de Mantenimiento",
        homeDepartmentCode: "MANTENIMIENTO",
    },
    // {
    //     code: "DPC-TH-0139",
    //     name: "Secretaria de Dirección de Operaciones",
    //     homeDepartmentCode: "SECRETARIA_DIRECCION_OPERACIONES",
    // },
    {
        code: "DPC-TH-0132",
        name: "Coordinador de Planeación y Control de la Producción",
        homeDepartmentCode: "PLANEACION_CONTROL_PRODUCCION",
    },
    {
        code: "DPC-TH-0028",
        name: "Coordinador de Sistemas de Gestión Integral SST-GA",
        homeDepartmentCode: "SST_GA",
    },
    {
        code: "DPC-TH-0073",
        name: "Gerente Ejecutivo",
        homeDepartmentCode: "DIRECCION_COMERCIAL",
    },
    {
        code: "DPC-TH-0012",
        name: "Jefe de Nuevos Negocios",
        homeDepartmentCode: "NUEVOS_NEGOCIOS",
    },
    {
        code: "GERENTE_FINANCIERO",
        name: "Gerente Financiero",
        homeDepartmentCode: "GERENCIA_FINANCIERA",
    },
    {
        code: "JEFE_CONTABILIDAD",
        name: "Jefe de Contabilidad",
        homeDepartmentCode: "CONTABILIDAD",
    },
    {
        code: "DPC-TH-0033",
        name: "Jefe de Suministros",
        homeDepartmentCode: "SUMINISTROS",
    },
    {
        code: "DPC-TH-0003",
        name: "Jefe de Talento Humano",
        homeDepartmentCode: "TALENTO_HUMANO",
    },
    {
        code: "DPC-TH-0080",
        name: "Auxiliar de Talento Humano",
        homeDepartmentCode: "TALENTO_HUMANO",
    },
    {
        code: "DPC-TH-0169",
        name: "Jefe de Tecnología e Inteligencia de Negocio",
        homeDepartmentCode: "TECNOLOGIA",
    },
    {
        code: "DPC-TH-0060",
        name: "Jefe Nacional de Ventas Farma y Consumo",
        homeDepartmentCode: "VENTAS_FARMA_CONSUMO",
    },
    // {
    //     code: "ASISTENTE_COMERCIAL",
    //     name: "Asistente Comercial",
    //     homeDepartmentCode: "EQUIPO_SOPORTE_COMERCIAL",
    // },
    {
        code: "DPC-TH-0059",
        name: "Jefe de Producto",
        homeDepartmentCode: "MERCADEO_PRODUCTO",
    },
];

// Relación jerárquica: cada departamento indica quién lo aprueba y a qué nivel superior sube.
const departmentStructure = [
    {
        departmentCode: "GERENCIA",
        parentDepartmentCode: null,
        responsiblePositionCode: "SUBGERENTE_GENERAL",
    },
    {
        departmentCode: "DIRECCION_OPERACIONES",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0002",
    },
    {
        departmentCode: "PRODUCCION",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0008",
    },
    {
        departmentCode: "ASEGURAMIENTO_CALIDAD",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0005",
    },
    {
        departmentCode: "CONTROL_CALIDAD",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0006",
    },
    {
        departmentCode: "PLANEACION_DISTRIBUCION",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0009",
    },
    {
        departmentCode: "INVESTIGACION_DESARROLLO",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0004",
    },
    {
        departmentCode: "MANTENIMIENTO",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0007",
    },
    // {
    //     departmentCode: "SECRETARIA_DIRECCION_OPERACIONES",
    //     parentDepartmentCode: "DIRECCION_OPERACIONES",
    //     responsiblePositionCode: "DPC-TH-0139",
    // },
    {
        departmentCode: "PLANEACION_CONTROL_PRODUCCION",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0132",
    },
    {
        departmentCode: "SST_GA",
        parentDepartmentCode: "DIRECCION_OPERACIONES",
        responsiblePositionCode: "DPC-TH-0028",
    },
    {
        departmentCode: "DIRECCION_COMERCIAL",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0073",
    },
    {
        departmentCode: "NUEVOS_NEGOCIOS",
        parentDepartmentCode: "DIRECCION_COMERCIAL",
        responsiblePositionCode: "DPC-TH-0012",
    },
    {
        departmentCode: "GERENCIA_FINANCIERA",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "GERENTE_FINANCIERO",
    },
    {
        departmentCode: "CONTABILIDAD",
        parentDepartmentCode: "GERENCIA_FINANCIERA",
        responsiblePositionCode: "JEFE_CONTABILIDAD",
    },
    {
        departmentCode: "SUMINISTROS",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0033",
    },
    {
        departmentCode: "TALENTO_HUMANO",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0003",
    },
    {
        departmentCode: "TECNOLOGIA",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0169",
    },
    {
        departmentCode: "VENTAS_FARMA_CONSUMO",
        parentDepartmentCode: "GERENCIA",
        responsiblePositionCode: "DPC-TH-0060",
    },
    // {
    //     departmentCode: "EQUIPO_SOPORTE_COMERCIAL",
    //     parentDepartmentCode: "VENTAS_FARMA_CONSUMO",
    //     responsiblePositionCode: "ASISTENTE_COMERCIAL",
    // },
    {
        departmentCode: "MERCADEO_PRODUCTO",
        parentDepartmentCode: "VENTAS_FARMA_CONSUMO",
        responsiblePositionCode: "DPC-TH-0059",
    },
];

// Ejecuta la carga inicial de Talento Humano.
const main = async () => {
    // Crea o actualiza los departamentos.
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

    // Crea o actualiza los cargos y los relaciona con su departamento base.
    for (const position of positionProfiles) {
        const homeDepartment = await prisma.department.findUnique({
            where: {
                code: position.homeDepartmentCode,
            },
        });

        if (!homeDepartment) {
            throw new Error(
                `No se encontró el departamento base ${position.homeDepartmentCode}`
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

    // Configura el departamento padre y el cargo responsable de cada departamento.
    for (const item of departmentStructure) {
        const department = await prisma.department.findUnique({
            where: {
                code: item.departmentCode,
            },
        });

        const parentDepartment = item.parentDepartmentCode
            ? await prisma.department.findUnique({
                where: {
                    code: item.parentDepartmentCode,
                },
            })
            : null;

        const responsiblePosition = await prisma.positionProfile.findUnique({
            where: {
                code: item.responsiblePositionCode,
            },
        });

        if (!department) {
            throw new Error(`No se encontró el departamento ${item.departmentCode}`);
        }

        if (!responsiblePosition) {
            throw new Error(
                `No se encontró el cargo responsable ${item.responsiblePositionCode}`
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

    // Configura el flujo de Talento Humano para la confirmación de contratación.
    const auxiliaryHumanTalentPosition = await prisma.positionProfile.findUnique({
        where: {
            code: "DPC-TH-0080",
        },
    });

    const chiefHumanTalentPosition = await prisma.positionProfile.findUnique({
        where: {
            code: "DPC-TH-0003",
        },
    });

    if (!auxiliaryHumanTalentPosition || !chiefHumanTalentPosition) {
        throw new Error("No se pudo configurar el flujo de Talento Humano.");
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

    console.log("Seed de estructura organizacional ejecutado correctamente.");
};

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });