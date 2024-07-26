const db = require("../db");
const { historyFormattedDate } = require('../utils/historyFormattedDate')

const AddActivityHistory = async (ActivityID, TimeStamp, Count, Succeed) => {
    const query = await db.query(`INSERT INTO ActivityHistory (ActivityID, TimeStamp, Count, Succeed) values (?,?,?,?)`, [ActivityID, TimeStamp, Count, Succeed])
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

module.exports = { AddActivityHistory, DeleteActivityHistory, CheckDuplicateHistory }