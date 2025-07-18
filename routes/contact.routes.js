const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  markAsRead,
  deleteContact,
} = require('../controllers/contact.controller');

router.route('/').post(createContact).get(getContacts);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteContact);

module.exports = router;
