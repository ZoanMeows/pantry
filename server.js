const express=require('express');
const connection = require('better-sqlite3');

const app=express();
app.use(express.json());
app.use(express.static('public'));

const db = new connection('./kitchen.db');

function search(searchArray){
    if(searchArray.length===0){
        return [];
    }
    const recipes = db.prepare('select * from recipe').all();
    let i = 0 ;let j = 0;
    for(i = 0;i<recipes.length;i++){
        recipes[i].ingredients=JSON.parse(recipes[i].ingredients);
        recipes[i].lowerIngredients=recipes[i].ingredients.map(ing=>ing.toLowerCase());
        recipes[i].matchCounter=0;
    }
    
    for(i=0;i<searchArray.length;i++){
        const querying=searchArray[i].toLowerCase();
        for(j=0;j<recipes.length;j++){
            const hasMatch = recipes[j].lowerIngredients.some(ingr=>ingr.includes(querying));
            if(hasMatch){
                recipes[j].matchCounter++;
            }
        }
    }

    let results=[];

    for(i=0;i<recipes.length;i++){
        if(recipes[i].matchCounter===searchArray.length && recipes[i].matchCounter>0){
            results.push(recipes[i]);
        }
    }

    for(i=0;i<recipes.length;i++){
        if(recipes[i].matchCounter===searchArray.length-1 && recipes[i].matchCounter>0){
            results.push(recipes[i]);
        }
    }

    for(i=0;i<recipes.length;i++){
        if(recipes[i].matchCounter===searchArray.length-2 && recipes[i].matchCounter>0){
            results.push(recipes[i]);
        }
    }

    return results;
}

app.post('/api/search',(req,res)=>{
    const results = search(req.body.ingredients);
    res.json(results);
});

app.get('/api/recipe/:id', (req, res) => {
    const recipeId = req.params.id;
    const recipe = db.prepare('SELECT * FROM recipe WHERE recipe_id = ?').get(recipeId);

    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    // Parse the ingredients JSON string into an array just like /api/search
    if (typeof recipe.ingredients === 'string') {
        recipe.ingredients = JSON.parse(recipe.ingredients);
    }

    res.json(recipe);
});

app.listen(3000,()=>{
    console.log('server running at http://localhost:3000');
});

