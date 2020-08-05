const Event = require('../../models/event');


module.exports = {
    events: () => {
        return Event
        .find()
        .then( events => {
            return events
        })
        .catch(err => { throw err})
    },
    createEvent: (args) => {
        const event = new Event({
           title: args.eventInput.title,
           description: args.eventInput.description,
           price: +args.eventInput.price,
           date: args.eventInput.date,
           creator: '5f29e807c927332079ad435c'
        });
        let createdEvent;
        return event
        .save()
        .then(response => {
            createdEvent = response;
            return User.findById('5f29e807c927332079ad435c')
            .then(user => {
                if(!user){
                    throw new Error('user dont exist')
                }
                user.createdEvents.push(event)
                return user.save()
            })
        })
        .then(result => {
            return createdEvent
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    },
}