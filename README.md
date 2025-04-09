To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

# Démarrer la BDD

```sh
docker-compose up -d
```

# Arrêter la BDD

```sh
docker-compose down
```

# Voir les logs

```sh
docker-compose logs -f
```

# Générer le client après modification du schéma

```sh
bunx prisma generate
```

# Créer une nouvelle migration

```sh
bunx prisma migrate dev --name nom_migration
```

# Voir l'état de la BDD

```sh
bunx prisma studio
```
