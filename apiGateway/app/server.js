'use strict';

const express = require('express');
var app = express();
const PORT = 8080;
const HOST = '0.0.0.0';

var request = require('request-promise');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
// request = request.defaults({jar: true});
var qs = require('querystring');
const subOptions = {
    resolveWithFullResponse: true,
    timeout: 1500
}

async function makeRequest(options, responseFun, res) {
    await request(Object.assign(options, subOptions), responseFun(res)).catch(e => {
        //keep empty, catch to prevent receiving status code 504 from other backend services which are down
    })
}

app.post('/api/login/', async (req, res) => {
    makeRequest({
        method: 'POST',
        json: true,
        headers: {"cookie": req.headers['cookie']},
        body: req.body,
        uri: 'http://host.docker.internal:8001/api/login/'
    }, responseStatusAndBodyAndCookies, res)
});

app.post('/api/register/', async (req, res) => {
    makeRequest({
        method: 'POST',
        json: true,
        body: req.body,
        uri: 'http://host.docker.internal:8001/api/register/'
    }, responseStatusAndBody, res)
});

app.post('/api/logout/', async (req, res) => {
    makeRequest({
        method: 'POST',
        headers: {"cookie": req.headers['cookie']},
        uri: 'http://host.docker.internal:8001/api/logout/'
    }, responseStatusAndBodyAndCookies, res)
});

app.get('/api/token_logged_in_user/', async (req, res) => {
    makeRequest({
        method: 'GET',
        headers: {"cookie": req.headers['cookie']},
        uri: 'http://host.docker.internal:8001/api/token_logged_in_user/'
    }, responseStatusAndBody, res)
});

app.get('/api/songs/:id', async (req, res) => {
    makeRequest({
        method: 'GET',
        uri: 'http://host.docker.internal:8001/api/songs/' + req.params['id']
    }, responseStatusAndBody, res)
});

app.put('/api/songs/:id', async (req, res) => {
    makeRequest({
        method: 'PUT',
        json: true,
        body: req.body,
        uri: 'http://host.docker.internal:8001/api/songs/' + req.params['id']
    }, responseStatusAndBody, res)
});

app.delete('/api/songs/:id', async (req, res) => {
    makeRequest({
        method: 'DELETE',
        json: true,
        uri: 'http://host.docker.internal:8001/api/songs/' + req.params['id']
    }, responseStatusAndBody, res)
});

app.post('/api/songs/', async (req, res) => {
    makeRequest({
        method: 'POST',
        json: true,
        body: req.body,
        uri: 'http://host.docker.internal:8001/api/songs/'
    }, responseStatusAndBody, res)
});

app.get('/api/songs/', async (req, res) => {
    res.send(await getSongs(res, qs.stringify(req.query)));
});

app.get('/api/main_app_songs_userlikes/', async (req, res) => {
    const headers = {"cookie": req.headers['cookie']}
    const userLikes = await getUserLikes(res, headers)
    const songs = await getSongs(res, qs.stringify(req.query));
    if (res.statusCode !== 200) {
        return res.send({'respond': "Server error, try again later."});
    }
    res.send({userLikes, "songs": songs});
});

app.post('/api/songs/:id/like/', async (req, res) => {
    makeRequest({
        method: 'POST',
        headers: {"cookie": req.headers['cookie']},
        uri: 'http://host.docker.internal:8002/api/songs/' + req.params['id'] + '/like/'
    }, responseStatusAndBody, res)
});

function responseStatusAndBody(res) {
    return (error, response, body) => {
        try {
            res.status(response.statusCode);
        } catch (e) {
            res.status(504);
            return res.send();
        }
        res.send(body)
    }
}

function responseStatusAndBodyAndCookies(res) {
    return (error, response, body) => {
        try {
            res.cookie(response.headers['set-cookie']);
            res.status(response.statusCode);
        } catch (e) {
            res.status(504);
            return res.send();
        }
        res.send(body);
    }
}

async function getSongs(res, urlParam) {
    let result;
    await request(Object.assign({
        json: true,
        method: 'GET',
        uri: 'http://host.docker.internal:8001/api/songs/?' + urlParam,
    }, subOptions), ((error, response, body) => {
        try {
            res.status(response.statusCode)
            if (response.statusCode === 200) {
                result = body
            }
        } catch (e) {
            res.status(500)
        }
    })).catch(e => {
        res.status(504)
    })
    return result;
}

async function getUserLikes(res, headers) {
    let result;
    await request(Object.assign({
        method: 'GET',
        json: true,
        headers: headers,
        uri: 'http://host.docker.internal:8002/api/user_likes/',
    }, subOptions), ((error, response, body) => {
        try {
            res.status(response.statusCode)
            if (response.statusCode === 200) {
                result = body['result']
            }
        } catch (e) {
            res.status(500)
        }
    })).catch(e => {
        res.status(504)
    })
    return result;
}

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});