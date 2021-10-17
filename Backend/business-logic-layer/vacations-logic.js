const dal = require("../data-access-layer/dal");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

async function getAllVacationsAsync() {
    const sql = `SELECT * FROM vacations`;
    const vacations = await dal.executeAsync(sql);
    for (const v of vacations) {
        v.startDate.setDate(v.startDate.getDate() + 1);//the date that comes back from database shows one day behind (because of timezone or something like that, this fixes it)
        v.endDate.setDate(v.endDate.getDate() + 1);//the date that comes back from database shows one day behind (because of timezone or something like that, this fixes it)
    }
    return vacations;
}

async function getFollowedVacationsAsync(userId) {
    const sql = `SELECT vacationId FROM followers WHERE userId=${userId}`;//all the rows where the user id shows in "followers" table in database
    const followedVacationsId = await dal.executeAsync(sql);
    let vacationIdStr = "";
    followedVacationsId.map((fv) => {
        vacationIdStr += fv.vacationId + ",";//string of all the vacationId he follows. I did this so i could use the "IN" sql operator
    })
    const newStr = vacationIdStr.substring(0, vacationIdStr.length - 1);//deletes the last character cause its a comma
    if (newStr !== "") {// if the user is following at least one vacation
        const secondSql = `SELECT * FROM vacations WHERE vacationId IN (${newStr})`;
        const followedVacations = await dal.executeAsync(secondSql);
        for (const v of followedVacations) {
            v.startDate.setDate(v.startDate.getDate() + 1);//the date that comes back from database shows one day behind (because of timezone or something like that, this fixes it)
            v.endDate.setDate(v.endDate.getDate() + 1);//the date that comes back from database shows one day behind (because of timezone or something like that, this fixes it)
        }
        return followedVacations;//return followed vacations
    }
    return [];//returns empty array in case he is currently not following any vacations
}

async function getUnFollowedVacationsAsync(userId) {
    const sql = `SELECT vacationId FROM followers WHERE userId=${userId}`;//all the rows where the user id shows in "followers" table in database
    const followedVacationsId = await dal.executeAsync(sql);
    let vacationIdStr = "";
    followedVacationsId.map((fv) => {
        vacationIdStr += fv.vacationId + ",";
    })
    const newStr = vacationIdStr.substring(0, vacationIdStr.length - 1);
    let secondSql = `SELECT * FROM vacations WHERE vacationId NOT IN (${newStr})`;//here I used the "NOT IN" sql operator to get all vacations which the user doesn't follow
    if (newStr === "") {
        secondSql = `SELECT * FROM vacations`;// if the user is not following any vacation, just get all vacations from database
    }
    const unFollowedVacations = await dal.executeAsync(secondSql);
    for (const v of unFollowedVacations) {
        v.startDate.setDate(v.startDate.getDate() + 1);//the date thing again
        v.endDate.setDate(v.endDate.getDate() + 1);//the date thing again
    }
    return unFollowedVacations;
}

async function followVacationAsync(userId, vacationId) {
    const sql = `INSERT INTO followers VALUES('${userId}', '${vacationId}')`;//add a row to "followers" table with userId and vacationId
    await dal.executeAsync(sql);
    return { userId, vacationId };
}
async function unFollowVacationAsync(userId, vacationId) {
    const sql = `DELETE FROM followers WHERE userId=${userId} AND vacationId=${vacationId}`;//delete the row from "followers" table that matches this userId and vacationId
    await dal.executeAsync(sql);
}

async function addVacationAsync(vacation, vacationImageFile) {
    const vacations = await getAllVacationsAsync();
    const maxId = vacations.reduce((maxId, v) => v.vacationId > maxId ? v.vacationId : maxId, 0);

    if (vacationImageFile) {//save image in images/vacations folder, with new name created using uuid
        const extension = vacationImageFile.name.substr(vacationImageFile.name.lastIndexOf("."));
        vacation.vacationImage = uuid.v4() + extension;
        const vacationImagesFolder = path.join(__dirname, "..", "images", "vacations", vacation.vacationImage);
        await vacationImageFile.mv(vacationImagesFolder);
    }
    const sql = `INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)`;//to prevent sql injection
    const info = await dal.executeAsync(sql, [vacation.location, vacation.startDate, vacation.endDate, vacation.price, vacation.description, vacation.vacationImage]);
    vacation.vacationId = info.insertId;

    return vacation;
}

async function updateVacationAsync(vacation, vacationImageFile) {

    const sql = `SELECT * FROM vacations WHERE vacationId=${vacation.vacationId}`;
    let vacationToUpdate = await dal.executeAsync(sql);
    vacationToUpdate = vacationToUpdate[0];

    if (vacationImageFile !== null) {//delete existing image from images/vacations folder 
        const imageFileToDelete = path.join(__dirname, "..", "images", "vacations", vacationToUpdate.vacationImage);
        try {
            if (imageFileToDelete && fs.existsSync(imageFileToDelete)) {
                fs.unlinkSync(imageFileToDelete);
            }
        }
        catch (err) { console.log(err.message) }
    }

    if (vacationImageFile !== null) {//save new image in images/vacations folder
        const extension = vacationImageFile.name.substr(vacationImageFile.name.lastIndexOf("."));
        vacation.vacationImage = uuid.v4() + extension;
        const imageFileToSave = path.join(__dirname, "..", "images", "vacations", vacation.vacationImage);
        await vacationImageFile.mv(imageFileToSave);
    }

    const secondSql = `UPDATE vacations SET
                 location=?,
                 price=?,
                 startDate=?,
                 endDate=?,
                 description=?,
                 vacationImage=?
                 WHERE vacationId=${vacation.vacationId}
                `;
    const info = await dal.executeAsync(secondSql, [vacation.location, vacation.price, vacation.startDate, vacation.endDate, vacation.description, vacation.vacationImage]);

    return info.affectedRows === 0 ? null : vacation;
}

async function deleteVacationAsync(vacationId) {
    const vacations = await getAllVacationsAsync();
    const index = vacations.findIndex(v => v.vacationId === vacationId);//the index is used for deleting the image from images/vacations folder 
    const sql = `DELETE FROM vacations WHERE vacationId=${vacationId}`;
    await dal.executeAsync(sql);

    if (index === -1) return;
    const imageFile = path.join(__dirname, "..", "images", "vacations", vacations[index].vacationImage);//here i used the index 
    try {
        if (!imageFile || !fs.existsSync(imageFile)) return;
        fs.unlinkSync(imageFile);
    }
    catch (err) { console.log(err.message) }

}

async function getFollowersAsync(vacationId) {//function that returns how many users follow this vacation
    const sql = `SELECT * FROM followers WHERE vacationId=${vacationId}`;//get all the rows where vacationId shows in "followers" table
    const followers = await dal.executeAsync(sql);
    let count = 0;
    for (const f of followers) {
        count++;
    }
    return count; //return follows amount
}


module.exports = {
    getAllVacationsAsync,
    getFollowedVacationsAsync,
    getUnFollowedVacationsAsync,
    addVacationAsync,
    followVacationAsync,
    unFollowVacationAsync,
    updateVacationAsync,
    deleteVacationAsync,
    getFollowersAsync
}