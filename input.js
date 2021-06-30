/////////////////
// OPENING PAGE
/////////////////

const startButton = document.querySelector("#startButton")
const openDiv = document.querySelector("#open")
const data = document.querySelector("#data")
const instructions = document.querySelector("#instructions")
const extras = document.querySelector("#egyeb")

//Player input
const addButton = document.querySelector("#add")
const removeButton = document.querySelector("#remove")
const playerInputs = document.querySelector("#playerInputs")

//Radio buttons
var radioMode = document.getElementsByName("radioMode");
var radioIsSetButton = document.getElementsByName("elso");
var radioShowSetButton = document.getElementsByName("masodik");
var radioThreeCard = document.getElementsByName("harmadik");

var radioLevel = document.getElementsByName("radioLevel")


//extra buttons on game page
const extraButtons = document.querySelector("#extraButtons")


//Szabályok megjelenítése
const instButton = document.querySelector("#szabalyGomb")

instButton.addEventListener("click", instructionToggle)

function instructionToggle() {
    if(data.style.display === "block") {
        data.style.display = "none"
        instructions.style.display = "block"
        instButton.innerHTML = "Vissza"
        topListButton.style.display = "none"
    }
    else {
        data.style.display = "block"
        instructions.style.display = "none"
        instButton.innerHTML = "Játékszabály"
        topListButton.style.display = "inline"
    }
}

const topListButton = document.querySelector("#topListaGomb")
const topListDiv = document.querySelector("#topListDiv")

//Toplisták megjelenítése
topListButton.addEventListener("click", topListToggle)

function topListToggle() {
    if(data.style.display === "block") {
        data.style.display = "none"
        topListDiv.style.display = "block"
        topListButton.innerHTML = "Vissza"
        instButton.style.display = "none"
    }
    else {
        data.style.display = "block"
        topListDiv.style.display = "none"
        topListButton.innerHTML = "Toplista"
        instButton.style.display = "inline"
    }
}




// Játékosok megadása
let numOfPlayers = 1

addButton.addEventListener("click", addPlayer) 

function addPlayer() {
    if(numOfPlayers < 10) {
        playerInputs.appendChild(document.createElement("br"))
        playerInputs.appendChild(document.createElement("br"))
        numOfPlayers++
        let newPlayer = document.createElement("input")
        newPlayer.type = "text"
        newPlayer.value = `Játékos${numOfPlayers}`
        newPlayer.placeholder = `Játékos${numOfPlayers}`
        playerInputs.appendChild(newPlayer)
    }
}

removeButton.addEventListener("click", removePlayer)

function removePlayer() {
    if(numOfPlayers > 1) {
        numOfPlayers--
        for (let i = 0; i < 3; i++) {
            let playerToRemove = playerInputs.childNodes[playerInputs.childNodes.length - 1]
            playerInputs.removeChild(playerToRemove)
        }
    }
}


//Játékmód
for (var i = 0; i < 2; i++) {
    radioMode[i].addEventListener('change', modeChange)
}

function modeChange(event) {
    if(event.target.value === "verseny") {
        extras.style.display = "none"
    }
    else {
        extras.style.display = "block"
    }
}



//radio buttonok értékei:
function gameMode() {
    if(radioMode[0].checked) {
        return ("gyakorlo")
    }
    else {
        return ("verseny")
    }
}

function isSetButton() {
    if(gameMode() === "verseny") //ha verseny, akkor mindenképp hamis
    {
        return false;
    }
    //amúgy a radiobuttontól függ
    if(radioIsSetButton[0].checked) {
        return true
    }
    else {
        return false
    }
}

function isShowSetButton() {
    if(gameMode() === "verseny") 
    {
        return false;
    }

    if(radioShowSetButton[0].checked) {
        return true
    }
    else {
        return false
    }
}

function threeCards() {
    if(gameMode() === "verseny") 
    {
        return "auto";
    }

    if(radioThreeCard[0].checked) {
        return ("gomb")
    }
    else {
        return ("auto")
    }
}



function gameLevel() {
    if(radioLevel[0].checked) {
        return ("easy")
    }
    else {
        return ("hard")
    }
}
