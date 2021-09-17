import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import database from '../config/firebaseConfig';

const Mapa = ({ navigation }) => {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [vendedores, setVendedores] = useState([]);

    useEffect(() => {
        database.collection("cadastroVendedor").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            })
            setVendedores(list)
            //console.log(list)
            //console.log(list[0].Lat)
        })
    }, [])

    useEffect(() => {
        (async function () {
            const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION_BACKGROUND);
            if (status === 'granted') { //acao caso o usuario permita liberar a localizacao para o app
                let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                setOrigin({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.00922, //proximidade do satelite
                    longitudeDelta: 0.00421, //0.0 >>> menos proximo - 0.00 mais proximo
                })
                //console.log(location);
            } else {  //acao caso o usuario NAO permita liberar a localizacao para o app
                console.log("Location permission not granted");
                throw new Error('Location permission not granted');
            }
        })();
    }, []);

    function mapMarkers() {
        return vendedores.map(vendedor => (
            <Marker coordinate={{ latitude: vendedor.Lat, longitude: vendedor.Lng }}
                title={vendedor.Nome}
                description={vendedor.Descricao}
                key={vendedor.id}>
            </Marker>
        ))
    }
    return (
        <View style={style.container}>
            <MapView style={style.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={origin}
                showsUserLocation={true}
            >
                {
                    mapMarkers()
                }
                {destination &&
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={config.googleApi}
                        strokeWidth={3}
                        onReady={result => {
                            //console.log(result);
                        }}
                    />
                }
            </MapView>

            <View style={style.search}>
                <GooglePlacesAutocomplete
                    placeholder='Qual local você procura?'
                    onPress={(data, details = null) => {
                        setDestination({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.00922, //proximidade do satelite
                            longitudeDelta: 0.00421, //0.0 >>> menos proximo - 0.00 mais proximo
                        });
                    }}
                    query={{
                        key: config.googleApi,
                        language: 'pt-br',
                    }}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    styles={{ listView: { height: 100 } }}
                />
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
    map: {
        height: '70%',
        backgroundColor: '#000',
    },
    search: {
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
    //Callout Bubble
    bubble: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 150,
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    image: {
        width: 120,
        height: 80,
    },
});
export default Mapa;
