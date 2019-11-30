

#define GET_LOW_BYTE(A) (uint8_t)((A))
//宏函数 获得A的低八位
#define GET_HIGH_BYTE(A) (uint8_t)((A) >> 8)
//宏函数 获得A的高八位
#define BYTE_TO_HW(A, B) ((((uint16_t)(A)) << 8) | (uint8_t)(B))
//宏函数 以A为高八位 B为低八位 合并为16位整形

#define LOBOT_SERVO_FRAME_HEADER         0x55
#define LOBOT_SERVO_ID_WRITE             13

byte LobotCheckSum(byte buf[])
{
  byte i;
  uint16_t temp = 0;
  for (i = 2; i < buf[3] + 2; i++) {
    temp += buf[i];
  }
  temp = ~temp;
  i = (byte)temp;
  return i;
}

void LobotSerialServoSetID(HardwareSerial &SerialX, uint8_t oldID, uint8_t newID)
{
  byte buf[7];
  buf[0] = buf[1] = LOBOT_SERVO_FRAME_HEADER;
  buf[2] = oldID;
  buf[3] = 4;
  buf[4] = LOBOT_SERVO_ID_WRITE;
  buf[5] = newID;
  buf[6] = LobotCheckSum(buf);
  SerialX.write(buf, 7);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200); //波特率115200
  pinMode(13, OUTPUT);
  delay(1000);
}


void loop() {
  // put your main code here, to run repeatedly:
  delay(500);
  digitalWrite(13,HIGH);  //指示灯，运行指示
  LobotSerialServoSetID(Serial, 254, 1); // 第一个参数为通信所用串口，第二个参数为旧ID（旧ID为254就是向所有在线的舵机广播此命令，对所有在线舵机有效）
                                           // 第三个参数为新的ID
  delay(500);
  digitalWrite(13,LOW);
}
