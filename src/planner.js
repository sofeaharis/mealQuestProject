document.addEventListener('DOMContentLoaded', () => {
    const categoryCard = document.getElementById('category_card');
    const mealList = document.getElementById('meal_list');
    const mealPlannerLists = {
        morning: document.getElementById('morning_meals').querySelector('.meal_planner_list'),
        afternoon: document.getElementById('afternoon_meals').querySelector('.meal_planner_list'),
        evening: document.getElementById('evening_meals').querySelector('.meal_planner_list'),
        night: document.getElementById('night_meals').querySelector('.meal_planner_list')
    };

    // Fetch categories and populate category cards
    /* fetchCategories: Fetches and populates the meal categories. */
    fetchCategories();

    function fetchCategories() {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(response => response.json())
            .then(data => {
                data.categories.forEach(category => {
                    createCategoryCard(category);
                });
            });
    }

    /* createCategoryCard: Creates and appends category cards. */
    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.classList.add('cat_card');
        card.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <h6>${category.strCategory}</h6>
            <button onclick="getMeals('${category.strCategory}')">View Meals</button>
        `;
        categoryCard.appendChild(card);
    }

    /* getMeals: Fetches meals based on selected categories. */
    window.getMeals = function(category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    displayMeals(data.meals);
                    document.getElementById('meal_section').style.display = 'block'; // Show the meal section
                    document.getElementById('meal_section').scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert("No meals found for this category.");
                }
            });
    }

    /* displayMeals: Displays the meals in the meal section. */
    function displayMeals(meals) {
        mealList.innerHTML = ''; // Clear previous meals
        meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal_item');
            mealItem.innerHTML = `
                <div class="meal_img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal_name">
                    <h4>${meal.strMeal}</h4>
                </div>
                <div class="meal_time_selection">
                    <button onclick="addToPlanner('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}', 'morning')">Add to Morning</button>
                    <button onclick="addToPlanner('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}', 'afternoon')">Add to Afternoon</button>
                    <button onclick="addToPlanner('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}', 'evening')">Add to Evening</button>
                    <button onclick="addToPlanner('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}', 'night')">Add to Night</button>
                </div>
            `;
            mealList.appendChild(mealItem);
        });
    }

    /* addToPlanner: Adds meals to the planner for the specified time of day. */
    window.addToPlanner = function(id, name, image, timeOfDay) {
        // Create a meal entry for the selected time of day
        const plannerList = mealPlannerLists[timeOfDay];
        
        // Check if the meal is already in the planner
        if (plannerList.querySelector(`#meal-${id}`)) {
            // feedback
            alert("This meal is already in your planner for this time.");
            return;
        }

        const mealCard = document.createElement('div');
        mealCard.classList.add('ingredient_box');
        mealCard.id = `meal-${id}`;
        mealCard.innerHTML = `
            <div class="meal_item">
                <img src="${image}" alt="${name}">
                <span>${name}</span>
                <button onclick="removeFromPlanner('${id}', '${timeOfDay}')">Remove</button>
            </div>
        `;
        
        plannerList.appendChild(mealCard);
        document.querySelector('.meal_planner').scrollIntoView({ behavior: 'smooth' });
    }

    /* removeFromPlanner: Removes meals from the planner. */
    window.removeFromPlanner = function(id, timeOfDay) {
        const mealCard = document.getElementById(`meal-${id}`);
        if (mealCard) {
            const mealName = mealCard.querySelector('span').textContent; // Get meal name
            mealCard.remove();
            
            // feedback
            alert(`${mealName} has been removed from your ${timeOfDay} meals.`);
        }
    }
});