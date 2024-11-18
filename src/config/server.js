import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Configuración de CORS - Política permisiva para desarrollo
app.use(cors({
    origin: '*', // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Permite todos los métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite estos headers
    credentials: true // Permite credenciales
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;
