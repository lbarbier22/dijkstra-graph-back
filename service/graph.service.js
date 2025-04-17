let lastGeneratedGraph = null;
const initGeneratedGraph = generateRandomGraph(30);


function normalizeGeoJsonFromLinesOnly(inputGeoJson) {
    const coordToId = new Map()
    const pointFeatures = []
    const edgeFeatures = []

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let counter = 0

    // Associer chaque coordonnée à un ID
    const assignId = (coord) => {
        const key = coord.join(',')
        if (coordToId.has(key)) return coordToId.get(key)

        const letter = letters[counter % letters.length]
        const suffix = counter >= letters.length ? Math.floor(counter / letters.length) : ''
        const id = `${letter}${suffix}`

        coordToId.set(key, id)
        pointFeatures.push({
            type: 'Feature',
            properties: { id },
            geometry: {
                type: 'Point',
                coordinates: coord
            }
        })
        counter++
        return id
    }

    // Pour chaque LineString : récupérer les deux coords, créer les points + arêtes enrichies
    for (const feature of inputGeoJson.features) {
        if (feature.geometry.type !== 'LineString') continue

        const [coordA, coordB] = feature.geometry.coordinates

        // On multiplie par 80 pour avoir des coordonnées plus grandes (pour cytoscape)
        coordA[0] *= 80
        coordA[1] *= -80

        coordB[0] *= 80
        coordB[1] *= -80

        const idA = assignId(coordA)
        const idB = assignId(coordB)

        const dx = coordA[0] - coordB[0]
        const dy = coordA[1] - coordB[1]
        const weight = Number(Math.sqrt(dx * dx + dy * dy).toFixed(2))

        edgeFeatures.push({
            type: 'Feature',
            properties: {
                source: idA,
                target: idB,
                weight
            },
            geometry: {
                type: 'LineString',
                coordinates: [coordA, coordB]
            }
        })
    }

    lastGeneratedGraph = {
        type: 'FeatureCollection',
            features: [...pointFeatures, ...edgeFeatures]
    }
    return lastGeneratedGraph;
}

// Basé sur la structure de cet article : https://www.datacamp.com/fr/tutorial/dijkstra-algorithm-in-python?dc_referrer=https%3A%2F%2Fwww.google.com%2F
// Utilisé pour le process de l'algorithme Dijkstra
function buildGraph(geojson) {
    const graph = {};

    geojson.features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {

            const source = feature.properties.source;
            const target = feature.properties.target;
            const weight = feature.properties.weight;

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            graph[source].push({ node: target, weight });
            graph[target].push({ node: source, weight });
        }
    });

    return graph;
}

function generateRandomGraph(numPoints) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nodes = [];

    for (let i = 0; i < numPoints; i++) {
        const letter = letters[i % letters.length];
        // Ajoute un suffixe si le nombre de points dépasse le nb de lettres
        const suffix = i >= letters.length ? Math.floor(i / letters.length) : '';
        const id = letter + suffix;

        const x = Number((Math.random() * 1000).toFixed(2));
        const y = Number((Math.random() * 1000).toFixed(2));

        nodes.push({
            id,
            coordinates: [x, y]
        });
    }

    const features = [];

    for (const node of nodes){
        features.push({
            type: 'Feature',
            properties: {id: node.id},
            geometry: {
                type: 'Point',
                coordinates: node.coordinates
            }
        });
    }

    const addedEdges = new Set();
    const nodeLinks = {};

    // Initialise le nombre de liens pour chaque nœud
    nodes.forEach(n => nodeLinks[n.id] = 0);

    function distance([x1, y1], [x2, y2]) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Retourne la racine carrée de la somme des carrés des coordonnées après les avoir soustraits
        return Number(Math.sqrt(dx * dx + dy * dy).toFixed(2));
    }

    // Pour chaque nœud, on trouve ses 3 voisins les plus proches
    for (let i = 0; i < nodes.length; i++) {
        const current = nodes[i];
        const distances = nodes
            .map(n => ({
                id: n.id,
                coordinates: n.coordinates,
                dist: n.id !== current.id ? distance(current.coordinates, n.coordinates) : Infinity
            }))
            .sort((a, b) => a.dist - b.dist);

        let linksAdded = 0;
        let j = 0;

        // On ajoute les 3 plus proches voisins
        while (linksAdded < 3 && j < distances.length) {
            const target = distances[j];
            const edgeId = [current.id, target.id].sort().join('-');

            // Si le lien n'existe pas déjà et que les deux nœuds n'ont pas atteint leur limite de 4 liens
            if (!addedEdges.has(edgeId) && nodeLinks[current.id] < 4 && nodeLinks[target.id] < 4) {
                addedEdges.add(edgeId);
                const weight = target.dist;

                features.push({
                    type: 'Feature',
                    properties: {
                        source: current.id,
                        target: target.id,
                        weight,
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [current.coordinates, target.coordinates]
                    }
                });
                nodeLinks[current.id]++;
                nodeLinks[target.id]++;
                linksAdded++;
            }
            j++;
        }
    }

    lastGeneratedGraph = {
        type: 'FeatureCollection',
        features
    }

    return lastGeneratedGraph;
}

function getLastGeneratedGraph() {
    return lastGeneratedGraph;
}

export {
    generateRandomGraph,
    buildGraph,
    getLastGeneratedGraph,
    normalizeGeoJsonFromLinesOnly
}
