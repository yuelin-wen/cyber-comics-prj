const express = require('express')
const router = express.Router();
const axios = require("axios");

let count = 0;
let maxNum = 0;
let view_id = [];
let flag = false;

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
var visitCount = (array, id) => {
    let c = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === id) {
            c++
        }
    }
    return c
}


router.get('/:id', async (req, res) => {
    if (isNaN(parseInt(req.params.id)) || parseInt(req.params.id) <= 0 || parseInt(req.params.id) > maxNum) {
        return res.render('404')
    }
    else {
        let transcript
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
router.post("/", (req, res) => {
    res.redirect(`/${req.body.id}`)
})
router.get('/', async (req, res) => {
    let data = await axios.get('https://xkcd.com/info.0.json')
    maxNum = data.data.num
    res.redirect(`/${maxNum}`)
});

exports.routes = router;