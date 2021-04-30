const jwt = require('jsonwebtoken');
const Members = require('../models/members');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = await jwt.verify(token, process.env.JWT_SALT);
        const member = await Members.findOne({_id : decoded._id, 'tokens.token': token});
        if(!member){
            throw new Error('User not found!');
        }
        req.token = token;
        req.member = member;
        next();
    }catch(error){
        res.status(401).send({error : "Please authenticate.."});
    }
}

module.exports = auth;