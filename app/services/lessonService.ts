import fileRepository from "../repositories/fileRepository";

// J'aurais dû mettre mes interfaces dans une couche models
interface Lesson {
    lastName: string;
    firstName: string;
    mark: number;
}

interface Student {
    firstName?: string;
    lastName?: string;
}

class LessonService {

    public async findAllLessons(): Promise<string[]> {
        if (!process.env.LESSONS_PATH) {
            throw new Error("Le chemin des leçons n'est pas défini.");
        }

        try {
            return await fileRepository.readDirectory(process.env.LESSONS_PATH);
        } catch (err) {
            throw new Error("Erreur lors de la lecture du fichier.");
        }
    }

    public async findLessonByName(lessonName: string, student?: Student): Promise<Lesson[]> {
        if (!process.env.LESSONS_PATH) {
            throw new Error("Le chemin des leçons n'est pas défini.");
        }

        lessonName = `${process.env.LESSONS_PATH}/${lessonName}.marks`;

        if (student?.firstName) {
            student.firstName = this.capitalize(student.firstName);
        }

        if (student?.lastName) {
            student.lastName = student.lastName.trim().toUpperCase();
        }

        try {
            const lesson = await fileRepository.readFile(lessonName);

            if (student?.firstName && student?.lastName) {
                return this.askedMarks(lesson, `${student.lastName}|${student.firstName}|`);
            } else if (student?.lastName) {
                return this.askedMarks(lesson, `${student.lastName}|`)
            } else if (student?.firstName) {
                return this.askedMarks(lesson, `|${student.firstName}|`);
            } else {
                return this.askedMarks(lesson, "");
            }
        } catch (err) {
            throw new Error("Erreur lors de la lecture du fichier.");
        }
    }

    public async createLesson(lessonName: string, lessons: Lesson[]): Promise<Lesson[]> {
        if (!process.env.LESSONS_PATH) {
            throw new Error("Le chemin des leçons n'est pas défini.");
        }

        lessonName = `${process.env.LESSONS_PATH}/${lessonName}.marks`;
        const fileContent: string = (lessons.map(l => `${l.lastName}|${l.firstName}|${l.mark}\\n`).join('\n')) + '\n';
        console.log(fileContent);

        try {
            const isCreated = await fileRepository.isCreated(lessonName);

            if (!isCreated) {
                await fileRepository.writeFile(lessonName, fileContent);
                return lessons;
            } else {
                const actualLessons = await fileRepository.readFile(lessonName);
                const actualLessonsList = this.askedMarks(actualLessons, "");
                let newLessonsStr = "";

                console.log(actualLessonsList);
                console.log(lessons);

                for (let actualLesson of actualLessonsList) {
                    for (let newLesson of lessons) {
                        if (actualLesson.lastName === newLesson.lastName && actualLesson.firstName === newLesson.firstName) {
                            // On met à jour la note et on supprime la leçon modifiée pour ne pas l'ajouter à la fin et en plus c'est plus performant
                            actualLesson.mark = newLesson.mark;
                            console.log("Mise à jour de la leçon :", actualLesson);
                            lessons.splice(lessons.indexOf(newLesson), 1);
                            break;
                        }
                    }
                    newLessonsStr += `${actualLesson.lastName}|${actualLesson.firstName}|${actualLesson.mark}\\n\n`;
                }

                // On ajoute les nouvelles leçons à la fin
                actualLessonsList.push(...lessons);
                newLessonsStr += (lessons.map(l => `${l.lastName}|${l.firstName}|${l.mark}\\n`).join('\n')) + '\n';

                await fileRepository.writeFile(lessonName, newLessonsStr);

                return actualLessonsList;
            }
        } catch (err) {
            throw new Error("Erreur lors de la création de la leçon.");
        }
    }

    /** Utils */
    private capitalize(str: string): string {
        const parts = str.trim().split(' ');
        let res = "";

        for (let part of parts) {
            part = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            res += part + ' ';
        }

        return res.trim();
    }

    private askedMarks(lesson: string, stringStart: string): Lesson[] {
        const lines: string[] = lesson.split('\n');

        const marks: Lesson[] = [];

        lines.filter(line => {
            if (line.includes(stringStart) || stringStart === "") {
                const firstName: string = String(line.split('|')[1]);
                const lastName: string = String(line.split('|')[0]);
                const mark: number = parseFloat(String(line.split('|')[2])?.slice(0, -2));

                marks.push({ firstName, lastName, mark });

                return line;
            }
        });

        if (marks[marks.length - 1]?.lastName === "") {
            marks.pop();
        }

        return marks;
    }
}

export default LessonService;