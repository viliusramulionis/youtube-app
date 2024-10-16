import Category from '../models/category.js';

export const populateCategories = async () => {
    const categories = ['Fashion', 'Comedy', 'Movie Trailers', 'Music', 'News'];
    
    if(await Category.countDocuments() > 0)
        return;

    for(const data of categories) {
        await Category.create({
            name: data
        });
    }
}