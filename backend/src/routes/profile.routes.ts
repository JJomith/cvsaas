import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  importFromLinkedIn,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  addCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/profile.controller';
import { authenticate, validate } from '../middleware';
import { profileSchema, experienceSchema, educationSchema, skillSchema, projectSchema, certificationSchema } from '../validations';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile
router.get('/', getProfile);
router.put('/', validate(profileSchema), updateProfile);
router.post('/import-linkedin', importFromLinkedIn);

// Experience
router.post('/experience', validate(experienceSchema), addExperience);
router.put('/experience/:id', validate(experienceSchema), updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', validate(educationSchema), addEducation);
router.put('/education/:id', validate(educationSchema), updateEducation);
router.delete('/education/:id', deleteEducation);

// Skills
router.post('/skill', validate(skillSchema), addSkill);
router.delete('/skill/:id', deleteSkill);

// Projects
router.post('/project', validate(projectSchema), addProject);
router.put('/project/:id', validate(projectSchema), updateProject);
router.delete('/project/:id', deleteProject);

// Certifications
router.post('/certification', validate(certificationSchema), addCertification);
router.put('/certification/:id', validate(certificationSchema), updateCertification);
router.delete('/certification/:id', deleteCertification);

export default router;
