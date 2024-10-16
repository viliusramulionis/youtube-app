import { Router } from 'express';
import Video from '../models/video.js';
import { upload } from '../middleware/upload.js';
import { checkAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
    const sortOptions = ['views', 'createdAt', 'title'];

    const filter = {};
    if(req.query.category) 
        filter.category = req.query.category;

    try {
        res.json(
            await Video.find(filter)
            .sort({ [sortOptions[sortOptions.indexOf(req.query.sort)]] : 'desc' })
            .populate({ path: 'user', select: ['userThumbnail', 'name'] })
        );
    } catch {
        res.status(500).json('Unable to reach server');
    }
});


//Vieno video (single video) duomenų grąžinimas
router.get('/:id', async (req, res) => {
    try {
        const data = await Video
                    .findById(req.params.id)
                    .populate({ path: 'user', select: ['userThumbnail', 'name'] });

        res.json(data);

        // Peržiūrų skaičiaus padidinimas
        await Video.findByIdAndUpdate(req.params.id, { views: ++data.views });
    } catch {
        res.status(500).json('Unable to reach server');
    }
});

// Naujo video pridėjimas
router.post('/', checkAuth, upload.single('thumbnail'), async (req, res) => {
    try {
        // req.file.path.replace('\\', '/')
        req.body.thumbnail = req.file.filename;
        req.body.user = req.session.user._id;

        res.json({ 
            data: await Video.create(req.body),
            message: 'Video is succesfully uploaded'
        });
    } catch {
        res.status(500).json('Unable to reach server');
    }
});

router.delete('/', checkAuth, (req, res) => {
    res.send('Naujo video ištrynimas');
});

export default router;

