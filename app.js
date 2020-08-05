///create server 
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose  = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');


const app = express();


app.use(bodyParser.json());



///configure graphql api
app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));


app.get('/', (req, res, next) => {
    res.send('hello')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-crhdv.mongodb.net/${process.env.MONGO_DB}`)
.then(() => {
    app.listen(8000);
    console.log('Server is running and DB is connected')
})
.catch(err => {
    console.log(err)
})


