import jwt from "jsonwebtoken";

const JWT_SECRET = "mi_clave_secreta"; // ⚠️ Usa variables de entorno en producción

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Obtiene el token desde los headers

    if (!token) {
        return res.status(401).json({ success: false, message: "Acceso denegado, token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verifica el token
        req.userId = decoded.id; // Guarda el userId en la solicitud para que los controladores lo usen
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Token inválido o expirado" });
    }
};

export default verifyToken;
