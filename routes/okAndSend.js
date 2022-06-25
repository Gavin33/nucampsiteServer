const okAndSend = (res, response) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(response);
};
module.exports = okAndSend;
