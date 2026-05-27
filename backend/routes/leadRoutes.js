const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createLead);
router.get('/', protect, getLeads);
router.put('/:id/status', protect, updateLeadStatus);
router.delete('/:id', protect, deleteLead);

module.exports = router;
