const express = require("express");
const crypto = require("crypto");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
const port = 3000;
const tokens = new Set(); // Almacena tokens válidos temporalmente

app.use(express.json());

// Generar un token único para cada sesión de QR
app.get("/generate-token", (req, res) => {
    const token = crypto.randomBytes(16).toString("hex");
    tokens.add(token);
    res.json({ token });
});

// Validar el token y registrar la asistencia en Excel
app.post("/register", (req, res) => {
    const { token, career, professor, subject } = req.body;
    if (!tokens.has(token)) {
        return res.status(400).json({ error: "Token inválido o ya usado" });
    }

    tokens.delete(token); // Token se elimina tras un uso exitoso

    // Registro de asistencia en Excel
    let workbook;
    if (fs.existsSync("Asistencias.xlsx")) {
        workbook = XLSX.readFile("Asistencias.xlsx");
    } else {
        workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Carrera", "Profesor", "Materia", "Fecha", "Hora"]]), "Asistencia");
    }

    const worksheet = workbook.Sheets["Asistencia"];
    const newRow = [[career, professor, subject, new Date().toLocaleDateString(), new Date().toLocaleTimeString()]];
    XLSX.utils.sheet_add_aoa(worksheet, newRow, { origin: -1 });
    XLSX.writeFile(workbook, "Asistencias.xlsx");

    res.json({ message: "Asistencia registrada correctamente." });
});

// Inicia el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});

});
