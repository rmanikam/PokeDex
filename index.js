// DOM Objects

const mainScreen = document.querySelector('.main_screen');
const pokemonName = document.querySelector('.pokemon_name');
const pokemonId = document.querySelector('.pokemon_id');
const pokemonFrontImg = document.querySelector('.pokemon_front_image');
const pokemonBackImg = document.querySelector('.pokemon_back_image');
const pokemonTypeOne = document.querySelector('.pokemon_type_one');
const pokemonTypeTwo = document.querySelector('.pokemon_type_two');
const pokemonWeight = document.querySelector('.pokemon_weight');
const pokemonHeight = document.querySelector('.pokemon_height');
const pokemonListItems =document.querySelectorAll('.list_item');
const leftBtn = document.querySelector('.left_button');
const rightBtn = document.querySelector('.right_button');

// constants and variables

const TYPES = [
'normal', 'fighting', 'flying',
'poison', 'ground', 'rock',
'bug', 'ghost', 'steel',
'fire', 'water', 'grass',
'electric', 'psychic', 'ice',
'dragon', 'dark', 'fairy'

];

let prevUrl = null;
let nxtUrl = null;

// Functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);
const resetScreen = () => {

    mainScreen.classList.remove('hide');
    for (const type of TYPES)
    {
        mainScreen.classList.remove(type);
    }
};

const fetchPokemonList = url => {

    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, previous, next } = data;
        prevUrl = previous;
        nxtUrl = next;
        for(let i = 0;  i < pokemonListItems.length ; i++)
        {
            const pokemonListItem = pokemonListItems[i];
            const resultData = results[i];
            const { name, url } = resultData;
            const urlArray = url.split('/');
            const id = urlArray[urlArray.length - 2];
            if(resultData)
            {
                pokemonListItem.textContent = id + '. ' + capitalize(name);
            }
            else{
                pokemonListItem.textContent = '';
            }
        }
    });
};

const fetchPokemonData = identity => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${identity}`)
    .then(res => res.json())
     .then( data => {
            resetScreen();
            const dataTypes = data['types'];
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            pokemonTypeOne.textContent = capitalize(dataFirstType['type']['name']);
            if(dataSecondType)
            {
                pokemonTypeTwo.classList.remove('hide');
                pokemonTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
            }
            else
            {
               pokemonTypeTwo.classList.add('hide');
               pokemonTypeTwo.textContent = '';
            }
            mainScreen.classList.add(dataFirstType['type']['name']);
            pokemonName.textContent = capitalize(data['name']);
            pokemonId.textContent = '#' + data['id'].toString().padStart(3, '0');
            pokemonWeight.textContent = data['weight'];
            pokemonHeight.textContent = data['height'];
            pokemonFrontImg.src = data['sprites']['front_default'] || '';
            pokemonBackImg.src = data['sprites']['back_default'] || ''
        });
    };
const handleLftBtnClick = () =>
{
    if(prevUrl)
    {
        fetchPokemonList(prevUrl);
    }
};
const handleRytBtnClick = () =>
{
    if(nxtUrl)
    {
        fetchPokemonList(nxtUrl);
    }
};
const handleLstItmClick = (e) =>
{
    if(!e.target)
    {
        return;
    }
    const listItm = e.target;
    if(!listItm.textContent)
    {
        return;
    }
    const identity = listItm.textContent.split('.')[0];
    fetchPokemonData(identity);
}

// adding event Listeners

leftBtn.addEventListener('click', handleLftBtnClick);
rightBtn.addEventListener('click', handleRytBtnClick);
for(const pokemonListItem of pokemonListItems)
{
    pokemonListItem.addEventListener('click', handleLstItmClick);
}

// initialize App

fetchPokemonList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
