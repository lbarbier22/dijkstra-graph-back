# 🔧 Backend — Visualisation de l'algorithme de Dijkstra 🧠

Bienvenue dans la partie **backend** du projet de visualisation de l'algorithme de Dijkstra 🚀

Ce serveur Node.js/Express expose plusieurs routes permettant de :
- Gérer les graphes (aléatoires ou personnalisés)
- Appliquer l'algorithme de Dijkstra
- Recevoir ou générer du GeoJSON

---

## 📦 Installation

### 🛠️ Prérequis

- Node.js v18+
- npm

### 📥 Installation des dépendances

```bash
npm install
```

---

## 🚀 Démarrer le serveur

```bash
npm run start
```

Par défaut, le serveur tourne sur :  
👉 [http://localhost:3000](http://localhost:3000)

---

## 📡 API disponibles

### `GET /api/graph`
📄 Récupère le graphe actuellement chargé en mémoire

### `GET /api/graph/random?numberOfNodes=50`
🧮 Génère un graphe aléatoire de `numberOfNodes` sommets

### `POST /api/graph/generate`
📥 Envoie un GeoJSON (uniquement LineString) pour le transformer en graphe exploitable  
**Body :**
```json
{
  "geoJson": {
    "type": "FeatureCollection",
    "features": [...]
  }
}
```

### `POST /api/dijkstra`
🔍 Calcule le plus court chemin à l’aide de Dijkstra  
**Body :**
```json
{
  "start": "A",
  "end": "B",
  "step": ["C", "D"]
}
```

---

## 🧪 Tests

Lancer les tests backend avec :

```bash
npm run test
```

Utilise `Vitest` + `Supertest` pour tester les routes Express et les services.

---

## 🧠 Fonctionnement de Dijkstra

L'algorithme cherche le chemin le plus court dans un graphe pondéré, en partant d’un nœud source vers un nœud cible, optionnellement en passant par des étapes intermédiaires (`step`).

---

## 📁 Structure des dossiers

```
.
├── routes/        # Routes Express
├── service/       # Algorithmes & logique
├── data/          # Graphe initial
├── test/          # Tests unitaires & intégration
```

---

## ❤️ Merci

Développé avec ❤️ pour visualiser et comprendre les algorithmes de graphes 🧩  
Contributions et feedbacks bienvenus !
