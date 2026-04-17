let iter = 0;
let prevIter;

let currentDifficulty = "easy";
let currentMode = "Timed";

let data;
let text;
let letters;

let words;
let correctWords = 0;
let currentWordIndex = 0;

let chars = "";
let correctChars = 0;
let totalChars = 0;

let startTime = null;

let timeLeft = 60;
let timerInterval = null;


document.addEventListener("change", (e) => {
    if (e.target.name === "difficulty") {
        currentDifficulty = e.target.value;
        iter = 0;
        text = getText();
        letters = getSpan();
        words = getWords(text);
    }
    if (e.target.name === "mode") {
        currentMode = e.target.value;
    }
});

async function getData() {
    const res = await fetch("../data.json");
    const data = await res.json();
    return data;
}

data = await getData();

function getText() {
    const texts = data[currentDifficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const textArea = document.getElementById("text");

    const innerText = randomText.text
        .split("")
        .map((letter) => `<span class="char">${letter}</span>`)
        .join("");
    textArea.innerHTML = innerText;

    return randomText.text;
}

function getWords(text) {
    const words = text.split(" ");

    return words;
}

function getSpan() {
    letters = document.querySelectorAll("span");
    return letters;
}

function getWordStart(index) {
    let pos = 0;
    for (let i = 0; i < index; i++) {
        pos += words[i].length + 1;
    }
    return pos;
}

function calculateWPM() {
    if (!startTime) return 0;
    const now = Date.now();
    const timeInMinutes = (now - startTime) / 1000 / 60;

    if (timeInMinutes === 0) return 0;
    const wpm = correctWords / timeInMinutes;

    return Math.round(wpm);
}

function calculateAccuracy() {
    if (totalChars === 0) return 100;

    return Math.round((correctChars / totalChars) * 100);
}

text = getText();
letters = getSpan();
words = getWords(text);

const wpmElement = document.getElementById("WPM");
let wpm = 0;
wpmElement.textContent = `WPM: ${wpm}`;

const accElement = document.getElementById("ACC");
let acc = 100;
accElement.textContent = `Accuracy: ${acc}%`;

function updateCursor(prevIter) {
    if (prevIter < letters.length && prevIter >= 0) {
        letters[prevIter].classList.remove("current");
    }

    if (iter < letters.length && iter >= 0) {
        letters[iter].classList.add("current");
    }
}

const timeElement = document.getElementById("timer");

function startTimer()
{
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.innerHTML = `Time: ${timeLeft}`;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame()
{
    const pbElement = document.getElementById("personal-best-paragraph");
    let personalBest = parseInt(localStorage.getItem("PB"));

    if(personalBest <= wpm || isNaN(personalBest))
    {
        localStorage.setItem("PB", wpm);
        pbElement.textContent = `Pesronal best: ${wpm}`
    }
    else
    {
        pbElement.textContent = `Pesronal best: ${personalBest}`;
    }
}

document.addEventListener("keydown", (e) => {
    prevIter = iter;

    if (e.key == "Backspace") 
    {
        if (iter > 0) 
        {
            iter--;
            const wasCorrect = letters[iter].classList.contains("correct");
            const wasWrong = letters[iter].classList.contains("wrong");

            letters[iter].classList.remove("correct", "wrong");
            letters[iter].classList.add("neutral");

            if (text[iter] === " ") 
            {
                currentWordIndex--;
                let startWordIndex = getWordStart(currentWordIndex);
                for (let i = startWordIndex; i < iter; i++) {
                    chars += letters[i].textContent;
                }
                console.log(chars)
            }
            else
            {
                chars = chars.slice(0, -1);
            }

            if (wasCorrect) 
            {
                correctChars--;
                totalChars--;
            } 
            else if (wasWrong) 
            {
                totalChars--;
            }
        }
    } 
    else 
    {
        if (e.key.length === 1) 
        {
            if (!startTime) 
            {
                startTime = Date.now();
                if(currentMode == "Timed")
                {
                    startTimer();
                }    
            }

            totalChars++;

            if (e.key === text[iter]) 
            {
                letters[iter].classList.add("correct");

                if (e.key !== " ") {
                    chars += e.key;
                }

                correctChars++;
            } 
            else 
            {
                letters[iter].classList.add("wrong");

                if (e.key !== " ") 
                {
                    chars += e.key;
                }
            }
            
            if (e.key === " " && text[iter] === " ") 
            {               
                if (chars === words[currentWordIndex]) 
                {
                    correctWords++;
                    console.log(correctWords);
                }
                currentWordIndex++;
                chars = "";
            }

            iter++;

            if(iter >= letters.length-1)
            {
                endGame();
                resetState();
            }
        }
    }

    wpm = calculateWPM();
    wpmElement.textContent = `WPM: ${wpm}`;

    let acc = calculateAccuracy();
    accElement.textContent = `Accuracy: ${acc}%`;

    updateCursor(prevIter);
});



function resetState() {
    text = getText();;
    letters = getSpan();
    words = getWords(text);
    correctWords = 0;
    currentWordIndex = 0;
    chars = "";
    correctChars = 0;
    totalChars = 0;
    startTime = null;
    iter = 0;
    prevIter = undefined;
    timeLeft = 60;
    clearInterval(timerInterval);
    timeElement.innerHTML = `Time: 60`;

    wpm = 0;
    wpmElement.textContent = `WPM: ${wpm}`;

    acc = 100;
    accElement.textContent = `Accuracy: ${acc}%`;
}


const resetbtnElement = document.getElementById("restart-button");

resetbtnElement.addEventListener("click", resetState);