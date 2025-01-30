import User from "../models/User.js";
import bcrypt from "bcrypt";
/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { first_name, last_name, email, password } = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            first_name,
            last_name,
            email,
            password,
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        const { role, ...user_data } = savedUser._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}


import jwt from "jsonwebtoken"; // Asegúrese de instalarlo con `npm install jsonwebtoken`

const JWT_SECRET = "mi_clave_secreta"; // Use una clave segura en variables de entorno

export async function Login(req, res) {
    const { email, password } = req.body;

    try {
        // Buscar usuario
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password.",
            });

        // Validar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password.",
            });

        // Generar el token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            JWT_SECRET,
            { expiresIn: "1h" } // Expira en 1 hora
        );

        // Devolver usuario y token
        const { password: _, ...user_data } = user._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            token,  // 🔹 Ahora devuelve el token
            message: "You have successfully logged in.",
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

