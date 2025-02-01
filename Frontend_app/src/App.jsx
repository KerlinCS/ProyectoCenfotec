import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Tasks from './Tasks';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';  
import Swal from 'sweetalert2';


// URL base de la API
const API_URL = 'http://localhost:5005/v1'

// Componente de Login
function Login() {
  const [email, setEmail] = useState(''); // Estado para almacenar el email
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
  const navigate = useNavigate(); // Hook para la navegación de rutas

  // Función para manejar el login
  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }); // Enviar datos al backend
      localStorage.setItem('token', response.data.token); // Guardar token en el localStorage
      console.log("Login exitoso")
      navigate('/tasks') // Redirigir a la página de tareas
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Autenticación',
        text: 'El email o la contraseña son incorrectos.',
        confirmButtonColor: '#d33',
      });
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="text-center">Autenticación del Sistema</h1>
        <Card className="p-4">
          <Card.Body>
            <Form className="d-flex flex-column gap-4">
              <Form.Control
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualizar email
                className="input-field"
              />
              <Form.Control
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)} // Actualizar contraseña
                className="input-field"
              />
              <Button onClick={login} className="btn-primary w-100">
                Iniciar Sesión
              </Button>
              <Button onClick={() => navigate("/register")} className="btn-secondary w-100 mt-3">
                Crear Usuario
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

// Componente de Registro
function Register() {
  const [firstName, setFirstName] = useState(''); // Estado para almacenar el nombre
  const [lastName, setLastName] = useState(''); // Estado para almacenar el apellido
  const [email, setEmail] = useState(''); // Estado para almacenar el email
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
  const navigate = useNavigate(); // Hook para la navegación de rutas

  const register = async () => {
    if (password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña inválida',
        text: 'Debe tener al menos 8 caracteres.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
  
    try {
      const checkEmailResponse = await axios.get(`${API_URL}/auth/check-email`, { params: { email } });
  
      if (checkEmailResponse.data.exists) {
        Swal.fire({
          icon: 'error',
          title: 'Correo ya registrado',
          text: 'El correo electrónico ya está en uso. Intente con otro.',
          confirmButtonColor: '#d33',
        });
        return;
      }
  
      await axios.post(`${API_URL}/auth/register`, { first_name: firstName, last_name: lastName, email, password });
  
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Usuario registrado correctamente!',
        confirmButtonColor: '#28a745',
      }).then(() => {
        navigate('/'); // Redirigir al login después de cerrar la alerta
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Hubo un problema al registrar el usuario. Intente de nuevo más tarde.',
        confirmButtonColor: '#d33',
      });
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="text-center">Registro de Usuario</h1>
        <Card className="p-4">
          <Card.Body>
            <Form className="d-flex flex-column gap-4">
              <Form.Control
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} // Actualizar nombre
                className="input-field"
              />
              <Form.Control
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} // Actualizar apellido
                className="input-field"
              />
              <Form.Control
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualizar email
                className="input-field"
              />
              <Form.Control
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)} // Actualizar contraseña
                className="input-field"
              />
              <Button onClick={register} className="btn-primary w-100">
                Crear Cuenta
              </Button>
              <Button onClick={() => navigate("/")} className="btn-secondary w-100 mt-3">
                Volver al Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

// Página protegida
function ProtectedPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Verificar si el token existe

  if (!token) return <Navigate to="/" />; // Si no hay token, redirigir al login

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token'); // Eliminar token
    navigate('/') // Redirigir al login
  }

  return (
    <div>
      <h1>Login exitoso</h1>
      <Button onClick={logout}>Cerrar Sesion</Button>
    </div>
  )
}

// Componente principal de la aplicación
function App() {
  const [count, setCount] = useState(0) // Estado de ejemplo, no se usa en el código

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta para login */}
        <Route path="/register" element={<Register />} /> {/* Ruta para registro */}
        <Route path="/tasks" element={<Tasks />} /> {/* Ruta para tareas */}
        <Route path="/protected" element={<ProtectedPage />} /> {/* Ruta para la página protegida */}
      </Routes>
    </Router>
  )
}

export default App
