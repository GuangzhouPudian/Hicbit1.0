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
    led1= 1,
    //% block="彩灯2"
    led2 = 2,
    //% block="彩灯3"
    led3 = 3,
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
                    if (status == 0) return true;
                } 
                break;
            case PinEnum.portB:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P13);
                    if (status == 0) return true;
                } 
                break;
            case PinEnum.portC:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P14);
                    if (status == 0) return true;
                } 
                break;
            case PinEnum.portD:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P10);
                    if (status == 0) return true;
                } 
                break;
        }
        return false;
    }

    //% weight=98 block="超声波|端口%pin|距离(mm)"
    //% group="超声波"
    //% color=#8470FF
    export function hicbit_ultrasonic(pin: PinEnum): number {
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
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(50);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(10);
        let time_echo_us = pins.pulseIn(echoPin, PulseValue.High, 60000);
        if ((time_echo_us < 60000) && (time_echo_us > 1)) {
            distance = time_echo_us * 17 / 100;//time_echo_us*340/2/1000(mm)
        }
        return Math.round(distance);
    }

    //% weight=98 block="RGB彩灯|端口%pin|彩灯%led|红%r|绿%g|蓝%b"
    //% group="RGB彩灯"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% color=#CD9B9B
    export function LedRGB(pin: PinEnum, led: LEDEnum, r: number, g: number, b: number): void {
        let ledPin: DigitalPin;
        let ledDat: number;
        let i: number;
        switch (pin) {
            case PinEnum.portA:
                ledPin = DigitalPin.P15;
                break;
            case PinEnum.portB:
                ledPin = DigitalPin.P13;
                break;
            case PinEnum.portC:
                ledPin = DigitalPin.P14;
                break;
            case PinEnum.portD:
                ledPin = DigitalPin.P10;
                break;
        }
        ledDat = ((g & 0xff) << 16) | ((r & 0xff) << 8) | (b & 0xff);
        pins.digitalWritePin(ledPin, 0);
        for (i = 23; i >= 0; i--) {
            if (ledDat & (1 << i)) {
                pins.digitalWritePin(ledPin, 1);
                control.waitMicros(0.8);
                pins.digitalWritePin(ledPin, 0);
                control.waitMicros(0.45);
            } else {
                pins.digitalWritePin(ledPin, 1);
                control.waitMicros(0.4);
                pins.digitalWritePin(ledPin, 0);
                control.waitMicros(0.85);
            }
        }
    }
}