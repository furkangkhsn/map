const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');

const app = express();
const port = 8888;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('htdocs'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/htdocs/index.html'));
});

app.listen(port);