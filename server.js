//sprawdzamy, czy pracujemy w srodowisku produkcyjnym

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index') // routing do index.js
const authorRouter = require('./routes/authors')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') //miejsce, gdzie przechowywane będą widoki

app.set('layout', 'layouts/layout')
app.use(expressLayouts) //odniesienie, ze bedziemy uzywać wzorca

app.use(express.static('public')) //gdzie będziemy przechowywać pliki
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { //ścieżka URL do bazy danych
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('err', error => console.error(error)) //info w przypadku błędu
db.once('open', () => console.log('Connected to Mongoose')) //połączenie z bazą danych

app.use('/', indexRouter)
app.use('/authors', authorRouter)

app.listen(process.env.PORT || 3000) //nasłuchiwanie na porcie 3000