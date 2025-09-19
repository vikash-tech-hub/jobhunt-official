import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJobs, getAllJobs, getJobById, postJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/get', isAuthenticated, getAllJobs);
router.get('/getadminjob', isAuthenticated, getAdminJobs);
router.get('/get/:id', isAuthenticated, getJobById);

export default router;
