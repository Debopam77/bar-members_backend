require('../db/mongooseConnection');
const Notices = require('../models/notices');
const express = require('express');
const auth = require('../middleware/auth');
const app = new express.Router();

//E ki holo?
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//Get Notices api
app.get('/notices', auth, async (req, res) => {
    try {
        const notices = await Notices.find();
        res.send(notices);
    }catch(e) {
        res.status(500).send(e);
    }
});
//Create Notice
app.post('/notices', auth, async(req, res) => {
    const notice = new Notices(req.body);
    try {
        await notice.save();
        res.send(notice);
    }catch(e){
        res.status(500).send(e);
    }
});
//Edit Notice
app.patch('/notices', auth, async(req, res) => {
    try {
        const notice = await Notices.findOne({_id : req.body._id});
        const updates = Object.keys(req.body);
        updates.forEach((update) => {notice[update] = req.body[update]});
        await notice.save();
        res.send(notice);
    }catch(e) {
        res.status(500).send('Couldnt update notice');
    }    
});
//Delete Notice
app.delete('/notices', auth, async(req, res) => {
    try {
        const notice = await Notices.findOne({_id : req.body._id});
        notice.remove();
        res.send(notice);
    }catch (e) {
        res.status(500).send();
    }
});

module.exports = app;