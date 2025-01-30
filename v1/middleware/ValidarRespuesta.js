import { validationResult } from "express-validator";

const ValidatarRespuesta = (res, next) => {
    const errors = validationResult(res);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};

export default ValidatarRespuesta;