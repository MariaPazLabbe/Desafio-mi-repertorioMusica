
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
// Ruta para obtener el contenido del archivo repertorios.json
app.get("/canciones", (req, res) => {
  // Si ocurre un error al leer el archivo, se muestra un mensaje de error específico
  fsp
    .readFile("repertorios.json", "utf8")
    .then((data) => {
      const canciones = JSON.parse(data);
      res.json(canciones);
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        res.json({ message: "El archivo repertorios.json no existe" });
      } else if (error instanceof SyntaxError) {
        res.json({
          message: "El archivo repertorios.json tiene un formato inválido",
        });
      } else {
        res.json({ message: "El recurso no esta disponible" });
      }
    });
});

// Ruta para agregar una canción al archivo repertorios.json
app.post("/canciones", (req, res) => {
  const cancion = req.body;
  console.log(cancion);

  // Si ocurre un error al leer el archivo, se muestra un mensaje de error específico
  fsp
    .readFile("repertorios.json", "utf8")
    .then((data) => {
      const canciones = JSON.parse(data);
      // Si ocurre un error al escribir el archivo, se muestra un mensaje de error específico
      return fsp.writeFile(
        "repertorios.json",
        JSON.stringify([...canciones, cancion])
      );
    })
    .then(() => {
      res.send("cancion agregada");
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        res.json({ message: "El archivo repertorios.json no existe" });
      } else if (error instanceof SyntaxError) {
        res.json({
          message: "El archivo repertorios.json tiene un formato inválido",
        });
      } else {
        res.json({ message: "El recurso no esta disponible" });
      }
    });
});

// Ruta para actualizar una canción en el archivo repertorios.json
app.put("/canciones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cancion = req.body;
  console.log(cancion);
  cancion.id = parseInt(cancion.id);
  console.log("id: ", id);

  // Validar que el ID de la canción sea un número entero válido
  if (!Number.isInteger(id)) {
    return res.status(400).json({
      message: "El ID de la canción debe ser un número entero válido",
    });
  }

  // Si ocurre un error al leer el archivo, se muestra un mensaje de error específico
  fsp
    .readFile("repertorios.json", "utf8")
    .then((data) => {
      const canciones = JSON.parse(data);

      const encontrarCancion = canciones.findIndex(
        (cancion) => cancion.id === id
      );

      if (encontrarCancion === -1) {
        return res.status(404).json({
          message: "La canción no se ha encontrado",
        });
      }

      canciones[encontrarCancion] = cancion;
      console.log("canciones: ", canciones);
      // Si ocurre un error al escribir el archivo, se muestra un mensaje de error específico
      return fsp.writeFile("repertorios.json", JSON.stringify(canciones));
    })
    .then(() => {
      res.send("cancion actualizada");
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        res.json({ message: "El archivo repertorios.json no existe" });
      } else if (error instanceof SyntaxError) {
        res.json({
          message: "El archivo repertorios.json tiene un formato inválido",
        });
      } else {
        res.json({ message: "El recurso no esta disponible" });
      }
    });
});

// Ruta para eliminar una canción del archivo repertorios.json
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;

  // Si ocurre un error al leer el archivo, se muestra un mensaje de error específico
  fsp
    .readFile("repertorios.json", "utf8")
    .then((data) => {
      const canciones = JSON.parse(data);
      const index = canciones.findIndex(
        (cancion) => cancion.id === parseInt(id)
      );
      console.log(index);
      if (index === -1) {
        return res
          .status(404)
          .json({ message: "no se encuentra la canción en la lista" });
      }

      canciones.splice(index, 1);
      // Si ocurre un error al escribir el archivo, se muestra un mensaje de error específico
      return fsp.writeFile("repertorios.json", JSON.stringify(canciones));
    })
    .then(() => {
      res.send("cancion eliminada");
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        res.json({ message: "El archivo repertorios.json no existe" });
      } else if (error instanceof SyntaxError) {
        res.json({
          message: "El archivo repertorios.json tiene un formato inválido",
        });
      } else {
        res.json({ message: "El recurso no esta disponible" });
      }
    });
});
