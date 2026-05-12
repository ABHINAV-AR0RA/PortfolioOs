const express = require('express');
const router = express.Router();
const {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} = require('../controllers/sectionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getSections);
router.get('/:id', getSection);
router.post('/', protect, adminOnly, createSection);
router.put('/reorder', protect, adminOnly, reorderSections);
router.put('/:id', protect, adminOnly, updateSection);
router.delete('/:id', protect, adminOnly, deleteSection);

module.exports = router;
