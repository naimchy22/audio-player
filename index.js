// Initialize some element 
let songIndex = 0;

// Finding Element 
let body = document.querySelector("body");
let audioElement = new Audio('audio/audio-5.m4a');
let bottomArea = document.querySelector(".bottomArea");
let songList = Array.from(document.getElementsByClassName("songList"));
let playNow = Array.from(document.getElementsByClassName("playNow"));
let masterPlay = bottomArea.querySelector("#masterPlay");
let previous = bottomArea.querySelector("#previous");
let next = bottomArea.querySelector("#next");
let playingGif = bottomArea.querySelector("#gif");
let masterSongName = bottomArea.querySelector("#masterSongName");
let seekBar = bottomArea.querySelector("#seekBar");
let myRange = bottomArea.querySelector(".myRange");
let duration = bottomArea.querySelector("#duration");
let total_time = bottomArea.querySelector("#total_time");

/*==============================*/
/*===== loading animation ======*/
/*==============================*/
const loadParent = document.querySelector("#loadParent");
loadParent.style.background = "#262626";

const loading = document.createElement("div");
loading.innerText = "Loading";
loading.classList.add("ring");
loadParent.appendChild(loading);

const loadAnim = document.createElement("span");
loadAnim.classList.add("roundCircle");
loading.appendChild(loadAnim)

window.addEventListener("load", () => {
    body.removeChild(loadParent);
    myRange.value = 0;
})

/**
 * All nasheeds data is here
 * @type {Array<{nasheedName: string,nasheeFilePath: string,coverPath: string,nasheedDuration: number}>}
 */
let nasheeds = [
    {nasheedName: "Salam Ya Mahdi | Perth Children", nasheeFilePath: "audio/audio-1.m4a", coverPath: "images/cover-image/cover-1.jpg", nasheedDuration: 7.08},
    {nasheedName: "kullu nafsin zaikatul maut surah", nasheeFilePath: "audio/audio-2.m4a", coverPath: "images/cover-image/cover-2.jpg", nasheedDuration: 3.08},
    {nasheedName: "The Most Relax Nasheed", nasheeFilePath: "audio/audio-3.m4a", coverPath: "images/cover-image/cover-3.jpeg", nasheedDuration: "4.20"},
    {nasheedName: "Sabeel ud dumu - nasheed", nasheeFilePath: "audio/audio-4.m4a", coverPath: "images/cover-image/cover-4.jpg", nasheedDuration: 4.28},
    {nasheedName: "Nasheed - Liyakun Yawmuka", nasheeFilePath: "audio/audio-5.m4a", coverPath: "images/cover-image/cover-5.jpeg", nasheedDuration: 2.37}
]

// add cover images
songList.forEach((element, i)=>{ 
    element.getElementsByTagName("img")[0].src = nasheeds[i].coverPath;
    element.getElementsByClassName("nasheedName")[0].innerText = nasheeds[i].nasheedName;
    element.getElementsByClassName("timeStamp")[0].innerText = nasheeds[i].nasheedDuration;
})

/**
 * Show song name and playing gif
 */
const showStatus = () => {
    playingGif.style.opacity = 1;
    masterSongName.style.opacity = 1;
}

/**
 * Hide song name and playing gif
 */
const hideStatus = () => {
    playingGif.style.opacity = 0;
    masterSongName.style.opacity = 0;
}

/**
 * this function work condition base like:  if click next audio to play.
 * the function() call, and make antoher audio pause icon convert to play.
 */
const makeAllPlays = () => {
    playNow.map((element => {
        element.classList.add('fa-play-circle');
        element.classList.remove('fa-pause-circle')
    }))
}

/*==============================*/
/* == play and pause controll ==*/
/*==============================*/
playNow.forEach((element) => {
    element.addEventListener("click", (e) => {
        if(audioElement.paused || audioElement.currentTime <= 0) {
            e.target.classList.remove("fa-play-circle");
            e.target.classList.add("fa-pause-circle");
            songIndex = parseInt(e.target.id);
            audioElement.src = nasheeds[songIndex].nasheeFilePath;
            masterSongName.innerText = nasheeds[songIndex].nasheedName;
            nextNasheed(songIndex)
            audioElement.play()
            showStatus()
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        }
        else if (e.target.className.includes("fa-play-circle")) {
            makeAllPlays()
            e.target.classList.remove("fa-play-circle");
            e.target.classList.add("fa-pause-circle");
            songIndex = parseInt(e.target.id);
            audioElement.src = nasheeds[songIndex].nasheeFilePath;
            masterSongName.innerText = nasheeds[songIndex].nasheedName;
            nextNasheed(songIndex)
            audioElement.play()
        }
        else {
            e.target.classList.add("fa-play-circle");
            e.target.classList.remove("fa-pause-circle");
            audioElement.pause()
            hideStatus()
            masterPlay.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
        }
    })
})

// seekBar.addEventListener("mousemove", () => {
//    let rangValue = myRange.value;
//    myRange.style.width = `${rangValue}%`;
// })

// myRange status
audioElement.addEventListener("timeupdate", (e) => {
    const { currentTime,duration } = e.srcElement;

    let progress = Math.floor((currentTime / duration) * 100);
    myRange.style.width = `${progress}%`;
    
    if(progress === 100) {
        nextNasheed()
        makeAllPlays()
        pauseNextIcon()
    }

    const curr_nasheed_min = Math.floor(duration / 60);
    const curr_nasheed_sec = Math.floor(duration % 60);

    if(curr_nasheed_sec < 10) {
        duration.innerText = `${curr_nasheed_min} : 0${curr_nasheed_sec}`;
    }else if(audioElement.duration){
        duration.innerText = `${curr_nasheed_min} : ${curr_nasheed_sec}`;
    }

    const audioTimeMin = Math.floor(currentTime / 60);
    const audioTimeSec = Math.floor(currentTime % 60);

    if(audioTimeSec < 10){
            total_time.innerText = `${audioTimeMin} : 0${audioTimeSec}`;
    }else{
        total_time.innerText = `${audioTimeMin} : ${audioTimeSec}`;
    }

})

// Change audio current time
const audioTimeChange = (e) => {
    const {duration} = audioElement;

    // audio duration 
    const move_progress =  (e.offsetX / seekBar.offsetWidth) * duration;
    audioElement.currentTime = move_progress;
}

seekBar.addEventListener("click", audioTimeChange);

/**
 * when users click "Master Play button" 
 * then work this function return a pause,play icon & audio 
 * || if audio is paused and thus work this.
 */
const playAudio = () => {
    if(audioElement.paused || audioElement.currentTime <= 0){
        audioElement.play()
        showStatus()
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    }else{
        audioElement.pause()
        hideStatus()
        masterPlay.classList.add('fa-play-circle');
        masterPlay.classList.remove('fa-pause-circle');
    }
}

masterPlay.addEventListener("click",() => {
    playAudio()
    makeAllPlays()
});

/*==============================*/
/* ======= forward  icon =======*/
/*==============================*/

const nextNasheed = (index) => {
    if (songIndex >= 5) {
        songIndex = 1;
    }else if (index < 5) {
        songIndex = index + 1;
    }else {
        songIndex += 1;
    }

    audioElement.src = nasheeds[songIndex - 1].nasheeFilePath;
    audioElement.currentTime = 0;
    audioElement.play()
    masterSongName.innerText = nasheeds[songIndex - 1].nasheedName;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    showStatus()
}

/**
 * This function works when a user clicks on the next play icon on the screen.
 * After clicking the Next Play icon, it will be pause. and play next audio.
 */
const pauseNextIcon = () => {
    playNow.forEach((e) => {
        if(parseInt(e.id) === songIndex - 1){
            e.classList.remove("fa-play-circle")
            e.classList.add("fa-pause-circle")
        }
    })
}

next.addEventListener("click", () => {
    nextNasheed()
    makeAllPlays()
    pauseNextIcon()
})


/*==============================*/
/*======= backward  icon =======*/
/*==============================*/
const previousNasheed = () => {
    if (songIndex <= 1) {
        songIndex = 5;
    }else {
        songIndex -= 1;
    }

    audioElement.src = nasheeds[songIndex - 1].nasheeFilePath;
    audioElement.currentTime = 0;
    audioElement.play()
    masterSongName.innerText = nasheeds[songIndex - 1].nasheedName;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    showStatus()
}

previous.addEventListener("click", () => {
    previousNasheed()
    makeAllPlays()
    pauseNextIcon()
})