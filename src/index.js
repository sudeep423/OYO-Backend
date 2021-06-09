const express = require('express')
const app = express()
const db = require('./db/db')
const userRouter = require('./router/user')
const hotelRouter = require('./router/hotel')
const bookingRouter = require('./router/booking')

app.get('/createDatabase', async (req, res) => {
    var query = "CREATE TABLE booking (id INT AUTO_INCREMENT , hotelId int NOT NULL, qtyRooms int DEFAULT 0, rent float DEFAULT 0, userId int NOT NULL, dateIn DATE NOT NULL , dateOut DATE NOT NULL, PRIMARY KEY (id) , FOREIGN KEY (hotelId) REFERENCES hotel(id) ,FOREIGN KEY (userId) REFERENCES user(id))"
    db.query(query, (err, res) => {
        if (err) {
            return console.log(err)
        }
        console.log(res)
    })
})

app.use(express.json())
app.use(userRouter)
app.use(hotelRouter)
app.use(bookingRouter)



app.listen(3000, (err) => {
    if (err) {
        return console.log("error")
    }
    console.log("listen on port 3000")
})