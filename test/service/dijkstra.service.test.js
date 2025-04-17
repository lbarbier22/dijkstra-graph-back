import { describe, it, expect } from 'vitest'
import { dijkstraCalculation } from '../../service/dijkstra.service.js'

describe('dijkstraCalculation', () => {
    const graph = {
        A: [{ node: 'B', weight: 1 }, { node: 'C', weight: 4 }],
        B: [{ node: 'C', weight: 2 }, { node: 'D', weight: 5 }],
        C: [{ node: 'D', weight: 1 }],
        D: []
    }

    it('trouve le plus court chemin simple entre deux nœuds', () => {
        const result = dijkstraCalculation(graph, 'A', 'D')
        expect(result.path).toEqual(['A', 'B', 'C', 'D'])
        expect(result.weight).toBe(4)
    })

    it('renvoie un chemin respectant les étapes intermédiaires (step)', () => {
        const result = dijkstraCalculation(graph, 'A', 'D', ['B', 'C'])
        expect(result.path).toEqual(['A', 'B', 'C', 'D'])
        expect(result.weight).toBe(4)
    })

    it('retourne un chemin vide si aucun chemin n\'est trouvé', () => {
        const disconnectedGraph = {
            A: [{ node: 'B', weight: 1 }],
            B: [],
            C: []
        }
        const result = dijkstraCalculation(disconnectedGraph, 'A', 'C')
        expect(result.path).toEqual([])
        expect(result.weight).toBeNull()
    })

    it('retourne un chemin vide si une étape échoue', () => {
        const result = dijkstraCalculation(graph, 'A', 'D', ['X']) // "X" n'existe pas
        expect(result.path).toEqual([])
        expect(result.weight).toBeNull()
    })

    it('gère les graphes circulaires sans boucler à l’infini', () => {
        const circularGraph = {
            A: [{ node: 'B', weight: 1 }],
            B: [{ node: 'C', weight: 1 }],
            C: [{ node: 'A', weight: 1 }]
        }
        const result = dijkstraCalculation(circularGraph, 'A', 'C')
        expect(result.path).toEqual(['A', 'B', 'C'])
        expect(result.weight).toBe(2)
    })

    it('retourne un chemin direct si start === end', () => {
        const result = dijkstraCalculation(graph, 'A', 'A')
        expect(result.path).toEqual(['A'])
        expect(result.weight).toBe(0)
    })

    it('retourne un chemin partiel si un stop est atteint mais pas la fin', () => {
        const result = dijkstraCalculation(graph, 'A', 'Z', ['B']) // "Z" n’existe pas
        expect(result.path).toEqual([])
        expect(result.weight).toBeNull()
    })
})
