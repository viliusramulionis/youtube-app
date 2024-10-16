import Router from 'express';
import User from '../models/user.js';
import { upload } from '../middleware/upload.js';
import { checkAuth } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = Router();

// Prisijungusio vartotojo tikrinimas
router.get('/check-user', checkAuth, (req, res) => {
    res.json({
        _id: req.session.user._id,
        email: req.session.user.email,
        userThumbnail: req.session.user.userThumbnail,
        name: req.session.user.name
    });
});

// Atsijungimas
router.get('/logout', checkAuth, (req, res) => {
    req.session.destroy();

    res.json('User succesfully logged out');
});

// Kanalo informacija
router.get('/:id', async (req, res) => {
    try {
        // const userData = await User.findById(req.params.id);
        // userData.videos = await Video.find({ user: userData._id});
        // console.log(userData);
        // res.json(userData);

        res.json(
            await User.findById(req.params.id)
            .populate('videos', ['title', 'thumbnail', 'createdAt', 'views'])
        );
    } catch {
        res.status(500).json('Unable to reach server');
    }
});

// Vartotojo registracija
router.post('/register', 
    upload.fields([ { name: 'coverPhoto', maxCount: 1 }, { name: 'userThumbnail', maxCount: 1 } ]), 
    async (req, res) => {
        try {
            // req.file.path.replace('\\', '/')
            // Nuotraukų failų priskyrimas
            req.body.coverPhoto = req.files.coverPhoto[0].filename;
            req.body.userThumbnail = req.files.userThumbnail[0].filename;
            
            //Slaptažodžio šifravimas
            req.body.password = await bcrypt.hash(req.body.password, 10);

            res.json({ 
                data: await User.create(req.body),
                message: 'User is succesfully created'
            });
        } catch(e) {
            let message = 'Unable to reach server';
            
            if(e.code === 11000) {
                message = 'Email address is already registered';
            } else if(!req.files.coverPhoto) {
                message = 'Cover photo must be uploaded';
            } else if(!req.files.userThumbnail) { 
                message = 'User thumbnail must be uploaded';
            }
            
            res.status(500).json(message);
        }
    }
);

// Vartotojo autentifikavimas
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});

        if(user && await bcrypt.compare(req.body.password, user?.password)) {
            req.session.user = user;
            return res.json({
                message: 'Login successful',
                data: {
                    _id: user._id,
                    email: user.email,
                    userThumbnail: user.userThumbnail,
                    name: user.name
                }
            });
        }

        res.status(401).json("Incorect login details");
    } catch {
        res.status(500).json('Unable to reach server');
    }
});

// Vartotojo duomenu redagavimas
router.put('/', checkAuth, (req, res) => {
    res.send('Vartotojo info redagavimas');
});

// Vartotojo istrynimas
router.delete('/', checkAuth, (req, res) => {
    res.send('Vartotojo ištrynimas');
});

export default router;