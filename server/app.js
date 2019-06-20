const express = require('express')
const app = express()
const generatePath = require('./controllers/generatePath')

app.get('/api/generate-path', generatePath)
app.listen(8080)
