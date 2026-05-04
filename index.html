#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <PubSubClient.h>

// ===== الدبوسين =====
const int relay1_pin = D1;
const int relay2_pin = D2;
const int button1_pin = D3;  // يوصل بـ GND لتشغيل الريلاي 1 (مرة واحدة)
const int button2_pin = D4;  // يوصل بـ GND لتشغيل الريلاي 2 (مرة واحدة)

const int eeprom_size = 768;  // زيادة الحجم لاستيعاب الإعدادات الجديدة

// ===== هيكل الإعدادات =====
struct Config {
  char ssid[32];
  char password[32];
  char relay1_name[32];
  char relay2_name[32];
  char mqtt_broker[64];
  uint16_t mqtt_port;
  char mqtt_client_id[32];
  char mqtt_topic1[64];
  char mqtt_topic2[64];
  bool enable_physical_buttons;
  
  // إعدادات AP الجديدة
  char ap_ssid[32];
  char ap_password[32];
  
  // إعدادات Static IP
  bool enable_static_ip;
  char static_ip[16];
  char static_gateway[16];
  char static_subnet[16];
  
  uint32_t magic;
};

Config config;
ESP8266WebServer server(80);
WiFiClient espClient;
PubSubClient client(espClient);

bool targetRelay1State = false;
bool targetRelay2State = false;

bool lastButton1State = HIGH;
bool lastButton2State = HIGH;

// ===== دوال EEPROM =====
void saveConfig() {
  EEPROM.begin(eeprom_size);
  config.magic = 0xDEADBEEF;
  EEPROM.put(0, config);
  EEPROM.commit();
  EEPROM.end();
}

void loadConfig() {
  EEPROM.begin(eeprom_size);
  EEPROM.get(0, config);
  if (config.magic != 0xDEADBEEF) {
    // القيم الافتراضية
    strcpy(config.ssid, "");
    strcpy(config.password, "");
    strcpy(config.relay1_name, "Relay 1");
    strcpy(config.relay2_name, "Relay 2");
    strcpy(config.mqtt_broker, "broker.hivemq.com");
    config.mqtt_port = 1883;
    strcpy(config.mqtt_client_id, "MOsEV_Client");
    strcpy(config.mqtt_topic1, "home/relay1");
    strcpy(config.mqtt_topic2, "home/relay2");
    config.enable_physical_buttons = true;
    
    // إعدادات AP الافتراضية
    strcpy(config.ap_ssid, "MOsEV-Config");
    strcpy(config.ap_password, "12345678");
    
    // Static IP افتراضياً مقفل
    config.enable_static_ip = false;
    strcpy(config.static_ip, "192.168.1.100");
    strcpy(config.static_gateway, "192.168.1.1");
    strcpy(config.static_subnet, "255.255.255.0");
    
    config.magic = 0xDEADBEEF;
    saveConfig();
  }
  EEPROM.end();
}

// ===== دوال التحكم في الريلاي =====
void setRelay(int relayNum, bool on) {
  if (relayNum == 1) {
    targetRelay1State = on;
    digitalWrite(relay1_pin, on ? LOW : HIGH);
  } else {
    targetRelay2State = on;
    digitalWrite(relay2_pin, on ? LOW : HIGH);
  }
}

bool getRelayState(int relayNum) {
  int pin = (relayNum == 1) ? relay1_pin : relay2_pin;
  return digitalRead(pin) == LOW;
}

// ===== MQTT =====
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  bool newState = (msg == "ON");

  if (strcmp(topic, config.mqtt_topic1) == 0) {
    setRelay(1, newState);
  } else if (strcmp(topic, config.mqtt_topic2) == 0) {
    setRelay(2, newState);
  }
}

void reconnectMQTT() {
  while (!client.connected()) {
    if (client.connect(config.mqtt_client_id)) {
      client.subscribe(config.mqtt_topic1);
      client.subscribe(config.mqtt_topic2);
      Serial.println("MQTT connected");
    } else {
      delay(2000);
    }
  }
}

// ===== معالجة الأزرار (لحظية) =====
void handlePhysicalButtons() {
  if (!config.enable_physical_buttons) return;

  bool current1 = digitalRead(button1_pin);
  bool current2 = digitalRead(button2_pin);

  if (lastButton1State == HIGH && current1 == LOW) {
    setRelay(1, true);
    client.publish(config.mqtt_topic1, "ON");
    Serial.println("Physical button D3 pressed -> Relay1 ON");
  }
  lastButton1State = current1;

  if (lastButton2State == HIGH && current2 == LOW) {
    setRelay(2, true);
    client.publish(config.mqtt_topic2, "ON");
    Serial.println("Physical button D4 pressed -> Relay2 ON");
  }
  lastButton2State = current2;
}

// ===== دوال WiFi مع دعم Static IP =====
void startAP() {
  WiFi.softAP(config.ap_ssid, config.ap_password);
  Serial.println("AP Mode Started");
  Serial.print("AP SSID: ");
  Serial.println(config.ap_ssid);
  Serial.print("AP IP: ");
  Serial.println(WiFi.softAPIP());
}

void connectToWiFi() {
  if (strlen(config.ssid) == 0) {
    startAP();
    return;
  }
  
  if (config.enable_static_ip && strlen(config.static_ip) > 0) {
    IPAddress ip, gateway, subnet;
    ip.fromString(config.static_ip);
    gateway.fromString(config.static_gateway);
    subnet.fromString(config.static_subnet);
    WiFi.config(ip, gateway, subnet);
    Serial.println("Static IP configured");
  }
  
  WiFi.begin(config.ssid, config.password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi failed, starting AP");
    startAP();
  }
}

// ===== صفحات الويب =====
String webpage() {
  bool state1 = getRelayState(1);
  bool state2 = getRelayState(2);
  bool btn1Pressed = (digitalRead(button1_pin) == LOW);
  bool btn2Pressed = (digitalRead(button2_pin) == LOW);
  
  String ipAddr = (WiFi.status() == WL_CONNECTED) ? WiFi.localIP().toString() : WiFi.softAPIP().toString();

  String html = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>MOsEV Smart Control</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-height: 100vh; padding: 20px; color: #eee; }
      .container { max-width: 600px; margin: 0 auto; }
      .card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 24px; padding: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); border: 1px solid rgba(255,255,255,0.18); }
      h1 { text-align: center; margin-bottom: 20px; font-size: 1.8rem; }
      .ip-box { text-align: center; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 20px; margin-bottom: 15px; font-size: 0.9rem; }
      .relay-card { background: rgba(0,0,0,0.5); border-radius: 20px; padding: 15px; margin-bottom: 15px; }
      .relay-title { font-size: 1.4rem; font-weight: bold; margin-bottom: 15px; text-align: center; }
      .button-group { display: flex; gap: 15px; justify-content: center; }
      button { border: none; padding: 12px 24px; border-radius: 40px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; width: 100px; }
      button:active { transform: scale(0.96); }
      .btn-on { background: #00cc66; color: white; box-shadow: 0 4px 15px rgba(0,204,102,0.3); }
      .btn-off { background: #dc3545; color: white; box-shadow: 0 4px 15px rgba(220,53,69,0.3); }
      .status { text-align: center; margin-top: 12px; font-size: 0.9rem; padding: 6px; border-radius: 30px; background: rgba(0,0,0,0.4); }
      .status-on { color: #00cc66; }
      .status-off { color: #ff6b6b; }
      .physical-status { text-align: center; font-size: 0.85rem; margin-top: 8px; color: #aaa; }
      .physical-active { color: #ffaa44; }
      .settings-link { display: block; text-align: center; margin-top: 20px; color: #aaa; text-decoration: none; font-size: 0.9rem; }
      .settings-link:hover { color: white; }
      hr { border-color: rgba(255,255,255,0.1); margin: 15px 0; }
      .info { font-size: 0.8rem; text-align: center; margin-top: 20px; color: #88a0b0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>⚡ MOsEV Smart Switch ⚡</h1>
        <div class="ip-box">🌐 IP: )rawliteral" + ipAddr + R"rawliteral(</div>
)rawliteral";

  // Relay 1
  html += "<div class='relay-card'>";
  html += "<div class='relay-title'>" + String(config.relay1_name) + "</div>";
  html += "<div class='button-group'>";
  html += "<a href='/r1on'><button class='btn-on'>ON</button></a>";
  html += "<a href='/r1off'><button class='btn-off'>OFF</button></a>";
  html += "</div>";
  html += "<div class='status'>الحالة: <span class='" + String(state1 ? "status-on" : "status-off") + "'>" + String(state1 ? "مشغل ✅" : "مطفأ ❌") + "</span></div>";
  html += "<div class='physical-status'>الزر الفيزيائي: " + String(btn1Pressed ? "<span class='physical-active'>مضغوط ⚡</span>" : "مفتوح") + "</div>";
  html += "</div>";

  // Relay 2
  html += "<div class='relay-card'>";
  html += "<div class='relay-title'>" + String(config.relay2_name) + "</div>";
  html += "<div class='button-group'>";
  html += "<a href='/r2on'><button class='btn-on'>ON</button></a>";
  html += "<a href='/r2off'><button class='btn-off'>OFF</button></a>";
  html += "</div>";
  html += "<div class='status'>الحالة: <span class='" + String(state2 ? "status-on" : "status-off") + "'>" + String(state2 ? "مشغل ✅" : "مطفأ ❌") + "</span></div>";
  html += "<div class='physical-status'>الزر الفيزيائي: " + String(btn2Pressed ? "<span class='physical-active'>مضغوط ⚡</span>" : "مفتوح") + "</div>";
  html += "</div>";

  html += R"rawliteral(
        <hr>
        <a href='/settings' class='settings-link'>⚙️ إعدادات متقدمة (WiFi / MQTT / أسماء الريلاي / AP / Static IP)</a>
        <div class='info'>مواضيع MQTT الحالية:<br>)rawliteral" + String(config.mqtt_topic1) + "<br>" + String(config.mqtt_topic2) + R"rawliteral(</div>
      </div>
    </div>
  </body>
  </html>
  )rawliteral";
  return html;
}

String settingsPage() {
  String html = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>إعدادات MOsEV</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { background:#0f172a; font-family:Arial; padding:20px; color:#e2e8f0; }
      .form-card { max-width:600px; margin:auto; background:#1e293b; padding:25px; border-radius:20px; }
      input, select, button { width:100%; padding:12px; margin:8px 0; border-radius:12px; border:none; font-size:1rem; }
      input, select { background:#334155; color:white; }
      button { background:#3b82f6; color:white; font-weight:bold; cursor:pointer; }
      h1 { text-align:center; }
      label { display:block; margin-top:10px; }
      .subgroup { background:#0f172a; padding:15px; border-radius:15px; margin-top:15px; }
    </style>
  </head>
  <body>
    <div class="form-card">
      <h1>⚙️ الإعدادات المتقدمة</h1>
      <form action="/saveconfig">
        <div class="subgroup">
          <h3>🌐 إعدادات WiFi البيت</h3>
          <label>🔹 SSID:</label><input name="ssid" value=")rawliteral" + String(config.ssid) + R"rawliteral("><br>
          <label>🔹 Password:</label><input name="password" type="password" value=")rawliteral" + String(config.password) + R"rawliteral("><br>
        </div>
        
        <div class="subgroup">
          <h3>📡 إعدادات AP (نقطة الوصول)</h3>
          <label>📱 AP SSID:</label><input name="ap_ssid" value=")rawliteral" + String(config.ap_ssid) + R"rawliteral("><br>
          <label>🔑 AP Password:</label><input name="ap_password" value=")rawliteral" + String(config.ap_password) + R"rawliteral("><br>
          <small>سيتم تطبيق هذه الإعدادات بعد إعادة التشغيل عند الدخول في وضع AP</small>
        </div>
        
        <div class="subgroup">
          <h3>🔧 إعدادات IP الثابت (Static IP)</h3>
          <label>✅ تفعيل Static IP:</label>
          <select name="enable_static">)rawliteral";
  html += String(config.enable_static_ip ? "<option value='1' selected>نعم</option><option value='0'>لا</option>" : "<option value='1'>نعم</option><option value='0' selected>لا</option>");
  html += R"rawliteral(</select><br>
          <label>🌐 IP Address:</label><input name="static_ip" value=")rawliteral" + String(config.static_ip) + R"rawliteral("><br>
          <label>🚪 Gateway:</label><input name="static_gateway" value=")rawliteral" + String(config.static_gateway) + R"rawliteral("><br>
          <label>🔢 Subnet Mask:</label><input name="static_subnet" value=")rawliteral" + String(config.static_subnet) + R"rawliteral("><br>
        </div>
        
        <div class="subgroup">
          <h3>🔌 إعدادات الريلاي والأزرار</h3>
          <label>🔸 اسم الريلاي الأول:</label><input name="relay1_name" value=")rawliteral" + String(config.relay1_name) + R"rawliteral("><br>
          <label>🔸 اسم الريلاي الثاني:</label><input name="relay2_name" value=")rawliteral" + String(config.relay2_name) + R"rawliteral("><br>
          <label>🔌 تفعيل الأزرار الفيزيائية (D3/D4):</label>
          <select name="enable_physical">)rawliteral";
  html += String(config.enable_physical_buttons ? "<option value='1' selected>نعم (لحظي)</option><option value='0'>لا</option>" : "<option value='1'>نعم (لحظي)</option><option value='0' selected>لا</option>");
  html += R"rawliteral(</select><br>
        </div>
        
        <div class="subgroup">
          <h3>📨 إعدادات MQTT</h3>
          <label>📡 MQTT Broker:</label><input name="mqtt_broker" value=")rawliteral" + String(config.mqtt_broker) + R"rawliteral("><br>
          <label>🔌 MQTT Port:</label><input name="mqtt_port" value=")rawliteral" + String(config.mqtt_port) + R"rawliteral("><br>
          <label>🆔 MQTT Client ID:</label><input name="mqtt_client_id" value=")rawliteral" + String(config.mqtt_client_id) + R"rawliteral("><br>
          <label>📨 Topic Relay 1:</label><input name="mqtt_topic1" value=")rawliteral" + String(config.mqtt_topic1) + R"rawliteral("><br>
          <label>📨 Topic Relay 2:</label><input name="mqtt_topic2" value=")rawliteral" + String(config.mqtt_topic2) + R"rawliteral("><br>
        </div>
        
        <button type="submit">💾 حفظ وإعادة التشغيل</button>
      </form>
      <br><a href="/" style="color:#94a3b8;">🔙 العودة للرئيسية</a>
    </div>
  </body>
  </html>
  )rawliteral";
  return html;
}

// ===== الإعداد الرئيسي =====
void setup() {
  Serial.begin(115200);

  pinMode(relay1_pin, OUTPUT);
  pinMode(relay2_pin, OUTPUT);
  digitalWrite(relay1_pin, HIGH);
  digitalWrite(relay2_pin, HIGH);

  pinMode(button1_pin, INPUT_PULLUP);
  pinMode(button2_pin, INPUT_PULLUP);

  lastButton1State = digitalRead(button1_pin);
  lastButton2State = digitalRead(button2_pin);

  loadConfig();
  connectToWiFi();

  client.setServer(config.mqtt_broker, config.mqtt_port);
  client.setCallback(callback);

  server.on("/", []() { server.send(200, "text/html", webpage()); });
  server.on("/settings", []() { server.send(200, "text/html", settingsPage()); });

  server.on("/saveconfig", []() {
    strcpy(config.ssid, server.arg("ssid").c_str());
    strcpy(config.password, server.arg("password").c_str());
    strcpy(config.relay1_name, server.arg("relay1_name").c_str());
    strcpy(config.relay2_name, server.arg("relay2_name").c_str());
    strcpy(config.mqtt_broker, server.arg("mqtt_broker").c_str());
    config.mqtt_port = server.arg("mqtt_port").toInt();
    strcpy(config.mqtt_client_id, server.arg("mqtt_client_id").c_str());
    strcpy(config.mqtt_topic1, server.arg("mqtt_topic1").c_str());
    strcpy(config.mqtt_topic2, server.arg("mqtt_topic2").c_str());
    config.enable_physical_buttons = (server.arg("enable_physical") == "1");
    
    // إعدادات AP الجديدة
    strcpy(config.ap_ssid, server.arg("ap_ssid").c_str());
    strcpy(config.ap_password, server.arg("ap_password").c_str());
    
    // إعدادات Static IP
    config.enable_static_ip = (server.arg("enable_static") == "1");
    strcpy(config.static_ip, server.arg("static_ip").c_str());
    strcpy(config.static_gateway, server.arg("static_gateway").c_str());
    strcpy(config.static_subnet, server.arg("static_subnet").c_str());
    
    saveConfig();
    server.send(200, "text/html", "<html><body style='background:#0f172a;color:white;text-align:center;padding-top:100px;'><h2>✅ تم الحفظ، الجهاز يعيد التشغيل...</h2></body></html>");
    delay(1000);
    ESP.restart();
  });

  server.on("/r1on", []() { setRelay(1, true); client.publish(config.mqtt_topic1, "ON"); server.send(200, "text/html", webpage()); });
  server.on("/r1off", []() { setRelay(1, false); client.publish(config.mqtt_topic1, "OFF"); server.send(200, "text/html", webpage()); });
  server.on("/r2on", []() { setRelay(2, true); client.publish(config.mqtt_topic2, "ON"); server.send(200, "text/html", webpage()); });
  server.on("/r2off", []() { setRelay(2, false); client.publish(config.mqtt_topic2, "OFF"); server.send(200, "text/html", webpage()); });

  server.begin();
  Serial.println("HTTP server started");
}

// ===== الحلقة الرئيسية =====
void loop() {
  handlePhysicalButtons();

  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) reconnectMQTT();
    client.loop();
  }

  server.handleClient();
}