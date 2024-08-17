const goalServices = require('../services/GoalServices')
const activityServices = require('../services/ActivityServices')

const userGoal = async (req, res) => {
    let noMoreData = false;
    let limit = 6
    let goal = []
    const { id, offset } = req.query
    const availableRows = await goalServices.rowsAfterOffset(id)
    const lastAvailableRow = availableRows[0].lastAvailableRows - offset
    if (lastAvailableRow < limit && lastAvailableRow >= 0) {
        limit = lastAvailableRow
        noMoreData = true
    }
    if (lastAvailableRow > 0) {
        const offsetValue = parseInt(offset);
        const limitValue = parseInt(limit)
        goal = await goalServices.userGoal(id, limitValue, offsetValue)
    } else {
        noMoreData = true
    }

    res.send({ goal, noMoreData })

}

const addGoal = async (req, res) => {
    const { GoalName, TimeFrame, LinkActivity, Frequence, UserId } = req.body.params
    let addGoal = 0

    addGoal = await goalServices.createNewGoal(GoalName, TimeFrame, Frequence, UserId)
    if (LinkActivity.length > 0) {
        for (i = 0; i < LinkActivity.length; i++) {
            const linkActivityToGoal = await activityServices.LinkActivityToGoal(addGoal, LinkActivity[i])
        }
    }
    if (addGoal > 0) {
        res.send(1)
    } else {
        res.send(0)
    }

}

const CheckDuplicate = async (req, res) => {
    const { UserID, GoalName } = req.query;
    const hasDuplicate = await goalServices.CheckNameDuplicate(UserID, GoalName);
    if (hasDuplicate.length == 0) {
        res.send(0);
    } else {
        res.send(1);
    }
};

const DeleteGoal = async (req, res) => {
    const GoalID = req.query.id;
    const hasBeenDeleted = await goalServices.DeleteGoal(GoalID)

    if (hasBeenDeleted > 0) {
        res.send("SUCCESS")
    } else {
        res.send("ERROR")
    }
}

const GetAllUserGoal = async (req, res) => {
    const UserId = req.query.id
    const goalList = await goalServices.GetAllUserGoal(UserId)
    res.send(goalList)
}

const UpdateGoal = async (req, res) => {
    const { GoalsId, GoalName, TimeFrameID, Frequence } = req.body.params
    const hasGoalbeenUpdated = await goalServices.UpdateGoal(GoalName, TimeFrameID, Frequence, GoalsId)
    if (hasGoalbeenUpdated === 1) {
        res.send(1)
    } else {
        res.send(0)
    }
}

const GetUserGoalByID = async (req, res) => {
    const { GoalsID, UserID } = req.query
    const goal = await goalServices.GetUserGoalByID(GoalsID)
    res.send(goal)
}

const GetLinkedActivityToGoal = async (req, res) => {
    const { GoalsID } = req.query
    let linkedActivity = await goalServices.GetLinkedActivityToGoal(GoalsID)
    linkedActivity = linkedActivity.map(activity => ({
        ...activity,
        checked: activity.checked === 1 // Convert 1 to true and 0 to false
    }));
    res.send(linkedActivity)
}

const GetAllActivityStatsForGoal = async (req, res) => {
    const { GoalID, TimeFrame } = req.query
    let activtiesStat = []

    switch (parseInt(TimeFrame)) {
        case 1:
            activtiesStat = await goalServices.ActivityGoalStatsByMonth(GoalID)
            break;
        case 2:
            activtiesStat = await goalServices.ActivityGoalStatsByWeek(GoalID)
            break;
        case 3:
            activtiesStat = await goalServices.ActivityGoalStatsByDay(GoalID)
            break;
    }

    let activitiesBestStreak = await GetAllActivityBestStreak(GoalID)

    activtiesStat = activtiesStat.map(activites => {
        const bestStreak = activitiesBestStreak.find((streak) => streak.ActivityID === activites.ActivityID);
        if (bestStreak !== undefined) {
            return { ...activites, BestStreak: bestStreak.BestStreak };
        }
        return activity;
    })

    res.send(activtiesStat)
}

const GetAllActivityBestStreak = async (GoalID) => {
    const history = await goalServices.GetAllActivityBestStreak(GoalID)
    let StreakCounter = 0
    let StreakCounterBackUp = 0
    let ActivityIDBackUp = 0
    let BestStreakByActivity = []
    for (i = 0; i < history.length; i++) {
        if (history[i].ActivityID !== ActivityIDBackUp) {
            if (ActivityIDBackUp !== 0) {
                BestStreakByActivity.push({ ActivityID: ActivityIDBackUp, BestStreak: StreakCounterBackUp })
            }

            ActivityIDBackUp = history[i].ActivityID
            StreakCounter = 0
            StreakCounterBackUp = 0
        }

        if (history[i].Succeed === 1) {
            StreakCounter++
            if (StreakCounter > StreakCounterBackUp) {
                StreakCounterBackUp = StreakCounter
            }
        } else {
            StreakCounter = 0
        }
    }

    // Ajoute la dernière activité au tableau
    if (ActivityIDBackUp !== 0) {
        BestStreakByActivity.push({ ActivityID: ActivityIDBackUp, BestStreak: StreakCounterBackUp });
    }
    return BestStreakByActivity
}

module.exports = {
    userGoal, addGoal, CheckDuplicate, DeleteGoal, GetAllUserGoal, UpdateGoal, GetUserGoalByID, GetLinkedActivityToGoal, GetAllActivityStatsForGoal,
    GetAllActivityBestStreak
}