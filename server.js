// Importaciones necesarias
const express = require("express");
const cors = require("cors"); // Permitir solicitudes desde otros orígenes
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite parsear JSON en las solicitudes

// Ruta para manejar la asistencia y generar el token del QR
app.post("/registrar-asistencia", (req, res) => {
    // Datos enviados desde el frontend
    const attendanceData = req.body;

    // Genera un token o código único para el QR (puedes personalizarlo)
    const token = `QR-${Math.random().toString(36).substring(2, 15)}`;

    console.log("Datos de asistencia recibidos:", attendanceData); // Para verificar en consola

    // Envía el token de vuelta al frontend
    res.json({ token });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en https://qrasistencia-production.up.railway.app/:${PORT}`);
});
