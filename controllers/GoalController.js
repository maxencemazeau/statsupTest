const goalServices = require('../services/GoalServices')
const activityServices = require('../services/ActivityServices')

const userGoal = async (req, res) => {
    let noMoreData = false;
    let limit = 5
    let goal = []
    const { id, offset } = req.query
    const availableRows = await goalServices.rowsAfterOffset(id)
    const lastAvailableRow = availableRows[0].lastAvailableRows - offset
    if (lastAvailableRow < limit && lastAvailableRow >= 0) {
        limit = lastAvailableRow
        noMoreData = true
    }

    if(lastAvailableRow > 0){
        const offsetValue = parseInt(offset);
        const limitValue = parseInt(limit)
        goal = await goalServices.userGoal(id, limitValue, offsetValue)
    } else{
        noMoreData = true
    }

    res.send({ goal, noMoreData })

}

const addGoal = async(req, res) => {
    const { GoalName, TimeFrame, LinkActivity, Frequence, UserId } = req.body.params
    let addGoal = 0

    addGoal = await goalServices.createNewGoal(GoalName, TimeFrame, Frequence, UserId)

    if( LinkActivity.length > 0 ){
        for(i = 0; i < LinkActivity.length; i++){
            const linkActivityToGoal = await activityServices.LinkActivityToGoal(addGoal, LinkActivity[i])
        }
    }
    if(addGoal > 0 ){
        res.send("Goal successfully created")
    } else {
        res.send("Error while adding the new activity")
    }

}


module.exports = { userGoal, addGoal}