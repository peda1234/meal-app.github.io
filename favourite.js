let searchResult=document.getElementById('search-result');
let mealRecepiePopUpContainer=document.getElementById('meal-recepie-pop-up-container');
let mealRecepieContainer=document.getElementById('meal-recepie-container');

let fav=document.getElementById('fav');

// get data from local storage
function getDataFromLocalStorage()
{
    const dataArray=JSON.parse(localStorage.getItem('mealIDs'));
    console.log(dataArray.length);
    let h2=document.createElement('h2');

    if (dataArray.length===0)
    {
        h2.innerHTML=`No Items in Favourite List`;
        fav.appendChild(h2);
    }
    else
    {
        h2.innerHTML=`YOUR FAVOURITE ITEMS ...`
        fav.appendChild(h2);
    for(var i=0;i<dataArray.length;i++)
    {
        itemData(dataArray[i]);

    }
}
}

// retrive data for each items from their id
async function itemData(data)
{
    url=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${data}`;
    const response= await fetch(url);
    const responseJson=await response.json();
    itemCard(responseJson.meals[0]);
}

// create meal card 
function itemCard(data)
{
    let item=document.createElement('div');
    item.classList.add('item');
    item.innerHTML=
    `
        <img src="${data.strMealThumb}">
        <div class="flex-container" data-id="${data.idMeal}">
            <h4 class="title">${data.strMeal}</h4>
            <h4 class="receipe-details">receip-details</h4>
            <i class="fa-solid fa-rectangle-xmark"></i>
        </div>
    `;
    searchResult.appendChild(item);
    let deletefavitem=item.querySelector('.fa-rectangle-xmark');
    let item_T=item.querySelector('.item');
    deletefavitem.addEventListener('click',function(e)
    {
        if(deletefavitem.classList.contains('fa-solid'))
        {
            removeMeals(data.idMeal);
            item.remove();
        }
    });
}

// function to remove meal from local storage
function removeMeals(mealId)
{
    const mealIDs = getMeals();
    localStorage.setItem('mealIDs', JSON.stringify(mealIDs.filter((id)=> id!== mealId)));
}

// function to get meals from localStorage
function getMeals()
{
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));
    return mealIDs === null ? [] : mealIDs;
} 

// add click event to search result 
searchResult.addEventListener('click',function (e)
{
    e.preventDefault();
    if(e.target.classList.contains("receipe-details"))
    {
        let meal_item=e.target.parentElement;
        Apifetchbyid(meal_item);
    }
});

// function to fetch meal details using meal id
async function Apifetchbyid(meal_item)
{
    console.log(`${meal_item.dataset.id}`);
    let urlById=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_item.dataset.id}
    `;
    let recepie_response=await fetch(urlById);
    let recepie_response_json=await recepie_response.json();
    showRecepie(recepie_response_json.meals);
}

// function to show recepie details, instruction, ingredients etc
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
                <a href="${resu[0].strYoutube}"><h4>Video Link</h4></a> 
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


mealRecepieContainer.addEventListener('click',function(e)
{
    e.preventDefault();
    if(e.target.classList.contains("close-button"))
    {
        mealRecepiePopUpContainer.style.visibility='hidden';
    }
});

getDataFromLocalStorage();