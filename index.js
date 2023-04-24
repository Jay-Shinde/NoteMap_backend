const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')


connectToMongo();

const app = express()
app.use(cors())
const port = 5000
app.use(express.json())
// app.get('/', (req, res) => {
//   res.send('Hello World! by jayesh')
// })
// app.get('/login', (req, res) => {
//   res.send('Hello World! FIrst login !') 
// })
// app.get('/login/invalid', (req, res) => {
//   res.send('Invalid ID or Password')
// })


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app is listening on port ${port}`)
}) 