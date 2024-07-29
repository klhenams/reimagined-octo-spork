#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

// WiFi and Supabase credentials
const char* ssid = ""; //WIFI SSID GOES HERE
const char* password = ""; //WIFI PASSWORD GOES. TRY TO AVOID SPACES WITHIN IT
const char* supabase_url = "https://oxebojkujqmdudvluhmp.supabase.co";
//secret api key works 
const char* supabase_api_key = ""; //PUBLIC API KEY TO SUPABASE DATABASE
const char* supabase_table = ""; //TABLE_NAME GOES HERE


// Initialize hardware serial for UART communication
HardwareSerial SerialPort(2);

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);
  // Initialize UART with RX on GPIO 16 (default TX on GPIO 17)
  SerialPort.begin(9600, SERIAL_8N1, 16, 17); // Only specifying RX_PIN

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Serial.println("Starting...");
}

void sendDataToSupabase(float temperature, float humidity, float co2, float ch2o, float tvoc, float pm2_5, float pm10) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(supabase_url) + "/rest/v1/" + supabase_table;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabase_api_key);

    // Prepare JSON payload
    String postData = "{\"TEMPERATURE\": " + String(temperature) + ", \"HUMIDITY\": " + String(humidity) +
                      ", \"CO2\": " + String(co2) + ", \"CH2O\": " + String(ch2o) +
                      ", \"TVOC\": " + String(tvoc) + ", \"PM2_5\": " + String(pm2_5) +
                      ", \"PM10\": " + String(pm10) + "}";

    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}

void loop() {
  //the code following code is specific to the sensor board that was used, M701B-uart
  if (SerialPort.available() ) {  // Ensure at least 17 bytes are available
    uint8_t buffer[17];
    SerialPort.readBytes(buffer, 17);  // Read 17 bytes from the UART
    
    // Print the received bytes for debugging
    Serial.print("Received bytes: ");
    for (int i = 0; i < 17; i++) {
      Serial.print(buffer[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    // Check fixed values
    if (buffer[0] == 0x3C && buffer[1] == 0x02) {
      // Extract values
      uint16_t eCO2 = (buffer[2] << 8) | buffer[3];
      uint16_t eCH2O = (buffer[4] << 8) | buffer[5];
      uint16_t TVOC = (buffer[6] << 8) | buffer[7];
      uint16_t PM25 = (buffer[8] << 8) | buffer[9];
      uint16_t PM10 = (buffer[10] << 8) | buffer[11];
      int8_t tempInt = buffer[12];
      uint8_t tempDec = buffer[13];
      uint8_t humidityInt = buffer[14];
      uint8_t humidityDec = buffer[15];
      uint8_t checkCode = buffer[16];

      // Calculate check code
      uint8_t calculatedCheckCode = 0;
      for (int i = 0; i < 16; i++) {
        calculatedCheckCode += buffer[i];
      }
      calculatedCheckCode = calculatedCheckCode & 0xFF;  // Low 8 bits

      // Validate check code
      if (calculatedCheckCode == checkCode) {
        // Print values for debugging
        Serial.print("eCO2: "); Serial.println(eCO2);
        Serial.print("eCH2O: "); Serial.println(eCH2O);
        Serial.print("TVOC: "); Serial.println(TVOC);
        Serial.print("PM2.5: "); Serial.println(PM25);
        Serial.print("PM10: "); Serial.println(PM10);
        Serial.print("Temperature: "); Serial.print(tempInt); Serial.print("."); Serial.println(tempDec);
        Serial.print("Humidity: "); Serial.print(humidityInt); Serial.print("."); Serial.println(humidityDec);

        // Send data to Supabase
        float temperature = tempInt + (tempDec / 100.0);
        float humidity = humidityInt + (humidityDec / 100.0);
        sendDataToSupabase(temperature, humidity, eCO2, eCH2O, TVOC, PM25, PM10);
      } else {
        Serial.println("Check code mismatch!");
        Serial.print("Calculated Check Code: "); Serial.println(calculatedCheckCode, HEX);
        Serial.print("Received Check Code: "); Serial.println(checkCode, HEX);
      }
    } else {
      Serial.println("Fixed bytes mismatch!");
      Serial.print("Received Byte 0: "); Serial.println(buffer[0], HEX);
      Serial.print("Received Byte 1: "); Serial.println(buffer[1], HEX);
    }
  } else {
    Serial.println("Not enough bytes available.");
  }

  delay(1000); // Add a delay to prevent flooding the serial monitor
}
