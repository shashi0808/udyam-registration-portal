import express from 'express';
import v1Routes from './v1';

const router = express.Router();

// API version 1
router.use('/v1', v1Routes);

// API info
router.get('/', (req, res) => {
  res.json({
    message: 'Udyam Registration API',
    version: '1.0.0',
    availableVersions: ['v1']
  });
});

export default router;