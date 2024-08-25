const db = require("../db");

const ActivityById = async (id, limit, offset) => {
  try {
    const query = await db.query(
      `SELECT 
    Activity.ActivityID, 
    Activity.ActivityName, 
    Goals.Frequence,
    Goals.TimeFrameID, 
    TimeFrame.Frame, 
    Activity.UserID, 
    Activity.Timer, 
    Goals.GoalName, 
    DATE_FORMAT(ActivityHistory.TimeStamp, '%Y-%m-%d') as TimeStamp,
    ActivityHistory.ActivityHistoryID,
    ActivityHistory.Count
    FROM Activity
    LEFT JOIN Goals ON Goals.GoalsID = Activity.GoalsID
    LEFT JOIN TimeFrame ON TimeFrame.TimeFrameID = Goals.TimeFrameID
    LEFT JOIN (
        SELECT ActivityID, MAX(ActivityHistoryID) as MaxActivityHistoryID
        FROM ActivityHistory
        GROUP BY ActivityID
      ) max_ah ON Activity.ActivityID = max_ah.ActivityID
      LEFT JOIN ActivityHistory ON max_ah.MaxActivityHistoryID = ActivityHistory.ActivityHistoryID
      WHERE Activity.UserID = ?
      ORDER BY Activity.ActivityID DESC
      LIMIT ? OFFSET ?;`
      ,
      [id, limit, offset]
    );
    return query[0];
  } catch (err) {
    console.log(err);
  }
};

const ActivityWithoutGoal = async (id) => {
  try {
    const query = await db.query(
      `SELECT ActivityID, ActivityName, 
      false as checked
      FROM Activity WHERE UserID = ? AND GoalsID = 0 OR GoalsID IS NULL`,
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

const AddNewActivity = async (ActivityName, GoalsId, UserId) => {
  try {
    const query = await db.query(
      `INSERT INTO Activity (ActivityName, GoalsID, UserID) values (?,?,?)`,
      [ActivityName, GoalsId, UserId]
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

const DeleteActivity = async (ActivityId) => {
  const query = await db.query(`DELETE FROM Activity WHERE ActivityID = ?`, [ActivityId])
  return query[0].affectedRows;
}

const GetUserActivityByID = async (ActivityId) => {
  try {
    const query = await db.query(`SELECT ActivityID, ActivityName, Frequence, Frame, Activity.UserID, 
      Goals.GoalsID, Goals.GoalName, TimeFrame.TimeFrameID, TimeFrame.Frame
      FROM Activity
      LEFT JOIN Goals ON Goals.GoalsID = Activity.GoalsID
      LEFT JOIN TimeFrame ON TimeFrame.TimeFrameID = Goals.TimeFrameID
      WHERE Activity.ActivityID = ?`, [ActivityId])
    return query[0]
  } catch (err) {
    console.log(err)
  }
}

const UpdateActivity = async (ActivityId, ActivityName, GoalsId) => {
  try {
    const query = await db.query(`UPDATE Activity set ActivityName = ?, GoalsID = ? WHERE ActivityID = ?`, [ActivityName, GoalsId, ActivityId,])

    if (query[0].affectedRows > 0) {
      return 1
    } else {
      return 0
    }
  } catch (err) {
    console.log(err)
  }
}

const UpdateActivityFromGoal = async (GoalsID, ActivityID) => {
  try {
    const query = await db.query(`UPDATE Activity set GoalsID = ? WHERE ActivityID = ?`, [GoalsID, ActivityID])
  } catch {
    console.log(err)
  }
}

module.exports = {
  ActivityById,
  ActivityWithoutGoal,
  AddNewActivity,
  rowsAfterOffset,
  LinkActivityToGoal,
  CheckNameDuplicate,
  DeleteActivity,
  GetUserActivityByID,
  UpdateActivity,
  UpdateActivityFromGoal
};
