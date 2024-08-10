const db = require("../db");
const { historyFormattedDate } = require('../utils/historyFormattedDate')

const AddActivityHistory = async (ActivityID, TimeStamp, Count, Succeed, UserID) => {
    const query = await db.query(`INSERT INTO ActivityHistory (ActivityID, TimeStamp, Count, Succeed, UserID) values (?,?,?,?,?)`, [ActivityID, TimeStamp, Count, Succeed, UserID])
    return query[0].affectedRows
}

const DeleteActivityHistory = async (ActivityHistoryID) => {
    const query = await db.query(`DELETE FROM ActivityHistory WHERE ActivityHistoryID = ?`, [ActivityHistoryID])
    return query[0].affectedRows
}

const CheckDuplicateHistory = async (ActivityID, TimeStamp, today) => {
    try {
        const [query] = await db.query(`SELECT ActivityHistoryID, ActivityHistory.ActivityID,TimeStamp, Goals.Frequence 
            FROM ActivityHistory 
            LEFT JOIN Activity ON Activity.ActivityId = ActivityHistory.ActivityID
            LEFT JOIN Goals ON Activity.GoalsID = Goals.GoalsID
            WHERE ActivityHistory.ActivityID = ? ORDER BY ActivityHistoryID DESC LIMIT 1`, [ActivityID])
        if (query.length > 0) {
            return query[0]
        } else {
            return 0
        }

    } catch (err) {
        console.log(err)
    }
}

const CountActivityById = async (ActivityId) => {
    const query = await db.query(`SELECT COUNT(ActivityId) as activityCompleted FROM ActivityHistory WHERE ActivityID = ?`, [ActivityId])
    return query[0]
}

const ActivityStatsByWeek = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            COUNT(ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(WEEK, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber
            FROM 
            ActivityHistory
            WHERE 
            ActivityID = ?;
    `, [ActivityId])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

const ActivityStatsByDay = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            COUNT(ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(DAY, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber
            FROM 
            ActivityHistory
            WHERE 
            ActivityID = ?;
    `, [ActivityId])
        return query[0]
    } catch (err) {
        console.log(err)
    }

}

const ActivityStatsByMonth = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            COUNT(ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(MONTH, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber
            FROM 
            ActivityHistory
            WHERE 
            ActivityID = ?;
    `, [ActivityId])
        return query[0]
    } catch (err) {
        console.log(err)
    }

}

const GetTotalActivityCount = async (UserId) => {
    const [query] = await db.query(`SELECT COUNT(ActivityHistoryId) as TotalActivityCompleted FROM ActivityHistory WHERE UserID = ?`, [UserId])
    return query[0]
}

const UpdateNonSucceedActivity = (ActivityHistoryID) => {
    try {
        const query = db.query(`UPDATE ActivityHistory set Succeed = -1 WHERE ActivityHistoryID = ? AND Succeed <> 1`, [ActivityHistoryID])
        return (query[0])
    } catch (err) {
        console.log(err)
    }
}

const GetBestActivityStreak = async (ActivityID, UserID) => {
    try {
        const [query] = await db.query(`SELECT Succeed FROM ActivityHistory WHERE ActivityId = ? AND UserID = ? AND (Succeed = 1 OR Succeed = -1)`, [ActivityID, UserID])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

const GetActivityHistory = async (ActivityID) => {
    try {
        const [query] = await db.query(`SELECT ActivityHistoryID, Succeed, DATE_FORMAT(TimeStamp, '%Y-%m-%d') as TimeStamp, Count, ActivityHistory.ActivityID, Frequence 
            FROM ActivityHistory 
            INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
            INNER JOIN Goals ON Goals.GoalsID = Activity.GoalsID
            WHERE ActivityHistory.ActivityID = ?
            ORDER BY ActivityHistoryID DESC`, [ActivityID])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    AddActivityHistory,
    DeleteActivityHistory,
    CheckDuplicateHistory,
    CountActivityById,
    UpdateNonSucceedActivity,
    GetTotalActivityCount,
    ActivityStatsByWeek,
    ActivityStatsByMonth,
    ActivityStatsByDay,
    GetBestActivityStreak,
    GetActivityHistory
}