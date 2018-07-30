const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require("body-parser"); //for json requests and responses

const cors = require('cors');

const Recipe = require('./Models/Recipe');
const User = require('./Models/User');

//Bring in Graphql/Express Middleware
const{ graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const{ makeExecutableSchema } = require('graphql-tools');

const{ typeDefs } = require('./Schema');
const{ resolvers } = require('./Resolvers');

//Create Graphql Schema
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
});

//connect to db using mongoose
mongoose.connect('mongodb://localhost/recipes');

//test db connection
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log('DB connected')
});

//initializa app
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));

//Create 
app.use('/graphiql', graphiqlExpress({
     endpointURL: '/graphql'
    }));


//Connect schemas with Graphql
app.use(
    '/graphql', 
    bodyParser.json(),
    graphqlExpress({
        schema,
        context: {
            Recipe,
            User
        }
}));

const PORT = process.env.PORT || 4444;

app.listenerCount(PORT);
 

app.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT)
});

