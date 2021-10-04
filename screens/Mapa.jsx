import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView, FlatList, Button, TouchableWithoutFeedback } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import uuid from "react-native-uuid"
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import database from '../config/firebaseConfig';
import { mapDarkStyle } from '../assets/map/dark';

const Mapa = ({ navigation }) => {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [vendedores, setVendedores] = useState([]);
    const [vendedorMarcado, setVendedorMarcado] = useState([])
    const [showPlace, setShowPlace] = useState(false);

    function handleSetVendedor(vendedor) {
        const { Cardapio } = vendedor
        const cardapioFormatted = []
        if (!Cardapio) {
            setShowPlace(false)
            return setVendedorMarcado(
                []
            )
        }
        setShowPlace(true)
        Cardapio.forEach(item => {
            const itemFormatted = item.split('R$')
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
        })
    }, [])

    useEffect(() => {
        (async function () {
            const { status, permissions } = await Location.requestForegroundPermissionsAsync();
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
                            <Text style={style.textCalloutNome}>{vendedor.Nome}</Text>
                        </View>
                        <View style={style.arrowBorder} />
                        <View style={style.arrow} />
                    </View>
                </Callout>
            </Marker>
        ))
    }

    return (
        <View style={style.container}>
            <TouchableWithoutFeedback onPress={handleSetVendedor}>
                <MapView
                    //ref={map => this.mapView = map}
                    style={style.mapView}
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
            {
                showPlace &&
                <FlatList
                    data={vendedorMarcado}
                    keyExtractor={item => item.id}
                    style={style.placesContainer}
                    ListEmptyComponent={ // QUANDO TIVER VAZIO A LISTA
                        <View style={style.emptyComponent}>
                            <TouchableOpacity>
                                <Image source={require('../assets/img/iconBORALI.png')} style={style.imgCardapio} />
                                <Text style={style.textCardapio}>Borali</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: 33 }}
                    renderItem={({ item }) =>
                        <View style={style.place}>
                            <View style={style.itemPlace}>
                                <Text>{item.name}</Text>
                                <Text>R${item.price}</Text>
                            </View>
                        </View>
                    }
                />
            }
        </View>
    )

}


const style = StyleSheet.create({
    container: {
        //position: 'relative',
        flex: 1,
        backgroundColor: "#e3e0d8",
        justifyContent: 'center',
    },
    mapView: {
        //position: 'absolute',
        flex: 1,
        height: '70%',
        backgroundColor: '#000',
    },
    placesContainer: {
        marginTop: 6,
        bottom: 0,
        width: '100%',
        maxHeight: 200,
        backgroundColor: 'transparent',
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
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: 18,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgCardapio: {
        alignSelf: 'center',
        width: 50,
        height: 50,
    },
    textCardapio: {
        fontSize: 20,
        marginHorizontal: 50,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 200,
        fontWeight: 'bold',
        color: "#000",
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
        fontSize: 22,
        fontWeight: 'bold',
        color: "#000",
    },
    textCalloutNome: {
        fontSize: 15,
        fontWeight: 'normal',
        color: '#000',
    },
});

export default Mapa;