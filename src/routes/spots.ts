import { Hono } from "hono"
import { SpotController } from "../controllers/SpotController"
import upload from "../middleware/upload"

const spots = new Hono()
const spotController = new SpotController()

// Liste tous les spots
spots.get("/", (c) => spotController.getAll(c))

// Récupère un spot par son ID
spots.get("/:id", (c) => spotController.getById(c))

// Crée un nouveau spot
spots.post("/", (c) => spotController.create(c))

// Ajoute une photo à un spot
spots.post("/:id/photos", upload.single("photo"), async (c) => {
	return spotController.addSpotPhoto(c)
})

// Met à jour un spot
spots.put("/:id", (c) => spotController.update(c))

// Supprime un spot
spots.delete("/:id", (c) => spotController.delete(c))

// Ajoute aux favoris
spots.post("/:id/favorites", (c) => spotController.addToFavorites(c))

export default spots
