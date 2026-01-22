import { Router } from 'express';
import {
  getDocuments,
  getDocument,
  generateCV,
  generateCoverLetter,
  updateDocument,
  deleteDocument,
  downloadPDF,
  getVersions,
  restoreVersion,
  optimizeATS,
} from '../controllers/document.controller';
import { authenticate, validate } from '../middleware';
import { generateCVSchema, generateCoverLetterSchema } from '../validations';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Documents
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.post('/cv', validate(generateCVSchema), generateCV);
router.post('/cover-letter', validate(generateCoverLetterSchema), generateCoverLetter);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

// PDF download
router.get('/:id/download', downloadPDF);

// Versions
router.get('/:id/versions', getVersions);
router.post('/:id/versions/:versionId/restore', restoreVersion);

// ATS optimization
router.post('/:id/optimize-ats', optimizeATS);

export default router;
