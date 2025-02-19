const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')

// ----------------> SIGN UP: chech if USERNAME exist <----------------
router.get('/signup', (req, res) => {

    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Please complete all the CAMPOS¿?' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup', { errorMessage: 'Username already exist' })
                return
            }
        })
        .catch(error => next(error))

    if (plainPassword.length <= 3) {
        res.render('auth/signup', { errorMessage: 'Please introduce a valid password. At least 3 characters' })
        return
    }



    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(error => next(error))

})


// ----------------> LOGIN <----------------
router.get('/login', (req, res) => {

    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, plainPassword } = req.body
    // res.send(req.body)

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Username not registered' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Wrong password' })
                return
            }
            console.log(user)

            req.session.currentUser = user
            res.redirect('/')
        })
        .catch(error => next(error))
    
})
    




module.exports = router
