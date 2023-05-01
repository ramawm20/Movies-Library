const express = require("express");

const server = express();

const PORT = 3002;

//listen to the port
server.listen(PORT, () => {
    console.log(`Listening on ${PORT} : I am ready `);
})

//create route to home to display constructor info 
server.get("/", (req, res) => {
    let data = require("./data.json")
    function Movies(title, posterPath, overview) {
        this.title = title;
        this.postPath = posterPath;
        this.overview = overview;
    }
    let movie1 = new Movies(data.title, data.poster_path, data.overview)
    res.send(movie1);
})

//route to favorite page
server.get("/favorite", (req, res) => {
    res.send("Welcome to favorite page")
})

//handle page not found errors
server.get('*', (req, res) => {
    res.status(404).send("Page not found")
    
})

//handle the server errors
 server.get("", (req,res) => {
    let errorNum = 500;
    let obj = {
        status: errorNum,
        responseText:"Sorry, something went wrong"
    }
    res.status(errorNum).send(obj)
})



