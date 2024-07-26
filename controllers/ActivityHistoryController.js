const activityHistortyServices = require('../services/ActivityHistoryServices')
const { FormattedDate } = require('../utils/FormattedDate')
const { historyFormattedDate } = require('../utils/historyFormattedDate')


const addActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count } = req.body.params
    let addHistory = 0
    const today = FormattedDate('fullDate')
    const hasTodayHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    console.log(hasTodayHistory)
    console.log(Count)
    if (hasTodayHistory === 0) {
        addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0)
    } else {
        const lastHistoryFormattedDate = historyFormattedDate(hasTodayHistory.TimeStamp)
        if (lastHistoryFormattedDate !== today) {
            if (Count >= hasTodayHistory.Frequence) {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 1)
            } else {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0)
            }
        }
    }


    if (addHistory === 1) {
        console.log("Add Success")
    } else {
        console.log("Add Error")
    }
    res.send("Success")
}

const DeleteActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count } = req.query
    const today = FormattedDate('fullDate')

    let deleteHistory = 0
    const checkLastHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    if (checkLastHistory === 0) {
        console.log("Nothing to delete")
    } else {
        const lastHistoryFormattedDate = historyFormattedDate(checkLastHistory.TimeStamp)
        if (lastHistoryFormattedDate === today) {
            deleteHistory = await activityHistortyServices.DeleteActivityHistory(checkLastHistory.ActivityHistoryID)
        }
    }


    if (deleteHistory === 1) {
        console.log("Delete Success")
    } else {
        console.log("Delete Error")
    }
    res.send("Success")
}

module.exports = {
    addActivityHistory,
    DeleteActivityHistory
};