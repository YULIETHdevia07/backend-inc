import { getAllUsersService, getUserByIdService, updateUserRoleService } from "../services/user.service.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";

export const getUsers = async (
  req: Request,
  res: Response
) => {

  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }

};

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        message: "El usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar usuario",
      error,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: "Login exitoso",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en el login",
      error,
    });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "El id del usuario no es válido",
      });
    }

    if (!role) {
      return res.status(400).json({
        message: "El rol es obligatorio",
      });
    }

    const allowedRoles = ["USER", "ADMIN", "AGENT"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Rol no válido",
        allowedRoles,
      });
    }

    const userExists = await getUserByIdService(userId);

    if (!userExists) {
      return res.status(404).json({
        message: "El usuario no existe",
      });
    }

    const updatedUser = await updateUserRoleService(userId,role);

    return res.status(200).json({
      message: "Rol del usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el rol del usuario",
      error,
    });
  }
};