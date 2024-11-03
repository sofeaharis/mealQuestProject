// index.html
const searchBtn = document.getElementById('search_btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal_details_content');
const recipeCloseBtn = document.getElementById('recipe_close_btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// get meal list that matches with the ingredients
/* getMealList(): Fetches meals based on the ingredient input. */
function getMealList() {
    let meal_input = document.getElementById('meal_input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${meal_input}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            const searchResultsTitle = document.getElementById('searchResultsTitle'); // Get the title element

            // Always show the title when a search is performed
            searchResultsTitle.style.display = "block"; // Show the title

            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal_item" data-id="${meal.idMeal}">
                            <div class="meal_img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal_name">
                                <h4>${meal.strMeal}</h4>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                // If no meals are found, the not found message are displayed
                // feedback
                html = "<div class='notFound'>Sorry, we didn't find any meal!</div>";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;

            // Scroll to the meal result section
            const mealResultSection = document.querySelector('.meal_result');
            mealResultSection.scrollIntoView({ behavior: 'smooth' });
        });
}

// Function to get meals by category
/* getMealsByCategory(category): Fetches meals based on the selected category. */
function getMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            const searchResultsTitle = document.getElementById('searchResultsTitle');
            const mealList = document.getElementById('meal');

            // Show the title when a category is selected
            searchResultsTitle.style.display = "block";

            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal_item" data-id="${meal.idMeal}">
                            <div class="meal_img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal_name">
                                <h4>${meal.strMeal}</h4>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            }

            mealList.innerHTML = html;

            // Scroll to the meal result section
            const mealResultSection = document.querySelector('.meal_result');
            mealResultSection.scrollIntoView({ behavior: 'smooth' });
        });
}

// get recipe of the meal
/* getMealRecipe(e): Fetches the recipe details for a selected meal. */
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.closest('.meal_item')) { // Check if the clicked element is within a meal_item
        let mealItem = e.target.closest('.meal_item');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                return Promise.all([meal, fetchCategoryDescription(meal.strCategory)]);
            })
            .then(([meal, categoryDescription]) => mealRecipeModal(meal, categoryDescription));
    }
}

// Fetch category description
/* fetchCategoryDescription(category): Fetches the description of a meal category. */
function fetchCategoryDescription(category) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        .then(response => response.json())
        .then(data => {
            const categoryInfo = data.categories.find(cat => cat.strCategory === category);
            return categoryInfo ? categoryInfo.strCategoryDescription : "No description available.";
        });
}

// create a modal
/* mealRecipeModal(meal, categoryDescription): Displays the modal with meal details. */
function mealRecipeModal(meal, categoryDescription) {
    console.log(meal);
    let ingredients = [];
    let measurements = [];

    // Extract ingredients and measurements
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(meal[`strIngredient${i}`]);
            measurements.push(meal[`strMeasure${i}`]);
        }
    }

    let ingredientsHtml = ingredients.map((ingredient, index) => `
        <li>${measurements[index]} ${ingredient}</li>
    `).join('');

    let html = `
        <div class="recipe_meal_img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <h2 class="recipe_title">${meal.strMeal}</h2>
        <p class="recipe_category">${meal.strCategory}</p>
        <p class="recipe_category_description">${categoryDescription}</p>
        <p class="recipe_area">Area: ${meal.strArea}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredientsHtml}</ul>
        <div class="recipe_instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe_link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}