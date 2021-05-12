const express = require("express");
const memberRouter = require("./routers/Members");
const noticesRouter = require("./routers/Notices");
const port = process.env.PORT || 5000;
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());

//Accept JSON request body
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))

app.listen(port, ()=> console.log('Server is up on port ' + port));
//Using the router for Members
app.use(memberRouter);
//Using the router for Notices
app.use(noticesRouter);