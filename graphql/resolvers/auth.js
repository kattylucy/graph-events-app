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
    login: async ({email, password}) => {
        const user = await User.findOne({email: email})
        if(!user){
            throw new Error('Invalid credentials');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('invalid credentials');
        }
        const token = jwt.sign({ userId: user._id, email:user.email }, 'supersecrettoken', {
            expiresIn: '1h'
        });

        return {userId: user._id, token: token, tokenExpiration:1}
    }
}