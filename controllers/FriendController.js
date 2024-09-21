const friendServices = require("../services/FriendServices")
const { ConvertPhotoToUri } = require("../utils/convertPhotoToUri");

const GetFriendList = async (req, res) => {
    const { UserId } = req.query
    const friendList = await friendServices.GetFriendList(UserId)

    if (friendList.length > 0) {
        for (i = 0; i < friendList.length; i++) {
            if (friendList[i].Photo !== null) {
                friendList[i].Photo = ConvertPhotoToUri(friendList[i].Photo)
            }
        }
    }
    res.send(friendList)
}

module.exports = {
    GetFriendList
}