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
    //% block="A"
    portA = 1,
    //% block="B"
    portB = 2,
    //% block="C"
    portC = 3,
    //% block="D"
    portD = 4,
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

    //% weight=90 block="蜂鸣器|端口%pin|开启"
    //% group="蜂鸣器"
    //% color=#B22222
    export function StartBuzzer(pin: PinEnum): void {
        switch (pin) {
            case PinEnum.portA:
                pins.digitalWritePin(DigitalPin.P15, 1);
                break;
            case PinEnum.portB:
                pins.digitalWritePin(DigitalPin.P13, 1);
                break;
            case PinEnum.portC:
                pins.digitalWritePin(DigitalPin.P14, 1);
                break;
            case PinEnum.portD:
                pins.digitalWritePin(DigitalPin.P10, 1);
                break;
        }
    }

    //% weight=80  block="蜂鸣器|端口%pin|停止"
    //% group="蜂鸣器"
    //% color=#B22222
    export function StopBuzzer(pin: PinEnum): void {
        switch (pin) {
            case PinEnum.portA:
                pins.digitalWritePin(DigitalPin.P15, 0);
                break;
            case PinEnum.portB:
                pins.digitalWritePin(DigitalPin.P13, 0);
                break;
            case PinEnum.portC:
                pins.digitalWritePin(DigitalPin.P14, 0);
                break;
            case PinEnum.portD:
                pins.digitalWritePin(DigitalPin.P10, 0);
                break;
        }
    }
}
