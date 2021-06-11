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
        booking.entryDate = Date.now()
        booking.entryDate = dateFormat(booking.entryDate)
        booking.dateOut = new Date(booking.dateIn)
        booking.dateOut.setDate(booking.dateOut.getDate() + booking.stayDay)
        booking.dateOut = booking.dateOut.toDateString("yyyy-MM-dd")
        booking.dateOut = dateFormat(booking.dateOut)
        console.log(booking)
        const dateCondition = `(("${booking.dateOut}" > booking.dateIn and   "${booking.dateOut}" <= booking.dateOut)  or ( "${booking.dateIn}" >= booking.dateIn  and "${req.body.dateIn}" < booking.dateOut)) or ("${req.body.dateIn}" <= booking.dateIn and "${req.body.dateOut}" >= booking.dateOut)`
        const q1 = `SELECT sum(qtyRooms)  as booked FROM booking Where hotelId=${booking.hotelId} and ${dateCondition}`
        const q2 = `SELECT qtyRooms, rentPerRoomPerDay FROM rooms WHERE hotelId=${booking.hotelId}`
        console.log(q1, q2)
        const resultQ1 = await db.promise().query(q1)
        const resultQ2 = await db.promise().query(q2);
        //console.log(resultQ1)
        if (resultQ1[0][0].booked + booking.qtyRooms > resultQ2[0][0].qtyRooms) {
            return res.status(400).send("Suffecient room is not available for booking")
        }
        booking.rent = booking.qtyRooms * resultQ2[0][0].rentPerRoomPerDay * booking.stayDay
        delete booking.stayDay
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



module.exports = router