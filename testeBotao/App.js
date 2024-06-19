// App.js
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const App = () => {
  const baseUrl = 'http://IP_DO_ESP32';

  const moveMotorForward = async () => {
    try {
      const response = await fetch(`${baseUrl}/motor/forward`);
      const text = await response.text();
      console.log(text);
    } catch (error) {
      console.error('Erro ao mover o motor para frente:', error);
    }
  };

  const moveMotorBackward = async () => {
    try {
      const response = await fetch(`${baseUrl}/motor/backward`);
      const text = await response.text();
      console.log(text);
    } catch (error) {
      console.error('Erro ao mover o motor para trás:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Controle de Motor de Passo</Text>
      <Button title="Mover para Frente" onPress={moveMotorForward} />
      <Button title="Mover para Trás" onPress={moveMotorBackward} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
