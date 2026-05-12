const PortfolioConfig = require('../models/PortfolioConfig');

// @desc    Get portfolio config (public)
// @route   GET /api/portfolio
const getPortfolio = async (req, res) => {
  try {
    let config = await PortfolioConfig.findOne();

    if (!config) {
      config = await PortfolioConfig.create({});
    }

    res.json(config);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update portfolio config (admin)
// @route   PUT /api/portfolio
const updatePortfolio = async (req, res) => {
  try {
    let config = await PortfolioConfig.findOne();

    if (!config) {
      config = await PortfolioConfig.create({ ...req.body, owner: req.user._id });
    } else {
      // Deep merge for nested objects like theme, seo, socialLinks
      const updateData = { ...req.body };

      if (req.body.theme) {
        updateData.theme = { ...config.theme.toObject(), ...req.body.theme };
      }
      if (req.body.seo) {
        updateData.seo = { ...config.seo.toObject(), ...req.body.seo };
      }
      if (req.body.socialLinks) {
        updateData.socialLinks = { ...config.socialLinks.toObject(), ...req.body.socialLinks };
      }

      config = await PortfolioConfig.findByIdAndUpdate(
        config._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.json(config);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPortfolio, updatePortfolio };
