const express = require('express')
const mongooose = require('mongoose');
const ShortUrl = require('./model/shortUrl')
const dotenv = require("dotenv");
const app = express()

//config
dotenv.config({path:"config/config.env"});

mongooose.connect(`${process.env.DB_URI}`,{
    useNewUrlParser: true, useUnifiedTopology: true
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find() 
    res.render('index', ({shortUrls: shortUrls}));
})
app.post('/shortUrls', async (req,res)=>{
   await ShortUrl.create({full: req.body.fullUrl})
   res.redirect('/')
})
app.get('/:shortUrl', async (req,res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    if(shortUrl == null) return  res.sendStatus(404) 
    shortUrl.clicks++
    shortUrl.save()
    
    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000);
console.log(`Server is running on `)