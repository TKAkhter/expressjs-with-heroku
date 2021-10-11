var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/profile', (req, res) => {
  res.send('here is your profile')
})
router.post('/api/v1/profile', (req, res) => {
  res.send('profile created')
})
router.put('/api/v1/profile', (req, res) => {
  res.send('profile updated')
})
router.delete('/api/v1/profile', (req, res) => {
  res.send('profile deleted')
})

module.exports = router;
