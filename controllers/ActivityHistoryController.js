const activityHistortyServices = require('../services/ActivityHistoryServices')
const { FormattedDate } = require('../utils/FormattedDate')
const { historyFormattedDate } = require('../utils/historyFormattedDate')


const addActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count } = req.body.params
    let addHistory = 0
    const today = FormattedDate('fullDate')
    const hasTodayHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    console.log(hasTodayHistory)
    if (hasTodayHistory === 0) {
        addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count)
    } else {
        const lastHistoryFormattedDate = historyFormattedDate(hasTodayHistory.TimeStamp)
        if (lastHistoryFormattedDate !== today) {
            addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count)
        }
    }
    // const lastHistoryFormattedDate = historyFormattedDate(hasTodayHistory.TimeStamp)

    // if (lastHistoryFormattedDate !== today) {
    //     addActivityHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count)
    // }

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

    const lastHistoryFormattedDate = historyFormattedDate(checkLastHistory.TimeStamp)
    if (lastHistoryFormattedDate === today) {
        deleteHistory = await activityHistortyServices.DeleteActivityHistory(checkLastHistory.ActivityHistoryID)
    }
    //console.log(lastHistoryFormattedDate + " " + today)
    // if (checkLastHistory[0] === 1) {
    //     const IdChecked = checkLastHistory[1]
    //     deleteHistory = await activityHistortyServices.DeleteActivityHistory(IdChecked)
    // }


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