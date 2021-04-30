const connectURL = process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/bar-members';
const mongoose = require('mongoose');
console.log(connectURL);
mongoose.connect(connectURL, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
});