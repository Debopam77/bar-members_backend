require('../db/mongooseConnection');
const Members = require('../models/members');
const express = require('express');
const app = new express.Router();
const auth = require('../middleware/auth');

// Create members api
app.post('/members', async (req, res) => {
    const member = new Members(req.body);
    try {
        await member.save();
        const token = await member.generateAuthToken();
        res.status(201).send({ member, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

//Login
app.post('/members/login', async (req, res) => {
    try {
        const member = await Members.findByCredentials(req.body.phone, req.body.password);
        const token = await member.generateAuthToken();
        res.send({ member, token });
    } catch (e) {
        res.status(400).send('Unable to login, check details..');
    }
});

//Logout
app.post('/members/logout', auth, async (req, res)=> {
    try {
        req.member.tokens = req.member.tokens.filter((token)=> {
            return token.token!== req.token;
        });
        await req.member.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

//Get members
app.get('/members', async (req, res) => {
    const member = await Members.find(req.body);
    res.send(member);
});

//Delete members
app.delete('/members', auth, async (req, res) => {
    try {
        member = req.member;
        if(member.isAdmin) {
            const removeMember = await Members.findOne({phone : req.body.phone});
            member = removeMember;
            await removeMember.remove();
        }else
            await member.remove();
        res.send(member);
    }catch (e) {
        res.status(500).send();
    }
});

//Edit members
app.patch('/members', auth, async (req, res) => {
    updatesNotAllowed = ['phone','_id'];
    let updates = Object.keys(req.body);
    member = req.member;
    //Check if request is made my Admin
    if(member.isAdmin) {
        //Find the member who is being patched
        member = await Members.findOne({phone : req.body.phone});
        //Remove phone from the updates array
        updates = updates.filter((value) => !(value === 'phone')); 
    }
    const isAllowed = updates.every((update) => !updatesNotAllowed.includes(update));
    
    if(!isAllowed)
        return res.status(400).send({ error : 'Invalid fields' });
    try {
        
        updates.forEach((update) => {member[update] = req.body[update]});
        await member.save();
        res.send(member);
    }catch(e) {
        console.log(e);
        res.status(400).send({error : 'Couldnt update member', message : e});
    }
});

module.exports = app;