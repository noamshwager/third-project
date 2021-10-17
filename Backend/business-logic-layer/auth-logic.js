const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const jwt = require("jsonwebtoken");

async function registerAsync(user) {
    user.password = cryptoHelper.hash(user.password);//salt and hash password
    const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, 'no')`;//to prevent sql injection
    const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.userName, user.password]);//add user to database
    user.userId = info.insertId;//insert id
    user.isAdmin = "no";//set isAdmin value as "no"
    delete user.password;//so the password wont be returned to front
    user.token = jwt.sign({ user }, config.jwtKey, { expiresIn: "5h" });//create token and add to user object
    return user;
}

async function loginAsync(credentials) {
    const sql = "SELECT * FROM users";
    const users = await dal.executeAsync(sql);
    credentials.password = cryptoHelper.hash(credentials.password);// salt and hash password to compare with salted and hashed password in database
    const user = users.find(u => u.userName === credentials.userName && u.password === credentials.password);
    if (!user) return null;
    delete user.password;//so the password wont be returned to front
    user.token = jwt.sign({ user }, config.jwtKey, { expiresIn: "5h" });//create token and add to user object
    return user;
}

module.exports = {
    registerAsync,
    loginAsync
}