const express = require('express') //express module
require('dotenv').config() //dotenv to get database creds stored in .env file
const {
    createPool
} = require('mysql') //mysql module
const port = process.env.PORT || 3000
const pool = createPool({
        "host": process.env.host, //host cred
        "user": process.env.user, //user cred
        "password": process.env.password, //password cred
        "database": process.env.database //database //cred
    }) //database creds
const app = express() //creating express app
app.use(express.json()) //enabling json
app.use(express.urlencoded({ extended: false }))
app.get("/", (req, res) => {
        res.status(200).json({ "Welcome_msg": "Hello!Type /countries and /countries/:countryname?queries to get started", "About": "Click here" })
    }) //initial route
app.get("/countries", (req, res) => {
        pool.query("SELECT * FROM gas_emissions ORDER BY year ASC", (err, results, fields) => {
            if (err) {
                return res.status(404).json({
                        "msg": "Whooops! Data Not found"
                    }) //data not found
            }
            return res.status(200).json({ "results": results }) //getting json response containing all the results
        })
    }) //main route
app.get("/countries/:country", (req, res) => {
        const { params, query } = req //getting param and query values from req using destructure property of JS
        const { country } = params //getting country
        let { startYear, endYear, gases } = query //getting query fields
        let gases_obj = {
                'sf6': 'sulphur',
                'ghs': 'greenhouse',
                'hfcs': 'hydrofluorocarbons',
                'co2': 'carbon',
                'no2': 'nitrous',
                'ch4': 'methane',
                'pfcs': 'perfluorocarbons'
            } //declaring gases
        gases = gases ? gases.split(',').map(i => i.toLowerCase()) : [] //gases value check
        const sYear = startYear ? startYear : 1990 //startYear value check
        const eYear = endYear ? endYear : 2014 //endYear value check
        if (startYear > endYear) return res.status(400).json({ "msg": "start year must be less than end year" }) //sending json response with status code of 400 as bad query parameters were produced by the user
        pool.query("SELECT * FROM gas_emissions WHERE country=? AND year>=? AND year<=? ORDER BY year ASC", [country, sYear, eYear], (err, results, fields) => {
            if (err) {
                return res.status(400).json({ "msg": "Whoops! Invalid request..." }) //error check
            } else if (results.length == 0) {
                return res.status(400).json({ "msg": "Whoops! Invalid request query parameters..." }) //sending json response with a status code of 400 because of invalid query parameters were produced by the user
            }
            if (gases.length) {
                //checks if user has provided any gas attributes or not
                let gases_frs = gases.map(i => gases_obj[i]) //getting perspective gas values from gases_obj
                let resu = results.filter(i => gases_frs.includes(i.gas_cat.split("_")[0])) //filtering the results based on gas provided by the user
                results = resu //setting the results
            }
            return res.status(200).json({ "results": results }) //sending json response containing results with a status code of 200 as there are no errors.
        })
    }) //queries route
app.listen(port) //setting the port