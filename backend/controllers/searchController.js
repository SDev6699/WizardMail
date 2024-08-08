const Email = require('../models/Email');

exports.searchEmails = async (req, res) => {
  try {
    const { query, fromDate, toDate, priority } = req.query;
    const searchCriteria = {
      userId: req.user._id,
      $or: [
        { sender: new RegExp(query, 'i') },
        { recipients: new RegExp(query, 'i') },
        { subject: new RegExp(query, 'i') },
        { body: new RegExp(query, 'i') }
      ]
    };
    if (fromDate) searchCriteria.date = { $gte: new Date(fromDate) };
    if (toDate) searchCriteria.date = { ...searchCriteria.date, $lte: new Date(toDate) };
    if (priority) searchCriteria.priority = priority;

    const emails = await Email.find(searchCriteria);
    res.json(emails);
  } catch (error) {
    res.status(500).send('Error searching emails: ' + error);
  }
};
