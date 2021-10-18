const express = require('express');
const router = express.Router();
//I use axios to fetch api in this project
const axios = require("axios");

let count = 0;      //used to record visit counts
let maxNum = 0;     //the latest page number, fetch it by num property in api
let view_id = [];   //an array to records all visited page’s id, then i can count how many times this page is visited
let flag = false;   //boolean flag, used to control, i won’t record the repeat visits that caused by accident, for example, user hit go next button accidently

//previous page button, next page button, random button methods
var goPrev = (num) => {
    if ((num - 1) >= 1) {
        num--;
    }
    if (num == 0) {
        flag = true;
    }
    return num
}
var goNext = (num) => {
    if ((num + 1) <= maxNum) {
        num++;
    }
    if (num == maxNum) {
        flag = true;
    }
    return num
}
var goRandom = () => {
    let num = 0;
    while (!num) {
        num = Math.floor(Math.random() * maxNum);
    }
    return num;
}

//record visit counts method
var visitCount = (array, id) => {
    let c = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === id) {
            c++
        }
    }
    return c
}


//GET route ‘/:id’, evaluate the request id first, then fetch api by using axios, and render the data to ejs views page
router.get('/:id', async (req, res) => {
    if (isNaN(parseInt(req.params.id)) || parseInt(req.params.id) <= 0 || parseInt(req.params.id) > maxNum) {
        return res.render('404')
    }
    else {
        let data, transcript
        try {
            let response = await axios.get(`https://xkcd.com/${req.params.id}/info.0.json`)
            data = response.data
            transcript = data.transcript.split('\n');
            view_id.push(req.params.id)
            if (!flag) {
                count = visitCount(view_id, req.params.id)
            }
            flag = false
        } catch (err) {
            console.log(err)
        }
        res.render('main', { data: data, transcript: transcript, count: count, maxNum: maxNum, goPrev: goPrev, goNext: goNext, goRandom: goRandom })
    }
});

//POST route ‘/’, this route is used to handle the POST request from my search form function, that form is used to allow user enter the comic page number and redirect to that page
router.post("/", (req, res) => {
    res.redirect(`/${req.body.id}`)
})

//GET route ‘/’, handle the main page route. Get the latest page num by using axios to fetch the latest api, then redirect it to the GET ‘/:id’ request route.
router.get('/', async (req, res) => {
    let data = await axios.get('https://xkcd.com/info.0.json')
    maxNum = data.data.num
    res.redirect(`/${maxNum}`);
});

exports.routes = router;