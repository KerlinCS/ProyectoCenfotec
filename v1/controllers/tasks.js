import Task from '../models/Tasks.js'; // Asegúrate de que la ruta al modelo sea correcta

export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Crea una nueva tarea
        const newTask = new Task({
            title,
            description,
            status
        });

        // Guarda la tarea en la base de datos
        await newTask.save();

        return res.status(201).json({
            status: 'success',
            data: newTask,
            message: 'Tarea creada exitosamente',
        });
    } catch (err) {
        console.error(err); // Imprime el error en la consola para que sea más fácil depurarlo
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
};
