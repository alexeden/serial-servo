#!/usr/bin/python3

import serial
import pigpio
import time

pi = pigpio.pi()  #初始化 pigpio库
serialHandle = serial.Serial("/dev/ttyAMA0", 115200)  #初始化串口， 波特率为115200


##
##命令发送
##
def servoWriteCmd(id, cmd, par1 = None, par2 = None):
    buf = bytearray(b'\x55\x55')
    try:
        len = 3   #若命令是没有参数的话数据长度就是3
        buf1 = bytearray(b'')

	## 对参数进行处理
        if par1 is not None:
            len += 2  #数据长度加2
            buf1.extend([(0xff & par1), (0xff & (par1 >> 8))])  #分低8位 高8位 放入缓存
        if par2 is not None:
            len += 2
            buf1.extend([(0xff & par2), (0xff & (par2 >> 8))])  #分低8位 高8位 放入缓存
        buf.extend([(0xff & id), (0xff & len), (0xff & cmd)])
        buf.extend(buf1) #追加参数

	##计算校验和
        sum = 0x00
        for b in buf:  #求和
            sum += b
        sum = sum - 0x55 - 0x55  #去掉命令开头的两个 0x55
        sum = ~sum  #取反
        buf.append(0xff & sum)  #取低8位追加进缓存
        serialHandle.write(buf) #发送
    except Exception as e:
        print(e)

def portInit(): #配置用到的IO口
    pi.set_mode(17, pigpio.OUTPUT)  #配置RX_CON 即 GPIO17 为输出
    pi.write(17, 0)
    pi.set_mode(27, pigpio.OUTPUT)  #配置TX_CON 即 GPIO27 为输出
    pi.write(27, 1)

def portWrite():  #配置单线串口为输出
    pi.write(27, 1)  #拉高TX_CON 即 GPIO27
    pi.write(17, 0)  #拉低RX_CON 即 GPIO17
    

def portRead():   #配置单线串口为输入
    pi.write(27, 0) #拉低TX_CON 即 GPIO27
    pi.write(17, 1) #拉高RX_CON 即 GPIO17


portInit()
while True:
    try:
        portWrite() #将单线串口配置为输出
        servoWriteCmd(1,1,0,1000) #发送命令 参数1 舵机id=1, 参数2 命令 = 1, 参数3 位置 = 0, 参数4 时间 = 1000ms
        time.sleep(1.1)
        servoWriteCmd(1,1,1000,2000)
        time.sleep(2.1)
    except Exception as e:
        print(e)
        break
