import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const Mapa = () => {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        (async function(){
            const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
            if (status === 'granted') { //acao caso o usuario permita liberar a localizacao para o app
                let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
                setOrigin({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.00922, //proximidade do satelite
                    longitudeDelta: 0.00421, //0.0 >>> menos proximo - 0.00 mais proximo
                })
            } else {  //acao caso o usuario NAO permita liberar a localizacao para o app
              throw new Error('Location permission not granted');
            }
        })();
    }, []);

    return(
        <View style={style.container}>
            <MapView style={style.map}
            initialRegion={origin}
            showsUserLocation={true}
            >
            </MapView>
            <View style={style.search}>
                <Text>João | Salgadinhos  ℹ️
                                          Coxinha | R$3,00{"\n"}
                                          Enrolado | R$3,50{"\n"}
                                          Pastel | R$2,50{"\n"}
                                          Quibe | R$3,00{"\n"}
                                          Suco | R$2,00
                </Text>
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
        height: '70%',
        backgroundColor: '#000',
    },
    search:{
        height: '30%',
        backgroundColor: '#ffff',
    },
    text1: {
        paddingHorizontal: 'center',
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'normal',
        color: "#fff",
        backgroundColor: "#ec5c54",
      },
    text2: {
        height: '25%',
        paddingHorizontal: 'center',
        paddingTop: 12,
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'normal',
        color: "#fff",
        backgroundColor: "#474a51",
    },
});
export default Mapa;
