const express = require('express')
const cors = require('cors')
const graphRouter = require('./routes/graph.route')
const dijkstraRouter = require('./routes/dijkstra.route')

const app = express()
const PORT = 3000
const allowedOrigins = ['http://localhost:5173']

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/graph', graphRouter)
app.use('/api/dijkstra', dijkstraRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
