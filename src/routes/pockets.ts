import { Hono } from "hono"
import { PocketController } from "../controllers/PocketController"

const pockets = new Hono()
const pocketController = new PocketController()

// Récupérer tous les pockets d'un utilisateur
pockets.get("/user/:userId", (c) => pocketController.getUserPockets(c))

// Créer un pocket pour un utilisateur
pockets.post("/user/:userId", (c) => pocketController.create(c))

// Supprimer un pocket
pockets.delete("/:id", (c) => pocketController.delete(c))

// Récupérer un pocket par son ID
pockets.get("/:id", (c) => pocketController.getById(c))

export default pockets
