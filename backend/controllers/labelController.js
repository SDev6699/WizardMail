const Label = require('../models/Label');

exports.getLabels = async (req, res) => {
  try {
    const labels = await Label.find({ userId: req.user._id });
    res.json(labels);
  } catch (error) {
    res.status(500).send('Error fetching labels: ' + error);
  }
};

exports.createLabel = async (req, res) => {
  try {
    const label = new Label({ ...req.body, userId: req.user._id });
    await label.save();
    res.status(201).json(label);
  } catch (error) {
    res.status(500).send('Error creating label: ' + error);
  }
};

exports.updateLabel = async (req, res) => {
  try {
    const label = await Label.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!label) {
      return res.status(404).send('Label not found');
    }
    res.json(label);
  } catch (error) {
    res.status(500).send('Error updating label: ' + error);
  }
};

exports.deleteLabel = async (req, res) => {
  try {
    const label = await Label.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!label) {
      return res.status(404).send('Label not found');
    }
    res.send('Label deleted successfully.');
  } catch (error) {
    res.status(500).send('Error deleting label: ' + error);
  }
};
