const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    notice : {
        type : String,
        required : false,
        trim : true
    },
    priority : {
        type : Number,
        default : 1
    }
});

//Getting details of news articles
noticeSchema.methods.toJSON = function () {
    const current = this;
    return {
        id : current._id,
        notice : current.notice,
        priority : current.priority
    }
}

//Create Notice collection
const Notices = mongoose.model('Notices', noticeSchema);
module.exports = Notices;
