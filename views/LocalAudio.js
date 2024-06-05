import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Audio, Video } from 'expo-av'
import Slider from '@react-native-community/slider'
import Entypo from '@expo/vector-icons/Entypo'
import Styles from '../hooks/Style'
import { pauseVideo, unPauseVideo } from '../hooks/Video'
import { formatAudioName } from '../hooks/Audio'

const LocalAudio = () => {
    const videoRef = useRef(null)
    const [sound, setSound] = useState(null)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [playerStatus, setPlayerStatus] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(0)
    const [currentTrackName, setCurrentTrackName] = useState('')
    const [currentVideo, setCurrentVideo] = useState('1.mp4')

    const playlist = [
        { uri: 'assets/musics/AgroPlay Verão - Nosso Quadro.mp3' },
        { uri: 'assets/musics/Zé Neto e Cristiano - BATERIA ACABOU.mp3' },
        { uri: 'assets/musics/Piração - Kaka e Pedrinho.mp3' }
    ]

    const playSound = async () => {
        if (currentTrack < playlist.length) {
            if (sound) {
                await sound.unloadAsync()
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                playlist[currentTrack],
                { shouldPlay: true }
            )            
            newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            setSound(newSound)
            
            setCurrentTrackName(formatAudioName(playlist[currentTrack].uri))
            setIsAudioPlaying(true)
            setPlayerStatus(true)     
            unPauseVideo(videoRef)       
        }        
    }
   
    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish && !status.isLooping) {
            setIsAudioPlaying(false)
            playNextTrack()
        }
    }

    const playNextTrack = () => {
        setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length)
    }

    const playPreviousTrack = () => {
        setCurrentTrack((prevTrack) => (prevTrack - 1 + playlist.length) % playlist.length)
    }

    const toggleSound = async () => {
        if (sound) {
            if (isAudioPlaying) {
                await sound.pauseAsync()
                setIsAudioPlaying(false)
                pauseVideo(videoRef)
            } else {
                await sound.playAsync()
                setIsAudioPlaying(true)
                unPauseVideo(videoRef)
            }
        }
    }

    const changeVolume = async (value) => {
        setVolume(value)
        if (sound) {
            await sound.setVolumeAsync(value)
        }
    }

    useEffect(() => {
        playSound()
        return sound
            ? () => {
                sound.unloadAsync()
            }
            : undefined
    }, [currentTrack])

    return (
        <View style={Styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: 'assets/templates/' + currentVideo }}
                isMuted={true}
                shouldPlay={false}
                resizeMode="cover"
                isLooping
                style={Styles.backgroundVideo}
            />

            <View style={Styles.controlsArea}>
                <Text style={Styles.trackText}>
                    {currentTrackName}
                </Text>

                <View style={Styles.controls}>
                    <TouchableOpacity title="Música anterior" onPress={playPreviousTrack}>
                        <Entypo name="controller-jump-to-start" size={34} color="white" style={Styles.btnControls} />
                    </TouchableOpacity>
                    {
                        playerStatus ?
                            <TouchableOpacity title="Pausar ou retomar Música" onPress={toggleSound}>
                                {
                                    isAudioPlaying ?
                                        <Entypo name="controller-paus" size={34} color="white" style={Styles.btnControls} />
                                        :
                                        <Entypo name="controller-play" size={34} color="white" style={Styles.btnControls} />
                                }
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={playSound}>
                                <Entypo name="controller-play" size={34} color="white" style={Styles.btnControls} />
                            </TouchableOpacity>
                    }
                    <TouchableOpacity title="Próxima música" onPress={playNextTrack}>
                        <Entypo name="controller-next" size={34} color="white" style={Styles.btnControls} />
                    </TouchableOpacity>
                </View>
            </View>

            <Slider
                style={Styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={changeVolume}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="white"
                thumbTintColor="white"
            />
        </View>
    )
}

export default LocalAudio
