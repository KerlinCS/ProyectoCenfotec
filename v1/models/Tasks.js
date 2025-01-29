import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Pendiente', 'En Progreso', 'Completada'],
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
