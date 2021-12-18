const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/adminRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

const app = express()

const dbURL = 'mongodb+srv://kemal:123@nodeblog.i6awq.mongodb.net/node-blog?retryWrites=true&w=majority'
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) =>console.log(err))


app.set('view engine','ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true}))

app.use(morgan('dev'))

app.use(cookieParser())

app.get('*', checkUser)


app.use('/admin',requireAuth, adminRoutes)
app.use('/blog', blogRoutes)
app.use('/', authRoutes)

app.get('/', (req,res) => {
    res.redirect('/blog')
})


app.get('/about', (req,res) => {
    res.render('about', {title: 'Hakkımızda'})
})

app.get('/about-us', (req,res) => {
    res.redirect('/about')
})

app.use((req,res) => {
    res.status(404).render('404', {title: 'Sayfa bulunamadı'})
})


