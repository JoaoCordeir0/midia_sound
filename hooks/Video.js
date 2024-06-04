
export async function pauseVideo(videoRef) {
    if (videoRef.current) {
        videoRef.current.pauseAsync()
    }
}

export async function unPauseVideo(videoRef) {
    if (videoRef.current) {
        videoRef.current.playAsync()
    }
}
