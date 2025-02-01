Proyecto de Gestión de Tareas
Descripción del Proyecto
Este proyecto permite a los usuarios gestionar tareas. Incluye funcionalidad para crear, actualizar, eliminar y obtener tareas. La aplicación está dividida en un backend (API RESTful) y un frontend. Los usuarios se registran, inician sesión y pueden gestionar sus propias tareas.

Tecnologías Utilizadas
Backend:
Node.js: Entorno de ejecución para JavaScript.
Express.js: Framework web para construir la API.
MongoDB: Base de datos NoSQL para almacenar los datos de las tareas y usuarios.
JWT (JSON Web Token): Para la autenticación y autorización de usuarios.
bcrypt.js: Para encriptar las contraseñas.
Frontend:
React.js: Librería para construir interfaces de usuario.
Axios: Cliente HTTP para interactuar con la API.
React Router: Para la navegación dentro de la aplicación.
Instalación
Backend
Clonar el repositorio:

git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio/backend
Instalar dependencias: Asegúrate de tener Node.js instalado. Puedes verificarlo con node -v y npm -v.

npm install
Configurar variables de entorno: Crea un archivo .env en la raíz del backend y agrega las siguientes variables:

URI=mongodb+srv://kerlin:cenfo1234@proyecto.gevzh.mongodb.net/?retryWrites=true&w=majority&appName=proyecto
PORT= 5005
SECRET_ACCESS_TOKEN=secret

Iniciar el servidor:

npm run dev
El servidor estará disponible en http://localhost:5005.

Frontend
Clonar el repositorio:

git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio/frontend
Instalar dependencias: Asegúrate de tener Node.js instalado.

npm install
Iniciar la aplicación React:

npm run dev
El frontend estará disponible en http://localhost:5173.

Funcionalidades Principales
Autenticación de Usuarios: Registro, inicio de sesión y protección de rutas mediante JWT.
Gestión de Tareas: Crear, editar, eliminar y listar tareas.
Filtrado de Tareas por Usuario: Los usuarios solo pueden ver y modificar sus propias tareas.
Documentación de la API
Autenticación
Registro de Usuario
Método: POST
Ruta: /api/auth/register
Descripción: Registra un nuevo usuario.

Cuerpo de la solicitud:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
Respuesta exitosa:

{
  "status": "success",
  "data": [ /* Datos del usuario */ ],
  "message": "Cuenta creada exitosamente."
}
Inicio de Sesión de Usuario
Método: POST
Ruta: /api/auth/login
Descripción: Inicia sesión con un usuario registrado.
Cuerpo de la solicitud:

{
  "email": "john.doe@example.com",
  "password": "password123"
}

Respuesta exitosa:
{
  "status": "success",
  "data": [ /* Datos del usuario */ ],
  "token": "jwt_token_aqui",
  "message": "Inicio de sesión exitoso."
}
Tareas
Crear una Tarea
Método: POST
Ruta: /api/tasks/Agregar
Descripción: Crea una nueva tarea.
Headers:
Authorization: Bearer <jwt_token>
Cuerpo de la solicitud:

{
  "title": "Comprar pan",
  "description": "Ir al supermercado",
  "status": "Pendiente"
}
Respuesta exitosa:

{
  "success": true,
  "data": {
    "title": "Comprar pan",
    "description": "Ir al supermercado",
    "status": "Pendiente",
    "userId": "usuario_id"
  }
}
Obtener Todas las Tareas
Método: GET
Ruta: /api/tasks/ObtenerTodos
Descripción: Obtiene todas las tareas del usuario autenticado.
Headers:
Authorization: Bearer <jwt_token>
Respuesta exitosa:

{
  "success": true,
  "data": [
    {
      "title": "Comprar pan",
      "description": "Ir al supermercado",
      "status": "Pendiente",
      "userId": "usuario_id"
    },
    {
      "title": "Lavar ropa",
      "description": "Lavar la ropa del hogar",
      "status": "En Progreso",
      "userId": "usuario_id"
    }
  ]
}
Actualizar una Tarea
Método: PUT
Ruta: /api/tasks/Actualizar/:id
Descripción: Actualiza el estado, título o descripción de una tarea.
Headers:
Authorization: Bearer <jwt_token>
Cuerpo de la solicitud:

{
  "status": "Completada"
}
Respuesta exitosa:

{
  "success": true,
  "data": {
    "status": "Completada"
  }
}
Eliminar una Tarea
Método: DELETE
Ruta: /api/tasks/Eliminar/:id
Descripción: Elimina una tarea.
Headers:
Authorization: Bearer <jwt_token>
Respuesta exitosa:

{
  "success": true,
  "message": "Tarea eliminada correctamente."
}