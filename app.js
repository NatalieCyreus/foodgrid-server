const express = require ('express');
const session = require('express-session');
const passport = require('passport');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const db = require('./config/keys').uri;
const cors = require('cors');

const app = express();

mongoose.Promise = global.Promise;

// allow cross-origin requests
app.use(cors());

mongoose.connect(db);
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: db,
    autoReconnect: true
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
 console.log('now listening for requests on port 4000')
});
