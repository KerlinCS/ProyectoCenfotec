import Auth from './auth.js';
import Tasks from "./tasks.js";

const Router = (server) => {
    // home route with the get method and a handler
    server.get("/v1", (req, res) => {
        try {
            res.status(200).json({
                status: "success",
                data: [],
                message: "Welcome to our API homepage!",
            });
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    })

    server.use("/v1/auth", Auth);
    server.use("/v1/tasks", Tasks);

    };
    export default Router;

    