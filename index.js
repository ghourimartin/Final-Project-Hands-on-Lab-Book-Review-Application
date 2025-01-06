const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Write the authenication mechanism here
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {

        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in authe" });
    }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>
    {
        console.log(`Server is running at:              curl -X GET http://localhost:${PORT}`)
        console.log(`for register at:                   curl -X POST http://localhost:${PORT}/register`)
        console.log(`for login at:                      curl -X POST http://localhost:${PORT}/customer/login`)
        console.log(`for auth_users revivew at:         curl -X PUT http://localhost:${PORT}/customer/auth/review/1`)
        console.log(`for auth_users revivew at:         curl -X DELETE http://localhost:${PORT}/customer/auth/review/1`)
    });
