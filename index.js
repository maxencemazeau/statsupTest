require('dotenv').config();

const fastify = require('fastify')();
const cors = require('@fastify/cors');
const db = require("./db")
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/UserRoutes')
const activityRoutes = require('./routes/ActivityRoutes')
const goalRoutes = require("./routes/GoalRoutes")
const activityHistoryroutes = require("./routes/ActivityHistoryRoutes")
const chartRoutes = require("./routes/ChartRoutes")
const searchFriendRoutes = require("./routes/SearchFriendRoutes");
const profilRoutes = require('./routes/ProfilRoutes');
const friendRoutes = require("./routes/FriendRoutes")

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
});

fastify.register(userRoutes);
fastify.register(activityRoutes)
fastify.register(goalRoutes)
fastify.register(activityHistoryroutes)
fastify.register(chartRoutes)
fastify.register(searchFriendRoutes)
fastify.register(profilRoutes)
fastify.register(friendRoutes)

fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${fastify.server.address().port}`)
  console.log(`Server is running on ${address}`);
});