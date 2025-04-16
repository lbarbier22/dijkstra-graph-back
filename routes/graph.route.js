const express = require('express')
const { generateRandomGraph, getLastGeneratedGraph } = require('../service/graph.service')

const router = express.Router();

router.get('/', (req, res) => {
    res.json(getLastGeneratedGraph());
})

router.get('/random', (req, res) => {
    const { numberOfNodes } = req.query;
    if (!numberOfNodes) {
        return res.status(400).json({ error: 'Number of nodes is required' });
    }
    currentGraph = generateRandomGraph(numberOfNodes)
    res.json(currentGraph)
})

module.exports = router;
