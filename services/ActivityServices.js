const db = require("../db");

const ActivityById = async (id, limit, offset) => {
  try {
    const query = await db.query(
      `SELECT ActivityID, ActivityName, Frequence, Frame, Activity.UserID, Timer, Goals.GoalName 
    FROM Activity
    LEFT JOIN Goals ON Goals.GoalsID = Activity.GoalsID
    LEFT JOIN TimeFrame ON TimeFrame.TimeFrameID = Goals.TimeFrameID
    WHERE Activity.UserID = ? ORDER BY ActivityID DESC LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );
    console.log(query[0])
    return query[0];
  } catch (err) {
    console.log(err);
  }
};

const ActivityWithoutGoal = async (id) => {
  try {
    const query = await db.query(
      `SELECT ActivityID, ActivityName FROM Activity WHERE UserID = ? AND GoalsID = 0 OR GoalsID IS NULL`,
      [id]
    );
    return query[0];
  } catch (err) {
    return err;
  }
};

const rowsAfterOffset = async (id) => {
  const query = await db.query(
    `SELECT Count(ActivityID) as lastAvailableRows FROM Activity WHERE UserID = ?`,
    [id]
  );
  return query[0];
};

const AddNewActivity = async (ActivityName, Timer, GoalsId, UserId) => {
  try {
    const query = await db.query(
      `INSERT INTO Activity (ActivityName, Timer, GoalsID, UserID) values (?,?,?,?)`,
      [ActivityName, Timer, GoalsId, UserId]
    );
    return query[0].insertId;
  } catch (err) {
    console.log(err);
  }
};

const LinkActivityToGoal = async (GoalId, ActivityId) => {
  const query = await db.query(
    `UPDATE Activity set GoalsID = ? WHERE ActivityID = ?`,
    [GoalId, ActivityId]
  );
  return query[0];
};

const CheckNameDuplicate = async (UserId, ActivityName) => {
  const query = await db.query(
    `SELECT ActivityName FROM Activity WHERE UserID = ? AND ActivityName = ?`,
    [UserId, ActivityName]
  );
  return query[0];
};

module.exports = {
  ActivityById,
  ActivityWithoutGoal,
  AddNewActivity,
  rowsAfterOffset,
  LinkActivityToGoal,
  CheckNameDuplicate,
};
