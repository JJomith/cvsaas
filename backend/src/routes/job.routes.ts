import { Router } from 'express';
import { scrapeJobUrl, parseJobDescription } from '../controllers/job.controller';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Job scraping
router.post('/scrape', scrapeJobUrl);
router.post('/parse', parseJobDescription);

export default router;
