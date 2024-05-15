const express = require('express')
const router = express.Router()

router.get('/foodData', async (req, res) => {
  try {
    console.log(global.food_items)
    res.json([global.food_items, global.foodCategory])
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

module.exports = router
