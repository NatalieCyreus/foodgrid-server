const express = require ('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const db = require('./config/keys').uri;
const cors = require('cors');

const app = express();

// allow cross-origin requests
app.use(cors());

mongoose.connect(db);
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
 console.log('now listening for requests on port 4000')
});
