let iter = 0;

let currentDifficulty = "easy";
let currentMode = "Timed";

let data;
let text;
let letters;
let words;

let correctWords = 0;
let currentWordIndex = 0;
let chars = "";

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
    const words = text
        .split(" ")

    return words;
}

function getSpan() {
    letters = document.querySelectorAll("span");
    return letters;
}

text = getText();
letters = getSpan();
words = getWords(text);

function updateCursor(prevIter) {
    if (prevIter < letters.length && prevIter >= 0) {
        letters[prevIter].classList.remove("current");
    }

    if (iter < letters.length && iter >= 0) {
        letters[iter].classList.add("current");
    }
}

document.addEventListener("keydown", (e) => {
    let prevIter = iter;
    if (e.key == "Backspace") {
        if (iter > 0) {
            iter--;
            letters[iter].classList.remove("correct", "wrong");
            letters[iter].classList.add("neutral");
        }
    } else {
        if (e.key.length === 1) {
            if (e.key === text[iter]) {
                letters[iter].classList.add("correct");

                if(e.key !== " "){
                    chars += e.key;
                }

                if(chars === words[currentWordIndex]){
                    correctWords++;
                    currentWordIndex++
                    chars = "";
                }
            } else {
                letters[iter].classList.add("wrong");
            }

            iter++;
        }
    }

    updateCursor(prevIter);
});
