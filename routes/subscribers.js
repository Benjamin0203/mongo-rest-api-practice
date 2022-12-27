const { json } = require('express');
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

//Getting all
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message});
    //status code 500 means there's error on the server
  }
});

//Getting one
router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

//Creating one
router.post('/', async (req, res) => {

  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  })
  /**
   * or just use this:
   * const subscriber = new Subscriber(req.body);
   */


  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
    //status code 201 means successfully created a new object
  } catch (error) {
    res.status(400).json({ message: error.message})
    //status code 400 means if something wrong with user input 
  }
});
//Updating one
router.patch('/:id',getSubscriber, async (req, res) => {
  for (const [key, obj] of Object.entries(Subscriber.schema.obj)) {
    if (req.body[key] != null) {
      res.subscriber[key] = req.body[key]
    }
  };
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }

});
//Deleting one
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
});

//create a middleware for individial subscriber (get/update/delete)
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber"});
    }
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
  res.subscriber = subscriber;
  next();
  //next function means it moves to the next middleware or the actual request itself
};

module.exports = router;