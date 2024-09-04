const db = require("../db")

const GetFriendList = async (UserID) => {
    const query = await db.query(`SELECT FirstName, LastName, UserID FROM Follow
        INNER JOIN User ON Follow.FollowingID = User.UserID
        WHERE Follow.FollowerID = ?
        `, [UserID])
    return query[0]
}

module.exports = {
    GetFriendList
}