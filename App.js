import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  return (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
        <TouchableOpacity>
        <Image source={require('./assets/img/boraliLogo.png')} style={styles.img} />
        <Text style={styles.text}>Borali</Text>
        </TouchableOpacity>
    </ScrollView>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 82,
    marginBottom: 5,
    marginTop: 250,
},
scrollView: {
  overflow: "scroll",
},
text: {
  marginLeft: 8,
  alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
    fontWeight: 'bold',
    color: "#00000",
},
});
