import { Hono } from "hono"
import { NoteController } from "../controllers/NoteController"

const notes = new Hono()
const noteController = new NoteController()

// Récupérer toutes les notes d'un utilisateur
notes.get("/user/:userId", (c) => noteController.getUserNotes(c))

// Créer une note pour un utilisateur
notes.post("/user/:userId", (c) => noteController.create(c))

// Supprimer une note
notes.delete("/:id", (c) => noteController.delete(c))

// Obtenir la moyenne des notes d'un utilisateur
notes.get("/user/:userId/average", (c) => noteController.getUserAverage(c))

export default notes
