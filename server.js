'use strict'

//declerations
const express = require("express");
const cors = require("cors")
const server = express();
require('dotenv').config();
const pg = require('pg')
server.use(cors())
const PORT = 3002;
const axios = require("axios")
const data = require("./data.json")
const apikey = process.env.APIkey;
server.use(express.json())

const client = new pg.Client('postgresql://localhost:5432/class15')
//calling functions
server.get('/', home)
server.get('/favorite', favorite)
server.get('/trending', trending)
server.get('/search', search)
server.get('/genres', genres)
server.get('/favactor', favActor)
server.get('/getMovies', getMovies)
server.post('/getMovies', addMovies)

server.get('*', notFound)

server.use(errorHandler)

//home function to display home 
function home(req, res) {
    function Movies(title, posterPath, overview) {
        this.title = title;
        this.postPath = posterPath;
        this.overview = overview;
    }
    let movie1 = new Movies(data.title, data.poster_path, data.overview)
    res.send(movie1);
}

//favorite function to display favorite page
function favorite(req, res) {
    res.send("Welcome to favorite page")
}

//page not found function to handle not found pages
function notFound(req, res) {
    res.status(404).send("Page not found")
}

//lab14
//constructor
function Movies(id, title, release_date, poster_path, overview) {
    this.id = id
    this.title = title
    this.date = release_date;
    this.path = poster_path
    this.overview = overview
}

//trending function to display trending page
async function trending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`
    let result = await axios.get(url)
    console.log(result.data);
    let mapResult = result.data.results.map(item => {
        let m = new Movies(item.id, item.original_title, item.release_date, item.backdrop_path, item.overview)
        return m;
    })
    res.send(mapResult)
}

//search function to display search page
function search(req, res) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&language=en-US&query=The&page=2`
    axios.get(url)
        .then(result => {
            let r = result.data;
            res.send(r)
        }
        )
        .catch((error) => {
            console.log(`sorry, you have somthing wrong`, error);
            res.status(500).send(error)
        })
}

//genres function to display type of movies in general
function genres(req, res) {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}&language=en-US`
    try {
        axios.get(url)
            .then(result => {
                let r = result.data
                res.send(r)
            })
            .catch((error) => {
                console.log(`sorry, you have somthing wrong`, error);
                res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res)
    }
}

//favActor function that display info of one of my favorite actors
function favActor(req, res) {
    let url = `https://api.themoviedb.org/3/person/287?api_key=${apikey}&language=en-US`
    axios.get(url)
        .then(result => {
            let r = result.data;
            res.send(r)
        }
        )

}

function getMovies(req, res) {
    const sql = 'SELECT * FROM favoriteMovie'
    client.query(sql)
        .then(data => {
            res.send(data.rows)
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })

}
function addMovies(req, res) {
    const movie = req.body;
    console.log(movie);
    const sql = `INSERT INTO favoriteMovie (title, summary, years, comment)
    VALUES ($1, $2, $3, $4);`
    const values = [movie.title, movie.summary, movie.years,movie.comment];
    client.query(sql, values)
        .then(data => {
            res.status(201).send("Your data added successfully, Congrats")
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })

}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}


client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening on ${PORT} : I am ready `);
        })
    })
