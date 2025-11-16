import { Request, Response } from "express";
import LessonService from "../services/lessonService";

class LessonController {

    async findAllLessons(req: Request, res: Response) {
        try {
            const lessons = await LessonService.findAllLessons();

            res.status(200).json({
                success: true,
                data: lessons,
                message: "Leçons récupérées avec succès"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des leçons",
                error: error.message
            });
        }
    }

    async findLessonByName(req: Request, res: Response) {
        const lessonName = req.params.name;
        if (!lessonName) {
            return res.status(400).json({
                success: false,
                message: "Le nom de la leçon est requis"
            });
        }

        const student = { firstName: req.query.firstName as string, lastName: req.query.lastName as string };

        try {
            const lesson = await LessonService.findLessonByName(lessonName, student);

            return res.status(200).json({
                success: true,
                data: lesson,
                message: "Leçon récupérée avec succès"
            });
        } catch (errror: any) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de la leçon",
                error: errror.message
            });
        }

    }

    async createLesson(req: Request, res: Response) {
        const lessonName = req.params.name;
        if (!lessonName) {
            return res.status(400).json({
                success: false,
                message: "Le nom de la leçon est requis"
            });
        }

        const lessons = req.body;
        
        try {
            const lesson = await LessonService.createLesson(lessonName, lessons);

            return res.status(201).json({
                success: true,
                data: lesson,
                message: "Leçon créée avec succès"
            });
        } catch (errror: any) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la leçon",
                error: errror.message
            });
        }
    }
}

export default new LessonController();