const express = require('express');
const {
  exportToCSV,
  exportToJSON,
  exportToPDF,
  exportFinancialReport,
  exportBackup
} = require('../utils/exportData');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/expenses/csv', async (req, res) => {
  try {
    const result = await exportToCSV(req.user.id, req.query);
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    res.send(result.data);
  } catch (error) {
    console.error('Export CSV Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/expenses/json', async (req, res) => {
  try {
    const result = await exportToJSON(req.user.id, req.query);
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    res.send(result.data);
  } catch (error) {
    console.error('Export JSON Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/expenses/pdf', async (req, res) => {
  try {
    const result = await exportToPDF(req.user.id, req.query);
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    res.send(result.data);
  } catch (error) {
    console.error('Export PDF Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/financial-report', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const result = await exportFinancialReport(req.user.id, period);
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    res.send(result.data);
  } catch (error) {
    console.error('Export Financial Report Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/backup', async (req, res) => {
  try {
    const result = await exportBackup(req.user.id);
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    res.send(result.data);
  } catch (error) {
    console.error('Export Backup Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;