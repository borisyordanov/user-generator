var userAmount = localStorage.getItem('userAmount') || '10';
var nationalities = 'us,dk,fr,gb'
var dataLink = `https://randomuser.me/api/?results=${userAmount}&nat=${nationalities}`;
var dataType = 'json';
var loader = document.querySelector('.cssload-container');
var destination = document.querySelector('.user-list');
var colors = ['#1abc9c', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#2ecc71', '#16a085', 'Brown', 'BurlyWood', 'CadetBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkOliveGreen', 'DarkOrange', 'DarkSlateGray', 'IndianRed', 'thistle', 'mistyrose', 'coral']
var increaseBtn = document.querySelector('.up');
var decreaseBtn = document.querySelector('.down');
var userParent = document.querySelector(".user-list");
var displayAmount = document.querySelector('.words');
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

displayAmount.innerHTML = userAmount;
loader.style.display = "block";

//Initial API fetch and display returned data
getUserData();

increaseBtn.addEventListener("click", function() {
  //increase user amount
  userAmount++;
  // update UI
  toggleLoader();
  updateDisplay();
});

decreaseBtn.addEventListener("click", function() {
  //check if decrease is possible
  if (userAmount > 1) {
    //decrease user amount
    userAmount--;
    // update UI
    toggleLoader();
    updateDisplay();
  } else {
    alert("Minimum value reached");
  }
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function toggleLoader() {
  //Turns the loading animation on or off
  if (loader.style.display === "none") {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
}

function getUserData() {

  fetch(dataLink)
    .then((resp) => resp.json())
    .then(function(data) {
      //stores the api data
      useReturnData(data);
      toggleLoader();
    })
    .catch(function(error) {
      console.log(error);
    });

};

function useReturnData(data) {

  var i = data.results.length;
  //iterate each user that was received
  while (i--) {
    var userHolder = `<img src=' ${data.results[i].picture.medium} '>
                      <p>Name: <span id='name'> ${data.results[i].name.first} ${data.results[i].name.last} </span></p>
                      <p>Email: <span id='email'> ${data.results[i].email} </span></p>
                      <p>Gender: <span id='gender'> ${data.results[i].gender} </span></p>`;
    //put each user in a div
    var user = createDiv(userHolder, i);
    //append the user to the parent DOM element
    destination.appendChild(user);
  }
};

function updateDisplay() {
  //Store the user value in the browser's local storage
  localStorage.setItem('userAmount', JSON.stringify(userAmount));
  //Update the value display in the UI
  displayAmount.innerHTML = userAmount;
  //Remove current 
  while (userParent.firstChild) {
    userParent.removeChild(userParent.firstChild);
  }
  //update API call link
  dataLink = `https://randomuser.me/api/?results=${userAmount}&nat=${nationalities}`;
  //fetch and display API data
  getUserData();
}


function createDiv(userHolder, i) {
  //create new div
  var newDiv = document.createElement('div');
  //insert HTML strong
  newDiv.innerHTML = userHolder;
  //add classes and styles
  newDiv.className = "user";
  // newDiv.style.backgroundColor = colors[i];

  newDiv.style.backgroundColor = colors.randomElement();
  return newDiv;
}

//Speech recognition

recognition.addEventListener('result', e => {
//convert speech data
  var transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');
//display the speech data if it's a number
  if (!isNaN(transcript)) {
    toggleLoader();
    //update user amount
    userAmount = parseInt(transcript);
    updateDisplay()
  } else {
    alert("Try again, please");
  }
});
//triggers the speech recognition
recognition.addEventListener('end', recognition.start);
recognition.start();