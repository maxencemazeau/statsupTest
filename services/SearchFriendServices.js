const db = require("../db")

const GetUserSearch = async (UserID, search) => {
    try {
        const query = await db.query(`SELECT FirstName, LastName, FollowingID, FollowerID, UserID,
            CASE 
            WHEN Follow.FollowerID IS NOT NULL AND Follow.FollowerID = ? THEN 1
            ELSE 0
            END AS isFollowing
            FROM User 
            LEFT JOIN Follow ON User.UserID = Follow.FollowingID
            WHERE FirstName LIKE ? AND UserID != ?`, [UserID, `${search}%`, UserID])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

const FollowUser = async (FollowingId, FollowerId) => {
    try {
        const query = await db.query(`INSERT INTO Follow (FollowingID, FollowerID) values (?,?)`, [FollowingId, FollowerId])
        if (query[0].affectedRows > 0) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

const UnFollowUser = async (FollowingId, FollowerId) => {
    try {
        const query = await db.query(`DELETE FROM Follow WHERE FollowingID = ? AND FollowerID = ?`, [FollowingId, FollowerId])
        if (query[0].affectedRows > 0) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

module.exports = {
    GetUserSearch,
    FollowUser,
    UnFollowUser
}