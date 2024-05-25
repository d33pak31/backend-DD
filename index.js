const express = require('express')
const app = express()
const port = process.env.port || 4000
const { mongoDB } = require('./db')
require('dotenv').config()

app.use((req, res, next) => {
  // CORS
  res.header(
    'Access-Control-Allow-Origin',
    'https://delicious-dispatch.netlify.app'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

mongoDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())

app.use('/api', require('./Routes/CreateUser'))
app.use('/api', require('./Routes/DisplayData'))
app.use('/api', require('./Routes/OrderData'))

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
