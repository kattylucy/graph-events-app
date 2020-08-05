const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

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
    },
    login: ({email, password}) => {
        User.findOne({email})
        .then(user => {
            if(!user){
                throw new Error('User does not exist')
            }
            bcrypt.compare(password, user.password)
            .then(password => {
                if(!password){
                    throw new Error('Incorrect credentials')
                }
                const token = jwt.sign({userId: user._id, email: user.email}, 'somesupersecretkey', {
                    expiresIn: '1h'
                });
                return { userId: user._id, token, tokenExpiration:1}
            })
            .catch(errPassword => { throw errPassword})
        })
        .catch(err => { throw err })

    }
}