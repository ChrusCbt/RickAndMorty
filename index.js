const hide = document.querySelector('.hide')
const container = document.querySelector('.container')
const cardContainer = document.querySelector('.cardContainer')
const form = document.createElement('form')
const randomForm = document.createElement('form')
const searchBar = document.createElement('input')
const submit = document.createElement('button')
const randomButton = document.createElement('button')
const leftButton = document.createElement('button')
const rightButton = document.createElement('button')
// app is dependant on state 
let state = {
    characters : [],
    characterEpisodeName : [],
    randomCharacter : [],
    randomCharacterEpisodeName : '',
    info : {prev : null , next : null}
}


//----- GRAB THE INFORMATION-----// 

const rickAndMorty = async (name) => {
    const characters = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`)


    const data = await characters.json()
    console.log(data)

    await setEpisodeState(data)
    
    console.log('rick and morty episode state ',state.characterEpisodeName)

    state.characters = data.results // state changes to the character results i pulled in displayCharacterResults
    state.randomCharacter = []
    state.randomCharacterEpisodeName = ''
    state.info = data.info
    render() // destroy the page and recreate it with the information in state
}


const randomCharacter = async () => {
    const randomNum = Math.floor(Math.random() * 826) + 1
    const character = await fetch(`https://rickandmortyapi.com/api/character/${randomNum}`)

    const data = await character.json()
    console.log(data)

    const episodeUrl = data.episode[0]

    const episode = await fetch (episodeUrl)
    const episodeData = await episode.json()
    console.log(episodeData)

    state.randomCharacterEpisodeName = episodeData.name
    console.log(state.randomCharacterEpisodeName)

    state.randomCharacter = [data]
    state.characters = []
    state.characterEpisodeName = []
    state.info = {prev : null , next : null}
    render()
}

const setEpisodeState = async (data) => {
    state.characterEpisodeName = []
    console.log('set episode data ',data)

    for(let i = 0; i < data.results.length; i++){
        let character = data.results[i]

        const episodeUrl = character.episode[0] 
        const episode = await fetch(episodeUrl)
        const episodeData = await episode.json()
        state.characterEpisodeName.push(episodeData.name)
    }
}

// destroy the page and recreate it with the form 

const render = () => {
    container.innerHTML = ''
    submit.innerHTML = 'Submit'
    randomButton.innerHTML = 'Random Character'
    searchBar.classList.add('searchBar')
    submit.classList.add('submit')
    randomButton.classList.add('randomButton')
    leftButton.classList.add('leftButton')
    leftButton.innerHTML = '<'
    rightButton.classList.add('rightButton')
    rightButton.innerHTML = '>'
    form.classList.add('form')
    randomForm.classList.add('form')

    if(state.info.prev === null){
        leftButton.disabled = true
    } else {
        leftButton.disabled = false
    }

    if(state.info.next === null){
        rightButton.disabled = true
    } else{
        rightButton.disabled = false
    }

    console.log(leftButton)
    console.log('state info in render ', state.info)
    
    randomForm.append(randomButton)
    form.append(searchBar,submit)
    container.append(form,randomForm,leftButton,rightButton)

    if (state.randomCharacter.length){
        displayCharacterResults(state.randomCharacter)
    } else displayCharacterResults(state.characters)
}


//------EVENT LISTENERS-----// 


form.addEventListener('submit', (e) => {
    e.preventDefault()
    rickAndMorty(searchBar.value)
    searchBar.value = ''
})

randomForm.addEventListener('submit', (e) => {
    e.preventDefault()
    randomCharacter()
})

rightButton.addEventListener('click', async (e) => {
    if (state.info.next === null){
        render()
        return
    }
    const characters = await fetch(state.info.next)
    e.target.disabled = true

    const data = await characters.json()
    console.log(data)
     
    await setEpisodeState(data)
    state.characters = data.results // state changes to the character results i pulled in displayCharacterResults
    state.randomCharacter = []
    state.info = data.info
    render() 
})

leftButton.addEventListener('click', async (e) => {
    if (state.info.prev === null){
        render()
        return
    }
    const characters = await fetch(state.info.prev)
    e.target.disabled = true


    const data = await characters.json()
    console.log('left button data ',data)

    await setEpisodeState(data)
    state.characters = data.results // state changes to the character results i pulled in displayCharacterResults
    state.randomCharacter = []
    state.info = data.info
    render() 
})


//-----DISPLAYING INFORMATION-----//


const displayCharacterResults = (data) => {
    console.log('in display state.characters' ,state.characters)

    const cardContainer = document.createElement('div')
    cardContainer.classList.add('cardContainer')
    container.append(cardContainer)

    for(let i = 0; i < data.length; i++){
        let currentChar = data[i]

        const card = document.createElement('div')
        card.classList.add('characterCard')
        container.append(card)

        const img = document.createElement('img')
        img.classList.add('characterImg')
        img.src = currentChar.image
        card.append(img)

        const textDiv = document.createElement('div')
        textDiv.classList.add('textDiv')
        card.append(textDiv)

        const characterName = document.createElement('h1')
        characterName.innerHTML = currentChar.name
        card.append(characterName)

        const characterStatus = document.createElement('h2')
        characterStatus.innerHTML = currentChar.status
        card.append(characterStatus)

        const characterSpecies = document.createElement('h2')
        characterSpecies.innerHTML = currentChar.species 
        card.append(characterSpecies)   

        const characterGender = document.createElement('h2')
        characterGender.innerHTML = currentChar.gender 
        card.append(characterGender)


        if(state.characterEpisodeName.length){
            const episodeName = document.createElement('h2')
            episodeName.innerHTML = state.characterEpisodeName[i]
            textDiv.append(characterName,characterStatus,characterSpecies,characterGender,episodeName)
        } else  {
            const randomEpisodeName = document.createElement('h2')
            randomEpisodeName.innerHTML = state.randomCharacterEpisodeName
            textDiv.append(characterName,characterStatus,characterSpecies,characterGender,randomEpisodeName)
        } 

        cardContainer.append(card)

    }
}

render()


