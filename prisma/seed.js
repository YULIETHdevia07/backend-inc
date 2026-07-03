import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Datos iniciales de áreas o departamentos.
const departments = [
    { code: "ORG-TH-0000", name: "Laboratorios Incobra S.A." },
    { code: "ORG-TH-0001", name: "Gerencia General" },
    { code: "ORG-TH-0002", name: "Gerencia Financiera" },
    { code: "ORG-TH-0003", name: "Dirección de Operaciones" },
    { code: "ORG-TH-0004", name: "Dirección Comercial" },
    { code: "ORG-TH-0005", name: "Talento Humano" },
    { code: "ORG-TH-0006", name: "Suministros" },
    { code: "ORG-TH-0007", name: "Tecnología e Inteligencia de Negocios" },
    { code: "ORG-TH-0008", name: "Aseguramiento de Calidad" },
    { code: "ORG-TH-0009", name: "Investigación y Desarrollo" },
    { code: "ORG-TH-0010", name: "Control de Calidad" },
    { code: "ORG-TH-0011", name: "Mantenimiento" },
    { code: "ORG-TH-0012", name: "Producción" },
    { code: "ORG-TH-0013", name: "Planeación y Distribución" },
    { code: "ORG-TH-0014", name: "Asuntos Regularios" },
    { code: "ORG-TH-0015", name: "Gestión Integral SST-GA" },
];

// Datos iniciales de perfiles de cargo.
const positionProfiles = [
    { code: "DPC-TH-0000", name: "Estudiante en Practica de Equipos y Sistemas de Apoyo Crítico" },
    { code: "DPC-TH-0001", name: "Estudiante en Practica de Sistemas Computarizado" },
    { code: "DPC-TH-0002", name: "Director de Operaciones / Director Técnico" },
    { code: "DPC-TH-0003", name: "Jefe de Talento Humano" },
    { code: "DPC-TH-0004", name: "Jefe Investigación & Desarrollo" },
    { code: "DPC-TH-0005", name: "Jefe de Aseguramiento de Calidad" },
    { code: "DPC-TH-0006", name: "Jefe de Control de Calidad" },
    { code: "DPC-TH-0007", name: "Jefe de Mantenimiento" },
    { code: "DPC-TH-0008", name: "Jefe de Producción" },
    { code: "DPC-TH-0009", name: "Jefe de Planeación y Distribución" },
    { code: "DPC-TH-0010", name: "Director Comercial" },
    { code: "DPC-TH-0011", name: "Gerente Médico" },
    { code: "DPC-TH-0012", name: "Jefe de Nuevos Negocios" },
    { code: "DPC-TH-0013", name: "Jefe de Distrito" },
    { code: "DPC-TH-0014", name: "Coordinador de Desarrollo y Validación de Técnicas Analíticas" },
    { code: "DPC-TH-0015", name: "Coordinador de Estabilidad" },
    { code: "DPC-TH-0016", name: "Coordinador de Control de Calidad de Productos" },
    { code: "DPC-TH-0017", name: "Coordinador de Control de Calidad de Materiales" },
    { code: "DPC-TH-0018", name: "Coordinador de Control de Calidad Microbiológico" },
    { code: "DPC-TH-0019", name: "Coordinador de Disposición de Producto" },
    { code: "DPC-TH-0020", name: "Coordinador de Cumplimiento" },
    { code: "DPC-TH-0021", name: "Coordinador de Validaciones" },
    { code: "DPC-TH-0022", name: "Coordinador de Validaciones Microbiológica" },
    { code: "DPC-TH-0023", name: "Coordinador de Mantenimiento de Planta Interna" },
    { code: "DPC-TH-0024", name: "Coordinador de Pisos Técnicos y Areas Externas de planta" },
    { code: "DPC-TH-0027", name: "Supervisor de Acabado" },
    { code: "DPC-TH-0028", name: "Coordinador de Sistemas de Gestión Integral SST-GA" },
    { code: "DPC-TH-0029", name: "Kam Nacional Institucional" },
    { code: "DPC-TH-0030", name: "Coordinador PMO" },
    { code: "DPC-TH-0031", name: "Formulador Técnico" },
    { code: "DPC-TH-0032", name: "Jefe Nacional de Promoción Médica" },
    { code: "DPC-TH-0033", name: "Jefe de Suministros" },
    { code: "DPC-TH-0034", name: "Auxiliar de Comercio Exterior y Servicios" },
    { code: "DPC-TH-0035", name: "Asistente de Proyectos" },
    { code: "DPC-TH-0036", name: "Técnico de Microbiología" },
    { code: "DPC-TH-0037", name: "Auxiliar de Suministros" },
    { code: "DPC-TH-0038", name: "Analista de Suministros 1" },
    { code: "DPC-TH-0039", name: "Analista de Suministros 2" },
    { code: "DPC-TH-0040", name: "Diseñador Gráfico Senior" },
    { code: "DPC-TH-0041", name: "Técnico Electromecánico" },
    { code: "DPC-TH-0042", name: "Auxiliar de Documentación Talento Humano" },
    { code: "DPC-TH-0044", name: "Auxiliar de Transaccioes de Inventario" },
    { code: "DPC-TH-0045", name: "Analista de Documentación Técnica" },
    { code: "DPC-TH-0046", name: "Visitador Médico" },
    { code: "DPC-TH-0047", name: "Jefe Nacional de Promoción" },
    { code: "DPC-TH-0048", name: "Ejecutivo de Cuenta" },
    { code: "DPC-TH-0049", name: "Analista de Asuntos Regulatorios de Nuevos Negocios" },
    { code: "DPC-TH-0050", name: "Diseñador Gráfico Junior" },
    { code: "DPC-TH-0051", name: "Analista de Cumplimiento" },
    { code: "DPC-TH-0052", name: "Gerente Nacional de Ventas" },
    { code: "DPC-TH-0053", name: "Analista de Disposición de Productos" },
    { code: "DPC-TH-0054", name: "Analista de Liberación e Inspección" },
    { code: "DPC-TH-0055", name: "Analista de Proveedores" },
    { code: "DPC-TH-0056", name: "Auditor" },
    { code: "DPC-TH-0057", name: "Analista de Gestión del Riesgo de Control de Calidad" },
    { code: "DPC-TH-0058", name: "Analista de Capacitación y Entrenamiento" },
    { code: "DPC-TH-0059", name: "Jefe de Producto" },
    { code: "DPC-TH-0060", name: "Jefe Nacional de Ventas Farma y Consumo" },
    { code: "DPC-TH-0061", name: "Inspector de Gestión Ambiental" },
    { code: "DPC-TH-0062", name: "Operario Línea 1" },
    { code: "DPC-TH-0063", name: "Operario de Linea 2" },
    { code: "DPC-TH-0064", name: "Asistente de Mercadeo" },
    { code: "DPC-TH-0065", name: "Aprendiz de Tecnología" },
    { code: "DPC-TH-0066", name: "Auxiliar de Salud y Seguridad en el Trabajo" },
    { code: "DPC-TH-0067", name: "Inspector de BPM" },
    { code: "DPC-TH-0068", name: "Auxiliar de Gerencia" },
    { code: "DPC-TH-0069", name: "Control Interno" },
    { code: "DPC-TH-0070", name: "Secretaria de Aseguramiento de Calidad" },
    { code: "DPC-TH-0071", name: "Auxiliar de Control Interno" },
    { code: "DPC-TH-0072", name: "Auxiliar Logístico" },
    { code: "DPC-TH-0073", name: "Gerente Ejecutivo" },
    { code: "DPC-TH-0074", name: "Analista de Validación de Procesos 2" },
    { code: "DPC-TH-0075", name: "Auxiliar de Mercadeo" },
    { code: "DPC-TH-0076", name: "Coordinador de Asuntos Regulatorios" },
    { code: "DPC-TH-0077", name: "Analista de Documentación" },
    { code: "DPC-TH-0078", name: "Analista de Inteligencia de Negocios" },
    { code: "DPC-TH-0079", name: "Transferencista" },
    { code: "DPC-TH-0080", name: "Auxiliar de Talento Humano" },
    { code: "DPC-TH-0081", name: "Analista Junior de Asuntos Regulatorios" },
    { code: "DPC-TH-0082", name: "Analista de Asuntos Regulatorios" },
    { code: "DPC-TH-0083", name: "Estudiante en Práctica Auxiliar de Disposición de Producto" },
    { code: "DPC-TH-0084", name: "Auxiliar de Sólidos y Semisólidos" },
    { code: "DPC-TH-0085", name: "Auxiliar de Estériles, Líquidos y Cosméticos" },
    { code: "DPC-TH-0086", name: "Analista de Materiales Junior" },
    { code: "DPC-TH-0087", name: "Técnico de Estabilidad" },
    { code: "DPC-TH-0088", name: "Auxiliar Comercial" },
    { code: "DPC-TH-0089", name: "Auxiliar de Tecnología e Información" },
    { code: "DPC-TH-0090", name: "Secretaria de Mantenimiento" },
    { code: "DPC-TH-0091", name: "Aprendiz de Planeación y Distribución" },
    { code: "DPC-TH-0092", name: "Analista de Mantenimiento" },
    { code: "DPC-TH-0093", name: "Auxiliar de Control de Microbiología" },
    { code: "DPC-TH-0094", name: "Analista de Metodos y Tiempos" },
    { code: "DPC-TH-0095", name: "Auxiliar de Laboratorio" },
    { code: "DPC-TH-0096", name: "Analista de Estabilidad" },
    { code: "DPC-TH-0097", name: "Analista de Reactivo" },
    { code: "DPC-H-0098", name: "Analista de Producto Senior" },
    { code: "DPC-TH-0099", name: "Analista de Microbiología" },
    { code: "DPC-TH-0100", name: "Técnico de Control Fisicoquímico" },
    { code: "DPC-TH-0101", name: "Estudiante en Práctica de Documentación Técnica" },
    { code: "DPC-TH-0102", name: "Analista de Documentación Técnica 1" },
    { code: "DPC-TH-0103", name: "Analista de Materiales Senior" },
    { code: "DPC-TH-0104", name: "Operario de Servicios Generales" },
    { code: "DPC-TH-0105", name: "Inspector de Control en Proceso" },
    { code: "DPC-TH-0106", name: "Técnico Muestreo e Inspección" },
    { code: "DPC-TH-0107", name: "Analista de Validación de Procesos 1" },
    { code: "DPC-TH-0108", name: "Analista de Validaciones Microbiológicas" },
    { code: "DPC-TH-0109", name: "Inspector de Equipos y Sistemas de Apoyo Crítico" },
    { code: "DPC-TH-0110", name: "Estudiante en Práctica Auxiliar de Documentaciòn" },
    { code: "DPC-TH-0111", name: "Estudiante en Práctica en Validación de Procesos" },
    { code: "DPC-TH-0112", name: "Analista de Validaciones de Sistema Computarizados" },
    { code: "DPC-TH-0113", name: "Analista de Planeación de Materiales Junior" },
    { code: "DPC-TH-0114", name: "Secretaria de Investigación & Desarrollo" },
    { code: "DPC-TH-0115", name: "Analista de Desarrollo de Técnicas Analíticas" },
    { code: "DPC-TH-0116", name: "Analista de Validación de Técnicas Analíticas" },
    { code: "DPC-TH-0117", name: "Aprendiz de Talento Humano" },
    { code: "DPC-TH-0118", name: "Analista de Talento Humano" },
    { code: "DPC-TH-0119", name: "Analista de Documentación Tecnica I&D" },
    { code: "DPC-TH-0120", name: "Estudiante en Práctica de Química y Farmacia" },
    { code: "DPC-TH-0121", name: "Técnico de Control de Materiales" },
    { code: "DPC-TH-0122", name: "Coordinador de Eficiencia y Productividad" },
    { code: "DPC-TH-0123", name: "Lider de Despacho" },
    { code: "DPC-TH-0124", name: "Analista de Estabilidad Junior" },
    { code: "DPC-TH-0125", name: "Técnico Electricista" },
    { code: "DPC-TH-0126", name: "Auxiliar de Refrigeración" },
    { code: "DPC-TH-0127", name: "Estudiante Practicas de Mantenimiento" },
    { code: "DPC-TH-0128", name: "Auxiliar de Logística" },
    { code: "DPC-TH-0129", name: "Estudiante en Práctica de Ingenieria" },
    { code: "DPC-TH-0130", name: "Técnico de Mantenimiento en Instalaciones" },
    { code: "DPC-TH-0131", name: "Supervisor de Almacén de Materiales" },
    { code: "DPC-TH-0132", name: "Coordinador de la Planeación y Control de la Producción" },
    { code: "DPC-TH-0133", name: "Auxiliar de Alistamiento" },
    { code: "DPC-TH-0134", name: "Auxiliar de Despacho" },
    { code: "DPC-TH-0135", name: "Auxiliar de Materia Prima y Material de Envase" },
    { code: "DPC-TH-0136", name: "Auxiliar de Material de Empaque" },
    { code: "DPC-TH-0137", name: "Aprendiz de Almacen de Materiales" },
    { code: "DPC-TH-0138", name: "Estudiante en Práctica de Planeación" },
    { code: "DPC-TH-0139", name: "Secretaria de Dirección de Operaciones" },
    { code: "DPC-TH-0140", name: "Analista de Metrologia y Calificaciones" },
    { code: "DPC-TH-0142", name: "Líder de Soporte Técnico" },
    { code: "DPC-TH-0143", name: "Aprendiz Auxiliar Administrativo de Suministros" },
    { code: "DPC-TH-0144", name: "Operario de Planta" },
    { code: "DPC-TH-0145", name: "Líder de Equipos y Sistemas de Apoyo Critico" },
    { code: "DPC-TH-0146", name: "Operario de Ropería" },
    { code: "DPC-TH-0147", name: "Supervisor de Despacho y Producto Terminado" },
    { code: "DPC-TH-0148", name: "Estudiante en Practicas de Microbiología" },
    { code: "DPC-TH-0149", name: "Estudiante en Practicas de Microbiológico" },
    { code: "DPC-TH-0150", name: "Supervisor de Producción de Sólidos y Semisólidos" },
    { code: "DPC-TH-0151", name: "Supervisor de Producción Estériles, Líquidos y Cosméticos" },
    { code: "DPC-TH-0152", name: "Inspector de Pesaje" },
    { code: "DPC-TH-0153", name: "Auxiliar Pesaje" },
    { code: "DPC-TH-0154", name: "Auxiliar de Acabado" },
    { code: "DPC-TH-0155", name: "Auxiliar de Producción" },
    { code: "DPC-TH-0156", name: "Auxiliar de Llenado Aséptico" },
    { code: "DPC-TH-0157", name: "Operario de Estériles, Líquidos y Cosméticos" },
    { code: "DPC-TH-0158", name: "Operario de Envase Solidos, Semisolidos" },
    { code: "DPC-TH-0159", name: "Analista de Documentación Técnica de Producción" },
    { code: "DPC-TH-0160", name: "Operario de Línea Institucional" },
    { code: "DPC-TH-0161", name: "Secretaria de Control de Calidad" },
    { code: "DPC-TH-0162", name: "Auxiliar de Laboratorio 2" },
    { code: "DPC-TH-0163", name: "Estudiante en Práctica Químico Farmacéutico" },
    { code: "DPC-TH-0164", name: "Analista de Documentación Técnica 2" },
    { code: "DPC-TH-0165", name: "Técnico Refrigeración" },
    { code: "DPC-TH-0166", name: "Analista de Planeación de Materiales Senior" },
    { code: "DPC-TH-0167", name: "Auxiliar de Planeación y Distribución" },
    { code: "DPC-TH-0168", name: "Asistente de Cartera" },
    { code: "DPC-TH-0169", name: "Jefe de Tecnología e Inteligencia de Negocios" },
    { code: "DPC-TH-0170", name: "Analista de Eficiencia Operativa" },
];

// Datos iniciales para los pasos de aprobación de requisiciones.
const requisitionApprovalSteps = [
    {
        stepOrder: 1,
        name: "Jefe de Área",
        requiredRole: "JEFE_AREA",
    },
    {
        stepOrder: 2,
        name: "Jefe de Departamento",
        requiredRole: "JEFE_DEPARTAMENTO",
    },
    {
        stepOrder: 3,
        name: "Gerente General",
        requiredRole: "GERENTE_GENERAL",
    },
];

// Datos iniciales para los pasos de VoBo de confirmación de contratación.
const hiringConfirmationApprovalSteps = [
    {
        stepOrder: 1,
        name: "Analista de Talento Humano",
        requiredRole: "ANALISTA_TALENTO_HUMANO",
    },
    {
        stepOrder: 2,
        name: "Jefe de Talento Humano",
        requiredRole: "JEFE_TALENTO_HUMANO",
    },
];

// Ejecuta la carga inicial de datos necesarios para el sistema.
const main = async () => {
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

    for (const positionProfile of positionProfiles) {
        await prisma.positionProfile.upsert({
            where: {
                code: positionProfile.code,
            },
            update: {
                name: positionProfile.name,
                isActive: true,
            },
            create: {
                code: positionProfile.code,
                name: positionProfile.name,
                isActive: true,
            },
        });
    }

    for (const step of requisitionApprovalSteps) {
        await prisma.requisitionApprovalStep.upsert({
            where: {
                stepOrder: step.stepOrder,
            },
            update: {
                name: step.name,
                requiredRole: step.requiredRole,
                isActive: true,
            },
            create: {
                stepOrder: step.stepOrder,
                name: step.name,
                requiredRole: step.requiredRole,
                isActive: true,
            },
        });
    }

    for (const step of hiringConfirmationApprovalSteps) {
        await prisma.hiringConfirmationApprovalStep.upsert({
            where: {
                stepOrder: step.stepOrder,
            },
            update: {
                name: step.name,
                requiredRole: step.requiredRole,
                isActive: true,
            },
            create: {
                stepOrder: step.stepOrder,
                name: step.name,
                requiredRole: step.requiredRole,
                isActive: true,
            },
        });
    }

    console.log("Seed ejecutado correctamente.");
};

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });