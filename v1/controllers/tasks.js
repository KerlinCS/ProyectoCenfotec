import Task from '../models/Tasks.js'; // Asegúrate de que la ruta al modelo sea correcta

// export const createTask = async (req, res) => {
//     try {
//         const { title, description, status, userId } = req.body;

//         // Crea una nueva tarea
//         const newTask = new Task({
//             title,
//             description,
//             status,
//             userId
//         });

//         // Guarda la tarea en la base de datos
//         await newTask.save();

//         return res.status(200).json({
//             status: 'success',
//             data: newTask,
//             message: 'Tarea creada exitosamente',
//         });
//     } catch (err) {
//         console.error(err); // Imprime el error en la consola para que sea más fácil depurarlo
//         return res.status(500).json({
//             status: 'error',
//             message: 'Error interno del servidor',
//         });
//     }
// };


//con userID
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Crear nueva tarea con el userId autenticado
        const newTask = new Task({
            title,
            description,
            status,
            userId: req.userId, // Tomar el userId desde el token
        });

        await newTask.save();

        return res.status(200).json({
            status: 'success',
            data: newTask,
            message: 'Tarea creada exitosamente',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
};



// export const getAllTask = async (req, res) => {
//     try {
//       const result = await Task.find();
//       if (!result || result.length === 0) {
//         return res.status(404).json({ success: false, message: "No se encontraron tareas" });
//       }
//       res.status(200).json({ success: true, data: result });
//     } catch (error) {
//       console.error("Error al obtener tareas:", error);
//       res.status(500).json({ success: false, message: "Error del servidor", error: error.message });
//     }
//   };

//con userID
export const getAllTask = async (req, res) => {
    try {
        // Obtener solo las tareas del usuario autenticado
        const result = await Task.find({ userId: req.userId });
        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, message: "No se encontraron tareas" });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ success: false, message: "Error del servidor", error: error.message });
    }
};
  
// // Función para actualizar una tarea
// export const updateTask = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
      
//       // Buscar la tarea por id
//       const task = await Task.findById(id);
//       if (!task) {
//         return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
//       }
  
//       // Actualizar el estado
//       task.status = status;
//       await task.save();
  
//       res.status(200).json({ success: true, data: task });
//     } catch (error) {
//       console.error('Error al actualizar tarea:', error);
//       res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
//     }
//   };

//nuevo

export const updateTask = async (req, res) => {
    const { id } = req.params; // ID de la tarea
    const { status } = req.body; // Nuevo estado
    const userId = req.userId; // ID del usuario autenticado desde el token

    try {
        // Buscar la tarea y asegurarse de que pertenezca al usuario autenticado
        const task = await Task.findOne({ _id: id, userId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada o no pertenece al usuario' });
        }

        // Actualizar la tarea
        task.status = status;
        await task.save();

        res.json({ success: true, message: 'Tarea actualizada correctamente', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar tarea', error: error.message });
    }
};

  
  // Función para eliminar una tarea
export const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar y eliminar la tarea por id
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
      }
  
      res.status(200).json({ success: true, message: 'Tarea eliminada' });
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
  };

