const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const graphPath = path.join(__dirname, '../data/graph.json');
const geojson = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

// based on the structure of this article : https://www.datacamp.com/fr/tutorial/dijkstra-algorithm-in-python?dc_referrer=https%3A%2F%2Fwww.google.com%2F
const buildGraph = (geojson) => {
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
};

router.post('/', (req, res) => {
    const { start, end } = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end nodes required' });
    }

    const result = buildGraph(geojson);

    res.status(200).json(result);
});

module.exports = router
