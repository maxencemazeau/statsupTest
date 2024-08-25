const db = require('../db')

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
            COUNT(ActivityHistory.ActivityID) as TotalActivity,
            User.FirstName,
            User.LastName,
            User.UserID
        FROM ActivityHistory
        INNER JOIN User ON User.UserID = ActivityHistory.UserID
        WHERE ActivityHistory.UserID = ?
        `, [UserId, UserId, UserId])
        return query[0]
    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    GetProfilInfoAndStats
}