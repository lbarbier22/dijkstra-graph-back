import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import router from '../../routes/dijkstra.route.js'
import * as graphService from '../../service/graph.service.js'
import * as dijkstraService from '../../service/dijkstra.service.js'

const app = express()
app.use(express.json())
app.use('/api/dijkstra', router)

describe('POST /api/dijkstra', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('retourne 400 si start est manquant', async () => {
        const res = await request(app).post('/api/dijkstra').send({ end: 'B' })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Start and end nodes required')
    })

    it('retourne 400 si end est manquant', async () => {
        const res = await request(app).post('/api/dijkstra').send({ start: 'A' })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Start and end nodes required')
    })

    it('retourne 404 si aucun chemin trouvé', async () => {
        vi.spyOn(graphService, 'getLastGeneratedGraph').mockReturnValue({ nodes: [], edges: [] })
        vi.spyOn(graphService, 'buildGraph').mockReturnValue({}) // graphe vide
        vi.spyOn(dijkstraService, 'dijkstraCalculation').mockReturnValue(null)

        const res = await request(app)
            .post('/api/dijkstra')
            .send({ start: 'A', end: 'B', step: [] })

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('No path found')
    })

    it('retourne 200 avec les résultats du plus court chemin', async () => {
        const mockGraph = { nodes: ['A', 'B'], edges: [['A', 'B']] }
        const mockResult = { path: ['A', 'B'], time: 0, weight: 10 }

        vi.spyOn(graphService, 'getLastGeneratedGraph').mockReturnValue(mockGraph)
        vi.spyOn(graphService, 'buildGraph').mockReturnValue(mockGraph)
        vi.spyOn(dijkstraService, 'dijkstraCalculation').mockReturnValue(mockResult)

        const res = await request(app)
            .post('/api/dijkstra')
            .send({ start: 'A', end: 'B', step: [] })

        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockResult)
    })

    it('appelle correctement les services avec les bons arguments', async () => {
        const mockGraph = { nodes: ['A', 'B'], edges: [] }
        vi.spyOn(graphService, 'buildGraph').mockReturnValue(mockGraph)
        const dijkstraSpy = vi.spyOn(dijkstraService, 'dijkstraCalculation').mockReturnValue({ path: ['A', 'B'], weight: 3 })

        await request(app).post('/api/dijkstra').send({ start: 'A', end: 'B', step: ['X'] })

        expect(dijkstraSpy).toHaveBeenCalledWith(mockGraph, 'A', 'B', ['X'])
    })
})
