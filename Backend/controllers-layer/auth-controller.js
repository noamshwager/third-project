const authLogic = require("../business-logic-layer/auth-logic");
const express = require("express");
const Credentials = require("../models/credentials");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        const userWithModel=new User(request.body);//for validation

        const errors = userWithModel.validate()//validation
        if (errors) return response.status(400).send(errors);//validation

        const addedUser = await authLogic.registerAsync(userWithModel);
        response.status(201).json(addedUser);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/login", async (request, response) => {
    try {
        const credentialsWithModel=new Credentials(request.body);//for validation
        
        const errors = credentialsWithModel.validate()//validation
        if (errors) return response.status(400).send(errors);//validation
        
        const loggedInUser = await authLogic.loginAsync(credentialsWithModel);
        if (!loggedInUser) {
            return response.status(401).send("Incorrect username or password.");
        }

        response.json(loggedInUser);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;