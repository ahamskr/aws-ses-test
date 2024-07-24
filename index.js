const express = require('express');
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const {sendEmail, verifyEmailAddresses, AWS_SES} = require("./emailService");

const app = express();

app.use(bodyParser.json());

// for testing whether the app is working fine or not
app.get('/status', (req,res) => res.send({status:'ok', AWS_SES}));

app.post('/verifyEmailAddresses', async(req, res) => {
    const {EmailAddresses} = req.body;
    if(!EmailAddresses || !Array.isArray(EmailAddresses) || EmailAddresses.length == 0){
        return res.status(400).json({
            message: "Invalid Email Format"
        });
    }
    try{
        const verificationSuccess = await verifyEmailAddresses(EmailAddresses);
        if(verificationSuccess){
            return res.json({
                success: true,
                message: 'Email verified successfully'
            });
        }
        else{
            return res.json({
                success: false,
                message: 'Failed to verify email address'
            });
        }
    }
    catch(error){
        console.log("Error while verifying emails ", error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
})


app.post('/sendEmail', async(req, res) => {
    const {EmailAddresses, message} = req.body;
    if(!EmailAddresses || !Array.isArray(EmailAddresses) || EmailAddresses.length == 0 || !message){
        return res.status(400).json({
            message: "Invalid Format"
        });
    }
    try{
        await sendEmail(EmailAddresses, message);
        return res.status(200).json({
            success: true,
            message: 'Email sent'
        })
    }
    catch(error){
        console.log("Error while sending emails ", error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }

});


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log("Server started on ", PORT);
// })


module.exports.handler = serverless(app);