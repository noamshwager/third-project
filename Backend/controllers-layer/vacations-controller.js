const vacationsLogic = require("../business-logic-layer/vacations-logic");
const express = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const path = require("path");
const fs = require("fs");
const socketHelper = require("../helpers/socket-helper");
const Vacation = require("../models/vacation");
const router = express.Router();

router.get("/", verifyAdmin, async (request, response) => {//get all vacations, used in admin vacation list 
    try {
        const vacations = await vacationsLogic.getAllVacationsAsync();
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/followed/:id", verifyLoggedIn, async (request, response) => {//get all vacations the user is following. used in vacation list component
    try {
        const id = +request.params.id;
        const vacations = await vacationsLogic.getFollowedVacationsAsync(id);
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/un-followed/:id", verifyLoggedIn, async (request, response) => {//get all vacations the user is not following. used in vacation list component
    try {
        const id = +request.params.id;
        const vacations = await vacationsLogic.getUnFollowedVacationsAsync(id);
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/followed/:userId/:vacationId", verifyLoggedIn, async (request, response) => {// route for when the user tries to follow a vacation(pressing follow button)
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        await vacationsLogic.followVacationAsync(userId, vacationId);
        response.status(201).json({ userId, vacationId });

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/", verifyAdmin, async (request, response) => {// add new vacation
    try {
        const vacationWithModel = new Vacation(request.body);

        const errors = vacationWithModel.validate();//validation
        if (errors) return response.status(400).send(errors); //validation

        const addedVacation = await vacationsLogic.addVacationAsync(vacationWithModel, request.files ? request.files.vacationImageFile : null);
        response.status(201).json(addedVacation);

        socketHelper.vacationAdded(addedVacation);//use socketHelper to emit vacationAdded
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/followed/:userId/:vacationId", verifyLoggedIn, async (request, response) => {//user is tries to unfollow vacation. (pressing unfollow button)
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        await vacationsLogic.unFollowVacationAsync(userId, vacationId);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.put("/:vacationId", verifyAdmin, async (request, response) => {//route for when admin edits/updates a vacation
    try {
        const vacationId = +request.params.vacationId;

        const vacationWithModel = new Vacation(request.body);//for validation

        const errors = vacationWithModel.validate();//validation
        if (errors) return response.status(400).send(errors);//validation

        vacationWithModel.vacationId = vacationId;

        const updatedVacation = await vacationsLogic.updateVacationAsync(vacationWithModel, request.files ? request.files.vacationImageFile : null);
        response.json(updatedVacation);

        socketHelper.vacationUpdated(updatedVacation);// emit "msg-from-server-vacation-updated"

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/:vacationId", verifyAdmin, async (request, response) => {//admin deleting a vacation
    try {
        const vacationId = +request.params.vacationId;
        await vacationsLogic.deleteVacationAsync(vacationId);
        response.sendStatus(204);

        socketHelper.vacationDeleted(vacationId);//emit vacationDeleted
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/images/:vacationImage", (request, response) => {//get the image vacation(used for displaying the image in a vacation card)
    try {
        const vacationImage = request.params.vacationImage;

        let imageFile = path.join(__dirname, "..", "images", "vacations", vacationImage);

        if (!fs.existsSync(imageFile)) imageFile = path.join(__dirname, "..", "images", "not-found.jpg");

        response.sendFile(imageFile);//return the image 

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/followers/:vacationId", async (request, response) => {//get how many followers follow a specific vacation
    try {
        const vacationId = request.params.vacationId;
        const followers = await vacationsLogic.getFollowersAsync(vacationId);
        response.json(followers); //a number
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})

module.exports = router;