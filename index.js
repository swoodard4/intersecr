const fileInput = document.querySelector(".file_location");
const fileTime = document.querySelector(".file-time")

const button = document.querySelector(".submit_button")
button.addEventListener("click", clickEventHandler)

const body = document.querySelector(".content");
const doubleSpeedInput = document.querySelector(".double");
const singleSpeeInput = document.querySelector(".single");

const fileInputField = document.querySelector("#file_upload_input");
fileInputField.onchange = ((e)=>{
    console.log(e.target.files[0])
    const media = URL.createObjectURL(e.target.files[0]);
    fileInput.value = media;
});
console.log(fileInputField.onchange);


function buildLearningTrain(fileName, videoBox){
    const train = document.createElement("div");
    const label = document.createElement("span");
    label.innerText = `train for ${fileName}`;
    train.classList.add("train");
    train.innerText = "0 seconds";
    videoBox.append(label)
    videoBox.appendChild(train);

    return train;
}
function changeTrainSeconds(train, newSeconds){
    train.innerText = `${newSeconds} seconds`;
}
function countdownTrain(train, fib2){
    let time = fib2;
    setInterval(()=>{
        time = Math.abs(time) - 1;
        changeTrainSeconds(train, time)
    }, 1000)
}
function setCounter(trainNum, counterNum){
    const counterSpan = document.querySelector(`#train${trainNum}`);
    counterSpan.innerText = `${counterNum} number of reps`;
}

async function clickEventHandler(){
    // cause the cascade
    const doubleSpeed = doubleSpeedInput.checked == true;
    const videoTime = doubleSpeed ? Math.floor(parseInt(fileTime.value)/2): parseInt(fileTime.value);
    const videoFile = fileInput.value;
    const videoBox = document.createElement("div");
    const counterSpan = document.createElement(`span`);
    videoBox.classList.add("videoBox");
    
    body.append(videoBox);
    // build visual output for the user to see this train of thought
    const train = buildLearningTrain(videoFile, videoBox);
    videoBox.appendChild(counterSpan);

    // reset the inputs
    fileInput.value = "";
    fileTime.value = "";
    singleSpeeInput.checked = true;
    // do fib
    let fib1 = 0;
    let fib2 = 1;
    let holder = 0;
    let counterNum = 0
    // get more user interface
    let trainNum = document.querySelectorAll(".train").length;
    counterSpan.id = `train${trainNum}`;

    // use the initial video time to determine the fib sequence
    while (fib2 < 100000){
        if(fib2 >= videoTime){
            changeTrainSeconds(train, fib2);
            countdownTrain(train, fib2);
            counterNum = counterNum + 1;
            setCounter(trainNum, counterNum);
            await playVideo(videoTime, doubleSpeed, videoFile, videoBox);
            await timeSleep(fib2-videoTime);
        }
        holder = fib2;
        fib2 = fib1 + fib2;
        fib1 = holder;
    }
    
    
}

// play video function
async function playVideo(videoTime, doubleSpeed, videoFile, videoBox){
    const video = document.createElement("video");
    const source = document.createElement("source");
    source.src = videoFile;
    video.style = "width:60%;";
    video.controls = true;
    video.appendChild(source);
    videoBox.appendChild(video);
    video.play();
    if(doubleSpeed) video.playbackRate = 2;
    await timeSleep(parseInt(videoTime));
    video.remove();
}


// custom sleep function for async functions
async function timeSleep(sleepSeconds){
    const sleeper = new Promise((resolve, reject)=>{
        setTimeout(()=>{resolve()}, sleepSeconds*1000)
    })
    return sleeper;
}