const connectURL = process.env.MONGO_CONNECTION_STRING || 'mongodb+srv://Debopam:1mNbp13lRj0ynihz@cluster0.cfpgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mongoose = require('mongoose');
console.log(connectURL);
mongoose.connect(connectURL, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
});