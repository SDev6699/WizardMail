const fs = require('fs');
const https = require('https');
const app = require('./app');
const { setupWebSocket } = require('./websockets/websocket');
const { startGmailPolling } = require('./polling/gmailPolling');

const PORT = process.env.PORT || 5001;
const key = fs.readFileSync('ssl/localhost-key.pem');
const cert = fs.readFileSync('ssl/localhost.pem');

const httpsServer = https.createServer({ key, cert }, app);

setupWebSocket(httpsServer);
startGmailPolling();

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});