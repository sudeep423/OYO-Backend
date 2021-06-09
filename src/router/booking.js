const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const bcrypt = require('bcryptjs')
const dateFormat = require('../utils/shared')

router.post('/hotel/:city', async (req, res) => {
    try {
        //console.log(req.body)
        const query1 = `(SELECT hotel.id as id,hotelName,Address,city,pinCode,state ,qtyRooms, rentPerRoomPerDay FROM rooms, hotel WHERE rooms.hotelId=hotel.id and hotel.city="${req.params.city}") as s1`
        //console.log(query1)
        const dateCondition = `(("${req.body.dateOut}" > booking.dateIn and   "${req.body.dateOut}" <= booking.dateOut)  or ( "${req.body.dateIn}" >= booking.dateIn  and "${req.body.dateIn}" < booking.dateOut)) or ("${req.body.dateIn}" <= booking.dateIn and "${req.body.dateOut}" >= booking.dateOut)`
        const query2 = `(SELECT hotelId,sum(qtyRooms) as booked from booking, hotel where booking.hotelId=hotel.id and ${dateCondition} group by hotelId) as s2`

        const query = `SELECT * , s1.qtyRooms-IFNULL(s2.booked,0) as available FROM ${query1} left join ${query2} ON s1.Id=s2.hotelId`

        //console.log(query)
        db.query(query, (err, result) => {
            if (err) {
                return res.status(400).send(err)
            }
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).send("server Error")
    }
})

router.post('/booking', async (req, res) => {
    try {
        const booking = req.body
        booking.dateOut = new Date(booking.dateIn)
        booking.dateOut.setDate(booking.dateOut.getDate() + booking.stayDay)
        booking.dateOut = booking.dateOut.toDateString("yyyy-MM-dd")
        booking.dateOut = dateFormat(booking.dateOut)
        delete booking.stayDay
        console.log(booking)

        const query = "INSERT INTO booking SET ?"
        db.query(query, booking, (err, result) => {
            if (err) {
                return res.status(400).send(err)
            }
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).send("server error")
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const query = `SELECT * FROM user WHERE emailId = "${req.body.emailId}"`
        const user = await db.promise().query(query)
        const isMatch = await bcrypt.compare(req.body.password, user[0][0].password)
        if (!isMatch) {
            return res.status(400).send({ error: "kill him" })
        }
        res.status(200).send("kill")
    } catch (err) {
        res.status(500).send("Server error")
    }
})



module.exports = router