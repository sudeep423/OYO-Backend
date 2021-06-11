const express = require('express')
const router = new express.Router()
const db = require('../db/db')


router.post('/admin/summary', async (req, res) => {
    try {
        const dateIn = req.body.dateIn
        const dateOut = req.body.dateOut
        const result = {}
        let query = `SELECT count(*) as total FROM user WHERE entryDate>="${dateIn}" and entryDate<="${dateOut}"`
        const userCount = await db.promise().query(query)
        result.totalUsers = userCount[0][0].total
        query = `SELECT count(*) as total FROM booking WHERE entryDate>="${dateIn}" and entryDate<="${dateOut}"`
        const bookingCount = await db.promise().query(query)
        result.totalBooking = bookingCount[0][0].total
        query = `SELECT count(*) as total FROM hotel WHERE entryDate>="${dateIn}" and entryDate<="${dateOut}"`
        const hotelCount = await db.promise().query(query)
        result.totalHotel = hotelCount[0][0].total
        res.status(200).send(result)

    } catch (err) {
        res.status(500).send('Server Error')
    }
})


module.exports = router