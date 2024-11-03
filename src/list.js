// Fetching the ingredient list from local storage and displaying it
document.addEventListener('DOMContentLoaded', () => {
    const ingredientList = document.getElementById('ingredient_list');
    const ingredientInput = document.getElementById('ingredient_input');

    // Load ingredients from local storage
    loadIngredients();

    // Function to handle button click
    window.buttonClicked = function() {
        const newIngredient = ingredientInput.value.trim();
        if (newIngredient) {
            addIngredient(newIngredient);
            ingredientInput.value = ''; // Clear the input field
        }
    };

    // Function to load ingredients from local storage
    /* loadIngredients(): Loads ingredients from local storage and displays them. */
    function loadIngredients() {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        console.log("Loaded ingredients:", ingredients); // Debugging line
        ingredientList.innerHTML = ''; // Clear existing list
        ingredients.forEach((ingredient, index) => {
            createIngredientCard(ingredient, index);
        });
    }

    /* addIngredient(ingredient): Adds a new ingredient to local storage and updates the display. */
    function addIngredient(ingredient) {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredients.push({ name: ingredient, bought: false });
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
        loadIngredients();
    }

    // Function to create an ingredient card
    /* createIngredientCard(ingredient, index): Creates and displays an ingredient card. */
    function createIngredientCard(ingredient, index) {
        const ingredientCard = document.createElement('div');
        ingredientCard.classList.add('ingredient_card');
        ingredientCard.innerHTML = `
            <input type="checkbox" id="ingredient-${index}" ${ingredient.bought ? 'checked' : ''} onclick="toggleBought(${index})">
            <label for="ingredient-${index}">${ingredient.name}</label>
            <button onclick="deleteIngredient(${index})">Delete</button>
        `;
        ingredientList.appendChild(ingredientCard);
    }

    // Function to toggle the bought status of an ingredient
    /* toggleBought(index): Toggles the bought status of an ingredient. */
    window.toggleBought = function(index) {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        const ingredientName = ingredients[index].name;
        ingredients[index].bought = !ingredients[index].bought;
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
        loadIngredients();
    }

    // Function to delete an ingredient
    /* deleteIngredient(index): Deletes an ingredient from the list. */
    window.deleteIngredient = function(index) {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        const ingredientName = ingredients[index].name;
        ingredients.splice(index, 1);
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
        loadIngredients();
        
        // feedback
        alert(`${ingredientName} has been removed from your list.`);
    }
});