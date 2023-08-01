import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js" 
import { getDatabase, onValue, ref, push, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js" 
const appSettings = {
  databaseURL: "https://we-are-the-champions-a89b9-default-rtdb.europe-west1.firebasedatabase.app/" 
}

const app = initializeApp(appSettings) 
const database = getDatabase(app) 
const data = ref(database, "data") 

const paraInpt = document.getElementById("para-input")
const fromEl = document.getElementById("from-el")
const tooEl = document.getElementById("too-el")
const publishBtn = document.getElementById("publish-btn")
const ulEl = document.getElementById("ul-el")

let dataArray = ""

function fetchDataFromDb(){
    onValue(data, function(snapshot){ // Retreives data from database to push it to dataArray
        if (snapshot.exists()){
            let dataOndb = Object.entries(snapshot.val())
            dataArray = dataOndb
            clearDisplay()      
            display(dataArray)
        }
    })
}

fetchDataFromDb()
function display(x){ // displays dataArray if called inside a forloop
    for (let i = 0; i<x.length;i++){
        let listItem = document.createElement("li")
        ulEl.append(listItem)
        // create too element
        let tooEl = document.createElement("h3")
        tooEl.textContent = `To ${x[i][1].too}`
        listItem.append(tooEl)
        // create paragtaph element
        let pEl = document.createElement("p")
        pEl.textContent = `${x[i][1].p}`
        listItem.append(pEl)
        // create first div 
        let firstDivEl = document.createElement("div")
        firstDivEl.setAttribute("class", "footer")
        listItem.append(firstDivEl)
        // create from element within firstDivEl
        let fromEl = document.createElement("h3")
        fromEl.textContent = `From ${x[i][1].from}`
        firstDivEl.append(fromEl)
        // create div element inside firstDivEl
        let secondDivEl = document.createElement("div")
        secondDivEl.setAttribute("class", "like-box")
        firstDivEl.append(secondDivEl)
        // create div element inside of secondDivEl
        let thirdDivEl = document.createElement("div")
        thirdDivEl.setAttribute("id", `${x[i][0]}`)
        secondDivEl.append(thirdDivEl)
        //create icon element inside of thirdDivEl
        let iEl = document.createElement("i")
        iEl.setAttribute("class","fa-regular fa-heart like-img")
        thirdDivEl.append(iEl)
        iEl.addEventListener("click", function(){
            x[i][1].likes += 1
            set(ref(database,"data/"+x[i][0]), (x[i][1]))
        }) 
        //create h4 inside second div
        let countNum = document.createElement("h4")
        countNum.textContent = `${x[i][1].likes}`
        secondDivEl.append(countNum)
    }                           
}

function clearDisplay(){  // clears UlEl if called
ulEl.innerHTML = ""
}

function clearInputs(){
    paraInpt.value = ""
    fromEl.value = ""
    tooEl.value = "" 
}

publishBtn.addEventListener("click", function(){  //Publish btn sends data to DATABSE 
    let input = {
        p          : paraInpt.value,
        from       : fromEl.value,
        too        : tooEl.value,
        likes      : 0,
        likeState  : false
    }
    push(data,input) // push data to firebase 
    clearInputs() // clear inputs
})
