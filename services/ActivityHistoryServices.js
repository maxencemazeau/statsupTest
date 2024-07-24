const db = require("../db");
const { historyFormattedDate } = require('../utils/historyFormattedDate')

const AddActivityHistory = async (ActivityID, TimeStamp, Count) => {
    const query = await db.query(`INSERT INTO ActivityHistory (ActivityID, TimeStamp, Count) values (?,?,?)`, [ActivityID, TimeStamp, Count])
    return query[0].affectedRows
}

const DeleteActivityHistory = async (ActivityHistoryID) => {
    const query = await db.query(`DELETE FROM ActivityHistory WHERE ActivityHistoryID = ?`, [ActivityHistoryID])
    return query[0].affectedRows
}

const CheckDuplicateHistory = async (ActivityID, TimeStamp, today) => {
    try {
        const [query] = await db.query(`SELECT ActivityHistoryID, TimeStamp FROM ActivityHistory WHERE ActivityID = ? ORDER BY ActivityHistoryID DESC LIMIT 1`, [ActivityID])
        console.log(query)
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