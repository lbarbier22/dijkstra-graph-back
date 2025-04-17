import { describe, it, expect, beforeEach } from 'vitest'
import { generateRandomGraph, buildGraph, getLastGeneratedGraph, normalizeGeoJsonFromLinesOnly } from '../../service/graph.service.js'

describe('Graph Service', () => {
    beforeEach(() => {
        // Reset du graphe avant chaque test pour éviter les interférences
        generateRandomGraph(10)
    })

    describe('generateRandomGraph', () => {
        it('génère un graphe valide avec les bonnes structures GeoJSON', () => {
            const result = generateRandomGraph(10)

            expect(result).toBeDefined()
            expect(result.type).toBe('FeatureCollection')
            expect(Array.isArray(result.features)).toBe(true)

            const points = result.features.filter(f => f.geometry.type === 'Point')
            const lines = result.features.filter(f => f.geometry.type === 'LineString')

            expect(points.length).toBe(10)
            expect(lines.length).toBeGreaterThan(0)

            points.forEach(p => {
                expect(p.properties.id).toBeDefined()
                expect(p.geometry.coordinates).toHaveLength(2)
            })

            lines.forEach(l => {
                expect(l.properties.source).toBeDefined()
                expect(l.properties.target).toBeDefined()
                expect(typeof l.properties.weight).toBe('number')
            })
        })

        it('génère des identifiants uniques même avec plus de 26 points', () => {
            const graph = generateRandomGraph(30)
            const pointIds = graph.features
                .filter(f => f.geometry.type === 'Point')
                .map(f => f.properties.id)

            const uniqueIds = new Set(pointIds)
            expect(uniqueIds.size).toBe(pointIds.length)
        })
    })

    describe('buildGraph', () => {
        it('construit correctement un graphe à partir d’un GeoJSON', () => {
            const geojson = generateRandomGraph(5)
            const graph = buildGraph(geojson)

            expect(graph).toBeDefined()
            expect(typeof graph).toBe('object')

            const allNodes = Object.keys(graph)
            expect(allNodes.length).toBeGreaterThan(0)

            for (const node of allNodes) {
                expect(Array.isArray(graph[node])).toBe(true)
                graph[node].forEach(edge => {
                    expect(edge.node).toBeDefined()
                    expect(typeof edge.weight).toBe('number')
                })
            }
        })

        it('retourne un objet vide si aucun LineString n’est présent', () => {
            const geojson = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [0, 0] },
                        properties: { id: 'A' }
                    }
                ]
            }

            const graph = buildGraph(geojson)
            expect(graph).toEqual({})
        })
    })

    describe('getLastGeneratedGraph', () => {
        it('retourne toujours le dernier graphe généré', () => {
            const first = generateRandomGraph(4)
            const second = generateRandomGraph(7)

            const result = getLastGeneratedGraph()
            expect(result).toEqual(second)
            expect(result.features.length).toBeGreaterThan(first.features.length)
        })
    })

    describe('normalizeGeoJsonFromLinesOnly', () => {
        it('crée des points et lignes à partir de LineStrings', () => {
            const geojsonInput = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: [[1, 2], [3, 4]]
                        }
                    }
                ]
            }

            const result = normalizeGeoJsonFromLinesOnly(geojsonInput)
            expect(result).toBeDefined()
            expect(result.type).toBe('FeatureCollection')

            const points = result.features.filter(f => f.geometry.type === 'Point')
            const lines = result.features.filter(f => f.geometry.type === 'LineString')

            expect(points.length).toBe(2)
            expect(lines.length).toBe(1)

            points.forEach(p => {
                expect(p.properties.id).toMatch(/^[A-Z0-9]+$/)
                expect(p.geometry.coordinates).toHaveLength(2)
            })

            const line = lines[0]
            expect(line.properties.source).toBeDefined()
            expect(line.properties.target).toBeDefined()
            expect(typeof line.properties.weight).toBe('number')
            expect(line.geometry.coordinates.length).toBe(2)
        })

        it('ignore les features non-LineString', () => {
            const geojsonInput = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: { id: 'X' },
                        geometry: {
                            type: 'Point',
                            coordinates: [0, 0]
                        }
                    }
                ]
            }

            const result = normalizeGeoJsonFromLinesOnly(geojsonInput)
            const points = result.features.filter(f => f.geometry.type === 'Point')
            const lines = result.features.filter(f => f.geometry.type === 'LineString')

            expect(points.length).toBe(0)
            expect(lines.length).toBe(0)
        })
    })
})
