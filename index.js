// Declare Global object using DOM Api

let searchBox=document.getElementById('search-box');
let searchResult=document.getElementById('search-result');
let searchButton=document.getElementById('search-button');
let mealRecepieContainer=document.getElementById('meal-recepie-container');
let mealRecepiePopUpContainer=document.getElementById('meal-recepie-pop-up-container');
let result='';

// attach event listener to search button
searchButton.addEventListener('click',function(e)
{
    e.preventDefault();
    fetchAPI();
    
});

// call fetch API to fetch meals data and add it inside HTML search result
async function fetchAPI()
{
    if (searchBox.value==='')
    {
        alert('enter meal...');
    }
    else{

        url=`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox.value}`;

        // fetch api data and convert the response into json object
        let res=await fetch(url);
        let data_json=await res.json();
        result=data_json.meals;
        let htmlElement='';

        // iterate over each element and store it into html search result
        result.forEach((results) => 
        {
            let item=document.createElement('div');
            item.classList.add('item');
            item.innerHTML=
            `
                <img src="${results.strMealThumb}">
                <div class="flex-container" data-id="${results.idMeal}">
                    <h4 class="title">${results.strMeal}</h4>
                    <h4 class="receipe-details">receip-details</h4>
                    <i class="fa-regular fa-heart" id="heart"></i>
                </div>
            `;

            // create favourite button to add or remove items to from fav list
            let faheart=item.querySelector('#heart');

            faheart.addEventListener('click',function(e)
            {
            if(faheart.classList.contains('fa-regular'))
            {
                faheart.setAttribute('class','fa-solid fa-heart');
                const mealIDs=getMeals();
                if(mealIDs.includes(results.idMeal))
                {}
                else
                {
                    addMeals(results.idMeal);
                }
            }
            else
            {
                faheart.setAttribute('class','fa-regular fa-heart');
                removeMeals(results.idMeal);

            }
        });
        searchResult.appendChild(item);
        });
   
    }
}

// get items from  browser local storage
function getMeals(){
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));
    console.log(mealIDs)
    return mealIDs === null ? [] : mealIDs;
}

// function to add items in local storage
function addMeals(mealId){
    const mealIDs = getMeals();
    localStorage.setItem('mealIDs', JSON.stringify([...mealIDs,mealId]));
}

// remove items from local storage
function removeMeals(mealId){
    const mealIDs = getMeals();
    localStorage.setItem('mealIDs', JSON.stringify(mealIDs.filter((id)=> id!== mealId)));
}

// add event over recepie details
searchResult.addEventListener('click',function (e)
        {
            e.preventDefault();
            if(e.target.classList.contains("receipe-details"))
            {
                let meal_item=e.target.parentElement;
                Apifetchbyid(meal_item);
            }
        });

// function to fetch details of meal item by their id 
async function Apifetchbyid(meal_item)
{
    let urlById=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_item.dataset.id}
    `;
    let recepie_response=await fetch(urlById);
    let recepie_response_json=await recepie_response.json();
    showRecepie(recepie_response_json.meals);
    
}

// function to show recepie details,img,instruction on html page
function showRecepie(resu)
{
    ingredients=[];
    for( let i=0;i<20;i++)
    {
        console.log(resu[0][`strIngredient${i}`]);
        if(resu[0][`strIngredient${i}`])
        {
        ingredients.push(`${resu[0][`strIngredient${i}`]} - ${resu[0][`strMeasure${i}`]}`);
        }
    }
    let recepieHTML=
    `
        <div id="meal-recepie-img-instruction">
        <div id="meal-img">
            <img src="${resu[0].strMealThumb}">
            <div class="flex-container">
                <h4 class="title">${resu[0].strMeal}</h4>
            </div>

        </div>
        <div id="instructions">
            <h4>Instructions</h4>
            <p>${resu[0].strInstructions}

            </p>
        </div>
    </div>
    <div id="ingredients">
        <h4>Ingredients</h4>
        <ul id="ingredient-list">
            
        ${ingredients.map((ingredient)=> `<li>${ingredient}</li>`).join('')}
 
        </ul>
    </div>
    
<div class="close-button"><i class="fa-solid fa-xmark"></i></div>

    `;
    mealRecepieContainer.innerHTML=recepieHTML;

    if(recepieHTML)
    {
        mealRecepiePopUpContainer.style.visibility='visible';
    }
}

// click event over close button to make the recepie details page hidden
mealRecepieContainer.addEventListener('click',function(e)
{
    e.preventDefault();
    console.log(67);
    if(e.target.classList.contains("close-button"))
    {
        console.log(12);
        mealRecepiePopUpContainer.style.visibility='hidden';
    }
});

