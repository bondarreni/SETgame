
//minta : 3SrD.svg 
// 1, 2, 3
// S: teli, H: csíkos, O: üres 
// r : red, g: green, p: purple
// D: diamond, P: ovális, S: hullámos

/*
const fillings = [
    "S", //teli
    "H", //csíkos
    "O" //üres
]

const colors = [
    "r", //red
    "g", //green
    "p" //purple
]

const shapes = [
    "D", //diamond
    "P", //ovális
    "S" //hullámos
]*/

class Card {

    constructor(number, filling, color, shape) {
        this.number = number;
        this.filling = filling; //könnyűnél nem kell
        this.color = color;
        this.shape = shape;

        this.image = new Image(200, 130)   //ha nincs szélesség, magasság, akkor az eredeti méret
        this.image.src = "./icons/" + number + filling + color + shape + ".png"
    }
}


//27 lapos pakli
class DeckEasy {

    constructor() {
        this.cards = [];    
    }
                       
    createDeck() {
        let numbers = [1, 2, 3]
        let colors = ['r', 'g', 'p'];
        let shapes = ['D', 'P', 'S'];
    

        for(let i = 0; i < numbers.length; i++) {
            for(let j = 0; j < colors.length; j++) {
                for(let k = 0; k < shapes.length; k++) {
                    this.cards.push(new Card(numbers[i], "S" , colors[j], shapes[k]))
                }
            }
        }

    }

    shuffleDeck() {
        this.cards = this.cards.sort(() => Math.random() - 0.5)
    }
}


//81 lapos pakli
class DeckHard {

    constructor() {
        this.cards = [];    
    }
                       
    createDeck() {
        let numbers = [1, 2, 3]
        let fillings = ['S', 'H', 'O']
        let colors = ['r', 'g', 'p'];
        let shapes = ['D', 'P', 'S'];
    

        for(let i = 0; i < numbers.length; i++) {
            for (let l = 0; l < fillings.length; l++) {
                for(let j = 0; j < colors.length; j++) {
                    for(let k = 0; k < shapes.length; k++) {
                        this.cards.push(new Card(numbers[i], fillings[l] , colors[j], shapes[k]))
                    }
                }
            }
        }

    }

    shuffleDeck() {
        this.cards = this.cards.sort(() => Math.random() - 0.5)
    }
}



class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.active = false //kezdetben minden játékos NEM aktív
        this.inGame = true //kezdetben minden játékos játékban van
    }
}



class Board {

    constructor(level, mode, isSetButton, isShowSetButton, threeCards) {
        this.cardsOnTable = [] //kártyák az asztalra kirakva
        this.players = []; //játékosok
        this.level = level
        this.mode = mode
        this.isSetButton = isSetButton
        this.isShowSetButton = isShowSetButton
        this.threeCards = threeCards
    }

    start() {
        //játékosok létrehozása:
        let child = playerInputs.firstElementChild
        this.players.push(new Player(child.value))
        for(let i = 1; i < numOfPlayers; i++) {
            let nextChild = child.nextElementSibling.nextElementSibling.nextElementSibling
            this.players.push(new Player(nextChild.value))
            child = nextChild
        }

        //pakli
        if(this.level === "easy") {
            this.deck = new DeckEasy()
        }
        else {
            this.deck = new DeckHard()
        }
        this.deck.createDeck()
        this.deck.shuffleDeck()

        console.log("Cards:")
        for(let i = 0; i < this.deck.cards.length; i++) {
            console.log(this.deck.cards[i])
        }

        for(let i = 0; i < 12; i++) {
            this.cardsOnTable.push(this.deck.cards[0])
            this.deck.cards.shift()
        }
        for(let i = 0; i < 9; i++) {
            this.cardsOnTable.push(null)
        }

        //extra gombok megjelenítése
        if(this.isSetButton) {
            isSetBtn.style.display = "inline"
        }
        else {
            isSetBtn.style.display = "none"
        }
        if(this.isShowSetButton) {
            showSetBtn.style.display = "inline"
        }
        else {
            showSetBtn.style.display = "none"
        }
        if(this.threeCards === "gomb") {
            plusCardsBtn.style.display = "inline"
        }
        else {
            plusCardsBtn.style.display = "none"
        }
    }
}


isSetBtn = document.querySelector("#isSet")
showSetBtn = document.querySelector("#showSet")
plusCardsBtn = document.querySelector("#plusCards")
