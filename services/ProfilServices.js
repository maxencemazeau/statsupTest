const db = require('../db')

const GetMyProfil = async (UserId) => {
    const query = await db.query(`SELECT FirstName, LastName, UserID, Photo FROM User 
        WHERE User.UserID = ?`, [UserId])
    return query[0]
}

const GetOtherProfil = async (UserId, MyUserID) => {
    const query = await db.query(`SELECT 
    User.FirstName, 
    User.LastName, 
    User.UserID, 
    CASE 
        WHEN Follow.FollowID IS NOT NULL THEN 1
        ELSE 0
    END AS isFollowing
FROM 
    User
LEFT JOIN 
    Follow 
    ON User.UserID = Follow.FollowingID AND Follow.FollowerID = ?
WHERE 
    User.UserID = ?`, [MyUserID, UserId])
    return query[0]
}

const GetProfilInfoAndStats = async (UserId) => {
    try {
        const query = await db.query(`SELECT 
            (SELECT ActivityName 
             FROM ActivityHistory
             INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
             WHERE ActivityHistory.UserID = ?
             GROUP BY ActivityName
             ORDER BY COUNT(ActivityHistory.ActivityID) DESC 
             LIMIT 1) AS MostDoneActivity,
            
            (SELECT GoalName 
             FROM ActivityHistory
             INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
             INNER JOIN Goals ON Activity.GoalsID = Goals.GoalsID
             WHERE Goals.UserID = ?
             GROUP BY GoalName 
             ORDER BY COUNT(Goals.GoalsID) DESC 
             LIMIT 1) AS MostDoneGoal,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) AS TotalAchievedGoals,
            
            COUNT(CASE WHEN Succeed = 1 OR Succeed = -1 THEN 1 END) AS TotalGoals,
            
            (COUNT(CASE WHEN Succeed = 1 THEN 1 END) * 100 / COUNT(*)) AS SuccessRate,
            COUNT(ActivityHistory.ActivityID) as TotalActivity
        FROM ActivityHistory
        WHERE ActivityHistory.UserID = ?
        `, [UserId, UserId, UserId])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

const GetActivityProfilList = async (UserId) => {
    const query = await db.query(`SELECT 
    Activity.ActivityName, 
    Activity.ActivityID,
    Goals.GoalName,
    Goals.Frequence,
    Frame,
    COUNT(ActivityHistory.ActivityID) as TotalActivity,
    COUNT(CASE WHEN Succeed = 1 THEN 1 END) AS TotalAchievedGoals,     
    COUNT(CASE WHEN Succeed = 1 OR Succeed = -1 THEN 1 END) AS TotalGoals 
    FROM 
    Activity
    LEFT JOIN 
    ActivityHistory ON Activity.ActivityID = ActivityHistory.ActivityID
    LEFT JOIN Goals ON Goals.GoalsID = Activity.GoalsID 
    LEFT JOIN TimeFrame ON TimeFrame.TimeFrameID = Goals.TimeFrameID
    WHERE 
    ActivityHistory.UserID = ?
    GROUP BY 
    Activity.ActivityID;`, [UserId])
    return query[0]
}

const GetBestGoalStreak = async (UserId) => {
    try {
        const query = await db.query(`SELECT Activity.ActivityID ,Succeed FROM ActivityHistory 
                    INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
                    INNER JOIN Goals ON Activity.GoalsID = Goals.GoalsID
                    WHERE ActivityHistory.UserID = ? AND (Succeed = 1 OR Succeed = -1)
                    ORDER BY ActivityID`, [UserId])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

const ChangeProfilPhoto = async (Photo, UserID) => {
    try {
        const query = await db.query(`UPDATE User set Photo = ? WHERE UserID = ?`, [Photo, UserID])

        if (query.affectedRows > 0) {
            return 1
        } else {
            return 0
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    GetMyProfil,
    GetOtherProfil,
    GetProfilInfoAndStats,
    GetActivityProfilList,
    GetBestGoalStreak,
    ChangeProfilPhoto
}