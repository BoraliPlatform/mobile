import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView, FlatList, Button, TouchableWithoutFeedback } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import uuid from "react-native-uuid"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import database from '../config/firebaseConfig';
import { mapDarkStyle } from '../assets/map/dark';

const Mapa = ({ navigation }) => {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [vendedores, setVendedores] = useState([]);
    const [vendedorMarcado, setVendedorMarcado] = useState([])

    function handleSetVendedor(vendedor) {
        const { Cardapio } = vendedor
        const cardapioFormatted = []
        Cardapio.forEach(item => {
            const itemFormatted = item.split(' ')
            cardapioFormatted.push({
                id: String(uuid.v4()),
                name: itemFormatted[0],
                price: itemFormatted[1]
            })
        })
        setVendedorMarcado(cardapioFormatted)
    }

    useEffect(() => {
        database.collection("cadastroVendedor").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            })
            setVendedores(list)
            // console.log(list)
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
                onPress={() => handleSetVendedor(vendedor)}
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
                key={vendedor.id}
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
            <TouchableWithoutFeedback onPress={() => setVendedorMarcado([])}>
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
            </TouchableWithoutFeedback>

        <FlatList 
            data={vendedorMarcado}
            keyExtractor={item => item.id}
            style={{flex: 1, marginTop: 15, marginBottom: 15}}
            ListEmptyComponent={ // QUANDO TIVER VAZIO A LISTA
                <View style={style.emptyComponent}>
                    <Text>Cardapio Vazio</Text>
                </View>
            } 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 33 }}
            renderItem={({ item }) => 
                <View style={style.place}>
                    <View style={style.itemPlace}> 
                        <Text>{item.name}</Text>
                        <Text>{item.price}</Text>
                    </View>
                </View>
            }
        />
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
    placesContainer: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: 'transparent',
    },
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    place: {
        maxHeight: 200,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 5,
        marginBottom: 8,

    },
    itemPlace: {
        paddingHorizontal: 18,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
