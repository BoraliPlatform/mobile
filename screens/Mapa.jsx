import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import database from '../config/firebaseConfig';
import { mapDarkStyle } from '../assets/map/dark';

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
            console.log(list)
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
                key={vendedor.id}
                icon={require('../assets/img/map_marker.png')}
                style={{ width: 6 }, { height: 4 }} //ainda precisa ajustar o tamanho do icon
            >
                <Callout tooltip>
                    <View>
                        <View style={style.bubble}>
                            <Text style={style.textCalloutDescricao}>{vendedor.Descricao}</Text>
                            <Text>{vendedor.Nome}</Text>
                        </View>
                        <View style={style.arrowBorder} />
                        <View style={style.arrow} />
                    </View>
                </Callout>
            </Marker>
        ))
    }

    function cardapioMarker() {
        return vendedores.map(vendedor => (
            <ScrollView
                style={style.placesContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}>
                <View style={style.place}>
                    <Text>{vendedor.Cardapio}</Text>
                </View>

            </ScrollView>
        ))
    }

    return (
        <View style={style.container}>
            <MapView
                //ref={map => this.mapView = map}
                style={style.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={origin}
                showsUserLocation={true}
                loadingEnabled={true}
                customMapStyle={mapDarkStyle}
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
            {
                cardapioMarker()
            }
        </View>
    )

}

const { height, width } = Dimensions.get('window');

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
    placesContainer: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: 'transparent',
    },
    place: {
        width: width - 40,
        maxHeight: 200,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 20,
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
        flexDirection: 'column',
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
    textCalloutDescricao: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000",
    },
    textCalloutNome: {
        fontSize: 15,
        textAlign: 'center',
        color: '#000',
    },
});
export default Mapa;
