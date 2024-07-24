const db = require("../db");


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
        const query = await db.query(`SELECT ActivityHistoryID, TimeStamp FROM ActivityHistory WHERE ActivityID = ? ORDER BY ActivityHistoryID DESC LIMIT 1`, [ActivityID])
        //const returnQuery = JSON.stringify(query[0])
        console.log(query[0].length)
        if (query[0].length > 0) {
            if (query[0][0].TimeStamp !== today) {
                return [1, query[0][0].ActivityHistoryID]
            } else {
                return [0, 0]
            }
        } else {
            return [0, 0]
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = { AddActivityHistory, DeleteActivityHistory, CheckDuplicateHistory }