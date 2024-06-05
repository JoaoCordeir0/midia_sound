import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Styles from "../hooks/Style";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SelectMode = ({navigation}) => {
    return(
        <View style={Styles.container}>          
            <View style={Styles.controls}>
                <TouchableOpacity title="Local" onPress={() => navigation.navigate('Local')} style={Styles.btn}>
                    <Text style={Styles.btnText}> Músicas locais <MaterialCommunityIcons name="playlist-music" size={34} color="white" /> </Text>
                </TouchableOpacity>

                <TouchableOpacity title="Bluetooth" onPress={() => navigation.navigate('Bluetooth')} style={Styles.btn}>
                    <Text style={Styles.btnText}> Músicas Bluetooth <FontAwesome name="bluetooth" size={34} color="white" /> </Text>
                </TouchableOpacity>        
            </View>         
        </View>
    )
}

export default SelectMode