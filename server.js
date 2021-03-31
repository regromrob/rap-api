//require module
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000

//code to connect to database
let db,
    dbConnectionStr = 'mongodb+srv://reg:Regina@cluster0.smlpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    dbName = 'myFirstDatabase'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


//setting up middleware and all its application
app.set('view engine', 'ejs') //use ejs
app.use(express.static('public')) //serve up anyfile in public folder
app.use(express.urlencoded({ extended: true })) //diff way of doing body parser; use this code to look at any request coming in
app.use(express.json()) //this line goes w the above explanation as well


let rappers ={
    '21 savage': {
    'age': 28,
    'birthName': 'sheyaa Bin Abraham-Joseph',
    "birthLocation": 'London, England'
},
    'chance the rapper': {
        'age': 28,
        'birthName': 'Chancelor Jonathan Bennett',
        'birthLocation': 'Chicago, Illinois'
    },
    'dylan':{
        'age': 28,
        'birthName': 'dylan',
        'birthLocation': 'dylan'
    }
}

//get,post,delete makes up the api
app.get('/', (request,response)=>{
    db.collection('rappers').find().toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/api/rappers/:rapperName', (request, response)=>{
    const rapName = request.params.rapperName.toLowerCase()
    console.log(rapName)
    if(rappers[rapName]){
        response.json(rappers[rapName])
    }else{
        response.json(rappers['dylan'])
    }
    
})

app.post('/addRapper', (request, response) => {
    db.collection('rappers').insertOne(request.body)
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteRapper', (request, response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))

})
//listen on port server prefers, but if not then run on port I gave(8000)
app.listen(process.env.PORT || PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})


