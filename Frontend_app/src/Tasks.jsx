import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil, faTrash, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Modal } from 'react-bootstrap';  // Importamos el Modal
import Swal from 'sweetalert2';


const API_URL = 'http://localhost:5005/v1';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(9);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [editingTask, setEditingTask] = useState(null);


  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const user = localStorage.getItem('user');
    if (user) {
      setUsername(user);
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
        setFilteredTasks(response.data.data);
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
      Swal.fire({
        title: 'Falta información',
        text: 'El título y la descripción son obligatorios.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      
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
      setShowModal(false);  // Cerrar el modal después de agregar la tarea
    } catch (error) {
      console.error("Error al agregar tarea", error);
    }
  };

  const updateTask = async (id) => {
    if (!title || !description) {
      Swal.fire({
        title: 'Falta información',
        text: 'El título y la descripción son obligatorios.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
  
    try {
      await axios.put(`${API_URL}/tasks/Actualizar/${id}?action=ActualizarTarea`, {
        title,
        description,
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      fetchTasks();  // Recargar la lista de tareas actualizadas
      closeModal();  // Cerrar el modal y limpiar los datos
    } catch (error) {
      console.error("Error al actualizar tarea", error);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/ActualizarEstado/${id}?action=ActualizarEstado`, {
        status: newStatus  // Enviar el nuevo estado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      fetchTasks();  // Recargar la lista de tareas actualizadas
    } catch (error) {
      console.error("Error al actualizar tarea", error);
    }
  };
  
  
  
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('Pendiente');
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
    localStorage.removeItem('user');
    navigate('/');
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Tareas</h1>

      <div className="d-flex justify-content-between align-items-center">
        <Button className="logout-button" onClick={logout}>Cerrar Sesión</Button>
      </div>
      <Row>
      <Col md={4} className="p-3">
  <div className='juntos-vertical' style={{ justifyContent: 'flex-start' }}>
    <h3 className="mt-4" style={{marginLeft:'15px'}}>Mis Tareas</h3>
    <Button onClick={() => setShowModal(true)} className='add-button' style={{ marginLeft: '10px', marginTop: '20px', borderRadius:'50%' }}>
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  </div>
</Col>

      <Col md={4} className="p-3">
      {/* Listado de tareas */}

    {filteredTasks.length > 0 && (
            <div style={{marginTop:'20px'}} className="pagination, juntos-vertical">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <span>{currentPage} de {totalPages}</span>
              <Button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          )}
    </Col>
    <Col md={4} className="p-3">
    

<div className='juntos-vertical'>
            <h3 className="mt-4" >Filtrar tareas</h3>
            <Form.Select style={{width:'200px', marginLeft:'10px',marginTop:'20px'}}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </Form.Select>
         </div>
          </Col>
          </Row>
          <Col md={12} className="p-3">
    {currentTasks.length === 0 ? (
      <p>No hay tareas registradas.</p>
    ) : (
      // Ajustar el mapeo para que las tareas se distribuyan en 2 columnas y 3 filas
      <Row className="g-3">
        {currentTasks.map((task) => (
          <Col md={4} key={task._id}>  {/* 4 columnas en pantallas medianas => 2 columnas en pantallas grandes */}
            <Card className="task-card mb-3" style={{ width: '100%' }}>
              <Card.Body>
              <h5 style={{ textAlign: 'center' }}>{task.title}</h5>
              <p>{task.description}</p>
                <div className="task-actions">
                  {/* Selector para cambiar el estado */}
                  <Form.Select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}  // Cambiar estado de tarea
                    size="sm"
                    style={{ width: '150px' }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                  </Form.Select>

                  {/* Botón para eliminar tarea */}
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}  // Eliminar tarea
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    
                    size="sm"
                    className="edit-btn"
                    onClick={() => handleEditTask(task)}
                  >
                  <FontAwesomeIcon icon={faPencil} />                  
                  </Button>

                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )}
  </Col>

      {/* Modal para crear tarea */}
      <Modal show={showModal} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
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
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Cerrar
    </Button>
    <Button
      variant="primary"
      onClick={() => {
        if (editingTask) {
          updateTask(editingTask._id);
        } else {
          addTask();
        }
      }}
    >
      {editingTask ? 'Actualizar' : 'Guardar'}
    </Button>
  </Modal.Footer>
</Modal>



    </div>
  );
}

export default Tasks;
