const chartService = require("../services/ChartServices")

const GetActivityChartData = async (req, res) => {
    const { UserId, ChartFrame, ActivityId } = req.query
    let chartData = []
    switch (ChartFrame) {
        case '1':
            chartData = await chartService.GetActivityChartData(ActivityId)
            break;
        case '2':
            console.log('ici')
            chartData = await chartService.GetThisMonthChart(ActivityId)
            break;
        case '3':
            break;
        case '4':
            break;
        case '5':
            break;
        case '6':
            break;
    }
    console.log("Envoi " + chartData[0])
    res.send(chartData[0])
}

module.exports = { GetActivityChartData }