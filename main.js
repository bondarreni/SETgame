//DELEGÁLÁS
function delegal(szulo, gyerek, mikor, mit) {
    function esemenyKezelo(esemeny) {
        let esemenyCelja = esemeny.target;
        let esemenyKezeloje = this;
        let legkozelebbiKeresettElem = esemenyCelja.closest(gyerek);

        if (esemenyKezeloje.contains(legkozelebbiKeresettElem)) {
            mit(esemeny, legkozelebbiKeresettElem);
        }
    }

    szulo.addEventListener(mikor, esemenyKezelo);
}
/////////////////////////////////////////////////////////////////////////////////////////


const body = document.querySelector("body")

let board
let start
let finish

let samePlayers = false //true, ha ez nem az első játék az adott játékosokkal

//Játék indítása 
startButton.addEventListener("click", startGame)
startButton.addEventListener("click", emptyPoints)

let pointsArray

function emptyPoints() {
    pointsArray = []
    samePlayers = false
}

function startGame() {
    start = Date.now()
    openDiv.style.display = "none"
    gameDiv.style.display = "block"
    body.style.backgroundImage = "none"

    //BOARD létrehozása
    board = new Board(gameLevel(), gameMode(), isSetButton(), isShowSetButton(), threeCards());
    board.start()

    if (board.players.length === 1) {
        selectedPlayer = board.players[0]
        board.players[0].active = true
    }
    else {
        selectedPlayer = null
    }

    generateTable()
    generatePlayers()

    if (isSetButton()) {
        isSetBtn.addEventListener("click", findSet)
    }
    if (isShowSetButton()) {
        showSetBtn.addEventListener("click", findSet)
    }

    if (threeCards() === "gomb") {
        plusCardsBtn.addEventListener("click", addCards)
    }

    isSetOnTable()

}



/////////////////
// GAME PAGE
/////////////////

const table = document.querySelector("table")
const gameDiv = document.querySelector("#game")


let selectedCards = []
let selectedPlayer = null




// Táblázat generálása 
function generateTable() {
    table.innerHTML = ""
    let counter = 0;
    for (let i = 0; i < 7; i++) {
        const tr = document.createElement("tr")
        if (board.cardsOnTable[counter] === null && board.cardsOnTable[counter + 1] === null && board.cardsOnTable[counter + 2] === null) //ha egy új sor összes eleme null
        {
            tr.style.display = "none" //akkor nem jelenítjük meg a sort
        }
        for (let j = 0; j < 3; j++) {
            const td = document.createElement("td")
            if (board.cardsOnTable[counter] !== null) {
                td.appendChild(board.cardsOnTable[counter].image)
            }
            tr.appendChild(td)
            counter++;
        }
        table.appendChild(tr)
    }
}


//Játékosok generálása
const playerDiv = document.querySelector("#playerDiv")
const players = document.getElementsByClassName("playerButton")
const playersNotInGame = []

function generatePlayers() {
    let inner = ""
    for (let i = 0; i < board.players.length; i++) {
        inner = inner + `<button class="playerButton ${board.players[i].active ? "jatekosKijelolve" : ""} ${!board.players[i].inGame ? "jatekosNotInGame" : ""}">${board.players[i].name}</button><span>${board.players[i].score}</span><br>`
    }
    playerDiv.innerHTML = inner
}


//Játékos kiválasztása

const progressDiv = document.querySelector("#progressDiv")
const progressBar = document.getElementById("pbar")
let timer

playerDiv.addEventListener("click", selectPlayer)

async function selectPlayer(event) {
    if (event.target.matches("button") && !event.target.classList.contains("jatekosNotInGame")) {

        if (selectedPlayer === null) {
            for (let i = 0; i < board.players.length; i++) {
                if (players[i] !== event.target) {
                    players[i].classList.remove("jatekosKijelolve")
                    board.players[i].active = false
                }
                else {
                    if (board.players[i].active) //ha már eddig is ő volt aktív, csak rákattintottam újra
                    {

                    }
                    else {
                        players[i].classList.add("jatekosKijelolve")
                        board.players[i].active = true
                        selectedPlayer = board.players[i]

                        timer = setTimeout(timeUp, 10000)
                        progressDiv.style.visibility = "visible"
                        startCountdown()

                    }
                }
            }
        }
    }
}


function timeUp() {
    console.log("Time's up!")

    selectedPlayer.active = false
    selectedPlayer.score--
    selectedPlayer.inGame = false

    selectedPlayer = null

    generatePlayers()
    removeCardSelections()

    progressDiv.style.visibility = "hidden"

    let playersNotInGame = document.getElementsByClassName("jatekosNotInGame")
    if (playersNotInGame.length === board.players.length) {
        for (let i = 0; i < playersNotInGame.length; i++) {
            board.players[i].inGame = true
        }
        generatePlayers()
    }
}



function startCountdown() {
    progressBar.value = 0
    let count = 10;
    let countTimer = setInterval(function () {
        progressBar.value = 10 - --count;
        if (count <= 0 || selectedPlayer === null) {
            clearInterval(countTimer);
        }
    }, 1000);
}




//kártyák kijelölése

delegal(table, "img", "click", kijeloles)

async function kijeloles(event, target) {

    if (selectedPlayer !== null) {

        //ha még nincs 3 kiválasztva akkor ezt is kijelöljük
        if (selectedCards.length < 3) {
            target.classList.toggle("kijelolve")
            selectedCards = document.querySelectorAll(".kijelolve")

            //ha 3 lett kijelölt, akkor...
            if (selectedCards.length === 3) {

                clearTimeout(timer)

                if (isSet()) {
                    selectedPlayer.score++

                    const setTimeoutPromise = timeout => new Promise(resolve => {
                        setTimeout(resolve, timeout);
                    });
                    await setTimeoutPromise(500);

                    removeSelectedCards()
                    removeCardSelections()

                    if (board.players.length > 1) {
                        selectedPlayer.active = false
                    }


                    for (let i = 0; i < board.players.length; i++) {
                        board.players[i].inGame = true
                    }

                    console.log("Lapok a pakliban : " + board.deck.cards.length)

                    isSetOnTable()


                }


                else {
                    selectedPlayer.score--

                    const setTimeoutPromise = timeout => new Promise(resolve => {
                        setTimeout(resolve, timeout);
                    });
                    await setTimeoutPromise(500);

                    removeCardSelections()
                    if (board.players.length > 1) {
                        selectedPlayer.active = false
                        selectedPlayer.inGame = false //most "kiesik"
                    }

                    generatePlayers()

                    let playersNotInGame = document.getElementsByClassName("jatekosNotInGame")
                    if (playersNotInGame.length === board.players.length) {
                        for (let i = 0; i < playersNotInGame.length; i++) {
                            board.players[i].inGame = true
                        }
                    }


                }
                generatePlayers()
                if (board.players.length > 1) {
                    selectedPlayer = null
                }

                progressDiv.style.visibility = "hidden"
            }
        }
    }

}

//kártyák kijelölésének eltávolítása
function removeCardSelections() {
    for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.remove("kijelolve")
    }
    selectedCards = []
}





// ha SET volt, akkor eltávolítjuk a kártyákat
function removeSelectedCards() {
    let card1CellIndex = selectedCards[0].parentElement.cellIndex
    let card1RowIndex = selectedCards[0].parentElement.parentElement.rowIndex

    let card2CellIndex = selectedCards[1].parentElement.cellIndex
    let card2RowIndex = selectedCards[1].parentElement.parentElement.rowIndex

    let card3CellIndex = selectedCards[2].parentElement.cellIndex
    let card3RowIndex = selectedCards[2].parentElement.parentElement.rowIndex


    //hány kártya van kint az asztalon:
    let cardOnTableNum = 0
    for (let i = 0; i < board.cardsOnTable.length; i++) {
        if (board.cardsOnTable[i] !== null) {
            cardOnTableNum++
        }
    }


    table.rows[card1RowIndex].cells[card1CellIndex].removeChild(table.rows[card1RowIndex].cells[card1CellIndex].firstChild)
    board.cardsOnTable[card1RowIndex * 3 + card1CellIndex] = null

    table.rows[card2RowIndex].cells[card2CellIndex].removeChild(table.rows[card2RowIndex].cells[card2CellIndex].firstChild)
    board.cardsOnTable[card2RowIndex * 3 + card2CellIndex] = null

    table.rows[card3RowIndex].cells[card3CellIndex].removeChild(table.rows[card3RowIndex].cells[card3CellIndex].firstChild)
    board.cardsOnTable[card3RowIndex * 3 + card3CellIndex] = null


    let c = 0
    if (cardOnTableNum === 12) {
        for (let i = 0; i < board.cardsOnTable.length; i++) {
            if (c < 3 && board.deck.cards.length > 0 && board.cardsOnTable[i] === null) {
                board.cardsOnTable[i] = board.deck.cards[0]
                board.deck.cards.shift()
                c++
            }
        }
        generateTable()
    }


}





function isSet() {

    let card1CellIndex = selectedCards[0].parentElement.cellIndex
    let card1RowIndex = selectedCards[0].parentElement.parentElement.rowIndex
    let card1 = board.cardsOnTable[card1RowIndex * 3 + card1CellIndex] //a tömbben így jön ki a mátrix táblázatból

    let card2CellIndex = selectedCards[1].parentElement.cellIndex
    let card2RowIndex = selectedCards[1].parentElement.parentElement.rowIndex
    let card2 = board.cardsOnTable[card2RowIndex * 3 + card2CellIndex]

    let card3CellIndex = selectedCards[2].parentElement.cellIndex
    let card3RowIndex = selectedCards[2].parentElement.parentElement.rowIndex
    let card3 = board.cardsOnTable[card3RowIndex * 3 + card3CellIndex]


    let numOK
    if (card1.number === card2.number) //ha az első kettő szám egyforma
    {
        if (card2.number === card3.number) {
            numOK = true
        }
        else {
            numOK = false
        }
    }
    else //ha az első szám és a második szám NEM egyforma
    {
        if ((card3.number !== card2.number) && (card3.number !== card1.number)) {
            numOK = true
        }
        else {
            numOK = false
        }
    }

    if (!numOK) {
        return false
    }

    let colorOK
    if (card1.color === card2.color) {
        if (card2.color === card3.color) {
            colorOK = true
        }
        else {
            colorOK = false
        }
    }
    else {
        if ((card3.color !== card2.color) && (card3.color !== card1.color)) {
            colorOK = true
        }
        else {
            colorOK = false
        }
    }

    if (!colorOK) {
        return false
    }


    let fillingOK
    if (card1.filling === card2.filling) {
        if (card2.filling === card3.filling) {
            fillingOK = true
        }
        else {
            fillingOK = false
        }
    }
    else {
        if ((card3.filling !== card2.filling) && (card3.filling !== card1.filling)) {
            fillingOK = true
        }
        else {
            fillingOK = false
        }
    }

    if (!fillingOK) {
        return false
    }

    let shapeOK
    if (card1.shape === card2.shape) {
        if (card2.shape === card3.shape) {
            shapeOK = true
        }
        else {
            shapeOK = false
        }
    }
    else {
        if ((card3.shape !== card2.shape) && (card3.shape !== card1.shape)) {
            shapeOK = true
        }
        else {
            shapeOK = false
        }
    }

    if (shapeOK) {
        return true
    }
    else {
        return false
    }


}



///////EXTRA BUTTONS 


function addCards() {
    let cardAdded = 0
    if (board.deck.cards.length > 0) {
        for (let i = 0; i < board.cardsOnTable.length; i++) {
            if (board.deck.cards.length > 0) {
                if (cardAdded < 3) {
                    if (board.cardsOnTable[i] == null) {
                        board.cardsOnTable[i] = board.deck.cards[0]
                        board.deck.cards.shift()
                        cardAdded++
                    }
                }
            }
        }
        generateTable()
    }
    else {
        //alert("Nincs több kártya a pakliban!") ---- legyen a gomb nem aktív
    }
}


//set keresése
async function findSet(e) {

    let card1
    let card2
    let card3

    let numEqual
    let colorEqual
    let shapeEqual
    let fillingEqual

    let set

    if (selectedPlayer === null || board.players.length === 1) {
        for (let i = 0; i < board.cardsOnTable.length; i++) {
            if (board.cardsOnTable[i] !== null) {

                card1 = board.cardsOnTable[i]
                for (let j = 0; j < board.cardsOnTable.length; j++) {
                    if (board.cardsOnTable[j] !== null) {
                        card2 = board.cardsOnTable[j]
                        if (card1 !== card2) {
                            if (card1.number === card2.number) {
                                numEqual = true
                            }
                            else {
                                numEqual = false
                            }

                            if (card1.filling === card2.filling) {
                                fillingEqual = true
                            }
                            else {
                                fillingEqual = false
                            }

                            if (card1.color === card2.color) {
                                colorEqual = true
                            }
                            else {
                                colorEqual = false
                            }

                            if (card1.shape === card2.shape) {
                                shapeEqual = true
                            }
                            else {
                                shapeEqual = false
                            }

                            for (let k = 0; k < board.cardsOnTable.length; k++) {
                                if (board.cardsOnTable[k] !== null) {
                                    card3 = board.cardsOnTable[k]
                                    if (card3 !== card2 && card3 !== card1) {

                                        set = true

                                        if (numEqual) {
                                            if (card3.number !== card2.number) {
                                                set = false
                                            }
                                        }
                                        else {
                                            if (card3.number === card2.number || card3.number === card1.number) {
                                                set = false
                                            }
                                        }

                                        if (fillingEqual) {
                                            if (card3.filling !== card2.filling) {
                                                set = false
                                            }
                                        }
                                        else {
                                            if (card3.filling === card2.filling || card3.filling === card1.filling) {
                                                set = false
                                            }
                                        }


                                        if (colorEqual) {
                                            if (card3.color !== card2.color) {
                                                set = false
                                            }
                                        }
                                        else {
                                            if (card3.color === card2.color || card3.color === card1.color) {
                                                set = false
                                            }
                                        }

                                        if (shapeEqual) {
                                            if (card3.shape !== card2.shape) {
                                                set = false
                                            }
                                        }
                                        else {
                                            if (card3.shape === card2.shape || card3.shape === card1.shape) {
                                                set = false
                                            }
                                        }

                                        if (set) {
                                            if (e.target.id === "showSet") {
                                                card1.image.classList.add("kijelolve")
                                                card2.image.classList.add("kijelolve")
                                                card3.image.classList.add("kijelolve")

                                                const setTimeoutPromise = timeout => new Promise(resolve => {
                                                    setTimeout(resolve, timeout);
                                                });
                                                await setTimeoutPromise(1000);

                                                card1.image.classList.remove("kijelolve")
                                                card2.image.classList.remove("kijelolve")
                                                card3.image.classList.remove("kijelolve")

                                                return
                                            }
                                            else if (e.target.id === "isSet") {
                                                console.log("Van SET")
                                                isSetBtn.style.backgroundColor = "#9fc788"

                                                const setTimeoutPromise = timeout => new Promise(resolve => {
                                                    setTimeout(resolve, timeout);
                                                });
                                                await setTimeoutPromise(1000);

                                                isSetBtn.style.backgroundColor = "#e6d7d3"
                                                return
                                            }

                                        }


                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!set) {
            if (e.target.id === "showSet") {
                return
            }
            else if (e.target.id === "isSet") {
                console.log("Nincs SET")
                isSetBtn.style.backgroundColor = "#d44d4d"

                const setTimeoutPromise = timeout => new Promise(resolve => {
                    setTimeout(resolve, timeout);
                });
                await setTimeoutPromise(1000);

                isSetBtn.style.backgroundColor = "#e6d7d3"
                return
            }
        }
    }
}




const gameOverDiv = document.querySelector("#gameOverDiv")


//ellenőrzi, hogy van e set és ha nincs van e a pakliban kártya
function isSetOnTable() {
    let card1
    let card2
    let card3

    let numEqual
    let colorEqual
    let shapeEqual
    let fillingEqual

    let set

    for (let i = 0; i < board.cardsOnTable.length; i++) {
        if (board.cardsOnTable[i] !== null) {

            card1 = board.cardsOnTable[i]
            for (let j = 0; j < board.cardsOnTable.length; j++) {
                if (board.cardsOnTable[j] !== null) {
                    card2 = board.cardsOnTable[j]
                    if (card1 !== card2) {
                        if (card1.number === card2.number) {
                            numEqual = true
                        }
                        else {
                            numEqual = false
                        }

                        if (card1.filling === card2.filling) {
                            fillingEqual = true
                        }
                        else {
                            fillingEqual = false
                        }

                        if (card1.color === card2.color) {
                            colorEqual = true
                        }
                        else {
                            colorEqual = false
                        }

                        if (card1.shape === card2.shape) {
                            shapeEqual = true
                        }
                        else {
                            shapeEqual = false
                        }

                        for (let k = 0; k < board.cardsOnTable.length; k++) {
                            if (board.cardsOnTable[k] !== null) {
                                card3 = board.cardsOnTable[k]
                                if (card3 !== card2 && card3 !== card1) {

                                    set = true

                                    if (numEqual) {
                                        if (card3.number !== card2.number) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.number === card2.number || card3.number === card1.number) {
                                            set = false
                                        }
                                    }

                                    if (fillingEqual) {
                                        if (card3.filling !== card2.filling) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.filling === card2.filling || card3.filling === card1.filling) {
                                            set = false
                                        }
                                    }

                                    if (colorEqual) {
                                        if (card3.color !== card2.color) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.color === card2.color || card3.color === card1.color) {
                                            set = false
                                        }
                                    }

                                    if (shapeEqual) {
                                        if (card3.shape !== card2.shape) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.shape === card2.shape || card3.shape === card1.shape) {
                                            set = false
                                        }
                                    }

                                    if (set) {
                                        return
                                    }


                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (!set) {
        //akkor új lapok vagy game over
        if (board.deck.cards.length > 0) {
            if (plusCardsBtn.style.display = "none") {
                addCards()
                isSetOnTable() //miután hozzáadtunk 3 kárytát megnézzük, hogy már van-e set (ha nem, akkor megint kell)
            }
        }
        else {
            console.log("GAME OVER")
            gameOverDiv.style.display = "block"
            gameOverDivGenerate()
            saveData()
            gameDiv.style.display = "none"
        }
        return
    }
    else //itt csak akkor lehet a set true, ha nem volt egy kártya sem már az asztalon
    {
        console.log("GAME OVER")
        gameOverDiv.style.display = "block"
        gameOverDivGenerate()
        saveData()
        gameDiv.style.display = "none"
        return
    }
}


const placesDiv = document.querySelector("#placesDiv")
let secondsPassed

let sortedPointsArray

const newGameButton = document.querySelector("#newGame")


function gameOverDivGenerate() {
    finish = Date.now()
    secondsPassed = Math.round((finish - start) / 1000)

    let sortedPlayers = []
    for(let i = 0; i < board.players.length; i++) {
        sortedPlayers.push(board.players[i])
    }
    sortedPlayers.sort(comparePlayers);
    let place = 1
    placesDiv.innerHTML = ""
    if (board.players.length === 1) {

        newGameButton.style.display = "none"

        let p1 = document.createElement("p")
        p1.innerHTML = "<b>Pontok: </b>" + board.players[0].score
        placesDiv.appendChild(p1)

        if (board.mode === "verseny") {
            let p2 = document.createElement("p")
            p2.innerHTML = "<b>Idő: </b>" + secondsPassed + " másodperc"
            placesDiv.appendChild(p2)
        }
    }
    else {
        for (let i = board.players.length - 1; i >= 0; i--) {
            let p = document.createElement("p")
            p.innerHTML = "<b>" + place + ".</b> " + sortedPlayers[i].name + " (" + sortedPlayers[i].score + " pont)"
            placesDiv.appendChild(p)
            place++
        }
        let pOssz = document.createElement("p")
        pOssz.innerHTML = "<b>Összesített:</b><br>"
        placesDiv.appendChild(pOssz)

        if(pointsArray.length === 0) {
            for(let i = 0; i < board.players.length; i++) {
                pointsArray.push([board.players[i].name, board.players[i].score])
            }
        } else {
            for(let i = 0; i < pointsArray.length; i++) {
                pointsArray[i][1] =  pointsArray[i][1] + board.players[i].score
            }
        }

        sortedPointsArray = []
        for(let i = 0; i < pointsArray.length; i++) {
            sortedPointsArray.push(pointsArray[i])
        }

        sortedPointsArray.sort(function (a, b) {
            return a[1] - b[1];
        });

        console.log(sortedPointsArray)
        place = 1
        for (let i = sortedPointsArray.length - 1; i >= 0; i--) {
            let p = document.createElement("p")
            p.innerHTML = "<b>" + place + ".</b> " + sortedPointsArray[i][0] + " (" + sortedPointsArray[i][1] + " pont)"
            placesDiv.appendChild(p)
            place++
        }

        newGameButton.style.display = "inline"
    }

    gameDiv.style.display = "none"
}


function comparePlayers(a, b) {
    if (a.score < b.score) {
        return -1;
    }
    if (a.score > b.score) {
        return 1;
    }
    return 0;
}




function saveData() {
    if (board.players.length === 1 && board.level === "easy" && board.mode === "verseny") {

        let arrElem = [`${board.players[0].name}`, secondsPassed]

        kezdoArr[kezdoArr.length] = arrElem

        kezdoArr.sort(function (a, b) {
            return a[1] - b[1];
        });

        if (kezdoArr.length > 10) {
            kezdoArr.pop()
        }

        localStorage.setItem("savedDataKezdo", JSON.stringify(kezdoArr))

        kezdoTopList.innerHTML = ""

        for (let i = 0; i < kezdoArr.length; i++) {
            newKezdo(kezdoArr[i])
        }
    }



    if (board.players.length === 1 && board.level === "hard" && board.mode === "verseny") {

        let arrElem = [`${board.players[0].name}`, secondsPassed]

        haladoArr[haladoArr.length] = arrElem

        haladoArr.sort(function (a, b) {
            return a[1] - b[1];
        });

        if (haladoArr.length > 10) {
            haladoArr.pop()
        }

        localStorage.setItem("savedDataHalado", JSON.stringify(haladoArr))

        haladoTopList.innerHTML = ""

        for (let i = 0; i < haladoArr.length; i++) {
            newHalado(haladoArr[i])
        }
    }

    if (board.players.length > 1) {

        let arr = []
        for(let i = sortedPointsArray.length - 1; i >= 0; i--) {
            arr[arr.length] = sortedPointsArray[i]
        }
        if(!samePlayers) {
            multiArr[multiArr.length] = arr
        } else {
            multiArr[multiArr.length - 1] = arr
        }
        
        if (multiArr.length > 10) {
            multiArr.shift()
        }

        localStorage.setItem("savedDataMulti", JSON.stringify(multiArr))

        tobbjatekosList.innerHTML = ""

        newMulti(multiArr)
    }

}




//Vissza a kezdőlapra
backToOpenBtn = document.querySelector("#backToOpen")
backToOpenBtn.addEventListener("click", backToOpeningPage)

function backToOpeningPage() {
    openDiv.style.display = "block"
    gameOverDiv.style.display = "none"
    body.style.backgroundImage = `url("./background.jpg")`
}


//Új játék a játékosokkal

newGameButton.addEventListener("click", startNewGame)

function startNewGame() {
    startGame()
    samePlayers = true
    gameOverDiv.style.display = "none"
}






















/// SEGÍTSÉG - KONZOLBA: 

async function setConsole() {

    let card1
    let card2
    let card3

    let numEqual
    let colorEqual
    let shapeEqual
    let fillingEqual

    let set

    for (let i = 0; i < board.cardsOnTable.length; i++) {
        if (board.cardsOnTable[i] !== null) {

            card1 = board.cardsOnTable[i]
            for (let j = 0; j < board.cardsOnTable.length; j++) {
                if (board.cardsOnTable[j] !== null) {
                    card2 = board.cardsOnTable[j]
                    if (card1 !== card2) {
                        if (card1.number === card2.number) {
                            numEqual = true
                        }
                        else {
                            numEqual = false
                        }

                        if (card1.filling === card2.filling) {
                            fillingEqual = true
                        }
                        else {
                            fillingEqual = false
                        }

                        if (card1.color === card2.color) {
                            colorEqual = true
                        }
                        else {
                            colorEqual = false
                        }

                        if (card1.shape === card2.shape) {
                            shapeEqual = true
                        }
                        else {
                            shapeEqual = false
                        }

                        for (let k = 0; k < board.cardsOnTable.length; k++) {
                            if (board.cardsOnTable[k] !== null) {
                                card3 = board.cardsOnTable[k]
                                if (card3 !== card2 && card3 !== card1) {

                                    set = true

                                    if (numEqual) {
                                        if (card3.number !== card2.number) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.number === card2.number || card3.number === card1.number) {
                                            set = false
                                        }
                                    }

                                    if (fillingEqual) {
                                        if (card3.filling !== card2.filling) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.filling === card2.filling || card3.filling === card1.filling) {
                                            set = false
                                        }
                                    }


                                    if (colorEqual) {
                                        if (card3.color !== card2.color) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.color === card2.color || card3.color === card1.color) {
                                            set = false
                                        }
                                    }

                                    if (shapeEqual) {
                                        if (card3.shape !== card2.shape) {
                                            set = false
                                        }
                                    }
                                    else {
                                        if (card3.shape === card2.shape || card3.shape === card1.shape) {
                                            set = false
                                        }
                                    }

                                    if (set) {
                                        card1.image.classList.add("kijelolve")
                                        card2.image.classList.add("kijelolve")
                                        card3.image.classList.add("kijelolve")

                                        const setTimeoutPromise = timeout => new Promise(resolve => {
                                            setTimeout(resolve, timeout);
                                        });
                                        await setTimeoutPromise(1000);

                                        card1.image.classList.remove("kijelolve")
                                        card2.image.classList.remove("kijelolve")
                                        card3.image.classList.remove("kijelolve")

                                        return
                                    }


                                }
                            }
                        }
                    }
                }
            }
        }
    }
}