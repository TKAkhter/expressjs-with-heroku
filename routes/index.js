var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', (req, res) => {
  res.send('here is your profile')
})
router.post('/profile', (req, res) => {
  res.send('profile created')
})
router.put('/profile', (req, res) => {
  res.send('profile updated')
})
router.delete('/profile', (req, res) => {
  res.send('profile deleted')
})

module.exports = router;
