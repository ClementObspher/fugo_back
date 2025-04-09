import { Context } from "hono"
import { PocketService } from "../services/PocketService"

const pocketService = new PocketService()

export class PocketController {
	async getUserPockets(c: Context) {
		try {
			const userId = c.req.param("userId")
			const pockets = await pocketService.findByUserId(userId)
			return c.json(pockets)
		} catch (error) {
			return c.json({ error: "Erreur lors de la récupération des pockets" }, 500)
		}
	}

	async create(c: Context) {
		try {
			const userId = c.req.param("userId")
			const pocket = await pocketService.create(userId)
			return c.json(pocket, 201)
		} catch (error) {
			return c.json({ error: "Erreur lors de la création du pocket" }, 500)
		}
	}

	async delete(c: Context) {
		try {
			const id = c.req.param("id")
			await pocketService.delete(id)
			return c.json({ message: "Pocket supprimé avec succès" })
		} catch (error) {
			return c.json({ error: "Erreur lors de la suppression du pocket" }, 500)
		}
	}

	async getById(c: Context) {
		try {
			const id = c.req.param("id")
			const pocket = await pocketService.findById(id)

			if (!pocket) {
				return c.json({ error: "Pocket non trouvé" }, 404)
			}

			return c.json(pocket)
		} catch (error) {
			return c.json({ error: "Erreur lors de la récupération du pocket" }, 500)
		}
	}
}
