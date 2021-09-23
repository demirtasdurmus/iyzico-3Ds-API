const api = require("express").Router();
const paymentRouter = require('./routes/payment');


api.use('/payment', paymentRouter);


module.exports = api;