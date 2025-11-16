import { access, constants, readdir, readFile, writeFile } from 'fs/promises';

export class FileRepository {
    async readDirectory(path: string): Promise<string[]> {
        try {
            return await readdir(path);
        } catch (err) {
            console.error("[FileRepository] Error reading directory:", err);
            throw new Error("Erreur lors de la lecture du répertoire.");
        }
    }

    async readFile(lessonName: string): Promise<string> {
        try {
            return await readFile(lessonName, { encoding: 'utf-8' });
        } catch (err) {
            console.error("[FileRepository] Error reading file:", err);
            throw new Error("Erreur lors de la lecture du fichier.");
        }
    }

    async writeFile(lessonName: string, data: string): Promise<void> {
        try {
            return await writeFile(lessonName, data, { mode: 0o777});
        } catch (err) {
            console.error("[FileRepository] Error writing file:", err);
            throw new Error("Erreur lors de l'écriture du fichier.");
        }
    }

    async appendFile(lessonName: string, data: string): Promise<void> {
        try {
            return await writeFile(lessonName, data);
        } catch (err) {
            console.error("[FileRepository] Error appending file:", err);
            throw new Error("Erreur lors de l'ajout au fichier.");
        }
    }

    async isCreated(lessonName: string): Promise<boolean> {
        try {
            await access(lessonName, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }
}

export default new FileRepository();