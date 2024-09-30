const express = require("express")
const cors = require("cors")

const app = express()
const port = 3200

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/test", require("./test"))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
