const profilServices = require('../services/ProfilServices')

const GetProfilInfoAndStats = async (req, res) => {
    const { UserId, myUserId } = req.query
    let userInfo = []
    if (UserId !== myUserId) {
        userInfo = await profilServices.GetOtherProfil(UserId, myUserId)
    } else {
        userInfo = await profilServices.GetMyProfil(UserId)
    }
    const userProfil = await profilServices.GetProfilInfoAndStats(UserId)

    if (userInfo.length > 0 && userInfo[0].Photo !== null) {
        userInfo[0].Photo = ConvertPhotoToUri(userInfo[0].Photo)
    }

    res.send({ userInfo, userProfil })
}

const GetActivityProfilList = async (req, res) => {
    const { UserId } = req.query
    const activityList = await profilServices.GetActivityProfilList(UserId)
    res.send(activityList)
}

const GetBestGoalStreak = async (req, res) => {
    const { UserId } = req.query

    const allActivityHistory = await profilServices.GetBestGoalStreak(UserId)
    let StreakCounter = 0
    let StreakCounterBackUp = 0
    let ActivityIDBackUp = 0
    let BestStreakByActivity = []
    for (i = 0; i < allActivityHistory.length; i++) {
        if (allActivityHistory[i].ActivityID !== ActivityIDBackUp) {
            if (ActivityIDBackUp !== 0) {
                BestStreakByActivity.push(StreakCounterBackUp)
            }

            ActivityIDBackUp = allActivityHistory[i].ActivityID
            StreakCounter = 0
            StreakCounterBackUp = 0
        }

        if (allActivityHistory[i].Succeed === 1) {
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
        BestStreakByActivity.push(StreakCounterBackUp);
    }

    const maxStreak = Math.max(...BestStreakByActivity)

    res.send(maxStreak)
}

const ChangeProfilPhoto = async (req, res) => {
    const { UserID } = req.query;
    const imageData = await req.file();

    // Convert the file stream into a Buffer or Blob (depending on your database)
    const chunks = [];
    for await (const chunk of imageData.file) {
        chunks.push(chunk);
    }
    const photoBlob = Buffer.concat(chunks);

    const updateSucceed = await profilServices.ChangeProfilPhoto(photoBlob, UserID)
    if (updateSucceed === 1) {
        console.log("true")
    } else {
        console.log("false")
    }
}

module.exports = {
    GetProfilInfoAndStats,
    GetActivityProfilList,
    GetBestGoalStreak,
    ChangeProfilPhoto
}