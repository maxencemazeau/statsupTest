const db = require('../db')


const userGoal = async (id, limitValue, offsetValue) => {
    try {
        const query = await db.query(`SELECT GoalsID, GoalName, Frequence, Frame, Goals.UserID
    FROM Goals
    LEFT JOIN TimeFrame ON TimeFrame.TimeFrameID = Goals.TimeFrameID
    WHERE UserID = ? ORDER BY GoalsID DESC LIMIT ? OFFSET ?`, [id, limitValue, offsetValue])
        return query[0]
    } catch (err) {
        console.log(err)
    }
};

const rowsAfterOffset = async (id) => {
    const query = await db.query(`SELECT Count(GoalsID) as lastAvailableRows FROM Goals WHERE UserID = ?`, [id])
    return query[0]
}

const createNewGoal = async (GoalName, TimeFrame, Frequence, UserId) => {
    const query = await db.query(`INSERT INTO Goals (GoalName, TimeFrameID, Frequence, UserID) values (?,?,?,?)`, [GoalName, TimeFrame, Frequence, UserId])
    if (query[0].affectedRows > 0) {
        return query[0].insertId
    }
}

const CheckNameDuplicate = async (UserId, GoalName) => {
    const query = await db.query(
        `SELECT GoalName FROM Goals WHERE UserID = ? AND GoalName = ?`,
        [UserId, GoalName]
    );
    return query[0];
};

const DeleteGoal = async (GoalId) => {
    const query = await db.query(`DELETE FROM Goals WHERE GoalsID = ?`, [GoalId])
    return query[0].affectedRows;
}

const GetAllUserGoal = async (UserId) => {
    try {
        const query = await db.query(`SELECT GoalsID, GoalName, Frequence, Goals.TimeFrameID, Frame FROM Goals
            LEFT JOIN TimeFrame ON Goals.TimeFrameID = TimeFrame.TimeFrameID
            WHERE UserID = ?`, [UserId])
        return query[0]
    } catch (err) {
        console.log(err)
    }
}

const UpdateGoal = async (GoalName, TimeFrameID, Frequence, GoalsID) => {
    try {
        const query = await db.query(`UPDATE Goals set GoalName = ?, TimeFrameID = ?, Frequence = ? WHERE GoalsID = ?`, [GoalName, TimeFrameID, Frequence, GoalsID])
        if (query[0].affectedRows > 0) {
            return 1
        } else {
            return 0
        }
    } catch (err) {
        console.log(err)
    }
}

const GetUserGoalByID = async (GoalsID) => {
    const query = await db.query(`SELECT GoalName, Goals.TimeFrameID, Frequence FROM Goals 
        INNER JOIN TimeFrame ON Goals.TimeFrameID = TimeFrame.TimeFrameID
        WHERE GoalsID = ?`, [GoalsID])
    return query[0]
}

const GetLinkedActivityToGoal = async (GoalsID) => {
    const query = await db.query(`SELECT 
    Activity.ActivityID, 
    Activity.ActivityName,
    CASE 
        WHEN Activity.GoalsID IS NULL THEN false
        ELSE true
    END AS checked
    FROM 
    Activity
    LEFT JOIN 
    Goals ON Activity.GoalsID = Goals.GoalsID
    WHERE 
    Goals.GoalsID = ? OR Activity.GoalsID IS NULL`, [GoalsID])
    return query[0]
}


const ActivityGoalStatsByWeek = async (GoalID) => {
    try {
        const [query] = await db.query(`SELECT 
            ActivityHistory.ActivityID,
            ActivityName,
            COUNT(ActivityHistory.ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(WEEK, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber,
            SUM(HoursSpent) as totalTime
            FROM 
            ActivityHistory
            INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
            INNER JOIN Goals ON ActivityHistory.GoalsID = Goals.GoalsID
            WHERE 
            Goals.GoalsID = ?
            GROUP BY ActivityHistory.ActivityID
    `, [GoalID])
        return query
    } catch (err) {
        console.log(err)
    }
}

const ActivityGoalStatsByDay = async (GoalID) => {
    try {
        const [query] = await db.query(`SELECT 
            ActivityHistory.ActivityID,
            ActivityName,
            COUNT(ActivityHistory.ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(DAY, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber,
            SUM(HoursSpent) as totalTime
            FROM 
            ActivityHistory
            INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
            INNER JOIN Goals ON ActivityHistory.GoalsID = Goals.GoalsID
            WHERE 
            Goals.GoalsID = ?
            GROUP BY ActivityHistory.ActivityID
    `, [GoalID])
        return query
    } catch (err) {
        console.log(err)
    }

}

const ActivityGoalStatsByMonth = async (GoalID) => {
    try {
        const [query] = await db.query(`SELECT 
            ActivityHistory.ActivityID,
            ActivityName,
            COUNT(ActivityHistory.ActivityID) AS totalActivityCompleted,
            COUNT(CASE WHEN Succeed = 1 THEN 1 END) as activityNbSucceed,
            MIN(TimeStamp) AS date_premier,
            CURRENT_DATE() AS date_dernier,
            TIMESTAMPDIFF(MONTH, MIN(TimeStamp), CURRENT_DATE()) AS totalGoalNumber,
            SUM(HoursSpent) as totalTime
            FROM 
            ActivityHistory
            INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
            INNER JOIN Goals ON ActivityHistory.GoalsID = Goals.GoalsID
            WHERE 
            Goals.GoalsID = ?
            GROUP BY ActivityHistory.ActivityID
    `, [GoalID])
        return query
    } catch (err) {
        console.log(err)
    }

}

const GetAllActivityBestStreak = async (GoalID) => {
    const query = await db.query(`SELECT Activity.ActivityID ,Succeed FROM ActivityHistory 
                    INNER JOIN Activity ON ActivityHistory.ActivityID = Activity.ActivityID
                    INNER JOIN Goals ON ActivityHistory.GoalsID = Goals.GoalsID
                    WHERE Goals.GoalsID = ? AND (Succeed = 1 OR Succeed = -1)
                    ORDER BY ActivityID`, [GoalID])
    return query[0]
}

module.exports = {
    userGoal, rowsAfterOffset, createNewGoal, CheckNameDuplicate, DeleteGoal, GetAllUserGoal, UpdateGoal, GetUserGoalByID, GetLinkedActivityToGoal,
    ActivityGoalStatsByWeek, ActivityGoalStatsByMonth, ActivityGoalStatsByDay, GetAllActivityBestStreak
}