// Sends a 200 status code and a json response
const okAndSend = (res, response) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(response);
};
module.exports = okAndSend;
