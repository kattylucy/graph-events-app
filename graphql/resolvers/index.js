const authResolver = require('./auth');
const bookingResolver = require('./bookings');
const eventsResolver = require('./events');



module.exports = {  
    ...authResolver,
    ...bookingResolver,
    ...eventsResolver
}