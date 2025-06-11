#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Homewifi_2.4G";
const char* password = "9sophie2011";

// Your server details
// THIS IS CORRECT. It points to the main domain.
// THIS IS CORRECT. It points to the main domain.
const char* serverName = "https://intelvis.ai/api/provision";
const char* apiKey = "another-very-strong-secret-key";


void provisionDevice() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-Key", apiKey);

    // Get the device's MAC address
    String macAddress = WiFi.macAddress();
    macAddress.toLowerCase(); // Ensure it's lowercase

    // Create JSON body
    StaticJsonDocument<100> doc;
    doc["mac"] = macAddress;
    String requestBody;
    serializeJson(doc, requestBody);

    Serial.print("Provisioning with MAC: ");
    Serial.println(macAddress);

    // Send the POST request
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected. Cannot provision.");
  }
}



void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");

  // Run the provisioning process once on startup
  provisionDevice();
}

void loop() {
  // Your device's main logic goes here (reading sensors, etc.)
  delay(10000);
}

// #include <Arduino.h>
// #include <nvs_flash.h> // Native NVS flash driver
// #include <nvs.h>       // Native NVS key-value storage API
// #include "esp_system.h" // For esp_fill_random to access the hardware RNG

// const char* NVS_NAMESPACE = "provisioning";
// const char* CLAIM_TOKEN_KEY = "claim_token";

// /**
//  * @brief Gets the device's unique claim token using the native ESP-IDF NVS API.
//  * 
//  * On first boot, it generates a cryptographically random 128-bit UUID,
//  * stores it in Non-Volatile Storage (NVS), and returns it.
//  * On all subsequent boots, it retrieves the existing token from NVS.
//  * 
//  * @return String The unique claim token for this device.
//  */
// String getClaimToken() {
//     // 1. Initialize NVS
//     esp_err_t err = nvs_flash_init();
//     if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
//         ESP_ERROR_CHECK(nvs_flash_erase());
//         err = nvs_flash_init();
//     }
//     ESP_ERROR_CHECK(err);

//     // 2. Open NVS
//     nvs_handle_t my_handle;
//     err = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &my_handle);
//     if (err != ESP_OK) {
//         Serial.printf("Error (%s) opening NVS handle!\n", esp_err_to_name(err));
//         return "";
//     }

//     // 3. Read the token size
//     size_t required_size = 0;
//     err = nvs_get_str(my_handle, CLAIM_TOKEN_KEY, NULL, &required_size);

//     if (err == ESP_OK && required_size > 0) {
//         // Token exists, read it
//         Serial.println("Claim token retrieved from NVS.");
//         char* token_buf = new char[required_size];
//         nvs_get_str(my_handle, CLAIM_TOKEN_KEY, token_buf, &required_size);
//         String token = String(token_buf);
//         delete[] token_buf;
//         nvs_close(my_handle);
//         return token;
//     } else {
//         // Token not found (err == ESP_ERR_NVS_NOT_FOUND) or other error
//         Serial.println("No claim token found. Generating a new one...");

//         // Generate Random Bytes (16 bytes for UUID)
//         uint8_t randomBytes[16];
//         esp_fill_random(randomBytes, sizeof(randomBytes));

//         // Format into a UUID string (36 chars + null terminator)
//         char uuidStr[37];
//         snprintf(uuidStr, sizeof(uuidStr), "%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x-%02x%02x%02x%02x%02x%02x",
//                  randomBytes[0], randomBytes[1], randomBytes[2], randomBytes[3],
//                  randomBytes[4], randomBytes[5], randomBytes[6], randomBytes[7],
//                  randomBytes[8], randomBytes[9], randomBytes[10], randomBytes[11],
//                  randomBytes[12], randomBytes[13], randomBytes[14], randomBytes[15]);

//         // Write the new token string to NVS
//         err = nvs_set_str(my_handle, CLAIM_TOKEN_KEY, uuidStr);
//         if (err != ESP_OK) {
//             Serial.printf("Error (%s) writing token to NVS!\n", esp_err_to_name(err));
//             nvs_close(my_handle);
//             return "";
//         }

//         // Commit written value.
//         err = nvs_commit(my_handle);
//         if (err != ESP_OK) {
//             Serial.printf("Error (%s) committing token to NVS!\n", esp_err_to_name(err));
//             nvs_close(my_handle);
//             return "";
//         }
        
//         Serial.println("New token successfully saved to NVS.");
//         nvs_close(my_handle);
//         return String(uuidStr);
//     }
// }

// void setup() {
//     Serial.begin(115200);
//     delay(1000);

//     Serial.println("--- Device Booting ---");

//     String myToken = getClaimToken();

//     if (myToken.length() > 0) {
//         Serial.println("------------------------------------");
//         Serial.print("Device Claim Token: ");
//         Serial.println(myToken);
//         Serial.println("------------------------------------");
//     } else {
//         Serial.println("Failed to get a claim token. System halted.");
//         while(1);
//     }
// }

// void loop() {
//     delay(10000);
// }