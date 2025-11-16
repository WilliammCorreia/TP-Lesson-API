import express from 'express';
import LessonController from '../controllers/lessonController';

const router = express.Router();

router.get('/', LessonController.findAllLessons);
router.get('/:name', LessonController.findLessonByName);
router.post('/:name', LessonController.createLesson);

export default router;