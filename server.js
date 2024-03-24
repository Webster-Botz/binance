const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');
const path = require('path');
const app = express();
const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
const io = socketIO(server);
const apiEndpoint = 'https://orionterminal.com/api/screener';

// Obtain data from the API endpoint every 10 seconds
setInterval(async () => {
  try {
    const response = await axios.get(apiEndpoint);
    io.emit('screener-data', response.data);
  } catch (error) {
    console.error(error);
  }
}, 10000);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});