import { Context } from "hono"
import { NoteService } from "../services/NoteService"

const noteService = new NoteService()

export class NoteController {
	async getUserNotes(c: Context) {
		try {
			const userId = c.req.param("userId")
			const notes = await noteService.findByUserId(userId)
			return c.json(notes)
		} catch (error) {
			return c.json({ error: "Erreur lors de la récupération des notes" }, 500)
		}
	}

	async create(c: Context) {
		try {
			const userId = c.req.param("userId")
			const { note } = await c.req.json<{ note: number }>()

			if (note < 0 || note > 5) {
				return c.json({ error: "La note doit être comprise entre 0 et 5" }, 400)
			}

			const newNote = await noteService.create({ userId, note })
			return c.json(newNote, 201)
		} catch (error) {
			return c.json({ error: "Erreur lors de la création de la note" }, 500)
		}
	}

	async delete(c: Context) {
		try {
			const id = c.req.param("id")
			await noteService.delete(id)
			return c.json({ message: "Note supprimée avec succès" })
		} catch (error) {
			return c.json({ error: "Erreur lors de la suppression de la note" }, 500)
		}
	}

	async getUserAverage(c: Context) {
		try {
			const userId = c.req.param("userId")
			const average = await noteService.getAverageByUserId(userId)
			return c.json({ average })
		} catch (error) {
			return c.json({ error: "Erreur lors du calcul de la moyenne" }, 500)
		}
	}
}
