const bcrypt = require('bcryptjs');
///models
const User = require('../../models/user');

module.exports = {  
    createUser: (args) => {
        return User.findOne({email:args.userInput.email}).then(user => {
            if(user){
                throw new Error('User exist already')
            }
            return bcrypt
            .hash(args.userInput.password, 12)
        })
        .then(hashedPassword =>
        {
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            return user.save()
            .then(resultUser => {
                return {email:resultUser.email, password:null}
            })
            .catch(err => { throw err})
        })
        .catch(err => { throw err})
    }
}