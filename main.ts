/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
enum MotorEnum {
    //% block="A"
    portA = 3,
    //% block="B"
    portB = 4,
    //% block="C"
    portC = 1,
    //% block="D"
    portD = 2,
}

enum DirectEnum {
    //% block="停止"
    direct0 = 0,
    //% block="正转"
    direct1 = 1,
    //% block="反转"
    direct2 = 2,
}

enum AngleEnum {
    //% block="15"
    angle15 = 15,
    //% block="30"
    angle30 = 30,
    //% block="45"
    angle45 = 45,
    //% block="60"
    angle60 = 60,
    //% block="90"
    angle90 = 90,
    //% block="120"
    angle120 = 120,
    //% block="150"
    angle150 = 150,
    //% block="180"
    angle180 = 180,
}

enum RowEnum {
    //% block="2"
    row2 = 2,
    //% block="3"
    row3 = 3,
    //% block="4"
    row4 = 4,
    //% block="5"
    row5 = 5,
    //% block="6"
    row6 = 6,
    //% block="7"
    row7 = 7,
    //% block="8"
    row8 = 8,
}

enum PinEnum {
    //% block="接口5"
    portA = 1,
    //% block="接口6"
    portB = 2,
    //% block="接口7"
    portC = 3,
    //% block="接口8"
    portD = 4,
}

enum OnOffEnum {
    //% block="停止"
    off = 0,
    //% block="启动"
    on = 1,
}

enum LEDEnum {
    //% block="彩灯1"
    led1 = 0,
    //% block="彩灯2"
    led2 = 1,
    //% block="彩灯3"
    led3 = 2,
    //% block="全部"
    all = 3,

}

/**
 * Custom blocks
 */
//% weight=100 color=#7CCD7C icon="" block="海客智能套件"
//% groups='["主机", "LCD", "电机", "蜂鸣器", "RGB彩灯", "超声波", "红外测距", "光敏", "温湿度", "旋钮", "声音", "碰撞", "循迹", "按键", "摇杆", "红外收发"]'
namespace motor {
    /*
    * hicbit initialization, please execute at boot time
    */
    //% weight=90 block="初始化Hicbit设备"
    //% group="主机"
    //% color=#7CCD7C
    export function HicbitInit() {
        led.enable(false);
        serial.redirect(
            SerialPin.P8,
            SerialPin.P12,
            BaudRate.BaudRate115200);
        basic.pause(3000);
        let i: number;
        let buf = pins.createBuffer(10);
        for (i = 1; i <= 4; i++){
            buf[0] = 0xfe;
            buf[1] = 0xa0;
            buf[2] = i;
            buf[3] = 0;
            buf[4] = 0;
            buf[5] = 0xef;
            serial.writeBuffer(buf);
        }
        ClearLCD(2, 8);
        basic.pause(1000);
    }

    //% sn.defl=RowEnum.row2
    //% weight=90 block="LCD|行数%sn|文本%str"
    //% group="LCD"
    //% color=#B22222
    export function SetLCDString(sn: RowEnum, str: string): void {
        let i:number=0;
        let len:number=0;
        let buf = pins.createBuffer(20);
        buf[0] = 0xfe;
        buf[1] = 0xc0;
        buf[2] = sn;
        len = str.length;
        for(i=0;i<len;i++)
            buf[i+3] = str.charCodeAt(i);
        buf[len+3] = 0xef;
        serial.writeBuffer(buf);
    }

    //% sn.defl=RowEnum.row2
    //% weight=80 block="LCD|行数%sn|数值%dat"
    //% group="LCD"
    //% color=#B22222
    export function SetLCDData(sn: RowEnum, dat: number): void {
        let i:number=0;
        let len:number=0;
        let str:string='';
        let buf = pins.createBuffer(20);
        buf[0] = 0xfe;
        buf[1] = 0xc0;
        buf[2] = sn;
        str = dat.toString();
        len = str.length;
        for(i=0;i<len;i++)
            buf[i+3] = str.charCodeAt(i);
        buf[len+3] = 0xef;
        serial.writeBuffer(buf);
    }

    //% sn1.defl=RowEnum.row2
    //% sn2.defl=RowEnum.row8
    //% weight=70 block="清屏|第%sn1行至|第%sn2行"
    //% group="LCD"
    //% color=#B22222
    export function ClearLCD(sn1: RowEnum, sn2: RowEnum): void {
        let buf = pins.createBuffer(10);
        buf[0] = 0xfe;
        buf[1] = 0xd0;
        buf[2] = sn1;
        buf[3] = sn1;
        buf[4] = 0xef;
        serial.writeBuffer(buf);
    }
    
    //% direct.defl=DirectEnum.direct1
    //% speed.min=0 speed.max=100
    //% weight=90 block="电机|端口%sn|方向%direct|速度%speed"
    //% group="电机"
    //% color=#5E9B9D
    export function SetMotorSpeed(sn: MotorEnum, direct: DirectEnum, speed: number): void {
        let buf = pins.createBuffer(10);
        buf[0] = 0xfe;
        buf[1] = 0xa0;
        buf[2] = sn;
        buf[3] = direct;
        buf[4] = speed;
        buf[5] = 0xef;
        serial.writeBuffer(buf);
    }

    //% direct.defl=DirectEnum.direct1
    //% weight=80 block="电机|端口%sn|方向%direct|角度%anelg"
    //% group="电机"
    //% color=#5E9B9D
    export function SetMotorAngle(sn: MotorEnum, direct: DirectEnum, angle: AngleEnum): void {
        let buf = pins.createBuffer(10);
        buf[0] = 0xfe;
        buf[1] = 0xb0;
        buf[2] = sn;
        buf[3] = direct;
        buf[4] = angle;
        buf[5] = 0xef;
        serial.writeBuffer(buf);
    }

    //% weight=90 block="光敏|端口%pin|值(0~255)"
    //% group="光敏"
    //% color=#4B974A
    export function GetPhotoSensitiveValue(pin: PinEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case PinEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case PinEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case PinEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case PinEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return 255 - Math.round(adValue);
    }

    //% weight=90 block="循迹|端口%pin|值(0~255)"
    //% group="循迹"
    //% color=#D7C599
    export function GetLineSensorValue(pin: PinEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case PinEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case PinEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case PinEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case PinEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    //% weight=90  block="旋钮|端口%pin|值(0~255)"
    //% group="旋钮"
    //% color=#923978
    export function GetKnobValue(pin: PinEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case PinEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case PinEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case PinEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case PinEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    //% weight=90 block="蜂鸣器|端口%pin|%act"
    //% group="蜂鸣器"
    //% color=#B22222
    export function StartBuzzer(pin: PinEnum, act: OnOffEnum): void {
        switch (pin) {
            case PinEnum.portA:
                pins.digitalWritePin(DigitalPin.P15, act);
                break;
            case PinEnum.portB:
                pins.digitalWritePin(DigitalPin.P13, act);
                break;
            case PinEnum.portC:
                pins.digitalWritePin(DigitalPin.P14, act);
                break;
            case PinEnum.portD:
                pins.digitalWritePin(DigitalPin.P10, act);
                break;
        }
    }

    //% weight=90 block="声音|端口%pin|值(0~255)"
    //% group="声音"
    //% color=#F5CD2F
    export function GetSoundSensorValue(pin: PinEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case PinEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case PinEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case PinEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case PinEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    //% weight=90 block="碰撞|端口%pin|触发" 
    //% group="碰撞"
    //% color=#435493
    export function CollisionHappen(pin: PinEnum): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (pin) {
            case PinEnum.portA:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P15);
                    if (status == 0) flag = true;
                } 
                break;
            case PinEnum.portB:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P13);
                    if (status == 0) flag = true;
                } 
                break;
            case PinEnum.portC:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P14);
                    if (status == 0) flag = true;
                } 
                break;
            case PinEnum.portD:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P10);
                    if (status == 0) flag = true;
                } 
                break;
        }
        return flag;
    }

    //% weight=98 block="超声波|端口%pin|距离(mm)"
    //% group="超声波"
    //% color=#8470FF
    export function GetUltrasonicDistance(pin: PinEnum): number {
        let echoPin: DigitalPin;
        let trigPin: DigitalPin;
        let distance = 0;
        switch (pin) {
            case PinEnum.portA:
                echoPin = DigitalPin.P15;
                trigPin = DigitalPin.P1;
                break;
            case PinEnum.portB:
                echoPin = DigitalPin.P13;
                trigPin = DigitalPin.P2;
                break;
            case PinEnum.portC:
                echoPin = DigitalPin.P14;
                trigPin = DigitalPin.P3;
                break;
            case PinEnum.portD:
                echoPin = DigitalPin.P10;
                trigPin = DigitalPin.P4;
                break;
        }
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);

        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        let time_echo_us = pins.pulseIn(echoPin, PulseValue.High, 60000);
        if ((time_echo_us < 60000) && (time_echo_us > 1)) {
            distance = time_echo_us * 17 / 100;//time_echo_us*340/2/1000(mm)
        }
        return Math.round(distance);
    }

    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0);
        basic.pause(18);
        let i = pins.digitalReadPin(pin);
        pins.setPull(pin, PinPullMode.PullUp);
    }

    function dht11_read(pin: DigitalPin): number {
        signal_dht11(pin);

        // Wait for response header to finish
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let value = 0;
        let counter = 0;

        for (let i = 0; i <= 32 - 1; i++) {
            while (pins.digitalReadPin(pin) == 0);
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        return value;
    }

    export enum Dht11Result {
        //% block="摄氏度"
        Celsius,
        //% block="华氏度"
        Fahrenheit,
        //% block="湿度"
        humidity
    }

    //% weight=98 block="温湿度|端口%pin|值%dhtResult"
    //% group="温湿度"
    //% pin_arg.fieldEditor="gridpicker" pin_arg.fieldOptions.columns=4
    //% pin_arg.fieldOptions.tooltips="false" pin_arg.fieldOptions.width="300"
    //% color=#E29B3F
    export function Get_DHT11_value(pin: PinEnum, dhtResult: Dht11Result): number {
        let pin_arg: DigitalPin;
        switch (pin) {
            case PinEnum.portA:
                pin_arg = DigitalPin.P1;
                break;
            case PinEnum.portB:
                pin_arg = DigitalPin.P2;
                break;
            case PinEnum.portC:
                pin_arg = DigitalPin.P3;
                break;
            case PinEnum.portD:0;
                pin_arg = DigitalPin.P4;
                break;
        }
        switch (dhtResult) {
            case Dht11Result.Celsius: return (dht11_read(pin_arg) & 0x0000ff00) >> 8;
            case Dht11Result.Fahrenheit: return ((dht11_read(pin_arg) & 0x0000ff00) >> 8) * 9 / 5 + 32;
            case Dht11Result.humidity: return dht11_read(pin_arg) >> 24;
            default: return 0;
        }
    }

    /*
    let lhRGBLight: neopixel.Strip;
    //% weight=98 block="RGB彩灯|端口%pin|彩灯%lightoffset|红%red|绿%green|蓝%blue"
    //% group="RGB彩灯"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% color=#CD9B9B
    export function SetRGBLight(pin: PinEnum, lightoffset: LEDEnum, red: number, green: number, blue: number) {
        switch (pin) {
            case PinEnum.portA:
                if (!lhRGBLight) {
                    lhRGBLight = neopixel.create(DigitalPin.P15, 3, NeoPixelMode.RGB);
                }
                break;
            case PinEnum.portB:
                if (!lhRGBLight) {
                    lhRGBLight = neopixel.create(DigitalPin.P13, 3, NeoPixelMode.RGB);
                }
                break;
            case PinEnum.portC:
                if (!lhRGBLight) {
                    lhRGBLight = neopixel.create(DigitalPin.P14, 3, NeoPixelMode.RGB);
                }
                break;
            case PinEnum.portD:
                if (!lhRGBLight) {
                    lhRGBLight = neopixel.create(DigitalPin.P10, 3, NeoPixelMode.RGB);
                }
                break;
        }
        lhRGBLight.clear();

        if (lightoffset == lhRGBLight._length)//全部
        {
            for (let i = 0; i < lhRGBLight._length; i++)
            {
                lhRGBLight.setBufferRGB(i, red, green, blue);     
            }
        }
        else
        {
            lhRGBLight.RGB(lightoffset, red, green, blue); 
        }
    }

    //% weight=98 blockId=hicbit_showLight block="Show light belt"
    export function hicbit_showLight() {
        lhRGBLight.show();
    }

    //% weight=97 blockGap=20 blockId=hicbit_clearLight block="Clear light"
    export function hicbit_clearLight() {
        lhRGBLight.clear();
    }*/

}