import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }, 
    btn: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 30,        
    },
    controlsArea: {
        marginTop: 150,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnControls: {
        margin: 10
    },
    slider: {
        width: 300,
        height: 40,
        marginTop: 20,
    },
    trackText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: width,
        height: height,
    },
})

export default Styles