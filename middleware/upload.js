import { mkdir, access } from 'node:fs/promises';
import multer from 'multer';

export const storage = multer.diskStorage({
    destination: async (req, file, next) => {
        const uploadsDir = './uploads'; 
        try {
            // Tikriname ar direktorija jau sukurta
            await access(uploadsDir);
        } catch {
            // Jeigu direktorijos nera gauname klaida dėl kurios atsiduriame catch bloke
            // Sukuriame direktorija
            await mkdir(uploadsDir);
        }
        // Perduodame sukurtos direktorijos adresa
        next(null, uploadsDir);
    },
    filename: (req, file, next) => {
        let filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let originalName = file.originalname.split('.');
        const extension = originalName[originalName.length - 1];

        next(null, filename + '.' + extension);
    }
});

export const upload = multer({ 
    storage, 
    fileFilter: (req, file, next) => {
        const types = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        if (!types.includes(file.mimetype))
            return next('Ivyko klaida', false);

        next(null, true);
    }
});
