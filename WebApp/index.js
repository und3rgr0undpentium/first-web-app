import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-ead5a-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {

    let inputValue = inputFieldEl.value

    //if click add to cart button without insert value in text field
    //the empty string will not insert into database.
    if (inputValue === "") {
    	return;
    }
    
    push(shoppingListInDB, inputValue)

    clearInputFieldEl() //this is function to clear input field after click button

    //appendItemToShoppingListEl(inputValue) //this is function to append new/update item in bottom
    
})

onValue(shoppingListInDB, function(snapshot) {

	//check if value is exists in database.
	if (snapshot.exists()) {
		let itemsArray = Object.entries(snapshot.val()) //entries - get keys and values

		clearShoppinglistEl() //function to clear list of redundant items after click button

		for(let i = 0; i < itemsArray.length; i++) {
			let currentItem = itemsArray[i]
			let currentItemID = currentItem[0]
			let currentItemValue = currentItem[1]

			appendItemToShoppingListEl(currentItem) //this is function to append new/update item in bottom
		}
	} else {
		shoppingListEl.innerHTML = "No items here...yet"
	}
	
})

function clearShoppinglistEl() {
	shoppingListEl.innerHTML = null
}

function clearInputFieldEl() {
    inputFieldEl.value = null
}

function appendItemToShoppingListEl(item) {
    //shoppingListEl.innerHTML += `<li>${itemValue}</li>`
	let itemID = item[0]
	let itemValue = item[1]
    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    //delete items listed when click on the specific item
    newEl.addEventListener("click", function() {
    	//remove the item based on the item ID, not name.
    	//because item can have same name and ID is unique.
    	let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    	remove(exactLocationOfItemInDB) //this function will remove item listed when clicked it

    })

    shoppingListEl.append(newEl)
}