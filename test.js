const express = require("express")

const router = express()

router.get("/hi", (req, res) => {
  return res.send("Hi")
})

router.post("/hi", (req, res) => {
  return res.send("Hi from post")
})

module.exports = router