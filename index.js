const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Define transporter outside of route handlers
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'prayagatwork2@gmail.com', // Your Gmail email address
        pass: 'rhhq mzse bqvy triy' // Your Gmail password
    }
});

mongoose.connect('mongodb+srv://prayagatwork2:admin54321@cluster0.koogrwh.mongodb.net/info?retryWrites=true&w=majority');

// Fetch users and render users page
app.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render('users', { users: users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Define the route to handle accepting requests
app.post('/accept', async (req, res) => {
    try {
        // Send email to the user with accepted request
        const { userId } = req.body;
        const user = await User.findByIdAndDelete(userId); // Assuming you have a User model
        if (!user) {
            return res.status(404).send('User not found');
        }

        const mailOptions = {
            from: 'your-email@gmail.com', // Your Gmail email address
            to: user.Email, // User's email address
            subject: 'Request Accepted',
            text: `Dear ${user.Name},\n\nYour request has been accepted.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully');
                res.render("/");
            }
        });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).send('Error accepting request');
    }
});

// Define the route to handle rejecting requests
app.post('/reject', async (req, res) => {
    try {
        // Send email to the user with rejected request
        const { userId } = req.body;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const mailOptions = {
            from: 'your-email@gmail.com', // Your Gmail email address
            to: user.Email, // User's email address
            subject: 'Request Rejected',
            text: `Dear ${user.Name},\n\nYour request has been rejected.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully');
                res.render("/");
            }
        });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).send('Error rejecting request');
    }
});

app.listen(port, function () {
    console.log("server is up and live");
});
