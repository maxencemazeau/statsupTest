const chartController = require("../controllers/ChartController");

function ChartRoutes(fastify, options, done) {

    fastify.get("/getActivityChartData", chartController.GetActivityChartData)

    done();
}

module.exports = ChartRoutes;
