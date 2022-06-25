// Setup the board and the players
$(".startGame").on("click", function() {
    gId("home").className = "h";
    gId("result").className = "h";
    clearAlphabet();
    clearPlayer();
    createWord();

    // Order of limbs to draw
    commandStack = ['gId("imgPart5").setAttribute("leftSide", "true")', 
        'gId("imgPart5").setAttribute("rightSide", "true")',
        'gId("imgPart6").setAttribute("data", "true"); gId("imgPart6").setAttribute("leftSide", "true")',
        'gId("imgPart6").setAttribute("rightSide", "true"); gameEnd(false)'];
});

// Word selection
var word = [["Hangman"], ["Preston"], ["HTML"], ["CSS"], ["PHP"], ["JavaScript"], ["Java"], 
    ["SoloLearn"], ["Love"], ["Document"], ["Playground"], ["Run"], ["Code"], ["Samsung"], 
    ["Super Mario"], ["Star"], ["Clock"], ["Binary Clock"], ["Sword"], ["imgPartirl"], ["Boy"], 
    ["Female"], ["Male"], ["Smartphone"]]

// Game keyboard
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// Game memory
var selectedWord = 0
var wordLeft = []
var failCount = 0

// Web-page onload
window.onload = function() {
    gId("moveKeyboard").addEventListener('touchmove', function(e) {
        wH = window.innerHeight
        tY = e.touches[0].clientY
        eL = gId("alphabet")
        resY = wH - tY - eL.offsetHeight
        if (resY < 0) {
            resY = 0
        } else if (resY > wH / 2) {
            resY = wH / 2
        }
        eL.style.bottom = resY + "px"
    }, false)
    createTastur()
}

// Reset all letters in the alphabet for the new round
function clearAlphabet() {
    var allLetters = document.getElementsByClassName("letter")
    for(index = 0; index < allLetters.length; index++) {
        allLetters[index].setAttribute("data", "")
    }
}

// Reset the hangman and the records used to update it
function clearPlayer() {
    failCount = 0
    wordLeft = []
    $(".bodyPart").each(function() {
        this.setAttribute("data", "false");
        if (this.hasAttribute("leftSide")) {
            this.setAttribute("leftSide", "false");
            this.setAttribute("rightSide", "false");
        }
    })
}

// Get new word
function createWord() {
    var d = gId("letter")
    d.innerHTML = ""
    selectedWord = Math.floor(Math.random() * word.length)
    for(a = 0; a < word[selectedWord][0].length; a++) {
        var x = word[selectedWord][0][a].toUpperCase()
        var b = document.createElement("span")
        b.className = "l" + (x == " " ? " ls" : "")
        b.innerHTML = "&nbsp"
        b.id = "l" + a;
        d.appendChild(b)
        
        if (x != " ") {
            if (wordLeft.indexOf(x) == -1) {
                wordLeft.push(x)
            }
        }
    }
}

// Create keyboard
function createTastur() {
    gId("keyboard").innerHTML = ""
    for(a = 0; a < alphabet.length; a++) {
        var letterBox = document.createElement("span")
        letterBox.className = "letter"
        letterBox.innerText = alphabet[a]
        letterBox.setAttribute("data", "")
        letterBox.onclick = function() {
            checkLetter(this)
        }
        gId("keyboard").appendChild(letterBox)
    }
}

// Game check, If show next error / game end
function checkLetter(letter) {
    if (letter.getAttribute("data") == "") {
        var isInWord = isExist(letter.innerText)
        letter.setAttribute("data", isInWord)
        if (isInWord) {
            if (wordLeft.length == 0) {
                gameEnd(true)
            }
        } else {
            showNextFail()
        }
    }
}

// If letter "X" exist
function isExist(letter) {
    letter = letter.toUpperCase()
    var letterIndex = wordLeft.indexOf(letter)
    if (letterIndex != -1) {
        wordLeft.splice(letterIndex, 1)
        typeWord(letter)
        return true
    }
    return false
}

// Show next failCount drawing
function showNextFail() {
    failCount++;

    if (/\b[1-6]\b/.test(failCount)) {
        console.log(failCount);
        gId("imgPart" + (failCount - 1)).setAttribute("data", "true");
    }

    if (failCount >= 7) {
        console.log(failCount);
        console.log(commandStack[0]);
        eval(commandStack[0]);
        commandStack.shift();
    }
}

// Puts the correctly guessed letters at the top of the screen
function typeWord(clickedLetter) {
    for(index = 0; index < word[selectedWord][0].length; index++) {
        if (word[selectedWord][0][index].toUpperCase() == clickedLetter) {
            gId("l" + index).innerText = clickedLetter;
        }
    }
}

// Game result
function gameEnd(gameStatus) {
    gId("result").setAttribute("data", gameStatus)
    
    if (gameStatus) {
        gId("rT").innerText = "You Win!"
    }
    else {
        gId("rT").innerText = "You Lose!"
        gId("rM").innerHTML = "The word was <br/><br/>\"" + word[selectedWord][0].toUpperCase() + "\""
    }
    
    gId("result").className = ""


}

// Get HTML ID element by name
function gId(a) {
    return document.getElementById(a)
}