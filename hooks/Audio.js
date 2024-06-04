
export function formatAudioName(musicPath) {
    let track = musicPath.split('/')
    return track[track.length - 1].replace('.mp3', '')
}