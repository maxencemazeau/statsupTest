const feedServices = require("../services/FeedServices")
const { historyFormattedDate } = require("../utils/historyFormattedDate")

const GetFeed = async (req, res) => {
    const { UserID } = req.query
    const feedResult = await feedServices.GetFeed(UserID)
    const modifiedResult = feedResult.map(article => {
        article.TimeStamp = historyFormattedDate(article.TimeStamp)
        switch (article.Succeed) {
            case 1:
                return { ...article, text: `has reached his ${article.Frame} goal ${article.GoalName}` }
            case null:
                return { ...article, text: `has completed his activity ${article.ActivityName}` }
            case 0:
                return { ...article, text: `has completed his activity ${article.ActivityName}` }
            case -1:
                return { ...article, text: `has failed his ${article.Frame} goal` }
        }
    })

    res.send(modifiedResult)
}

module.exports = { GetFeed }