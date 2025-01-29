import express from 'express';
import { body } from 'express-validator';
import Validate from '../middleware/validate.js'; // Importar el middleware
import { createTask } from '../controllers/tasks.js'; // Controlador para crear la tarea

const router = express.Router();

// Ruta para crear una tarea, con validaciones
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('status')
      .isIn(['Pendiente', 'En Progreso', 'Completada'])
      .withMessage('El estado no es válido'),
  ],
  Validate, // Se utiliza el middleware de validación aquí
  createTask // Función del controlador para crear la tarea
);

export default router;
