import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faCog, faCheck, faTrash, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';

const API_URL = 'http://localhost:5005/v1';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(2);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [token]);

  useEffect(() => {
    if (filterStatus === 'Todos') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filterStatus));
    }
  }, [tasks, filterStatus]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/ObtenerTodos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data.data)) {
        setTasks(response.data.data);
        setFilteredTasks(response.data.data);  // Inicializamos con todas las tareas
      } else {
        console.error("La respuesta no es un arreglo", response.data);
        setTasks([]);
        setFilteredTasks([]);
      }
    } catch (error) {
      console.error("Error al obtener tareas", error);
      setTasks([]);
      setFilteredTasks([]);
    }
  };

  const addTask = async () => {
    if (!title || !description) {
      alert("Debe ingresar título y descripción");
      return;
    }
    try {
      await axios.post(`${API_URL}/tasks/Agregar`, { title, description, status }, {
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
      fetchTasks();  // Vuelve a cargar las tareas después de la actualización
    } catch (error) {
      console.error("Error al actualizar tarea", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/Eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const statusIcons = {
    Pendiente: faClock,
    'En Progreso': faCog,
    Completada: faCheck
  };

  const statusColors = {
    Pendiente: 'danger',
    'En Progreso': 'warning',
    Completada: 'success'
  };

  // Lógica de paginación
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div style={{padding: '20px' }}>
      <h1>Gestión de Tareas</h1>
      <Button className="logout-button" onClick={logout}>Cerrar Sesión</Button>
      
      <Row>
        {/* Columna para Nueva tarea */}
        <Col md={4} className="p-3">
          <Card className="p-3">
            <Card.Body>
              <h3 className="text-center">Nueva tarea</h3>
              <Form className="d-flex flex-column gap-2">
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
                <Button onClick={addTask} className='add-button'>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="p-3">
        <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <span>  {currentPage} de {totalPages} </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>

        <Col md={1.5} className=" p-3">
          <h3 className="mt-4">Filtrar tareas</h3>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </Form.Select>
          
        </Col>
      </div>
        </Col>
      </Row>

      <Row>
  <Col md={12} className="p-3">
    <h3 className="mt-4">Mis Tareas</h3>
    {currentTasks.length === 0 ? (
      <p>No hay tareas registradas.</p>
    ) : (
      currentTasks.map((task) => (
        <Card key={task._id} className="task-card mb-3" style={{ width: '100%' }}>
          <Card.Body>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <div className="task-actions">
              {/* Selector para cambiar el estado */}
              <Form.Select
                value={task.status}
                onChange={(e) => updateTask(task._id, e.target.value)}  // Llamada a la función updateTask para cambiar el estado
                size="sm"
                style={{ width: '150px' }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </Form.Select>

              {/* Botón para eliminar la tarea */}
              <Button
                variant="danger"
                size="sm"
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))
    )}
  </Col>
</Row>



    </div>
  );
}

export default Tasks;
