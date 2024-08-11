import { Howl } from 'howler';

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const radioUrl = playButton.dataset.url;

    const sound = new Howl({
        src: [radioUrl],
        html5: true // Enables HTML5 Audio for large files
    });

    playButton.addEventListener('click', () => {
        sound.play();
    });

    pauseButton.addEventListener('click', () => {
        sound.pause();
    });
});
