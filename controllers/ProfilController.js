const profilServices = require('../services/ProfilServices')

const GetProfilInfoAndStats = async (req, res) => {
    const { UserId } = req.query
    const userProfil = await profilServices.GetProfilInfoAndStats(UserId)
    res.send(userProfil)
}

module.exports = {
    GetProfilInfoAndStats
}