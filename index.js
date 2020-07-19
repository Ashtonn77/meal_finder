const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  singleMeal = document.getElementById("single-meal");

//search meal and fetch from apisingle-meal
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  singleMeal.innerHTML = "";

  //get search term
  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>Search results came back empty. Try another meal</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
          
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealId="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            </div>
          </div>

          `
            )
            .join("");
        }
      });
    //clear search text
    search.value = "";
  } else {
    alert("Please input something to search for");
  }
}

//fetch random meal
function randomMeal() {
  //clear currebt meal
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}

//add meal to dom
function addMealToDom(meal) {
  const ingredients = [];

  for (let i = 1; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>

      <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
      
      ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      
      </ul>
      </div>

    </div>
  `;
}

//fecth meal by id
function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

//event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealId");
    getMealById(mealId);
  }
});
