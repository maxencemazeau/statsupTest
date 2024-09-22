const userServices = require('../services/UserServices');
const { ConvertPhotoToUri } = require("../utils/convertPhotoToUri");

const userLogin = async (req, res) => {
    let { email, password } = req.query;

    try {
        email = email.trim().toLowerCase()
        password = password.trim()
        const user = await userServices.userLoginService(email, password);
        if (user !== null && user.user.Photo !== null) {
            user.user.Photo = ConvertPhotoToUri(user.user.Photo)
        }
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error in userLogin:', error); // Log the error for debugging
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsersService();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const userSignUp = async (req, res) => {
    let { email, firstName, lastName, password } = req.body;
    try {
        firstName = firstName.trim().toLowerCase()
        lastName = lastName.trim().toLowerCase()
        password = password.trim()
        const username = firstName + " " + lastName
        email = email.trim().toLowerCase();
        const user = await userServices.userSignUpService(email, firstName, lastName, username, password);
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const user = async (req, res) => {
    const user = await userServices.user()
    res.send(user)
}

module.exports = { userLogin, getAllUsers, userSignUp, user };
