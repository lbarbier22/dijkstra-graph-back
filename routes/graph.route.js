const express = require('express')
const graphData = require('../data/graph.json')

const router = express.Router();

router.get('/', (req, res) => {
    res.json(graphData)
})

module.exports = router
