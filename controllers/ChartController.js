const chartService = require("../services/ChartServices")
const { historyFormattedDate } = require('../utils/historyFormattedDate')

const GetActivityChartData = async (req, res) => {
    const { UserId, ChartFrame, ActivityId } = req.query
    let chartData = []
    let startDate
    let endDate
    console.log(ChartFrame)
    const todayDate = new Date()
    switch (ChartFrame) {
        case '1':
            chartData = await chartService.GetActivityChartData(ActivityId)
            console.log(chartData)
            break;
        case '2':
            chartData = await chartService.GetThisMonthChart(ActivityId)
            console.log(chartData)
            break;
        case '3':
            let fullYear = new Date().getFullYear()
            startDate = new Date(fullYear, 0, 1)
            console.log(startDate)
            startDate = startDate.toISOString().split('T')[0]
            endDate = todayDate.toISOString().split('T')[0]
            chartData = await chartService.GetPrevious3MonthOrYear(startDate, endDate, ActivityId)
            console.log(chartData)
            break;
        case '4':
            startDate = new Date(todayDate)
            endDate = todayDate.toISOString().split('T')[0]
            startDate.setMonth(todayDate.getMonth() - 3)
            startDate = startDate.toISOString().split('T')[0]
            chartData = await chartService.GetPrevious3MonthOrYear(startDate, endDate, ActivityId)
            console.log(chartData)
            break;
        case '5':
            break;
    }

    res.send(chartData)
}

module.exports = { GetActivityChartData }