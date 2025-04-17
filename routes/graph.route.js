import express from 'express'
import { generateRandomGraph, getLastGeneratedGraph } from "../service/graph.service.js";

const router = express.Router();

router.get('/', (req, res) => {
    const graph = getLastGeneratedGraph()
    if (!graph) {
        return res.status(404).json({})
    }
    res.status(200).json(graph)
})

router.get('/random', (req, res) => {
    const numberOfNodes = Number(req.query.numberOfNodes)

    if (!numberOfNodes || isNaN(numberOfNodes) || numberOfNodes < 2 || numberOfNodes > 1000) {
        return res.status(400).json({
            error: 'Number of nodes is required and must be a number between 2 and 1000'
        })
    }

    const currentGraph = generateRandomGraph(numberOfNodes)
    res.status(200).json(currentGraph)
})

export default router
