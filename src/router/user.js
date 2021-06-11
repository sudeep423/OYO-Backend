const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const bcrypt = require('bcryptjs')

router.post('/user/signup', async (req, res) => {
    try {
        const user = req.body
        console.log("enter")
        user.password = await bcrypt.hash(user.password, 8)
        user.entryDate = new Date().toISOString().slice(0, 10)
        console.log(user)
        const query = "INSERT INTO user SET ?"
        db.query(query, user, (err, result) => {
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
        console.log(req.body)
        const user = await db.promise().query(query)
        if (user[0][0] === undefined) {
            return res.status(404).send({ error: "user not found" })
        }
        
        const isMatch = await bcrypt.compare(req.body.password, user[0][0].password)
        if (!isMatch) {
            console.log("selef")
            return res.status(400).send({ error: "kill him" })
        }
        res.status(200).send(user[0][0])
    } catch (err) {
        res.status(500).send("Server error")
    }
})



module.exports = router