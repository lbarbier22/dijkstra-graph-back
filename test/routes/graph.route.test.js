import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import router from '../../routes/graph.route.js'
import * as graphService from '../../service/graph.service.js'

const app = express()
app.use(express.json())
app.use('/api/graph', router)

describe('Graph API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('POST /api/graph/generate - retourne une erreur 400 si geoJson est manquant', async () => {
        const res = await request(app).post('/api/graph/generate').send({})
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('geoJson required')
    })

    it('POST /api/graph/generate - retourne un graphe généré à partir de geoJson', async () => {
        const inputGeoJson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: [
                            [0, 0],
                            [1, 1]
                        ]
                    }
                }
            ]
        }

        const res = await request(app).post('/api/graph/generate').send({ geoJson: inputGeoJson })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('type', 'FeatureCollection')
        expect(res.body.features.length).toBeGreaterThan(0)
    })

    it('GET /api/graph - retourne le graphe sauvegardé', async () => {
        vi.spyOn(graphService, 'getLastGeneratedGraph').mockReturnValue({ nodes: ['A'], edges: [] })

        const res = await request(app).get('/api/graph')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ nodes: ['A'], edges: [] })
    })

    it('GET /api/graph - retourne un objet vide si aucun graphe', async () => {
        vi.spyOn(graphService, 'getLastGeneratedGraph').mockReturnValue(undefined)

        const res = await request(app).get('/api/graph')
        expect(res.status).toBe(404)
        expect(res.body).toEqual({})
    })

    it('GET /api/graph/random - retourne une erreur 400 si paramètre manquant', async () => {
        const res = await request(app).get('/api/graph/random')
        expect(res.status).toBe(400)
        expect(res.body.error).toContain('Number of nodes is required')
    })

    it('GET /api/graph/random - retourne une erreur 400 si NaN', async () => {
        const res = await request(app).get('/api/graph/random?numberOfNodes=abc')
        expect(res.status).toBe(400)
    })

    it('GET /api/graph/random - retourne une erreur si trop petit', async () => {
        const res = await request(app).get('/api/graph/random?numberOfNodes=1')
        expect(res.status).toBe(400)
    })

    it('GET /api/graph/random - retourne une erreur si trop grand', async () => {
        const res = await request(app).get('/api/graph/random?numberOfNodes=1001')
        expect(res.status).toBe(400)
    })

    it('GET /api/graph/random - génère un graphe valide', async () => {
        const fakeGraph = {
            nodes: ['N1', 'N2'],
            edges: [['N1', 'N2']]
        }

        const spy = vi.spyOn(graphService, 'generateRandomGraph').mockReturnValue(fakeGraph)

        const res = await request(app).get('/api/graph/random?numberOfNodes=5')
        expect(res.status).toBe(200)
        expect(res.body).toEqual(fakeGraph)
        expect(spy).toHaveBeenCalledWith(5)
    })
})
