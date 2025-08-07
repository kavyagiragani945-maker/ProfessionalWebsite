require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Form Message',
        text: `From: ${name} <${email}>

${message}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send('Error sending message.');
        }
        res.send('Message sent successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
