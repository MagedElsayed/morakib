const config = require("../../config/config.json"),
      Sequelize = require("sequelize");

//Selecting the active environment database configs.
const env = process.env.APP_ENV || "development"; //default environment
const dbConf = config[env];

const db = new Sequelize(
    process.env.DB_NAME || dbConf.database, 
    process.env.DB_USERNAME || dbConf.username,
    process.env.DB_PASSWORD || dbConf.password,{
    dialect: dbConf.dialect,
    host: process.env.DB_HOSTNAME || dbConf.host,
    logging: false,
    pool: {
        min: 2,
        max: 5,
        acquire: 10000,
        idle: 60000
    }
});


//Export the db object.
module.exports = db;