# Déploiement Nexo UI

## Build pour Production

L'application est conçue pour être buildée en fichiers statiques et embarquée dans le binaire Go du backend.

### Commande de build

```bash
npm run build
```

### Output

Le build génère les fichiers dans le dossier `dist/` :

```
dist/
├── index.html                    # Point d'entrée HTML
└── assets/
    ├── index-[hash].css         # Styles (~16 KB, ~4 KB gzippé)
    ├── index-[hash].js          # Code de l'application (~200 KB, ~66 KB gzippé)
    ├── vendor-[hash].js         # Dépendances externes (~175 KB, ~58 KB gzippé)
    └── editor-[hash].js         # Code de l'éditeur (~0.03 KB)
```

### Configuration pour l'embed Go

1. **Base path** : L'application est configurée pour être servie à la racine `/`
2. **API proxy** : Les requêtes vers `/api/*` sont automatiquement proxifiées vers le backend
3. **Routing** : L'application utilise React Router en mode HTML5 (pas de hash)

### Intégration Backend Go

Le backend Go doit :

1. Servir les fichiers statiques du dossier `dist/`
2. Servir l'API sous le préfixe `/api`
3. Rediriger toutes les routes non-API vers `index.html` (pour le routing client-side)

Exemple de configuration Go avec Fiber :

\`\`\`go
// Servir les fichiers statiques
app.Static("/", "./dist")

// API routes
api := app.Group("/api")
// ... vos routes API

// Fallback pour le routing client-side (doit être en dernier)
app.Get("*", func(c *fiber.Ctx) error {
    return c.SendFile("./dist/index.html")
})
\`\`\`

## Variables d'environnement

Aucune variable d'environnement n'est requise côté frontend. La configuration est statique :

- API base URL : `/api` (relatif)
- Authentication : JWT stocké dans localStorage

## Notes importantes

1. **CORS** : Si le frontend et le backend sont sur des domaines différents en développement, configurer CORS sur le backend
2. **JWT** : Le token est stocké dans `localStorage` sous la clé `auth_token`
3. **Dark mode** : La préférence de thème est stockée dans `localStorage` sous `theme`
4. **Current space** : L'espace actuel est stocké dans `localStorage` sous `current_space`

## Vérification du build

Pour tester le build en local :

```bash
npm run preview
```

Cela démarre un serveur de preview sur `http://localhost:4173`

## Optimisations

Le build inclut automatiquement :

- ✅ Minification JavaScript et CSS
- ✅ Tree-shaking (suppression du code non utilisé)
- ✅ Code splitting (vendor, app, editor)
- ✅ Hashing des fichiers (cache busting)
- ✅ Compression gzip
- ✅ Optimisation des images

## Taille du bundle

- **Total** : ~390 KB (~128 KB gzippé)
- **First Load** : ~175 KB (vendor chunk)
- **Excellent score** pour une application moderne avec React + Router + TanStack Query + Radix UI

## Compatibilité navigateurs

L'application est compatible avec :

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Tous les navigateurs modernes supportant ES2020
