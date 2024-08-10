const activityHistortyServices = require('../services/ActivityHistoryServices')
const { FormattedDate } = require('../utils/FormattedDate')
const { historyFormattedDate } = require('../utils/historyFormattedDate')


const addActivityHistory = async (req, res) => {
    const { ActivityHistoryID, ActivityID, TimeStamp, Count, Frequence, UserID } = req.body.params
    let addHistory = 0
    const today = FormattedDate('fullDate')
    const hasTodayHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    if (hasTodayHistory === 0) {
        if (Frequence === Count) {
            addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 1, UserID)
        } else {
            addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0, UserID)
        }
    } else {
        const lastHistoryFormattedDate = historyFormattedDate(hasTodayHistory.TimeStamp)
        if (lastHistoryFormattedDate !== today) {
            if (Count >= hasTodayHistory.Frequence) {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 1, UserID)
            } else {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0, UserID)
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

const GetTotalActivityCount = async (req, res) => {
    const UserID = req.query.id
    const total = await activityHistortyServices.GetTotalActivityCount(UserID)
    res.send(total)
}

const UpdateNonSucceedActivity = (ActivityHistoryID) => {
    activityHistortyServices.UpdateNonSucceedActivity(ActivityHistoryID)
}

const GetBestActivityStreak = async (ActivityID, UserID) => {
    const history = await activityHistortyServices.GetBestActivityStreak(ActivityID, UserID)
    let StreakCounter = 0
    let StreakCounterBackUp = 0

    for (i = 0; i < history.length; i++) {
        if (history[i].Succeed === 1) {
            StreakCounter++
            if (StreakCounter > StreakCounterBackUp) {
                StreakCounterBackUp = StreakCounter
            }
        } else {
            StreakCounter = 0
        }
    }
    return StreakCounterBackUp
}

const GetActivityHistory = async (req, res) => {
    const { ActivityID } = req.query
    const activityHistory = await activityHistortyServices.GetActivityHistory(ActivityID)
    res.send(activityHistory)
}

module.exports = {
    addActivityHistory,
    DeleteActivityHistory,
    UpdateNonSucceedActivity,
    GetTotalActivityCount,
    GetBestActivityStreak,
    GetActivityHistory
};