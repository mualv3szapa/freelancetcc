import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Container } from "./src/components/Container/Container";
import { TimerRacao } from "./src/components/TimerRacao/TimerRacao";
import { BtnLiberar } from "./src/components/BtnLiberar/BtnLiberar";
import { Header } from "./src/components/Header/Header";
import { useState, useEffect } from "react";

export default function App() {
  const [racao, setRacao] = useState(null);
  const [peso, setPeso] = useState(null);

  const ESP32_IP_ADDRESS = "172.20.10.7"; // Substitua pelo endereço IP real do seu ESP32

  // Função para buscar dados de ração do ESP32
  const fetchEsp = async () => {
    try {
      let response = await fetch(`http://${ESP32_IP_ADDRESS}/getRation`);
      let responseText = await response.text();
      setRacao(responseText);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao buscar dados de ração");
    }
  };

  // Função para buscar dados de peso do ESP32
  const fetchWeight = async () => {
    try {
      let response = await fetch(`http://${ESP32_IP_ADDRESS}/getWeight`);
      let responseText = await response.text();
      setPeso(responseText);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao buscar dados de peso");
    }
  };

  // Função para acionar o motor de passo e dispensar ração
  const rotateMotor = async () => {
    try {
      let response = await fetch(`http://${ESP32_IP_ADDRESS}/rotateMotor`); // Corrigida a rota para acionar o motor de passo
      let responseText = await response.text();
      Alert.alert("Sucesso", responseText);
      fetchEsp(); // Atualiza a quantidade de ração após a dispensação
      fetchWeight(); // Atualiza o peso após a dispensação
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao acionar o motor de passo");
    }
  };

  // Carrega os dados iniciais quando o componente é montado
  useEffect(() => {
    fetchEsp();
    fetchWeight();
  }, []);

  return (
    <Container>
      <Header source={require("./src/assets/logo.png")} />

      {/* Temporizador de Ração */}
      <TimerRacao
        onFinish={rotateMotor} // Adicione esta prop para integrar a lógica do temporizador
      />

      {/* Exibe os dados de ração */}
      <Text style={styles.text}>
        Ração restante: {racao ? `${racao}g` : "Carregando..."}
      </Text>

      {/* Exibe os dados de peso */}
      <Text style={styles.text}>
        Peso da ração dispensada: {peso ? `${peso}g` : "Carregando..."}
      </Text>

      {/* Botão para liberar ração manualmente */}
      <BtnLiberar btnTitle={"Liberar"} onPress={rotateMotor} />
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    textTransform: "uppercase",
    marginTop: 50,
    fontSize: 16, // Adicionando uma configuração de tamanho de fonte para melhor leitura
    textAlign: "center", // Centraliza o texto
  },
});
