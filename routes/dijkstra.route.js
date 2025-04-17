import express from 'express'
import { buildGraph, getLastGeneratedGraph } from '../service/graph.service.js';
import { dijkstraCalculation } from '../service/dijkstra.service.js';
import { performance } from 'perf_hooks';

const router = express.Router();

router.post('/', (req, res) => {
    const { start, end, step} = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end nodes required' });
    }

    const graphPrepared = buildGraph(getLastGeneratedGraph());

    const startTime = performance.now();
    const result = dijkstraCalculation(graphPrepared, start, end, step);
    const endTime = performance.now();

    if (!result) {
        return res.status(404).json({ error: 'No path found' });
    }
    res.status(200).json({ ...result, time: Number((endTime - startTime).toFixed(2)) });
});

export default router
