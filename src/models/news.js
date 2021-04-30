const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    news : [{
        value : {
            type : String,
            required : false,
            trim : true
        }
    }]
});

//Getting details of news articles
newsSchema.methods.toJSON = function () {
    const current = this;
    return {
        news : current.news.map((article) => article.value)
    }
}
