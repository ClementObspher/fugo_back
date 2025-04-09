import { Note } from "../generated/prisma"
import prisma from "../lib/prisma"

export class NoteService {
	async findByUserId(userId: string): Promise<Note[]> {
		return prisma.note.findMany({
			where: { userId },
		})
	}

	async create(data: { userId: string; note: number }): Promise<Note> {
		return prisma.note.create({
			data: {
				userId: data.userId,
				note: data.note,
				date: new Date(),
			},
		})
	}

	async delete(id: string): Promise<Note> {
		return prisma.note.delete({
			where: { id },
		})
	}

	async getAverageByUserId(userId: string): Promise<number> {
		const notes = await prisma.note.findMany({
			where: { userId },
		})

		if (notes.length === 0) return 0

		const sum = notes.reduce((acc, note) => acc + note.note, 0)
		return sum / notes.length
	}
}
