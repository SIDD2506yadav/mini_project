const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
    "sk_test_51JWFNJSCJtrsbBWebkchMus2kQdB31XuT8L69bz3OOD7KTlatsafZkQ2ylPhsEb175sUSURsjdIgGQZrUeeJ7Xuf00VuPSbRDz"
);
require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(
    express.urlencoded({
        extended: true,
    })
);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

app.post("/payments/create", async (req, res) => {
    try {
        const { total } = req.query;
        const newTotal = parseInt(total);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: newTotal,
            currency: "inr",
        });

        res.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
    }
});

app.post("/sendmail", async (req, res) => {
    const { email, orderId, orderItem } = req.query;
    let info = await transporter.sendMail({
        from: "shophubbusiness123@gmail.com",
        to: `${email}`,
        subject: `Order Id: ${orderId}`,
        text: `Your order for order id ${orderId} has been placed.\nOrder items:\n${orderItem}`,
    });

    transporter.sendMail(info, function (err, data) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Email sent successfully.");
            res.json("Email sent successfully");
        }
    });
});

app.listen(5000, () => {
    console.log("Server started at port 5000");
});
