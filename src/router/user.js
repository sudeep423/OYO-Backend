const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const bcrypt = require('bcryptjs')

router.post('/user/signup', async (req, res) => {
    try {
        const user = req.body
        user.password = await bcrypt.hash(user.password, 8)
        console.log(user)
        const query = "INSERT INTO user SET ?"
        db.query(query, user, (err, result) => {
            if (err) {
                res.status(400).send(err)
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