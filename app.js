///create server 
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');

///models
const Event = require('./models/event');
const User = require('./models/user');

const app = express();


app.use(bodyParser.json());

///configure graphql api
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            date: String!
            price: Float!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type RootQuery{
            events: [Event]!
        }
        
        type RootMutation{
            createEvent(eventInput:EventInput): Event
            createUser(userInput:UserInput): User
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then( events => {
                return events;
            })
            .catch(err => { throw err})
        },
        createEvent: (args) => {
            const event = new Event({
               title: args.eventInput.title,
               description: args.eventInput.description,
               price: +args.eventInput.price,
               date: args.eventInput.date
            });
            return event
            .save()
            .then(response => {
                console.log(response)
                return {...response._doc}
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        },
        createUser: (args) => {
            return bcrypt
            .hash(args.userInput.password, 12).then(hashedPassword =>
            {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save()
                .then(resultUser => {
                    return resultUser
                })
                .catch(err => { throw err})
            })
            .catch(err => { throw err})
        }
    },
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


