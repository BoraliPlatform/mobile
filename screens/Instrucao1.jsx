import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from 'expo-linear-gradient';

const slides = [
    {
        key: '1',
        title: 'Localize',
        text: 'Veja os vendedores ambulantes mais próximos de você.',
        image: require('../assets/img/tela1.png')
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

const Instrucao1 = ({navigation}) => {
    const [showHome, setShowHome] = useState(false);

    function renderSlides({ item }){
        return(
            <View style={{flex:1}}>
                 <LinearGradient // Background Linear Gradient
                    colors={['#e54f4f', '#fff']}
                    style={styles.background}/>
                <Image source={item.image}
                    style={{
                        paddingTop: 400,
                        resizeMode: 'cover',
                        height: '73%',
                        width: '100%',
                        alignSelf: 'center',
                    }}/>
                <Text style={{
                    paddingTop: 15,
                    paddingBottom: 10,
                    fontSize: 25,
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}>{item.title}</Text>
                <Text style={{
                    paddingHorizontal: 25,
                    fontSize: 15,
                    textAlign: 'center',
                    color: '#000',
                }}>{item.text}</Text>
            </View>
        )
    }

    if(showHome){
        return <Text>ENTROU NA HOME</Text>
    } else{
        return(
            <AppIntroSlider
                renderItem={renderSlides}
                data={slides}
                activeDotStyle={{
                    backgroundColor: '#000',
                    width: 30 
                }}
                style={{backgroundColor:'#fff'}}
                renderPrevButton={() => <Text>Anterior</Text>}
                renderNextButton={() => <Text>Próximo</Text>}
                renderDoneButton={() => <Text>Ir para o App!</Text>}
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
});

export default Instrucao1;
