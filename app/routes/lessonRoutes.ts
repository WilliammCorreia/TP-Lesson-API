import express from 'express';
import lessonController from "../controllers/lessonController";

const router = express.Router();

router.get('/', lessonController.findAllLessons);
router.get('/:name', lessonController.findLessonByName);
router.post('/:name', lessonController.createLesson);

export default router;