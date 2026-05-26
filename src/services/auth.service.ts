
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import prisma from "../../prisma/client.js";
import type {
  BulkRegisterUserData,
  BulkRegisterUserError,
} from "../interfaces/auth.interface.js";
import { isValidEmail, isValidName } from "../utils/validators.js";


interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export const registerUserService = async ({
  name,
  email,
  password,
}: RegisterUserData) => {
  // Limpia espacios y normaliza los datos
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (!isValidName(cleanName)) {
    throw new Error(
      "El nombre solo puede contener letras"
    );
  }

  if (cleanName.length < 3) {
    throw new Error("El nombre debe tener mínimo 3 caracteres");
  }

  if (!isValidEmail(cleanEmail)) {
    throw new Error("El correo electrónico no tiene un formato válido");
  }

  if (cleanPassword.length < 6) {
    throw new Error("La contraseña debe tener mínimo 6 caracteres");
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  if (userExists) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(cleanPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    },
  });

  // Retira la contraseña antes de responder
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

// Permite registrar usuarios mediante carga masiva desde un archivo Excel.
export const registerUsersBulkService = async (fileBuffer: Buffer) => {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });

  // Valida que el archivo tenga al menos una hoja.
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("El archivo Excel no contiene hojas");
  }

  // Obtiene la primera hoja del archivo Excel.
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error("No se pudo leer la hoja del archivo Excel");
  }

  // Convierte la hoja de Excel en arreglo de objetos.
  const users = XLSX.utils.sheet_to_json<BulkRegisterUserData>(sheet);

  if (users.length === 0) {
    throw new Error("El archivo Excel no contiene usuarios para registrar");
  }

  const errors: BulkRegisterUserError[] = [];
  const validUsers: BulkRegisterUserData[] = [];
  const emailsInFile = new Set<string>();

  // Primera fase: valida todo el archivo antes de registrar.
  for (const [index, userData] of users.entries()) {
    const rowNumber = index + 2;

    const cleanName = userData.name?.trim();
    const cleanEmail = userData.email?.trim().toLowerCase();
    const password = String(userData.password ?? "");

    // Valida que la fila tenga todos los campos requeridos.
    if (!cleanName || !cleanEmail || !password) {
      errors.push({
        row: rowNumber,
        message: "Todos los campos son obligatorios",
      });
      continue;
    }

    // Valida que el nombre solo contenga letras permitidas.
    if (!isValidName(cleanName)) {
      errors.push({
        row: rowNumber,
        email: cleanEmail,
        message: "El nombre solo puede contener letras, espacios, tildes y ñ",
      });
      continue;
    }

    // Valida la longitud mínima del nombre.
    if (cleanName.length < 3) {
      errors.push({
        row: rowNumber,
        email: cleanEmail,
        message: "El nombre debe tener mínimo 3 caracteres",
      });
      continue;
    }

    // Valida el formato del correo electrónico.
    if (!isValidEmail(cleanEmail)) {
      errors.push({
        row: rowNumber,
        email: cleanEmail,
        message: "El correo electrónico no tiene un formato válido",
      });
      continue;
    }

    // Valida la longitud mínima de la contraseña sin modificarla.
    if (password.length < 6) {
      errors.push({
        row: rowNumber,
        email: cleanEmail,
        message: "La contraseña debe tener mínimo 6 caracteres",
      });
      continue;
    }

    // Valida que el correo no esté repetido dentro del mismo archivo.
    if (emailsInFile.has(cleanEmail)) {
      errors.push({
        row: rowNumber,
        email: cleanEmail,
        message: "Correo duplicado dentro del archivo",
      });
      continue;
    }

    emailsInFile.add(cleanEmail);

    validUsers.push({
      name: cleanName,
      email: cleanEmail,
      password,
    });
  }

  // Si hay errores en formato o campos, no registra ningún usuario.
  if (errors.length > 0) {
    return {
      totalRows: users.length,
      totalCreated: 0,
      totalErrors: errors.length,
      createdUsers: [],
      errors,
      message: "El archivo contiene errores. Debe corregirlos y volver a subirlo.",
    };
  }

  // Consulta en base de datos si ya existen correos del archivo.
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: validUsers.map((user) => user.email),
      },
    },
    select: {
      email: true,
    },
  });

  const existingEmails = new Set(
    existingUsers.map((user) => user.email)
  );

  // Valida usuarios existentes en base de datos.
  validUsers.forEach((user, index) => {
    if (existingEmails.has(user.email)) {
      errors.push({
        row: index + 2,
        email: user.email,
        message: "El usuario ya existe",
      });
    }
  });

  // Si algún correo ya existe, no registra ningún usuario.
  if (errors.length > 0) {
    return {
      totalRows: users.length,
      totalCreated: 0,
      totalErrors: errors.length,
      createdUsers: [],
      errors,
      message: "El archivo contiene usuarios ya registrados. No se registró ningún usuario.",
    };
  }

  // Segunda fase: si todo está correcto, registra todos los usuarios.
  const usersToCreate = await Promise.all(
    validUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      };
    })
  );

  // Registra todos los usuarios válidos en una sola operación.
  await prisma.user.createMany({
    data: usersToCreate,
  });

  // Consulta los usuarios creados para responder sin contraseña.
  const createdUsers = await prisma.user.findMany({
    where: {
      email: {
        in: validUsers.map((user) => user.email),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return {
    totalRows: users.length,
    totalCreated: createdUsers.length,
    totalErrors: 0,
    createdUsers,
    errors: [],
    message: "Todos los usuarios fueron registrados correctamente.",
  };
};