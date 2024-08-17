const db = require("../db")

const GetActivityChartData = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            TimeStamp,
            COUNT(ActivityId) AS NbActivity
        FROM 
            ActivityHistory
        WHERE 
            YEARWEEK(TimeStamp, 1) = YEARWEEK(CURDATE(), 1) AND ActivityID = ?
        GROUP BY 
            DAYOFWEEK(TimeStamp)
        ORDER BY 
            DAYOFWEEK(TimeStamp)`, [ActivityId])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

const GetThisMonthChart = async (StartDate, EndDate, ActivityId) => {
    try {
        const [query] = await db.query(`SELECT COUNT(ActivityID) as NbActivity, TimeStamp 
            FROM ActivityHistory 
            WHERE TimeStamp BETWEEN ? AND ? AND ActivityID = ?
            GROUP BY TimeStamp`, [StartDate, EndDate, ActivityId])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

const GetPrevious3MonthOrYear = async (StartDate, EndDate, ActivityId) => {
    try {
        const [query] = await db.query(`SELECT COUNT(ActivityID) as NbActivity, TimeStamp 
            FROM ActivityHistory 
            WHERE TimeStamp BETWEEN ? AND ? AND ActivityID = ?
            GROUP BY MONTH(TimeStamp)`, [StartDate, EndDate, ActivityId])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

const GetAllTimeData = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT COUNT(ActivityID) as NbActivity, YEAR(TimeStamp) as TimeStamp
            FROM ActivityHistory WHERE ActivityID = ? GROUP BY YEAR(TimeStamp)`, [ActivityId])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}


module.exports = { GetActivityChartData, GetThisMonthChart, GetPrevious3MonthOrYear, GetAllTimeData }