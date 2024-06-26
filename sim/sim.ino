#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <AccelStepper.h>
#include "HX711.h"

// WiFi credentials
const char* ssid = "Redmi 13C";
const char* password = "igor2024";

// Motor de Passo (DRV8825)
// Defina os pinos de controle do motor de passo
const int stepPin = 13; // Pino de passo, conectado ao D13 (GPIO 13)
const int dirPin = 26;  // Pino de direção, conectado ao D26 (GPIO 26)

// Crie uma instância da classe AccelStepper
AccelStepper stepper(AccelStepper::DRIVER, stepPin, dirPin);

// Ultrasonic Sensor
const int trigPin = 21; // Pino de trigger, conectado ao D21 (GPIO 21)
const int echoPin = 22; // Pino de echo, conectado ao D22 (GPIO 22)
long duration;
int distance;
const float maxDistance = 30.0; // Capacidade máxima do recipiente em cm

// Load Cell (HX711)
const int LOADCELL_DOUT_PIN = 19; // Pino DT, conectado ao D15 (GPIO 15)
const int LOADCELL_SCK_PIN = 18;   // Pino SCK, conectado ao D4 (GPIO 4)
HX711 scale;

// Server
AsyncWebServer server(80);

// Meta de peso para cada operação de dispensação (200 gramas neste exemplo)
const float targetWeight = 200.0;

// Calibração de passos do motor de passo para dispensar 200 gramas (valor de exemplo)
const long stepsForTargetWeight = 200; // Ajuste conforme necessário

// Offset para a célula de carga
long offset = 0;

void setup() {
  Serial.begin(115200);

  // Motor de Passo
  stepper.setMaxSpeed(1000); // Defina a velocidade máxima
  stepper.setAcceleration(500); // Defina a aceleração

  // Ultrasonic Sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Load Cell
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  offset = scale.read_average(3); // Calibração inicial
  scale.tare(); // Reseta a balança para 0

  // WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
  Serial.println(WiFi.localIP());

  // Server endpoints
  server.on("/rotateMotor", HTTP_GET, [](AsyncWebServerRequest *request){
    dispenseRation();
    request->send(200, "text/plain", "Motor de passo ativado e ração dispensada");
  });

  server.on("/getRation", HTTP_GET, [](AsyncWebServerRequest *request){
    float percentage = getRationPercentage();
    request->send(200, "text/plain", String(percentage) + "%");
  });

  server.on("/getWeight", HTTP_GET, [](AsyncWebServerRequest *request){
    float weight = getWeight();
    request->send(200, "text/plain", String(weight));
  });

  server.begin();
}

void loop() {
  // Nada a ser feito no loop
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  return duration;
}

float getWeight() {
  return (scale.read_average(10) - offset) / 1000.0; // Média de 10 leituras com ajuste de offset
}

float getRationPercentage() {
  long duration = getDistance();
  int distance = duration * 0.034 / 2; // Distância em cm

  // Calcular a porcentagem com base na distância medida e na distância máxima
  float percentage = (1.0 - (distance / maxDistance)) * 100.0;

  // Limitar a porcentagem ao intervalo de 0% a 100%
  if (percentage < 0) {
    percentage = 0;
  } else if (percentage > 100) {
    percentage = 100;
  }

  return percentage;
}

void dispenseRation() {
  // Medir o peso inicial
  float initialWeight = getWeight();
  Serial.print("Peso inicial: ");
  Serial.println(initialWeight);

  // Mover o motor de passo para dispensar ração
  stepper.moveTo(stepsForTargetWeight); // Mover a quantidade definida de passos
  while (stepper.distanceToGo() > 0) {
    stepper.run();
  }

  delay(1000); // Aguarde para garantir que a ração foi dispensada

  // Medir o peso final
  float finalWeight = getWeight();
  Serial.print("Peso final: ");
  Serial.println(finalWeight);

  // Calcular a quantidade de ração dispensada
  float dispensedWeight = finalWeight - initialWeight;
  Serial.print("Peso dispensado: ");
  Serial.println(dispensedWeight);

  // Ajustar se necessário
  if (dispensedWeight < targetWeight) {
    long additionalSteps = (targetWeight - dispensedWeight) * (stepsForTargetWeight / targetWeight);
    stepper.moveTo(stepper.currentPosition() + additionalSteps);
    while (stepper.distanceToGo() > 0) {
      stepper.run();
    }
  } else if (dispensedWeight > targetWeight) {
    long reverseSteps = (dispensedWeight - targetWeight) * (stepsForTargetWeight / targetWeight);
    stepper.moveTo(stepper.currentPosition() - reverseSteps);
    while (stepper.distanceToGo() > 0) {
      stepper.run();
    }
  }

  delay(1000); // Aguarde novamente para qualquer ação final

  // Voltar à posição inicial
  stepper.moveTo(0);
  while (stepper.distanceToGo() > 0) {
    stepper.run();
  }

  // Peso final ajustado
  float adjustedWeight = getWeight();
  Serial.print("Peso final ajustado: ");
  Serial.println(adjustedWeight);
}
