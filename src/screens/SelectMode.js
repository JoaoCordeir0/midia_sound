import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Styles from "../hooks/Style";

const SelectMode = ({navigation}) => {
    return(
        <View style={Styles.container}>          
            <View style={Styles.controls}>
                <TouchableOpacity title="Local" onPress={() => navigation.navigate('Local')} style={Styles.btn}>
                    <Text style={Styles.btnText}> Músicas locais </Text>
                </TouchableOpacity>

                <TouchableOpacity title="Bluetooth" onPress={() => navigation.navigate('Bluetooth')} style={Styles.btn}>
                    <Text style={Styles.btnText}> Músicas Bluetooth </Text>
                </TouchableOpacity>        
            </View>         
        </View>
    )
}

export default SelectMode