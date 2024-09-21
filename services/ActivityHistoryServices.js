const db = require("../db");
const { historyFormattedDate } = require('../utils/historyFormattedDate')

const AddActivityHistory = async (ActivityID, TimeStamp, Count, Succeed, UserID, HoursSpent, GoalsID, Frequence) => {
    try {
        const query = await db.query(`INSERT INTO ActivityHistory (ActivityID, TimeStamp, Count, Succeed, UserID, HoursSpent, GoalsID, Frequence) values (?,?,?,?,?,?,?,?)`,
            [ActivityID, TimeStamp, Count, Succeed, UserID, HoursSpent, GoalsID, Frequence])
        return query[0].affectedRows
    } catch (err) {
        console.log(err)
        return 0
    }
}

const DeleteActivityHistory = async (ActivityHistoryID) => {
    try {
        const query = await db.query(`DELETE FROM ActivityHistory WHERE ActivityHistoryID = ?`, [ActivityHistoryID])
        return query[0].affectedRows
    } catch (err) {
        console.log(err)
        return 0
    }
}

const CheckDuplicateHistory = async (ActivityID, TimeStamp, today) => {
    try {
        const [query] = await db.query(`SELECT ActivityHistoryID, ActivityHistory.ActivityID,TimeStamp, Goals.Frequence 
            FROM ActivityHistory 
            LEFT JOIN Activity ON Activity.ActivityId = ActivityHistory.ActivityID
            LEFT JOIN Goals ON ActivityHistory.GoalsID = Goals.GoalsID
            WHERE ActivityHistory.ActivityID = ? ORDER BY ActivityHistoryID DESC LIMIT 1`, [ActivityID])
        if (query.length > 0) {
            return query[0]
        } else {
            return 0
        }

    } catch (err) {
        console.log(err)
        return 0
    }
}

const CountActivityById = async (ActivityId) => {
    const query = await db.query(`SELECT COUNT(ActivityId) as activityCompleted FROM ActivityHistory WHERE ActivityID = ?`, [ActivityId])
    return query[0]
}

const ActivityStatsByWeek = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            COUNT(ActivityID) as totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            SUM(HoursSpent) as totalTime,
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
            COUNT(ActivityID) as totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            SUM(HoursSpent) as totalTime,
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
            COUNT(ActivityID) as totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            SUM(HoursSpent) as totalTime,
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

const GetActivityHistory = async (ActivityID, Limit, Offset) => {
    try {
        const [query] = await db.query(`SELECT ActivityHistoryID, Succeed, DATE_FORMAT(TimeStamp, '%Y-%m-%d') as TimeStamp, Count, ActivityHistory.ActivityID, ActivityHistory.Frequence 
            FROM ActivityHistory 
            INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
            LEFT JOIN Goals ON Goals.GoalsID = ActivityHistory.GoalsID
            WHERE ActivityHistory.ActivityID = ?
            ORDER BY ActivityHistoryID DESC
            LIMIT ? OFFSET ?`, [ActivityID, Limit, Offset])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

const rowsAfterOffset = async (ActivityID) => {
    const query = await db.query(
        `SELECT Count(ActivityID) as lastAvailableRows FROM ActivityHistory WHERE ActivityID = ?`,
        [ActivityID]
    );
    return query[0];
};

const GetLastActivityHistory = async (ActivityID) => {
    const query = await db.query(`SELECT ActivityHistoryID, HoursSpent 
        FROM ActivityHistory 
        WHERE ActivityID = ? ORDER BY ActivityHistoryID DESC LIMIT 1 `,
        [ActivityID])
    return query[0][0]
}

const UpdateActivityHistory = async (HoursSpent, ActivityHistoryID) => {
    try {
        const query = await db.query(`UPDATE ActivityHistory set HoursSpent = ? WHERE ActivityHistoryID = ?`, [HoursSpent, ActivityHistoryID])
        return query[0].affectedRows
    } catch (err) {
        console.log(err)
        return 0
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
    GetActivityHistory,
    rowsAfterOffset,
    GetLastActivityHistory,
    UpdateActivityHistory
}