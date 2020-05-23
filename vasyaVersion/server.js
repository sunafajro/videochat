var express = require('express');
const https = require('https')
const fs = require('fs')
var app = express();
const wsServer = require('websocket').server;

const httpsOptions = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.pem')
}
app.use('/static', express.static('static'));
var bodyParser = require('body-parser')

let interlocutors=[]//new (require('events'))
let answers=[]
app.use('/getinterlocutor',express.json(),(req,res)=>{
    if(interlocutors.length){
    let interlocutor= interlocutors.pop()
    interlocutor(req.body)
    function onAnswer(answer){
        console.log('answer',answer);
        res.end(JSON.stringify(answer))
    }
    onAnswer.id=req.body.id
    answers.push(onAnswer)
    //res.end('{}');
    }else{
        res.status(404).end('Собеседников на данный момент нет')
    }
})
let uniqId=0

app.use('/setinterlocutor',express.json(),(req,res)=>{
    let interlocutorId =uniqId++
    let onSearch = function (offer){
        console.log('offer',offer);
        res.end(JSON.stringify(offer))
    }
    onSearch.id=interlocutorId
    interlocutors.push(onSearch)
    req.on('close',()=>{
        interlocutors=interlocutors.filter(v=>v.id!==interlocutorId)
    })
})
app.use('/answerinterlocutor',express.json(),(req,res)=>{
    let answer = answers.find(a=>a.id===req.body.id);
    if(answer){
        answer(req.body)
        res.end('{}')
    }else{
        res.status(404).end('Собеседник не ответил')

    }
})
const server = https.createServer(httpsOptions, app)
    .listen(8888, () => {
        console.log('server running at ' + 8888)
    })