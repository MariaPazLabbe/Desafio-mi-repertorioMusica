const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.sendFile(__dirname + "/index.html");
  } catch (error) {
    res.json({ message: "El recurso no esta disponible " });
  }
});

app.get("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    res.json(canciones);
  } catch (error) {
    res.json({ message: "El recurso no esta disponible " });
  }
});

app.post("/canciones", (req, res) => {
  try {
    const cancion = req.body;
    console.log(cancion);

    if (Object.values(cancion).some((value) => value === "")) {
      return res.status(400).json({ message: "Falta completar un campo " });
    }

    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    fs.writeFileSync(
      "repertorios.json",
      JSON.stringify([...canciones, cancion])
    );
    res.send("cancion agregada");
  } catch (error) {
    res.json({ message: "El recurso no esta disponible " });
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    const cancion = req.body;

    if (Object.values(cancion).some((value) => value === "")) {
      return res.status(400).json({ message: "Falta completar un campo " });
    }

    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    const index = canciones.findIndex((cancion) => cancion.id === parseInt(id));
    console.log(index);
    if (index === -1) {
      return res
        .status(404)
        .json({ message: "no se encuetra la cancion en la lista" });
    }

    canciones[index] = cancion;

    fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
    res.send("cancion actualizada");
  } catch (error) {
    res.json({ message: "El recurso no esta disponible " });
  }
});

app.delete("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;

    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    const index = canciones.findIndex((cancion) => cancion.id === parseInt(id));

    console.log(index);

    if (index === -1) {
      return res.status(404).json({
        message: "El recurso que desea eliminar no se encuetra en la lista",
      });
    }

    canciones.splice(index, 1);
    fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
    res.send("cancion eliminada");
  } catch (error) {
    res.json({ message: "El recurso no esta disponible " });
  }
});

app.listen(3000, console.log("encendido"));