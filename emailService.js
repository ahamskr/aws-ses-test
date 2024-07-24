const AWS = require('aws-sdk');
require('dotenv').config();

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION || 'ap-south-1'
}

const AWS_SES = new AWS.SES(SES_CONFIG);

const verifyEmailAddresses = async(emails) => {
    try{
        const verificationPromise = emails.map(async email => {
            const params = {
                EmailAddress: email
            }
            return await AWS_SES.verifyEmailIdentity(params).promise();
        });
    }
    catch(e){
        console.log("Email address could not be verified", error);
        return false;
    }
}

const sendEmail = async(emails, message) => {
    const params = {
        Source: 'dyo.chef.world@gmail.com',
        Destination: {
            ToAddresses: emails
        },
        Message: {
            Subject: {
                Data: 'Welcome to Dyo Chef'
            },
            Body: {
                Text: {
                    Data: message
                }
            }
        }
    }
    try{
        const data = await AWS_SES.sendEmail(params).promise();
        console.log("Email Sent ", data);
    }
    catch(error){
        console.log("Failed to send message ", error);
        throw error;
    }
}


module.exports = {
    sendEmail,
    verifyEmailAddresses,
    AWS_SES
}