const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const bcrypt = require('bcryptjs')

router.post('/owner/signup', async (req, res) => {
    try {
        const user = req.body
        user.password = await bcrypt.hash(user.password, 8)

        user.entryDate = Date.now()
        user.entryDate = dateFormat(user.entryDate)

        const query = "INSERT INTO hotel SET ?"
        db.query(query, user, (err, result) => {
            if (err) {
                return res.status(400).send(err)
            }
            let room = `INSERT INTO rooms SET hotelId =${result.insertId}`
            db.query(room, (err, resul) => {
                if (err) {
                    return res.status(400).send(err)
                }
                console.log(resul)
            })
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).send("server error")
    }
})

router.post('/owner/login', async (req, res) => {
    try {
        const query = `SELECT * FROM hotel WHERE emailId = "${req.body.emailId}"`
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


router.patch('/owner/update/:id', async (req, res) => {
    try {
        const rooms = req.body
        const query = `UPDATE rooms SET qtyRooms = ${rooms.qtyRooms} , rentPerRoomPerDay = ${rooms.rentPerRoomPerDay} WHERE hotelId = ${req.params.id}`
        db.query(query, (err, result) => {
            if (err) {
                return res.status(400).send(err)
            }
            return res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).send("Server Error")
    }
})


router.post('/owner/:date', async (req, res) => {
    try {
        const query = `SELECT * FROM booking WHERE hotelId=${req.body.id} and entryDate="${req.params.date}"`
        console.log(query)
        db.query(query, (err, result) => {
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