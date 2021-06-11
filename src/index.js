const express = require('express')
const app = express()
const db = require('./db/db')
const userRouter = require('./router/user')
const hotelRouter = require('./router/hotel')
const bookingRouter = require('./router/booking')
const adminRouter = require('./router/admin')
const cors = require('cors')


app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(hotelRouter)
app.use(bookingRouter)
app.use(adminRouter)



app.listen(8000, (err) => {
    if (err) {
        return console.log("error")
    }
    console.log("listen on port 3000")
})