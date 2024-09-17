const db = require("../db")

const GetFeed = async (UserID) => {
    try {
        const query = await db.query(`SELECT 
    Activity.ActivityName, 
    Goals.GoalName, 
    ActivityHistory.ActivityHistoryID, 
    ActivityHistory.Succeed, 
    ActivityHistory.TimeStamp,
    Activity.ActivityID,
    ActivityHistory.ActivityID,
    User.UserID, 
    User.FirstName, 
    User.LastName,
    TimeFrame.Frame
FROM User
INNER JOIN Activity ON Activity.UserID = User.UserID
INNER JOIN ActivityHistory ON Activity.ActivityID = ActivityHistory.ActivityID
INNER JOIN Goals ON Activity.GoalsID = Goals.GoalsID
INNER JOIN Follow ON Follow.FollowingID = User.UserID
INNER JOIN TimeFrame ON Goals.TimeFrameID = TimeFrame.TimeFrameID
WHERE Follow.FollowerID = ?
ORDER BY TimeStamp DESC
LIMIT 100`, [UserID])
        console.log(query[0])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

module.exports = { GetFeed }