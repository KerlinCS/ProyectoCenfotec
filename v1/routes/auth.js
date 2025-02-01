import express from "express";
import { Register, Login } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import User from "../models/User.js"; // Asegúrate de importar el modelo de usuario

const router = express.Router();

// Verificar si el email ya está registrado -- GET request
router.get("/check-email", async (req, res) => {
    try {
        const { email } = req.query; // Obtener el email de la URL
        if (!email) {
            return res.status(400).json({ message: "Email es requerido" });
        }

        const user = await User.findOne({ email }); // Buscar en la base de datos
        return res.json({ exists: !!user }); // Retorna { exists: true } si el email existe
    } catch (error) {
        console.error("Error al verificar email:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

// Register route -- POST request
router.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("first_name")
        .not()
        .isEmpty()
        .withMessage("Your first name is required")
        .trim()
        .escape(),
    check("last_name")
        .not()
        .isEmpty()
        .withMessage("Your last name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    Validate,
    Register
);

// Login route -- POST request
router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    Login
);

export default router;
