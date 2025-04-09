import { Hono } from "hono"
import { UserController } from "../controllers/UserController"
import upload from "../middleware/upload"

const users = new Hono()
const userController = new UserController()

// Liste tous les utilisateurs
users.get("/", (c) => userController.getAll(c))

// Récupère un utilisateur par son ID
users.get("/:id", (c) => userController.getById(c))

// Crée un nouvel utilisateur
users.post("/", (c) => userController.create(c))

// Met à jour l'avatar d'un utilisateur
users.post("/:id/avatar", upload.single("avatar"), async (c) => {
	return userController.updateAvatar(c)
})

// Met à jour un utilisateur
users.put("/:id", (c) => userController.update(c))

// Supprime un utilisateur
users.delete("/:id", (c) => userController.delete(c))

// Ajoute un ami
users.post("/:id/friends", (c) => userController.addFriend(c))

export default users
