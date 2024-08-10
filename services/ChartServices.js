const db = require("../db")

const GetActivityChartData = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
            DAYNAME(TimeStamp) AS days,
            COUNT(ActivityId) AS activityCount
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

const GetThisMonthChart = async (ActivityId) => {
    try {
        const [query] = await db.query(`SELECT 
                    DATE(timeStamp) AS day,
                    COUNT(*) AS count
                    FROM 
                    ActivityHistory
                    WHERE 
                    YEAR(timeStamp) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                    AND MONTH(timeStamp) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                    AND ActivityID = ?
                    GROUP BY 
                    DATE(timeStamp)
                    ORDER BY 
                    day;`, [ActivityId])
        return [query][0]
    } catch (err) {
        console.log(err)
    }
}

module.exports = { GetActivityChartData, GetThisMonthChart }