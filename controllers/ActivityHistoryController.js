const activityHistortyServices = require('../services/ActivityHistoryServices')
const { FormattedDate } = require('../utils/FormattedDate')


const addActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count } = req.body.params
    let addHistory = 0
    const today = FormattedDate('fullDate')
    const hasTodayHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)

    if (hasTodayHistory[0] !== 1) {
        addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count)
    }

    if (addHistory === 1) {
        console.log("Success")
    } else {
        console.log("Error")
    }
    res.send("Success")
}

const DeleteActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count } = req.query
    const today = FormattedDate('fullDate')

    let deleteHistory = 0
    const checkLastHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    if (checkLastHistory[0] === 1) {
        const IdChecked = checkLastHistory[1]
        deleteHistory = await activityHistortyServices.DeleteActivityHistory(IdChecked)
    }


    if (deleteHistory === 1) {
        console.log("Success")
    } else {
        console.log("Error")
    }
    res.send("Success")
}

module.exports = {
    addActivityHistory,
    DeleteActivityHistory
};