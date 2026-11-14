let searchArray=[];

function searchArrayAdd(searchValue,searchArray){
    if(searchArray.includes(searchValue)){
        return false;
    }
    searchArray.push(searchValue);
    return true;
}

function searchArrayRemove(poppedValue,searchArray){
    let count = 0;
    for(count=0;count<searchArray.length;count++){
        if(searchArray[count]===poppedValue){
            break;
        }
    }
    if(count<searchArray.length){
        searchArray.splice(count,1);
    }
    return;
}

function enter(event){
    if(event.key==='Enter'){
        const inputBox = document.querySelector('#ingredient-input');
        const inputValue = inputBox.value.trim().toLowerCase();
        if(!inputValue){
            return;
        }

        if(searchArrayAdd(inputValue,searchArray)){
            document.querySelector('.chip-list').
            innerHTML+=`<div class="chip-container">
                            <p class="chip-text">${inputValue}</p>
                            <button class="chip-cross"
                            onclick="let poppedValue = this.parentElement.querySelector('.chip-text').textContent;
                                    poppedValue = poppedValue.toLowerCase();
                                    searchArrayRemove(poppedValue,searchArray);
                                    this.parentElement.remove();"
                                >X</button>
                        </div>`;

            }

            inputBox.value='';

        return;
    }
}

function card(results,searchLength){
    const card = document.createElement('div');
    card.className='card-container';

    //header

    const header=document.createElement('div');
    header.className='card-header';

    const imgContainer=document.createElement('div');
    imgContainer.className='img-container';
    const img=document.createElement('img');
    img.className='icon';
    img.src=results.img_url||'dummy.png';
    imgContainer.appendChild(img);

    const headingContainer=document.createElement('div');
    headingContainer.className='heading-container';
    const recipeTitle=document.createElement('p');
    recipeTitle.className='recipe-title';
    recipeTitle.textContent=results.recipe_name;
    headingContainer.appendChild(recipeTitle);

    header.append(imgContainer,headingContainer);

    //body

    const cardBody=document.createElement('div');
    cardBody.className='card-body';

    const body=document.createElement('div');
    body.className='main-body';
    const footer=document.createElement('div');
    footer.className='card-footer';

    const bodyLeft=document.createElement('div');
    bodyLeft.className='body-left';
    const bodyRight=document.createElement('div');
    bodyRight.className='body-right';

    //bodyLeft

    const ratingContainer=document.createElement('div');
    ratingContainer.className='rating-container';
    const rating=document.createElement('span');
    rating.className='rating';
    rating.textContent=`*${results.rating}`;
    ratingContainer.appendChild(rating);

    const matchContainer=document.createElement('div');
    matchContainer.className='match-container';
    const matches=document.createElement('span');
    matches.className='matches';
    matches.textContent=`${results.matchCounter}/${searchLength} matches`;
    matchContainer.appendChild(matches);

    bodyLeft.append(ratingContainer,matchContainer);

    //bodyRight

    const ingredientsHeading=document.createElement('p');
    ingredientsHeading.className='ingredients-heading';
    ingredientsHeading.textContent='Ingredients';
    const ingredientsList=document.createElement('ul');
    ingredientsList.className='ingredients-list';
    let limit=0;
    if(results.ingredients.length<5){
        limit=results.ingredients.length;
    }
    else{
        limit=5;
    }
    for(let i=0;i<limit;i++){
        const listElement=document.createElement('li');
        listElement.textContent=results.ingredients[i];
        ingredientsList.appendChild(listElement);
    }

    bodyRight.append(ingredientsHeading,ingredientsList);

    body.append(bodyLeft,bodyRight);

    //footer

    const time=document.createElement('span');
    time.textContent=`⏱${results.prep_time}min`;
    const origin=document.createElement('span');
    origin.textContent=`•${results.origin}`;
    const servings=document.createElement('span');
    servings.textContent=`•${results.servings} srv`;

    footer.append(time,origin,servings);

    cardBody.append(body,footer);

    card.append(header,cardBody);

    card.addEventListener('click', () => {
    window.open(`target.html?id=${results.recipe_id}`, '_blank');
    });

    return card;
}


function cardGrid(card,results,searchLength){
    const cardGrid=document.querySelector('.card-grid');
    cardGrid.innerHTML='';

    for(let i=0;i<results.length;i++){
        const appendCard=card(results[i],searchLength);
        cardGrid.appendChild(appendCard);
    }
    return;
}

function search(searchArray){
    if(searchArray.length===0){
        return [];
    }

    fetch('/api/search',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ingredients:searchArray})
    })
    .then(res=>res.json())
    .then(results=>{
        console.log('Matched results:',results);
        cardGrid(card,results,searchArray.length);
    })
}

