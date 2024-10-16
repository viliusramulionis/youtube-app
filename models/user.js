import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true, //Nurodome, kad reiksme yra reikalaujama
        minLength: 3, // Minimalaus vartotojo vardo ilgis
        maxLength: 20 // Maksimalus vartotojo vardo ilgis
    },
    email: {
        type: String,
        unique: true, //Nurodymas, jog kolekcijoje ši reikšmė privalės būti unikali (t.y nesikartoti)
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Įveskite galiojantį el. pašto adresą"] // El. pasto adreso formato validavimas
    },
    password: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    userThumbnail: {
        type: String,
        required: true
    },
    description: String,
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    // Nurodymas, kad papildoma info būtų įtraukta į JSON stringą
    toJSON: {
        virtuals: true
    }
});

UserSchema.virtual('videos', {
    ref: 'Video', // Modelis i kuri reikiamas
    localField: '_id', 
    foreignField: 'user', //Nurodome kuriame laukelyje video kolekcijoje priskirtas vartotojo id
});

// Users modelis
export default mongoose.model('User', UserSchema);