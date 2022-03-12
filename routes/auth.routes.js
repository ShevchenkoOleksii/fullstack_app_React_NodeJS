const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jsonWebToken = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Email is not correct').isEmail(),
        check('password', 'Password is too short')
            .isLength({
                min: 6
            })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                // message: 'Registration data is invalid [auth.routes26]'
                message: errors.array()[0].msg
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
           return res.status(400).json({message: `the user already exists`})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: `User has been created!`})

    } catch (e) {
        console.log(e)
        const errorMessage = e.array()[0].msg
        // res.status(500).json({message: `something went wrong, try again`})
        res.status(500).json({message: `something went wrong 50 ${errorMessage}`})

    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'You entered not correct data'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Invalid password, try again'})
            }

            const token = jsonWebToken.sign(
                { userId: user.id },
                config.get('jsonWebTokenSecret'),
                { expiresIn: '1h' }
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({message: `something went wrong, try again`})
        }
})

module.exports = router