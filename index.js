const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PASSWORD = 'drishal123';

app.use(express.static('public'));

// Add middleware to check password
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth.split(' ')[1] !== PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="Chat App"');
    res.status(401).send('Authentication required.');
    return;
  }
  next();
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Read existing messages from history.txt and emit to client
  fs.readFile('history.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading history.txt:', err);
      return;
    }
    const messages = data.split('\n').filter(Boolean);
    messages.forEach((msg) => {
      socket.emit('chat message', msg);
    });
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);

    // Append message to history.txt
    fs.appendFile('history.txt', msg + '\n', (err) => {
      if (err) {
        console.error('Error appending to history.txt:', err);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
