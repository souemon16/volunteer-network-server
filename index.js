const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.843ii.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteerNetwork").collection("events");
  console.log("event database conected")

  // Get Datas from DB 
  app.get('/events', (req, res) => {
    eventsCollection.find({}).limit(20)
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Add Events To DB 
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    eventsCollection.insertOne(newEvent)
    .then(result.insertedCount > 0);
  })
});

client.connect(err => {
  const volunteerList = client.db("volunteerNetwork").collection("volunteerList");
  console.log("volunteerList database conected")

  // Save Data into DB 
  app.post('/addVolunteer', (req, res) => {
    const newVolunteer = req.body;
    volunteerList.insertOne(newVolunteer)
    .then(result => {
      res.send(result.insertedCount > 0);
      console.log(result);
    })
  })

  // Get Data from DB 
  app.get('/volunteerList', (req, res) => {
    volunteerList.find({email: req.query.userEmail})
    .toArray((err, documents) => { 
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    volunteerList.deleteOne({_id: ObjectId(req.params.id)})
    .then((err, result) => {
      console.log(result)
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})