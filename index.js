const textList = [
    `The color of animals is by no means a matter of chance; it depends on many considerations, but in the majority of cases tends to protect the animal from danger by rendering it less conspicuous. Perhaps it may be said that if coloring is mainly protective, there ought to be but few brightly colored animals. There are, however, not a few cases in which vivid colors are themselves protective. The kingfisher itself, though so brightly colored, is by no means easy to see. The blue harmonizes with the water, and the bird as it darts along the stream looks almost like a flash of sunlight. Desert animals are generally the color of the desert. Thus, for instance, the lion, the antelope, and the wild donkey are all sand-colored. “Indeed,” says Canon Tristram, “in the desert, where neither trees, brushwood, nor even undulation of the surface afford the slightest protection to its foes, a modification of color assimilated to that of the surrounding country is absolutely necessary. Hence, without exception, the upper plumage of every bird, and also the fur of all the smaller mammals and the skin of all the snakes and lizards, is of one uniform sand color.” The next point is the color of the mature caterpillars, some of which are brown. This probably makes the caterpillar even more conspicuous among the green leaves than would otherwise be the case. Let us see, then, whether the habits of the insect will throw any light upon the riddle. What would you do if you were a big caterpillar? Why, like most other defenseless creatures, you would feed by night, and lie concealed by day. So do these caterpillars. When the morning light comes, they creep down the stem of the food plant, and lie concealed among the thick herbage and dry sticks and leaves, near the ground, and it is obvious that under such circumstances the brown color really becomes a protection. It might indeed be argued that the caterpillars, having become brown, concealed themselves on the ground, and that we were reversing the state of things. But this is not so, because, while we may say as a general rule that large caterpillars feed by night and lie concealed by day, it is by no means always the case that they are brown; some of them still retaining the green color. We may then conclude that the habit of concealing themselves by day came first, and that the brown color is a later adaptation.`
]

const typedTextZone = document.getElementById("typedText");
const needToTypeTextZone = document.getElementById("needToTypeText");
const inputZone = document.getElementById("inputZone");
const coursor = document.getElementById("typeCoursor");
const secondsRemainCounter = document.getElementById("secondsRemainCounter");
const wordsMinCounter = document.getElementById("wordsMinCounter");
const charsMinCounter = document.getElementById("charsMinCounter");
const accuracyCounter = document.getElementById("accuracyCounter");

coursor.classList.add("deactivate");

let typed = "";
let needToType = "";

let secondsRemain = 60;
let wrongChars = 0;
let correctChars = 0;
let wordsCount = 0;

let intervalId;
let isStarted = false;
let secondsFromStart = 0;
let secondsToEnd;

function Init() {
    needToType = textList[0];
    VisualizeText();
    StartTypingSequence();
    CoursorCheckingSequence();
}

function Destroy() {
    secondsFromStart == 0
    clearInterval(intervalId);
}

function TickTime() {
    console.log("tick");
    secondsToEnd--;
    secondsFromStart++;
    VisualizeCounters();

    if(secondsRemain == 0){
        console.log("ho time");
        isStarted = false;
        Destroy();
    }
}

function CheckForStart() {
    if(isStarted == false){
        isStarted = true;
        secondsToEnd = secondsRemain;
        intervalId = setInterval(TickTime, 1000);
    }
}

function StartTypingSequence() {
    inputZone.addEventListener("input", (e)=>{
        CheckForStart();

        let inputCharCode = e.data;

        if(inputCharCode == GetNextCharCode()){
            CorrectWordSequence();
        } else{
            wrongChars ++;
        }

        VisualizeCounters();
    })    
}

function CorrectWordSequence() {
    if(IsWordEnded()){
        wordsCount ++;
    }
    
    correctChars ++;

    MoveLine();
    VisualizeText();
}

function IsWordEnded() {
    return needToType[0].charCodeAt(0) == 32 ? true : false;
}

function MoveLine() {
    typed += needToType[0];
    needToType = needToType.slice(1);
}

function GetNextCharCode(){
    return needToType[0];
}

function VisualizeCounters() {
    secondsRemainCounter.innerText = secondsToEnd;

    let wpm = GetUnitPerMin(wordsCount, secondsFromStart);
    let cpm = GetUnitPerMin(correctChars, secondsFromStart);
    let accuracy = Math.round(100 -(wrongChars * 100 / correctChars))

    wordsMinCounter.innerText = GetCorrectNum(wpm);
    charsMinCounter.innerText = GetCorrectNum(cpm);
    accuracyCounter.innerText = GetCorrectNum(accuracy);
}

function GetUnitPerMin(unit, seconds) {
    return Math.round(unit / (seconds / 60));
}

function GetCorrectNum(num){
    console.log(num);

    if( 
        num != NaN && 
        num != Infinity && 
        num != -Infinity &&
        num > 0
    ){
        return num;
    } else{
        return 0;
    }
}

function VisualizeText() {
    let isCurrentNotSpacebar = typed.slice(-1).charCodeAt(0) != 32 ? true : false


    let splittedTypedList = typed.split(" ");
    let splittedNeedToTypeList = needToType.split(" ");

    let typedRenderLine = "";
    let needToTypeRenderLine = "";


    splittedTypedList.forEach((el, index) => {

        if(isCurrentNotSpacebar && index == splittedTypedList.length-1){
            typedRenderLine += String.fromCharCode(160) + `<span class = "isPrinting">${el}</span>`
        } else{
            typedRenderLine += String.fromCharCode(160) + `<span class = "printed">${el}</span>`
        }
    });

    console.log("list -" + typedRenderLine);

    needToTypeRenderLine = splittedNeedToTypeList.join(String.fromCharCode(160));

    typedTextZone.innerHTML = typedRenderLine;
    needToTypeTextZone.innerText = needToTypeRenderLine;
}

function CoursorCheckingSequence() {
    let timeoutId;

    inputZone.addEventListener("blur", ()=>{
        coursor.className = "deactivate";
    })

    inputZone.addEventListener("focus", ()=>{
        coursor.className = "blink";
    })

    inputZone.addEventListener("input", ()=> {
        coursor.className = "";

        if(timeoutId != null){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(()=>{coursor.className = "blink";}, 10);
    })
}


Init();