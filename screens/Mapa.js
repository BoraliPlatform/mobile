import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';

const Mapa = () => {
    return(
        <View style={style.container}>
            <MapView style={style.map}
            initialRegion={{
                latitude: -1.449709,
                longitude: -48.477707,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
             }}>
            </MapView>
            <View style={style.search}>

            </View>
        </View>
    )

}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8dbd3",
        justifyContent: 'center',
    },
    map:{
        height: '60%',
        backgroundColor: '#000',
    },
    search:{
        height: '40%',
        backgroundColor: '#808080',
    }
});
export default Mapa;
