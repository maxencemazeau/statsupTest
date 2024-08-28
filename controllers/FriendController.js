const friendServices = require("../services/FriendServices")

const GetFriendList = async (req, res) => {
    const { UserId } = req.query
    const friendList = await friendServices.GetFriendList(UserId)
    res.send(friendList)
}

module.exports = {
    GetFriendList
}