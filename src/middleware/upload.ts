import multer from "multer"
import { Context, Next } from "hono"
import { Request } from "express"

const storage = multer.memoryStorage()
const multerUpload = multer({ storage })

export const uploadSingle = (fieldName: string) => {
	return async (c: Context, next: Next) => {
		try {
			const upload = multerUpload.single(fieldName)
			await new Promise((resolve, reject) => {
				upload(c.req.raw as unknown as Request, {} as any, (err: any) => {
					if (err) reject(err)
					else resolve(true)
				})
			})
			await next()
		} catch (error) {
			return c.json({ error: "Erreur lors de l'upload du fichier" }, 400)
		}
	}
}

export default {
	single: uploadSingle,
}
