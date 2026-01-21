import { Router } from 'express';
import { scrapeJob, parseJobDescription } from '../controllers/job.controller';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Job scraping
router.post('/scrape', scrapeJob);
router.post('/parse', parseJobDescription);

export default router;
