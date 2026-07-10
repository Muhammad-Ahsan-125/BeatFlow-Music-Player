window.addEventListener("load", () => {
    setTimeout(() => {
        const l = document.getElementById("loader");
        l.classList.add("hide");

        setTimeout(() => {
            l.remove();
        }, 1000);

    }, 3000);
});

let currentSong = new Audio();

async function getSongs() {
    const response = await fetch("./songs.json");
    return await response.json();
}

async function main() {

    const playBtn = document.getElementById("play");
    const playIcon = playBtn.querySelector("i");

    const songName = document.querySelector(".name");
    const duration = document.querySelector(".duration");

    // Mobile sidebar (hamburger) toggle
    const hamburger = document.getElementById("hamburger");
    const hamburgerIcon = hamburger.querySelector("i");
    const sidebar = document.querySelector(".container-1");
    const overlay = document.getElementById("overlay");

    const openSidebar = () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        hamburgerIcon.classList.remove("fa-bars");
        hamburgerIcon.classList.add("fa-xmark");
    };

    const closeSidebar = () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        hamburgerIcon.classList.remove("fa-xmark");
        hamburgerIcon.classList.add("fa-bars");
    };

    hamburger.addEventListener("click", () => {
        if (sidebar.classList.contains("active")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);

    const playMusic = (track) => {
        currentSong.src = "./Songs/" + encodeURIComponent(track);

        songName.innerText = track.replace(".mp3", "");

        currentSong.play();

        currentSongIndex = songs.indexOf(track)
    };

    currentSong.addEventListener("play", () => {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    });

    currentSong.addEventListener("pause", () => {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    });

    currentSong.addEventListener("timeupdate", () => {

        let currentMinutes = Math.floor(currentSong.currentTime / 60);
        let currentSeconds = Math.floor(currentSong.currentTime % 60);

        let totalMinutes = isNaN(currentSong.duration)
            ? 0
            : Math.floor(currentSong.duration / 60);

        let totalSeconds = isNaN(currentSong.duration)
            ? 0
            : Math.floor(currentSong.duration % 60);

        if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
        if (totalSeconds < 10) totalSeconds = "0" + totalSeconds;

        duration.innerText =
            `${currentMinutes}:${currentSeconds} / ${totalMinutes}:${totalSeconds}`;
    });

    const songs = await getSongs();
    let currentSongIndex = 0;
    let songUL = document.querySelector(".songslist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <i class="fa-solid fa-music"></i>

            <div class="info">
                <div>${song.replace(".mp3", "")}</div>
            </div>

            <div class="play-now">
                <p>Play Now</p>
                <i class="fa-solid fa-play"></i>
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {

        console.log(e.querySelector(".info").firstElementChild.innerHTML);

        e.addEventListener("click", () => {
            const track = e.querySelector(".info").firstElementChild.innerText;
            playMusic(track + ".mp3");
        });

    });

    playBtn.addEventListener("click", () => {

        if (!currentSong.src) {
            playMusic(songs[0]);
            return;
        }

        if (currentSong.paused) {
            currentSong.play();
        } else {
            currentSong.pause();
        }

    });

    const seekbar = document.querySelector(".seekbar");

    currentSong.addEventListener("timeupdate", () => {

        let percent = (currentSong.currentTime / currentSong.duration) * 100;
        seekbar.value = percent || 0;

        let currentMinutes = Math.floor(currentSong.currentTime / 60);
        let currentSeconds = Math.floor(currentSong.currentTime % 60);

        let totalMinutes = isNaN(currentSong.duration) ? 0 : Math.floor(currentSong.duration / 60);
        let totalSeconds = isNaN(currentSong.duration) ? 0 : Math.floor(currentSong.duration % 60);

        if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
        if (totalSeconds < 10) totalSeconds = "0" + totalSeconds;

        duration.innerText =
            `${currentMinutes}:${currentSeconds} / ${totalMinutes}:${totalSeconds}`;
    });

    seekbar.addEventListener("input", () => {
        currentSong.currentTime =
            (seekbar.value / 100) * currentSong.duration;
    });

    let presong = document.querySelector(".prev");
    presong.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playMusic(songs[currentSongIndex])
        }
    })

    let nexsong = document.querySelector(".forw");
    nexsong.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex]);
        }
    })

    currentSong.addEventListener("ended", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex]);
        }

    });
}


main();