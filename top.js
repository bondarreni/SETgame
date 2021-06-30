
const kezdoTopList = document.querySelector("#kezdoTop")
const haladoTopList = document.querySelector("#haladoTop")
const tobbjatekosList = document.querySelector("#tobbjatekos")


// 1 személyes kezdő versenyek
let kezdoArr
if(JSON.parse(localStorage.getItem("savedDataKezdo")) === null) {
    kezdoArr = []
} else {
    kezdoArr = JSON.parse(localStorage.getItem("savedDataKezdo"))
}

for(let i = 0; i < kezdoArr.length; i++) {
        newKezdo(kezdoArr[i])
}


function newKezdo(elem) {
    let e = document.createElement("li")
    e.innerHTML = elem[0] + " (" + elem[1] + " másodperc)"
    kezdoTopList.appendChild(e)
}



// 1 személyes haladó versenyek
let haladoArr
if(JSON.parse(localStorage.getItem("savedDataHalado")) === null) {
    haladoArr = []
} else {
    haladoArr = JSON.parse(localStorage.getItem("savedDataHalado"))
}

for(let i = 0; i < haladoArr.length; i++) {
        newHalado(haladoArr[i])
}


function newHalado(elem) {
    let e = document.createElement("li")
    e.innerHTML = elem[0] + " (" + elem[1] + " másodperc)"
    haladoTopList.appendChild(e)
}


//többjátékos mód eredmények
let multiArr
if(JSON.parse(localStorage.getItem("savedDataMulti")) === null) {
    multiArr = []
} else {
    multiArr = JSON.parse(localStorage.getItem("savedDataMulti"))
}


newMulti(multiArr)


function newMulti(elem) {

    for(let i = elem.length - 1; i >= 0; i--) {

        //let u = document.createElement("ul")
        for(let j = 0; j < elem[i].length; j++) {
            let e = document.createElement("li")
            e.innerHTML = j+1 + ". " + elem[i][j][0] + " (" + elem[i][j][1] + " pont)"
            //u.appendChild(e)
            tobbjatekosList.appendChild(e)
        }
        //tobbjatekosList.appendChild(u)
        tobbjatekosList.innerHTML += "<br>" 
    }
}
