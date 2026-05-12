const Section = require('../models/Section');

// @desc    Get all sections (public)
// @route   GET /api/sections
const getSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single section
// @route   GET /api/sections/:id
const getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create section (admin)
// @route   POST /api/sections
const createSection = async (req, res) => {
  try {
    const section = await Section.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json(section);
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update section (admin)
// @route   PUT /api/sections/:id
const updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete section (admin)
// @route   DELETE /api/sections/:id
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder sections (admin)
// @route   PUT /api/sections/reorder
const reorderSections = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    const updatePromises = orderedIds.map((id, index) =>
      Section.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updatePromises);

    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    console.error('Reorder sections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSections, getSection, createSection, updateSection, deleteSection, reorderSections };
