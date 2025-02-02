import express from 'express';
import { body } from 'express-validator';
import Validate from '../middleware/validate.js';
import verifyToken from '../middleware/verifyToken.js'; // 🔹 Middleware de autenticación
import { createTask, getAllTask, updateTask, deleteTask, updateTaskStatus  } from '../controllers/tasks.js';

const router = express.Router();

// 🔹 Ruta para crear una tarea (AUTENTICADA)
router.post(
  '/Agregar',
  verifyToken, // 🔹 Protege la ruta
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('status')
      .isIn(['Pendiente', 'En Progreso', 'Completada'])
      .withMessage('El estado no es válido'),
  ],
  Validate,
  createTask
);

// 🔹 Ruta para obtener todas las tareas del usuario autenticado
router.get('/ObtenerTodos', verifyToken, getAllTask);

// 🔹 Ruta para actualizar una tarea
router.put('/Actualizar/:id', verifyToken, updateTask);
router.put("/ActualizarEstado/:id", verifyToken, updateTaskStatus);

// 🔹 Ruta para eliminar una tarea
router.delete('/Eliminar/:id', verifyToken, deleteTask);

export default router;
