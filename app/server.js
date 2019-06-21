const express = require('express')
const app = express()
const generatePath = require('./controllers/generatePath')
const path = require('path')
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, 'client/build')))
app.get('/api/generate-path', generatePath)
app.listen(port, () => console.log(`🚀 Server listen on port: ${port}`))
