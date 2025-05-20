import { Hono } from "hono"
import { SpotController } from "../controllers/SpotController"
import { uploadSingle } from "../middleware/upload"

const spots = new Hono()
const spotController = new SpotController()

// Liste tous les spots
spots.get("/", (c) => spotController.getAll(c))

// Récupère un spot par son ID
spots.get("/:id", (c) => spotController.getById(c))

// Liste tous les spots d'un utilisateur
spots.get("/user/:userId", (c) => spotController.getUserSpots(c))

// Crée un nouveau spot
spots.post("/", (c) => spotController.create(c))

// Ajoute une photo à un spot
spots.post("/:id/photo", uploadSingle("photo"), async (c) => {
	return spotController.addSpotPhoto(c)
})

// Met à jour un spot
spots.put("/:id", (c) => spotController.update(c))

// Supprime un spot
spots.delete("/:id", (c) => spotController.delete(c))

// Ajoute aux favoris
spots.post("/:id/favorites", (c) => spotController.addToFavorites(c))

export default spots
