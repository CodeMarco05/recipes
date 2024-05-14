const dotenv = require('dotenv')

dotenv.config()

const string = process.env.CONNECTION_MONGO_DB

console.log(string)