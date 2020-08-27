const express = require ('express')
const connectDB = require('./config/db')
const Cors = require('cors')

// Creamos el server
const app = express()

// Conectamos a la base de datos
connectDB()

//Habilitar cors
app.use(Cors())

//Habilitar express.JSON
app.use(express.json({extend:true}))

//puerto de la app
const PORT = process.env.PORT || 4000

//Importar Rutas
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/articles', require('./routes/articles'))
app.use('/api/providers', require('./routes/providers'))

app.listen(PORT, () => console.log(`El servidor esta corriendo en el puerto:${PORT}`))

