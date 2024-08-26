const profilServices = require('../services/ProfilServices')

const GetProfilInfoAndStats = async (req, res) => {
    const { UserId } = req.query
    const userProfil = await profilServices.GetProfilInfoAndStats(UserId)
    res.send(userProfil)
}

const GetActivityProfilList = async(req, res) => {
    const { UserId } = req.query
    const activityList = await profilServices.GetActivityProfilList(UserId)
    res.send(activityList)
}

module.exports = {
    GetProfilInfoAndStats,
    GetActivityProfilList
}