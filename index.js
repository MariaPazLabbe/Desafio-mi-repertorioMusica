
const fs = require("fs-extra");
const fsp = fs.promises;
const express = require("express");
const app = express();
const cors = require("cors");

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});

// Permitir el uso de json en las solicitudes y habilitar CORS
app.use(express.json());
app.use(cors());

// Middleware para validar los campos de la canción enviada en las rutas POST y PUT
app.use((req, res, next) => {
  const cancion = req.body;
  // Si algún campo de la canción está vacío, se muestra un mensaje de error
  if (Object.values(cancion).some((value) => value === "")) {
    return res.status(400).json({ message: "Falta completar un campo " });
  }
  next();
});
// Ruta para mostrar el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
