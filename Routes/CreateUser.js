const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const { validationResult, body } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwrSecret = 'MynameisDeepakMishraandIamafullstackdeveloper'

router.post(
  '/createuser',
  body('name').isLength({ min: 5 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    try {
      await User.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        location: req.body.location,
      })
      res.json({ success: true })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
  }
)

router.post(
  '/loginuser',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }
    try {
      let userData = await User.findOne({
        email: req.body.email,
      })
      if (!userData) {
        return res.status(400).json({ success: false, error: 'Invalid Email' })
      }

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userData.password
      )
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid Password' })
      }

      const data = {
        user: {
          id: userData.id,
        },
      }

      const authToken = jwt.sign(data, jwrSecret)

      return res.json({ success: true, authToken })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
  }
)

module.exports = router
