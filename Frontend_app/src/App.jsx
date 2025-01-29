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



const API_URL = 'http://localhost:5005/v1'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      console.log("Login exitoso")
      navigate('/tasks')
    } catch (error) {
      console.error("El password o el email son incorrectos")
    }
  }

  return (
    <div className=''>
      <h1>Autenticacion del Sistema</h1>
      <Card className='p-3 w-100'>
        <Card.Body>
          <Form className='d-flex flex-column gap-4'>
            <Form.Control
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)
              } />
            <Form.Control
              placeholder="Password"
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)
              } />
            <Button onClick={login}>Iniciar Sesion</Button>
            <Button onClick={() => navigate("/register")}>Crear Usuario</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`,
                                         { 'first_name': firstName,
                                          'last_name': lastName,
                                          email, 
                                          password })
      console.log("Usuario registrado exitosamente")
      navigate('/')
    } catch (error) {
      console.error("Error al registrar usuario")
    }
  }

  return (
    <div className=''>
    <h1>Registro de Usuario</h1>
    <Card className='p-3 w-100'>
      <Card.Body>
        <Form className='d-flex flex-column gap-4'>
          <Form.Control
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)
            } />
          <Form.Control
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)
            } />
          <Form.Control
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)
            } />
          <Form.Control
            placeholder="Password"
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)
            } />
          <Button onClick={register}>Crear Cuenta</Button>
          <Button onClick={() => navigate("/")}>Volver al Login</Button>
        </Form>
      </Card.Body>
    </Card>
  </div>
  )
}

function ProtectedPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/" />;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/')
  }

  return (
    <div>
      <h1>Login exitoso</h1>
      <Button onClick={logout}>Cerrar Sesion</Button>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/protected" element={<ProtectedPage />} />
      </Routes>
    </Router>
  )
}

export default App
