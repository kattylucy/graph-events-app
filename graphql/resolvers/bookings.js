const Booking = require('../../models/booking');



module.exports = {
    bookings: () => {
        return Booking
        .find()
        .then(bookings => {
            return bookings;
        })
        .catch(err => { throw err})
    },
    bookEvent: (args) => {
        const booking = new Booking({
            event: args.eventId
        })
        booking.save()
        .then(booking => { return booking })
        .catch(err => { throw err})
    },
    cancelBooking: (args) => {
        Booking.deleteOne({_id:args.bookingId})
        .then(booking => console.log(booking))
        .catch(err => { throw err })
    }
}