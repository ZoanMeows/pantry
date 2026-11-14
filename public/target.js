const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');

if (recipeId) {
    fetch(`/api/recipe/${recipeId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Recipe not found');
            }
            return res.json();
        })
        .then(recipe => {
            // 1. Browser tab title & top header details
            document.title = `Recipe - ${recipe.recipe_name}`;

            const img = document.querySelector('.main-product-img');
            img.src = recipe.img_url || 'dummy.png';
            img.alt = recipe.recipe_name;

            document.querySelector('.product-title').textContent = recipe.recipe_name;
            document.querySelector('.rating-text').textContent = `(${recipe.rating}/5)`;

            // 2. Action box & specs table (indexed in HTML order: 0=Time, 1=Origin, 2=Servings, 3=Difficulty)
            document.querySelector('.price-mimic').textContent = `Ready in ${recipe.prep_time} mins`;

            const specValues = document.querySelectorAll('.spec-value');
            specValues[0].textContent = `${recipe.prep_time} minutes`;
            specValues[1].textContent = recipe.origin;
            specValues[2].textContent = `${recipe.servings} people`;
            specValues[3].textContent = recipe.difficulty;

            // 3. Ingredients list (first .themed-list)
            const ingredientsList = document.querySelector('.themed-list');
            ingredientsList.innerHTML = '';
            recipe.ingredients.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ingredientsList.appendChild(li);
            });

            // 4. Instructions list (second .themed-list, which also has .numbered)
            const instructionsList = document.querySelector('.themed-list.numbered');
            instructionsList.innerHTML = '';
            const steps = recipe.instructions
                .split('.')
                .map(step => step.trim())
                .filter(step => step.length > 0);

            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = `${step}.`;
                instructionsList.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Error loading recipe:', err);
            document.querySelector('.product-title').textContent = 'Recipe not found';
        });
}

const startCookingBtn = document.querySelector('.primary-btn');
const detailsSection = document.querySelector('.product-bottom');

if (startCookingBtn && detailsSection) {
    startCookingBtn.addEventListener('click', () => {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}