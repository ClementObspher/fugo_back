import { Hono } from "hono"

const openapi = new Hono()

openapi.get("/openapi.json", (c) => {
	return c.json({
		openapi: "3.0.0",
		info: {
			title: "API Fugo",
			version: "1.0.0",
			description: "API pour l'application Fugo",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Serveur de développement",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				Error: {
					type: "object",
					properties: {
						error: {
							type: "string",
							description: "Message d'erreur",
						},
						code: {
							type: "string",
							description: "Code d'erreur",
							enum: ["UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "VALIDATION_ERROR", "INTERNAL_ERROR"],
						},
						details: {
							type: "object",
							description: "Détails supplémentaires sur l'erreur",
						},
					},
				},
				User: {
					type: "object",
					properties: {
						id: { type: "string" },
						email: { type: "string", format: "email" },
						name: { type: "string" },
						avatar: { type: "string", format: "uri" },
					},
				},
				Spot: {
					type: "object",
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						latitude: { type: "number" },
						longitude: { type: "number" },
						photos: {
							type: "array",
							items: { type: "string", format: "uri" },
						},
					},
				},
				Pocket: {
					type: "object",
					properties: {
						id: { type: "string" },
						userId: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
					},
				},
				Note: {
					type: "object",
					properties: {
						id: { type: "string" },
						userId: { type: "string" },
						value: { type: "number", minimum: 0, maximum: 5 },
						comment: { type: "string" },
					},
				},
			},
			responses: {
				UnauthorizedError: {
					description: "Non autorisé",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				ForbiddenError: {
					description: "Accès interdit",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				NotFoundError: {
					description: "Ressource non trouvée",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				ValidationError: {
					description: "Erreur de validation",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				InternalError: {
					description: "Erreur serveur",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
			},
		},
		paths: {
			"/api/auth/login": {
				post: {
					tags: ["Authentification"],
					summary: "Connexion utilisateur",
					description: "Permet à un utilisateur de se connecter avec son email et son mot de passe",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["email", "password"],
									properties: {
										email: {
											type: "string",
											format: "email",
											description: "Email de l'utilisateur",
										},
										password: {
											type: "string",
											format: "password",
											description: "Mot de passe de l'utilisateur",
										},
									},
								},
							},
						},
					},
					responses: {
						"200": {
							description: "Connexion réussie",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											token: {
												type: "string",
												description: "JWT token d'authentification",
											},
										},
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/users": {
				get: {
					tags: ["Utilisateurs"],
					summary: "Liste tous les utilisateurs",
					security: [{ bearerAuth: [] }],
					responses: {
						"200": {
							description: "Liste des utilisateurs récupérée avec succès",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: { $ref: "#/components/schemas/User" },
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				post: {
					tags: ["Utilisateurs"],
					summary: "Crée un nouvel utilisateur",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					responses: {
						"201": {
							description: "Utilisateur créé avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/users/{id}": {
				get: {
					tags: ["Utilisateurs"],
					summary: "Récupère un utilisateur par son ID",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Utilisateur trouvé",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				put: {
					tags: ["Utilisateurs"],
					summary: "Met à jour un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					responses: {
						"200": {
							description: "Utilisateur mis à jour",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				delete: {
					tags: ["Utilisateurs"],
					summary: "Supprime un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					responses: {
						"204": {
							description: "Utilisateur supprimé avec succès",
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/users/{id}/avatar": {
				post: {
					tags: ["Utilisateurs"],
					summary: "Met à jour l'avatar d'un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"multipart/form-data": {
								schema: {
									type: "object",
									properties: {
										avatar: {
											type: "string",
											format: "binary",
										},
									},
								},
							},
						},
					},
					responses: {
						"200": {
							description: "Avatar mis à jour",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/users/{id}/friends": {
				post: {
					tags: ["Utilisateurs"],
					summary: "Ajoute un ami",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										friendId: {
											type: "string",
											description: "ID de l'ami à ajouter",
										},
									},
								},
							},
						},
					},
					responses: {
						"201": {
							description: "Ami ajouté avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/spots": {
				get: {
					tags: ["Spots"],
					summary: "Liste tous les spots",
					security: [{ bearerAuth: [] }],
					responses: {
						"200": {
							description: "Liste des spots récupérée avec succès",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: { $ref: "#/components/schemas/Spot" },
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				post: {
					tags: ["Spots"],
					summary: "Crée un nouveau spot",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Spot" },
							},
						},
					},
					responses: {
						"201": {
							description: "Spot créé avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Spot" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/spots/{id}": {
				get: {
					tags: ["Spots"],
					summary: "Récupère un spot par son ID",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du spot",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Spot trouvé",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Spot" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				put: {
					tags: ["Spots"],
					summary: "Met à jour un spot",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du spot",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Spot" },
							},
						},
					},
					responses: {
						"200": {
							description: "Spot mis à jour",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Spot" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				delete: {
					tags: ["Spots"],
					summary: "Supprime un spot",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du spot",
							schema: { type: "string" },
						},
					],
					responses: {
						"204": {
							description: "Spot supprimé avec succès",
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/spots/{id}/photos": {
				post: {
					tags: ["Spots"],
					summary: "Ajoute une photo à un spot",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du spot",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"multipart/form-data": {
								schema: {
									type: "object",
									properties: {
										photo: {
											type: "string",
											format: "binary",
										},
									},
								},
							},
						},
					},
					responses: {
						"200": {
							description: "Photo ajoutée avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Spot" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/spots/{id}/favorites": {
				post: {
					tags: ["Spots"],
					summary: "Ajoute un spot aux favoris",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du spot",
							schema: { type: "string" },
						},
					],
					responses: {
						"201": {
							description: "Spot ajouté aux favoris",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Spot" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/pockets/user/{userId}": {
				get: {
					tags: ["Pockets"],
					summary: "Récupère tous les pockets d'un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Liste des pockets récupérée",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: { $ref: "#/components/schemas/Pocket" },
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				post: {
					tags: ["Pockets"],
					summary: "Crée un pocket pour un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Pocket" },
							},
						},
					},
					responses: {
						"201": {
							description: "Pocket créé avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Pocket" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/pockets/{id}": {
				get: {
					tags: ["Pockets"],
					summary: "Récupère un pocket par son ID",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du pocket",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Pocket trouvé",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Pocket" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				delete: {
					tags: ["Pockets"],
					summary: "Supprime un pocket",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID du pocket",
							schema: { type: "string" },
						},
					],
					responses: {
						"204": {
							description: "Pocket supprimé avec succès",
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/notes/user/{userId}": {
				get: {
					tags: ["Notes"],
					summary: "Récupère toutes les notes d'un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Liste des notes récupérée",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: { $ref: "#/components/schemas/Note" },
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
				post: {
					tags: ["Notes"],
					summary: "Crée une note pour un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Note" },
							},
						},
					},
					responses: {
						"201": {
							description: "Note créée avec succès",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Note" },
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"422": {
							$ref: "#/components/responses/ValidationError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/notes/user/{userId}/average": {
				get: {
					tags: ["Notes"],
					summary: "Obtenir la moyenne des notes d'un utilisateur",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							description: "ID de l'utilisateur",
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Moyenne calculée",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											average: {
												type: "number",
												description: "Moyenne des notes",
											},
										},
									},
								},
							},
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
			"/api/notes/{id}": {
				delete: {
					tags: ["Notes"],
					summary: "Supprime une note",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "ID de la note",
							schema: { type: "string" },
						},
					],
					responses: {
						"204": {
							description: "Note supprimée avec succès",
						},
						"401": {
							$ref: "#/components/responses/UnauthorizedError",
						},
						"403": {
							$ref: "#/components/responses/ForbiddenError",
						},
						"404": {
							$ref: "#/components/responses/NotFoundError",
						},
						"500": {
							$ref: "#/components/responses/InternalError",
						},
					},
				},
			},
		},
	})
})

export default openapi
