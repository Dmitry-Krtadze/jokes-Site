const http = require("http");
const fs = require("fs");
const path = require('path');
const url = require('url');

const dataPath = path.join(__dirname, 'data');

const querystring = require('querystring');

const server = http.createServer((req, res)=>{
    if(req.url == '/jokes' && req.method == 'GET')
    {
        getAllJokes(req,res);
    }
    if(req.url == '/jokes' && req.method == 'POST')
    {
        addJokes(req,res);
    }
    const urlParts = url.parse(req.url, true);
    const queryParams = urlParts.query;
    const jokeNumber = parseInt(queryParams.joke, 10); 
    
    if(req.url == `/jokes?joke=${jokeNumber}` && req.method == 'GET'){
        getOneJoke(jokeNumber,res);
    }
});
server.listen(3000);

function getOneJoke(id,res){
    let file = fs.readFileSync(path.join(dataPath, id+'.json'));
    let jokeJson = Buffer.from(file).toString();
    let joke = JSON.parse(jokeJson);
    res.end(JSON.stringify(joke));
}


function addJokes(req,res)
{
    let data = '';
    req.on('data', function(chunk){
        data += chunk;
    });
    req.on('end', function(){
        let joke = JSON.parse(data);
        joke.likes = 0;
        joke.dislikes = 0;
        let dir = fs.readdirSync(dataPath);
        let fileName = dir.length+'.json';
        let filePath = path.join(dataPath,fileName);
        fs.writeFileSync(filePath,JSON.stringify(joke));
        res.end();
    });
}


function getAllJokes(req,res)
{
    let dir = fs.readdirSync(dataPath);
    let allJokes = [];
    for(let i = 0; i < dir.length; i++)
    {
        let file = fs.readFileSync(path.join(dataPath, i+'.json'));
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.id = i;

        allJokes.push(joke);
    }
    res.end(JSON.stringify(allJokes));
}