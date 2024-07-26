const activityServices = require("../services/ActivityServices");
const goalServices = require("../services/GoalServices");
const { FormattedDate } = require("../utils/FormattedDate");
const { getWeek } = require("../utils/getWeek");

const userActivity = async (req, res) => {
  let noMoreData = false;
  let limit = 6;
  let activity = [];
  const { id, offset } = req.query;
  const availableRows = await activityServices.rowsAfterOffset(id);
  const lastAvailableRow = availableRows[0].lastAvailableRows - offset;
  if (lastAvailableRow < limit && lastAvailableRow >= 0) {
    limit = lastAvailableRow;
    noMoreData = true;
  }
  if (lastAvailableRow > 0) {
    const offsetValue = parseInt(offset);
    const limitValue = parseInt(limit);
    activity = await activityServices.ActivityById(id, limitValue, offsetValue);
  } else {
    noMoreData = true;
  }

  if (activity.length > 0) {
    let TodayDate = FormattedDate('day')
    for (i = 0; i < activity.length; i++) {
      if (activity[i].TimeStamp !== null) {
        let activityDate = new Date(activity[i].TimeStamp)
        let activityMonth = activityDate.getMonth() + 1
        let thisWeek = FormattedDate('week')
        switch (activity[i].TimeFrameID) {
          case 1: //Monthly
            if (activityMonth !== TodayDate.getMonth() + 1) {
              activity[i].Count = 0
            }
            break;
          case 2: //Weekly
            if (getWeek(activityDate) !== thisWeek) {
              activity[i].Count = 0
            }
            break;
          case 3: //Daily
            if (activityDate.getDay() + 1 !== TodayDate.getDay() + 1) {
              activity[i].Count = 0
            }
            break;
        }
      }
    }
  }

  res.send({ activity, noMoreData });
};

const addActivity = async (req, res) => {
  let addActivity = false;
  let newGoalId = 0;
  const { ActivityName, GoalsId, CreateNewGoal, GoalName, TimeFrame, Frequence, UserId, } = req.body.params;

  if (CreateNewGoal !== true) {
    if (GoalsId == 0) {
      GoalsId = null
    }
    addActivity = await activityServices.AddNewActivity(ActivityName, GoalsId, UserId);
  } else {
    newGoalId = await goalServices.createNewGoal(GoalName, TimeFrame, Frequence, UserId);
    addActivity = await activityServices.AddNewActivity(ActivityName, newGoalId, UserId);
  }

  if (addActivity) {
    res.send({ success: 1, id: addActivity });
  } else {
    res.send({ success: 0 });
  }
};

const ActivityWithoutGoal = async (req, res) => {
  const { id } = req.query;
  const getActivityWithoutGoal = await activityServices.ActivityWithoutGoal(id);
  res.send(getActivityWithoutGoal);
};

const CheckDuplicate = async (req, res) => {
  const { UserID, ActivityName } = req.query;
  const hasDuplicate = await activityServices.CheckNameDuplicate(
    UserID,
    ActivityName
  );
  if (hasDuplicate.length == 0) {
    res.send(0);
  } else {
    res.send(1);
  }
};

const DeleteActivity = async (req, res) => {
  const ActivityID = req.query.id;
  const hasBeenDeleted = await activityServices.DeleteActivity(ActivityID)

  if (hasBeenDeleted > 0) {
    res.send("SUCCESS")
  } else {
    res.send("ERROR")
  }

}

const GetUserActivityByID = async (req, res) => {
  const { ActivityID } = req.query
  const activity = await activityServices.GetUserActivityByID(ActivityID)
  res.send(activity)
}

// const UpdateCompletedActivity = async(req, res) => {
//   const { UserId, ActivityId } = req,query
// }

module.exports = {
  userActivity,
  addActivity,
  ActivityWithoutGoal,
  CheckDuplicate,
  DeleteActivity,
  GetUserActivityByID
};
