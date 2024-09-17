const activityHistortyServices = require('../services/ActivityHistoryServices')
const { FormattedDate } = require('../utils/FormattedDate')
const { historyFormattedDate } = require('../utils/historyFormattedDate')


const addActivityHistory = async (req, res) => {
    const { ActivityID, TimeStamp, Count, Frequence, UserID, HoursSpent } = req.body
    let addHistory = 0
    const today = FormattedDate('fullDate')
    const hasTodayHistory = await activityHistortyServices.CheckDuplicateHistory(ActivityID, TimeStamp, today)
    if (hasTodayHistory === 0) {
        if (Frequence === Count) {
            addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 1, UserID, HoursSpent)
        } else {
            addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0, UserID, HoursSpent)
        }
    } else {
        const lastHistoryFormattedDate = historyFormattedDate(hasTodayHistory.TimeStamp)
        if (lastHistoryFormattedDate !== today) {
            if (Count >= hasTodayHistory.Frequence) {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 1, UserID, HoursSpent)
            } else {
                addHistory = await activityHistortyServices.AddActivityHistory(ActivityID, TimeStamp, Count, 0, UserID, HoursSpent)
            }
        }
    }


    if (addHistory === 1) {
        console.log("Add Success")
        res.send("Success")
    } else {
        console.log("Add Error")
        res.send("Error")
    }
}

const DeleteActivityHistory = async (req, res) => {
    const { ActivityID, TimeStamp, Count } = req.body
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
        res.send("Success")
    } else {
        console.log("Delete Error")
        res.send("Error")
    }
}

const UpdateActivityHistory = async (req, res) => {
    const { ActivityID, HoursSpent } = req.body
    const getLastActivityHistory = await activityHistortyServices.GetLastActivityHistory(ActivityID)
    const newHoursSpent = getLastActivityHistory.HoursSpent + HoursSpent
    const updatedActivity = await activityHistortyServices.UpdateActivityHistory(newHoursSpent, getLastActivityHistory.ActivityHistoryID)

    updatedActivity === 1 ? res.send("Success") : res.send("Error")

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
    const { ActivityID, Offset } = req.query
    let limit = 5;
    let activityHistory = []
    let noMoreData = false
    const availableRows = await activityHistortyServices.rowsAfterOffset(ActivityID);
    const lastAvailableRow = availableRows[0].lastAvailableRows - Offset;
    if (lastAvailableRow < limit && lastAvailableRow >= 0) {
        limit = lastAvailableRow;
        noMoreData = true
    }

    const numberOfPage = Math.ceil(availableRows[0].lastAvailableRows / limit)

    if (lastAvailableRow > 0) {
        const offsetValue = parseInt(Offset);
        const limitValue = parseInt(limit);
        activityHistory = await activityHistortyServices.GetActivityHistory(ActivityID, limitValue, offsetValue)
    } else {
        noMoreData = true;
    }

    res.send({ activityHistory, numberOfPage, noMoreData })
}

module.exports = {
    addActivityHistory,
    DeleteActivityHistory,
    UpdateNonSucceedActivity,
    GetTotalActivityCount,
    GetBestActivityStreak,
    GetActivityHistory,
    UpdateActivityHistory
};