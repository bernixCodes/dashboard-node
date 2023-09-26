//app requirements and dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const app = express();
  
const PORT = 7070;  //server port

//middlewares
//To parse json data
app.use(bodyParser.json())
//allow origin access
app.use(cors({
    origin : '*'
}))
//add public folder to the client 
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile('index.html', err => {
        if (err) {
          res.status(403).send('error index.html not found');
        }
      });
})

//api
app.use('/api', routes)

  //start app on this port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
