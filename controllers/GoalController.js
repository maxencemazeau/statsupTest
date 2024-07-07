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


module.exports = { userGoal, addGoal, CheckDuplicate }