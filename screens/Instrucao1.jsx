import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from 'expo-linear-gradient';

const slides = [
    {
        key: '1',
        title: 'Localize',
        text: 'Veja os vendedores ambulantes mais próximos de você.',
        image: require('../assets/img/tela1.png'),
        backgroundColor: '#e54f4f'
    },
    {
        key: '2',
        title: 'Selecione',
        text: 'Escolha o vendedor de acordo com a comida que deseja e a rota será traçada.',
        image: require('../assets/img/tela2.png')
    },
    {
        key: '3',
        title: 'Coma',
        text: 'Chegue ao seu destino e apenas aproveite a comida.',
        image: require('../assets/img/tela3.png')
    }
];

const Instrucao1 = ({ navigation }) => {
    const [showHome, setShowHome] = useState(false);

    function renderSlides({ item }) {
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient // Background Linear Gradient
                    colors={['#e54f4f', '#fff']}
                    style={styles.background} />
                <Image source={item.image}
                    style={{
                        paddingTop: 400,
                        resizeMode: 'contain',
                        height: '65%',
                        width: '90%',
                        alignSelf: 'center',
                    }} />
                <Text style={{
                    paddingBottom: 10,
                    fontSize: 27,
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}>{item.title}</Text>
                <Text style={{
                    paddingHorizontal: 25,
                    fontSize: 17,
                    textAlign: 'center',
                    color: '#000',
                }}>{item.text}</Text>
            </View>
        )
    }

    if (showHome) {
        return <Text>ENTROU NA HOME</Text>
    } else {
        return (
            <AppIntroSlider
                renderItem={renderSlides}
                data={slides}
                activeDotStyle={{
                    backgroundColor: '#000',
                    width: 30
                }}
                style={{ backgroundColor: '#fff' }}
                showPrevButton={true}
                renderPrevButton={() => <Text style={styles.button}>Anterior</Text>}
                renderNextButton={() => <Text style={styles.button}>Próximo</Text>}
                renderDoneButton={() => <Text style={styles.button}>Ir para o App!</Text>}
                onDone={() => navigation.navigate("Mapa")}
            />
        );
    }

}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
    },
    button: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Instrucao1;
