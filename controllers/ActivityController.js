const activityServices = require("../services/ActivityServices");
const goalServices = require("../services/GoalServices");

const userActivity = async (req, res) => {
  let noMoreData = false;
  let limit = 5;
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

  res.send({ activity, noMoreData });
};

const addActivity = async (req, res) => {
  let addActivity = false;
  let newGoalId = 0;
  const {
    ActivityName,
    Timer,
    GoalsId,
    CreateNewGoal,
    GoalName,
    TimeFrame,
    Frequence,
    UserId,
  } = req.body.params;

  if (CreateNewGoal !== true) {
    addActivity = await activityServices.AddNewActivity(
      ActivityName,
      Timer,
      GoalsId,
      UserId
    );
  } else {
    newGoalId = await goalServices.createNewGoal(
      GoalName,
      TimeFrame,
      Frequence,
      UserId
    );
    addActivity = await activityServices.AddNewActivity(
      ActivityName,
      Timer,
      newGoalId,
      UserId
    );
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

module.exports = {
  userActivity,
  addActivity,
  ActivityWithoutGoal,
  CheckDuplicate,
};
