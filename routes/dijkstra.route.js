const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { buildGraph } = require('../service/graph.service');
const { dijkstraCalculation } = require('../service/dijkstra.service');
const graphPath = path.join(__dirname, '../data/graph.json');
const geojson = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

router.post('/', (req, res) => {
    const { start, end, step} = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end nodes required' });
    }

    const graph = buildGraph(geojson);
    const result = dijkstraCalculation(graph, start, end, step);
    if (!result) {
        return res.status(404).json({ error: 'No path found' });
    }
    res.status(200).json(result);
});

module.exports = router
