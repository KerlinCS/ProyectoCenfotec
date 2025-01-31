// import express from 'express';
// import { body } from 'express-validator';
// import Validate from '../middleware/validate.js'; // Importar el middleware
// import { createTask, getAllTask, updateTask, deleteTask } from '../controllers/tasks.js'; // Controlador para crear la tarea
// import ValidatarRespuesta from '../middleware/ValidarRespuesta.js';

// const router = express.Router();

// // Ruta para crear una tarea, con validaciones
// router.post(
//   '/Agregar',
//   [
//     body('title').notEmpty().withMessage('El título es obligatorio'),
//     body('description').notEmpty().withMessage('La descripción es obligatoria'),
//     body('status')
//       .isIn(['Pendiente', 'En Progreso', 'Completada'])
//       .withMessage('El estado no es válido'),
//     body('userId').notEmpty().withMessage('El usuario es obligatorio'),
//   ],
//   Validate, // Se utiliza el middleware de validación aquí
//   createTask // Función del controlador para crear la tarea
// );

// // Ruta para obtener todas las tareas
// router.get('/ObtenerTodos', getAllTask); 

// // Ruta para actualizar el estado de una tarea
// router.put('/Actualizar/:id', updateTask);

// // Ruta para eliminar una tarea
// router.delete('/Eliminar/:id', deleteTask);

// export default router;


import express from 'express';
import { body } from 'express-validator';
import Validate from '../middleware/validate.js';
import verifyToken from '../middleware/verifyToken.js'; // 🔹 Middleware de autenticación
import { createTask, getAllTask, updateTask, deleteTask } from '../controllers/tasks.js';

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

// 🔹 Ruta para eliminar una tarea
router.delete('/Eliminar/:id', verifyToken, deleteTask);

export default router;
