const mongoose = require('mongoose');
const dotenv = require('dotenv')

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        console.log("Success!");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { connect };