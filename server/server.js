const express = require('express');
//const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

const routes = require('./routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1999;

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client/dist')));
//app.use(authMiddleware);
//app.use(session(sessionObj));

app.use(routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist/index.html')));
}
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 127.0.0.1:27017
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/setlist-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(PORT, () => console.log('http://localhost:' + PORT));