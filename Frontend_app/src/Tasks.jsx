import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const API_URL = 'http://localhost:5005/v1';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [userId, setUserId] = useState('6799b19255c7c559a5b5dc7d');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/ObtenerTodos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Verifica si la respuesta tiene el formato esperado
      if (Array.isArray(response.data.data)) {
        setTasks(response.data.data); // Asume que las tareas están en response.data.data
      } else {
        console.error("La respuesta no es un arreglo", response.data);
        setTasks([]); // Asegura que tasks sea siempre un arreglo
      }
    } catch (error) {
      console.error("Error al obtener tareas", error);
      setTasks([]); // Asegura que tasks sea siempre un arreglo
    }
  };

  const addTask = async () => {
    if (!title || !description) {
      alert("Debe ingresar título y descripción");
      return;
    }
    try {
      await axios.post(`${API_URL}/tasks/Agregar`, { title, description, status, userId}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setStatus('Pendiente');
      fetchTasks();
    } catch (error) {
      console.error("Error al agregar tarea", error);
    }
  };

  const updateTask = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/Actualizar/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // Refrescar las tareas después de la actualización
    } catch (error) {
      console.error("Error al actualizar tarea", error);
    }
  };
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/Eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // Refrescar las tareas después de eliminar
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    
    <div>
        <Button onClick={logout}>Cerrar Sesión</Button>
      <h1>Gestión de Tareas </h1>
      
      
      <Card className='p-3 mt-3'>
        <Card.Body>
          <h3>Nueva tarea</h3>
          <Form className='d-flex flex-column gap-2'>
            <Form.Control
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Form.Control
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completada</option>
            </Form.Select>
            <Button onClick={addTask}> <FontAwesomeIcon icon={faPlus} /></Button>
          </Form>
        </Card.Body>
      </Card>

      <h3 className='mt-4'>Mis Tareas</h3>
      {tasks.length == 0 ? <p>No hay tareas registradas.</p> : (
        tasks.map(task => (
          <Card key={task._id} className='p-3 mt-2'>
            <Card.Body>
              <h5>{task.title}</h5>
              <p>{task.description}</p>
              <Form.Select 
                value={task.status} 
                onChange={(e) => updateTask(task._id, e.target.value)}
              >
                <option>Pendiente</option>
                <option>En Progreso</option>
                <option>Completada</option>
              </Form.Select>
              <Button variant="danger" className="mt-2" onClick={() => deleteTask(task._id)}>Eliminar</Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Tasks;
