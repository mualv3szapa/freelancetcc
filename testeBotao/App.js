// App.js
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const App = () => {
  // Altere este URL para o IP do seu ESP32 na rede Wi-Fi
  const baseUrl = "http://192.168.194.44";

  const moveMotorForward = async () => {
    try {
      console.log("Tentando mover o motor para frente...");
      const response = await fetch(`${baseUrl}/motor/forward`);
      const text = await response.text();
      console.log("Resposta do servidor para frente:", text);
    } catch (error) {
      console.error("Erro ao mover o motor para frente:", error);
    }
  };

  const moveMotorBackward = async () => {
    try {
      console.log("Tentando mover o motor para trás...");
      const response = await fetch(`${baseUrl}/motor/backward`);
      const text = await response.text();
      console.log("Resposta do servidor para trás:", text);
    } catch (error) {
      console.error("Erro ao mover o motor para trás:", error);
    }
  };

  useEffect(() => {
    const testMotorMovement = async () => {
      await moveMotorForward();
      // Adicione um pequeno atraso antes de mover para trás
      setTimeout(async () => {
        await moveMotorBackward();
      }, 2000); // 2 segundos de atraso, ajuste conforme necessário
    };

    testMotorMovement();
  }, []);

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});

export default App;

