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
    res.send({ userInfo, userProfil })
}

const GetActivityProfilList = async (req, res) => {
    const { UserId } = req.query
    const activityList = await profilServices.GetActivityProfilList(UserId)
    res.send(activityList)
}

module.exports = {
    GetProfilInfoAndStats,
    GetActivityProfilList
}