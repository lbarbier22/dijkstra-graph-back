import express from 'express'
import { buildGraph, getLastGeneratedGraph } from '../service/graph.service.js';
import { dijkstraCalculation } from '../service/dijkstra.service.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { start, end, step} = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end nodes required' });
    }

    const graphPrepared = buildGraph(getLastGeneratedGraph());
    const result = dijkstraCalculation(graphPrepared, start, end, step);
    if (!result) {
        return res.status(404).json({ error: 'No path found' });
    }
    res.status(200).json(result);
});

export default router
