require('dotenv').config();
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
});

const port = process.env.PORT || 5050;

client.auth(process.env.REDIS_AUTH, (err, response) => {
    if (err) throw `${err}, ${response}`;
});

app.get('/', (req, res) => {
    res.status(200).send({
        message: "Looks like you've hit the root url",
        availableurls: [
            "/write/:key/:value",
            "/read/:key",
            "/delete/:key",
        ],
    })
});

app.get('/read/:key', (req, res) => {
    client.get(req.params.key, (err, reply) => {
        res.status(200).send({
            data: reply
        });
    });
});

app.get('/write/:key/:value', (req, res) => {
    client.set(req.params.key, req.params.value);
    res.status(200).send({
        status: 'OK'
    });
});

app.get('/delete/:key', (req, res) => {
    client.del(req.params.key);
    res.status(200).send({
        status: 'OK'
    });
});

app.get('*', function(req, res){
    res.status(400).send({
        message: "Invalid endpoint",
        status: 404
    });
});

app.listen(port, () => {
    console.log(`App successfully started on http://localhost:${port}`);
});