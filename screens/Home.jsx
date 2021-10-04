import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate("Instrucao1")}>
          <Image source={require('../assets/img/iconBORALI.png')} style={styles.img} />
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
    width: 102,
    height: 102,
    marginTop: 250,
    alignSelf: 'center',
  },
  scrollView: {
    overflow: "scroll",
  },
  text: {
    fontSize: 20,
    marginHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
    fontWeight: 'bold',
    color: "#000",
  },
});

export default Home;