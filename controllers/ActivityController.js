const activityServices = require("../services/ActivityServices");
const goalServices = require("../services/GoalServices");
const activityHistortyServices = require("../services/ActivityHistoryServices")
const activityHistoryController = require("../controllers/ActivityHistoryController")
const { FormattedDate } = require("../utils/FormattedDate");
const { historyFormattedDate } = require('../utils/historyFormattedDate')
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
    let TodayDate = FormattedDate('fullDate')
    for (i = 0; i < activity.length; i++) {
      if (activity[i].TimeStamp !== null) {
        let activityDate = activity[i].TimeStamp
        switch (activity[i].TimeFrameID) {
          case 1: //Monthly
            let activityMonth = activityDate.substring(5, 7)
            let activityYear = activityDate.substring(0, 4)
            let TodayMonth = TodayDate.substring(5, 7)
            let TodayYear = TodayDate.substring(0, 4)
            if (`${activityYear}-${activityMonth}` !== `${TodayYear}-${TodayMonth}`) {
              activity[i].Count = 0
              activityHistoryController.UpdateNonSucceedActivity(activity[i].ActivityHistoryID)
            }
            break;
          case 2: //Weekly
            let thisWeek = historyFormattedDate(TodayDate, 'week')
            let activityWeek = historyFormattedDate(activityDate, 'week')
            if (activityWeek !== thisWeek) {
              activity[i].Count = 0
              activityHistoryController.UpdateNonSucceedActivity(activity[i].ActivityHistoryID)
            }
            break;
          case 3: //Daily
            if (activityDate !== TodayDate) {
              activity[i].Count = 0
              activityHistoryController.UpdateNonSucceedActivity(activity[i].ActivityHistoryID)
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
  const { ActivityName, GoalsId, CreateNewGoal, GoalName, TimeFrame, Frequence, UserId } = req.body.params;
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
  let getActivityWithoutGoal = await activityServices.ActivityWithoutGoal(id);
  getActivityWithoutGoal = getActivityWithoutGoal.map(activity => ({
    ...activity,
    checked: activity.checked === false // Convert 1 to true and 0 to false
  }));
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
  const { ActivityID, UserID } = req.query
  let activityStats = []
  const activity = await activityServices.GetUserActivityByID(ActivityID)
  switch (activity[0].TimeFrameID) {
    case 1:
      frame = "MONTH"
      activityStats = await activityHistortyServices.ActivityStatsByMonth(ActivityID)
      break;
    case 2:
      frame = "WEEK"
      activityStats = await activityHistortyServices.ActivityStatsByWeek(ActivityID)
      break;
    case 3:
      frame = "DAY"
      activityStats = await activityHistortyServices.ActivityStatsByDay(ActivityID)
      break;
  }

  if (activityStats.totalGoalNumber == null) {
    activityStats.totalGoalNumber = 0
  }

  const bestStreak = await activityHistoryController.GetBestActivityStreak(ActivityID, UserID)

  res.send({ activity, activityStats, bestStreak })
}

const UpdateActivity = async (req, res) => {
  const { ActivityID, ActivityName, GoalsId, UserId } = req.body.params
  const hasActivitybeenUpdated = await activityServices.UpdateActivity(ActivityID, ActivityName, GoalsId)
  if (hasActivitybeenUpdated === 1) {
    res.send(1)
  } else {
    res.send(0)
  }
}

const UpdateActivityFromGoal = async (GoalsId, ActivityId) => {
  const hasActivityBeenUpdated = await activityServices.UpdateActivityFromGoal(GoalsId, ActivityId)
  return hasActivityBeenUpdated
}

module.exports = {
  userActivity,
  addActivity,
  ActivityWithoutGoal,
  CheckDuplicate,
  DeleteActivity,
  GetUserActivityByID,
  UpdateActivity,
  UpdateActivityFromGoal
};
