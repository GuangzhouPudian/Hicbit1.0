/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
enum MotorEnum {
    //% block="1"
    portA = 3,
    //% block="2"
    portB = 4,
    //% block="3"
    portC = 1,
    //% block="4"
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

enum SensorEnum {
    //% block="5"
    portA = 1,
    //% block="6"
    portB = 2,
    //% block="7"
    portC = 3,
    //% block="8"
    portD = 4,
}

enum OnOffEnum {
    //% block="停止"
    off = 0,
    //% block="启动"
    on = 1,
}

enum DirectKeyEnum {
    //% block="上"
    up = 0,
    //% block="下"
    down = 1,
    //% block="左"
    left = 2,
    //% block="右"
    right = 3,
}

enum KeyEnum {
    //% block="A"
    keya = 0,
    //% block="B"
    keyb = 1,
}

enum LEDEnum {
    //% block="1"
    led1 = 0,
    //% block="2"
    led2 = 1,
    //% block="3"
    led3 = 2,
}

enum Dht11Result {
    //% block="摄氏度"
    Celsius,
    //% block="华氏度"
    Fahrenheit,
    //% block="湿度"
    humidity
}

enum RockerEnum {
    //% block="5"
    portA = 1,
}

enum RockerdirectEnum {
    //% blockId="Nostate" block="无"
    nostate = 0,
    //% blockId="Up" block="上"
    Up = 1,
    //% blockId="Down" block="下"
    Down = 2,
    //% blockId="Left" block="左"
    Left = 3,
    //% blockId="Right" block="右"
    Right = 4,
}

enum RockerXYEnum {
    //% block="X轴"
    x = 1,
    //% block="Y轴"
    y = 2,
}

enum IrButton {
    //% block="any"
    Any = -1,
    //% block="▲"
    Up = 24,
    //% block=" "
    Unused_2 = -2,
    //% block="◀"
    Left = 16,
    //% block="OK"
    Ok = 56,
    //% block="▶"
    Right = 90,
    //% block=" "
    Unused_3 = -3,
    //% block="▼"
    Down = 74,
    //% block=" "
    Unused_4 = -4,
    //% block="1"
    Number_1 = 162,
    //% block="2"
    Number_2 = 98,
    //% block="3"
    Number_3 = 226,
    //% block="4"
    Number_4 = 34,
    //% block="5"
    Number_5 = 2,
    //% block="6"
    Number_6 = 194,
    //% block="7"
    Number_7 = 224,
    //% block="8"
    Number_8 = 168,
    //% block="9"
    Number_9 = 144,
    //% block="*"
    Star = 104,
    //% block="0"
    Number_0 = 152,
    //% block="#"
    Hash = 176,
}

enum IrButtonAction {
    //% block="按下"
    Pressed = 0,
    //% block="松开"
    Released = 1,
}

enum IrProtocol {
    //% block="Keyestudio"
    Keyestudio = 0,
    //% block="NEC"
    NEC = 1,
}

/**
 * Custom blocks
 */
//% weight=100 color=#00CCFF icon="\uf2c5" block="海客智能套件"
//% groups='["主机", "电机", "蜂鸣器", "RGB彩灯", "超声波", "红外避障", "光敏", "温湿度", "旋钮", "声音", "碰撞", "循迹", "按键", "摇杆", "红外接收"]'
namespace hicbit {
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
        basic.pause(2000);
        let i: number;
        for (i = 1; i <= 4; i++) {
            SetMotorSpeed(i, 0);
        }
        ClearLCD(1, 7);
        SetLCDString(7, 1, "Loading Success!");
        basic.pause(1000);
        ClearLCD(7, 7);
    }

    //% row.min=1 row.max=7
    //% row.defl=1
    //% col.min=1 col.max=21
    //% col.defl=1
    //% weight=80 block="LCD|第%row行|第%col列|内容%dat"
    //% group="主机"
    //% color=#7CCD7C
    export function SetLCDString(row: number, col: number, str: string): void {
        let len = str.length;
        let buf = pins.createBuffer(len + 5);
        buf[0] = 0xfe;
        buf[1] = 0xc0;
        buf[2] = row + 1;
        buf[3] = (col - 1) * 6 + 1;
        for (let i = 0; i < len; i++)
            buf[i + 4] = str.charCodeAt(i);
        buf[len + 4] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(20);
    }

    //% row.min=1 row.max=7
    //% row.defl=1
    //% col.min=1 col.max=21
    //% col.defl=1
    //% weight=70 block="LCD|第%row行|第%col列|数值%dat"
    //% group="主机"
    //% color=#7CCD7C
    export function SetLCDData(row: number, col: number, dat: number): void {
        let str = dat.toString();
        let len = str.length;
        let buf = pins.createBuffer(len + 7);
        buf[0] = 0xfe;
        buf[1] = 0xc0;
        buf[2] = row + 1;
        buf[3] = (col - 1) * 6 + 1;
        for (let i = 0; i < len; i++)
            buf[i + 4] = str.charCodeAt(i);
        buf[len + 4] = 0x20;
        buf[len + 5] = 0x20;
        buf[len + 6] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(20);
    }

    //% row.min=1 row.max=7
    //% row.defl=1
    //% col.min=1 col.max=21
    //% col.defl=1
    //% weight=60 block="LCD|第%row行|第%col列|内容%str|数值%dat"
    //% inlineInputMode=inline
    //% group="主机"
    //% color=#7CCD7C
    export function SetLCD(row: number, col: number, str: string, dat: number): void {
        let s = dat.toString();
        str = str.concat(s);
        let len = str.length;
        let buf = pins.createBuffer(len + 7);
        buf[0] = 0xfe;
        buf[1] = 0xc0;
        buf[2] = row + 1;
        buf[3] = (col - 1) * 6 + 1;
        for (let i = 0; i < len; i++)
            buf[i + 4] = str.charCodeAt(i);
        buf[len + 4] = 0x20;
        buf[len + 5] = 0x20;
        buf[len + 6] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(20);
    }

    //% row1.min=1 row1.max=7
    //% row1.defl=1
    //% row2.min=1 row2.max=7
    //% row2.defl=7
    //% weight=50 block="清屏|第%row1行至第%row2行"
    //% group="主机"
    //% color=#7CCD7C
    export function ClearLCD(row1: number, row2: number): void {
        let buf = pins.createBuffer(5);
        row1 = row1 + 1;
        row2 = row2 + 1;
        buf[0] = 0xfe;
        buf[1] = 0xd0;
        buf[2] = row1;
        buf[3] = row2;
        if (row1 > row2) {
            buf[2] = row2;
            buf[3] = row1;
        }
        buf[4] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(100);
    }

    //% weight=40 block="方向键|%directkey按下"
    //% group="主机"
    //% color=#7CCD7C
    export function IsDirectKeyPress(directkey: DirectKeyEnum): boolean {
        let IsDirectKey: boolean = false;
        switch (directkey) {
            case DirectKeyEnum.up:
                pins.setPull(DigitalPin.P5, PinPullMode.PullUp);
                if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                    basic.pause(10);
                    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                        IsDirectKey = true;
                        while (pins.digitalReadPin(DigitalPin.P5) == 0);
                    }
                }
                break;
            case DirectKeyEnum.down:
                pins.setPull(DigitalPin.P9, PinPullMode.PullUp);
                if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                    basic.pause(10);
                    if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                        IsDirectKey = true;
                        while (pins.digitalReadPin(DigitalPin.P9) == 0);
                    }
                }
                break;
            case DirectKeyEnum.left:
                pins.setPull(DigitalPin.P11, PinPullMode.PullUp);
                if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                    basic.pause(10);
                    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                        IsDirectKey = true;
                        while (pins.digitalReadPin(DigitalPin.P11) == 0);
                    }
                }
                break;
            case DirectKeyEnum.right:
                pins.setPull(DigitalPin.P7, PinPullMode.PullUp);
                if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                    basic.pause(10);
                    if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                        IsDirectKey = true;
                        while (pins.digitalReadPin(DigitalPin.P7) == 0);
                    }
                }
                break;
        }
        return IsDirectKey;
    }

    //% weight=30 block="当方向键|%directkey按下时"
    //% group="主机"
    //% color=#7CCD7C
    export function OnDirectKeyPress(directkey: DirectKeyEnum, body: () => void) {
        control.inBackground(function () {
            while (true) {
                if (IsDirectKeyPress(directkey)) {
                    body();
                }
                basic.pause(10);
            }
        })
    }

    //% weight=90 block="按键|接口%pin|%keypress按下"
    //% group="按键"
    //% color=#C4281B     
    export function IsKeyPress(pin: SensorEnum, presskey: KeyEnum): boolean {
        let IsKeyPress: boolean = false;
        switch (pin) {
            case SensorEnum.portA:
                if (presskey == KeyEnum.keya) {
                    pins.setPull(DigitalPin.P0, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P0) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P0) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    pins.setPull(DigitalPin.P1, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P1) == 0);
                        }
                    }
                }
                break;
            case SensorEnum.portB:
                if (presskey == KeyEnum.keya) {
                    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P13) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    pins.setPull(DigitalPin.P2, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P2) == 0);
                        }
                    }
                }
                break;
            case SensorEnum.portC:
                if (presskey == KeyEnum.keya) {
                    pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P14) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    pins.setPull(DigitalPin.P3, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P3) == 0);
                        }
                    }
                }
                break;
            case SensorEnum.portD:
                if (presskey == KeyEnum.keya) {
                    pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P15) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    pins.setPull(DigitalPin.P4, PinPullMode.PullUp);
                    if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                        basic.pause(10);
                        if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P4) == 0);
                        }
                    }
                }
                break;
        }
        return IsKeyPress;
    }

    //% weight=90 block="按键|当接口%pin|%keypress按下时"
    //% group="按键"
    //% color=#C4281B  
    export function OnKeyPress(pin: SensorEnum, presskey: KeyEnum, body: () => void) {
        control.inBackground(function () {
            while (true) {
                if (IsKeyPress(pin, presskey)) {
                    body();
                }
                basic.pause(10);
            }
        })
    }

    //% direct.defl=DirectEnum.direct1
    //% speed.min=-100 speed.max=100
    //% weight=90 block="电机|接口%sn|速度%speed"
    //% group="电机"
    //% color=#5E9B9D
    export function SetMotorSpeed(sn: MotorEnum, speed: number): void {
        let direct: number = 0;
        let buf = pins.createBuffer(6);
        if (speed > 0) direct = 1;
        else if (speed < 0) {
            direct = 2;
            speed = Math.abs(speed);
        }
        buf[0] = 0xfe;
        buf[1] = 0xa0;
        buf[2] = sn;
        buf[3] = direct;
        if (speed == 0) buf[4] = 0;
        else buf[4] = 20 + Math.floor(speed * 0.65);
        buf[5] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(100);
    }

    //% direct.defl=DirectEnum.direct1
    //% angle.min=-360 angle.max=360
    //% weight=80 block="电机|接口%sn|角度%anelg"
    //% group="电机"
    //% color=#5E9B9D
    export function SetMotorAngle(sn: MotorEnum, angle: number): void {
        let direct: number = 0;
        let buf = pins.createBuffer(8);
        if (angle > 0) direct = 1;
        else if (angle < 0) {
            direct = 2;
            angle = Math.abs(angle);
        }
        else direct = 0;
        angle = angle * 5.2 - 12;
        buf[0] = 0xfe;
        buf[1] = 0xb0;
        buf[2] = sn;
        buf[3] = direct;
        buf[4] = 35;
        buf[5] = ((angle >> 8) & 0xff);
        buf[6] = (angle & 0xff);
        if (buf[6] == 0xef) buf[6] = 0xee;
        if (buf[6] == 0xfe) buf[6] = 0xff;
        buf[7] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(100);
    }

    //% weight=70 block="电机|接口%sn|停止"
    //% group="电机"
    //% color=#5E9B9D
    export function StopMotor(sn: MotorEnum): void {
        SetMotorSpeed(sn, 0);
    }

    //% weight=90 block="光敏|接口%pin|值(0~255)"
    //% group="光敏"
    //% color=#4B974A
    export function GetPhotoSensitiveValue(pin: SensorEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case SensorEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case SensorEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case SensorEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return 255 - Math.round(adValue);
    }

    //% weight=90 block="循迹|接口%pin|值(0~255)"
    //% group="循迹"
    //% color=#D7C599
    export function GetLineSensorValue(pin: SensorEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case SensorEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case SensorEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case SensorEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    //% weight=90  block="旋钮|接口%pin|值(0~255)"
    //% group="旋钮"
    //% color=#923978
    export function GetKnobValue(pin: SensorEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case SensorEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case SensorEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case SensorEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    //% weight=90 block="蜂鸣器|接口%pin|%act"
    //% group="蜂鸣器"
    //% color=#B22222
    export function StartBuzzer(pin: SensorEnum, act: OnOffEnum): void {
        switch (pin) {
            case SensorEnum.portA:
                pins.digitalWritePin(DigitalPin.P0, act);
                break;
            case SensorEnum.portB:
                pins.digitalWritePin(DigitalPin.P13, act);
                break;
            case SensorEnum.portC:
                pins.digitalWritePin(DigitalPin.P14, act);
                break;
            case SensorEnum.portD:
                pins.digitalWritePin(DigitalPin.P15, act);
                break;
        }
    }

    //% weight=90 block="声音|接口%pin|值(0~255)"
    //% group="声音"
    //% color=#F5CD2F
    export function GetSoundSensorValue(pin: SensorEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case SensorEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case SensorEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case SensorEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let n = 1000;
        let max = 0;
        let adValue = 0;
        for (let i = 0; i < n; i++) {
            let adValue = pins.analogReadPin(ADCPin);
            if (adValue > max) max = adValue;
        }
        return Math.round(max * 255 / 1023);
    }

    //% weight=90 block="碰撞|接口%pin|触发" 
    //% group="碰撞"
    //% color=#435493
    export function CollisionHappen(pin: SensorEnum): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (pin) {
            case SensorEnum.portA:
                pins.setPull(DigitalPin.P0, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P0);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P0);
                    if (status == 0) flag = true;
                }
                break;
            case SensorEnum.portB:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P13);
                    if (status == 0) flag = true;
                }
                break;
            case SensorEnum.portC:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P14);
                    if (status == 0) flag = true;
                }
                break;
            case SensorEnum.portD:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                if (status == 0) {
                    basic.pause(10);
                    status = pins.digitalReadPin(DigitalPin.P15);
                    if (status == 0) flag = true;
                }
                break;
        }
        return flag;
    }

    const MICROBIT_MAKERBIT_ULTRASONIC_OBJECT_DETECTED_ID = 798;
    const MAX_ULTRASONIC_TRAVEL_TIME = 300 * 58;
    const ULTRASONIC_MEASUREMENTS = 3;
    interface UltrasonicRoundTrip {
        ts: number;
        rtt: number;
    }
    interface UltrasonicDevice {
        trig: DigitalPin | undefined;
        roundTrips: UltrasonicRoundTrip[];
        medianRoundTrip: number;
        travelTimeObservers: number[];
    }
    let ultrasonicState: UltrasonicDevice;

    //% weight=98 block="超声波|接口%pin|距离(cm)"
    //% group="超声波"
    //% color=#8470FF
    export function GetUltrasonicValue(pin: SensorEnum): number {
        let trig: DigitalPin;
        let echo: DigitalPin;
        let dist: number;
        switch (pin) {
            case SensorEnum.portA:
                trig = DigitalPin.P0;
                echo = DigitalPin.P1;
                break;
            case SensorEnum.portB:
                trig = DigitalPin.P13;
                echo = DigitalPin.P2;
                break;
            case SensorEnum.portC:
                trig = DigitalPin.P14;
                echo = DigitalPin.P3;
                break;
            case SensorEnum.portD:
                trig = DigitalPin.P15;
                echo = DigitalPin.P4;
                break;
        }
        //第一次用来检测传感器是否插入
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);
        //dist = pins.pulseIn(echo, PulseValue.High, 300 * 58); //read pulse该方法准确性不高
        let begintime = input.runningTimeMicros();
        while (pins.digitalReadPin(echo) == 0) {
            if ((input.runningTimeMicros() - begintime) > 500) return 300; //未检测到传感器
        }
        basic.pause(100);
        //第二次测距
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);
        while (pins.digitalReadPin(echo) == 0);
        let starttime = input.runningTimeMicros();
        while (pins.digitalReadPin(echo) == 1);
        let endtime = input.runningTimeMicros();
        dist = Math.idiv((endtime - starttime), 58);
        if (dist > 300) dist = 0;
        return dist;
    }

    //% weight=90 block="温湿度|接口%pin|值%dhtResult"
    //% group="温湿度"
    //% color=#E29B3F
    export function GetDHT11value(pin: SensorEnum, dhtResult: Dht11Result): number {
        let Dht11Pin: DigitalPin;
        switch (pin) {
            case SensorEnum.portA:
                Dht11Pin = DigitalPin.P0;
                break;
            case SensorEnum.portB:
                Dht11Pin = DigitalPin.P13;
                break;
            case SensorEnum.portC:
                Dht11Pin = DigitalPin.P14;
                break;
            case SensorEnum.portD: 0;
                Dht11Pin = DigitalPin.P15;
                break;
        }
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        for (let i = 0; i < 40; i++) dataArray.push(false);
        for (let i = 0; i < 5; i++) resultArray.push(0);
        pins.digitalWritePin(Dht11Pin, 0); //begin protocol, pull down pin
        basic.pause(18);
        pins.digitalReadPin(Dht11Pin); //pull up pin
        pins.setPull(Dht11Pin, PinPullMode.PullUp); //pull up data pin if needed
        control.waitMicros(40);
        let currenttime = input.runningTimeMicros();
        while (pins.digitalReadPin(Dht11Pin) == 1) { //主机拉高等待从机响应
            if ((input.runningTimeMicros() - currenttime) > 100) return 0.1;//未插入退出
        }
        while (pins.digitalReadPin(Dht11Pin) == 0); //从机拉低
        while (pins.digitalReadPin(Dht11Pin) == 1); //从机拉高

        //read data (5 bytes)
        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(Dht11Pin) == 1);
            while (pins.digitalReadPin(Dht11Pin) == 0);
            control.waitMicros(28);
            //if sensor still pull up data pin after 28 us it means 1, otherwise 0
            if (pins.digitalReadPin(Dht11Pin) == 1) dataArray[i] = true;
        }
        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 8; j++)
                if (dataArray[8 * i + j]) resultArray[i] += 2 ** (7 - j);
        let humidity = resultArray[0] + resultArray[1] / 10;
        let temperature = resultArray[2] + resultArray[3] / 10;
        let fahrenheit = temperature * 9 / 5 + 32;
        basic.pause(1000);
        switch (dhtResult) {
            case Dht11Result.Celsius: return temperature;
            case Dht11Result.Fahrenheit: return fahrenheit;
            case Dht11Result.humidity: return humidity;
        }
    }

    //% weight=90 block="摇杆|接口%pin|方向%value"
    //% group="摇杆"
    //% color=#0D69AB
    export function ISRockerDirectPress(pin: RockerEnum, value: RockerdirectEnum): boolean {
        let ADCPin1: AnalogPin;
        let ADCPin2: AnalogPin;
        let x;
        let y;
        let flag: boolean = false;
        let now_state = RockerdirectEnum.nostate;
        ADCPin1 = AnalogPin.P0;
        ADCPin2 = AnalogPin.P1;
        /*switch (pin) {         
            case RockerEnum.portA:
                ADCPin1 = AnalogPin.P0;
                ADCPin2 = AnalogPin.P1;
                break;
            case RockerEnum.portB:
                ADCPin1 = AnalogPin.P13;
                ADCPin2 = AnalogPin.P2;
                break;
            case RockerEnum.portC:
                ADCPin1 = AnalogPin.P14;
                ADCPin2 = AnalogPin.P3;
                break;
            case RockerEnum.portD:
                ADCPin1 = AnalogPin.P15;
                ADCPin2 = AnalogPin.P4;
                break;
        }*/
        x = pins.analogReadPin(ADCPin1);//x轴模拟量获取
        y = pins.analogReadPin(ADCPin2);//y轴模拟量获取
        if (x < 100) now_state = RockerdirectEnum.Down;
        else if (x > 800) now_state = RockerdirectEnum.Up;
        else if (y < 100) now_state = RockerdirectEnum.Right;
        else if (y > 800) now_state = RockerdirectEnum.Left;
        if (now_state == value)
            flag = true;
        else
            flag = false;
        return flag;
    }

    //% weight=80 block="摇杆|当接口%pin|方向%value时"
    //% group="摇杆"
    //% color=#0D69AB
    export function OnRockerDirectPress(pin: RockerEnum, value: RockerdirectEnum, body: () => void) {
        control.inBackground(function () {
            while (true) {
                if (ISRockerDirectPress(pin, value)) {
                    body();
                }
                basic.pause(100);
            }
        })
    }

    //% weight=70 block="摇杆|接口%pin|%xy|值(0~255)"
    //% group="摇杆"
    //% color=#0D69AB
    export function GetRockerValue(pin: RockerEnum, xy: RockerXYEnum): number {
        let ADCPin1: AnalogPin;
        let ADCPin2: AnalogPin;
        let x;
        let y;
        ADCPin1 = AnalogPin.P0;
        ADCPin2 = AnalogPin.P1;
        /*switch (pin) {         
            case RockerEnum.portA:
                ADCPin1 = AnalogPin.P0;
                ADCPin2 = AnalogPin.P1;
                break;
            case RockerEnum.portB:
                ADCPin1 = AnalogPin.P13;
                ADCPin2 = AnalogPin.P2;
                break;
            case RockerEnum.portC:
                ADCPin1 = AnalogPin.P14;
                ADCPin2 = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin1 = AnalogPin.P15;
                ADCPin2 = AnalogPin.P4;
                break;
        }*/
        x = pins.analogReadPin(ADCPin1);//x轴模拟量获取
        y = pins.analogReadPin(ADCPin2);//y轴模拟量获取
        if (xy == RockerXYEnum.x) return Math.round(x * 255 / 1023);
        else if (xy == RockerXYEnum.y) return Math.round(y * 255 / 1023);
        return 0;
    }

    //% weight=90 block="红外避障|接口%pin|值(0~255)"
    //% group="红外避障"
    //% color=#DA8540
    export function GetIrValue(pin: SensorEnum): number {
        let ADCPin: AnalogPin;
        switch (pin) {
            case SensorEnum.portA:
                ADCPin = AnalogPin.P1;
                break;
            case SensorEnum.portB:
                ADCPin = AnalogPin.P2;
                break;
            case SensorEnum.portC:
                ADCPin = AnalogPin.P3;
                break;
            case SensorEnum.portD:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    const MICROBIT_MAKERBIT_IR_NEC = 777;
    const MICROBIT_MAKERBIT_IR_DATAGRAM = 778;
    const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789;
    const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790;
    const IR_REPEAT = 256;
    const IR_INCOMPLETE = 257;
    const IR_DATAGRAM = 258;

    interface IrState {
        protocol: IrProtocol;
        hasNewDatagram: boolean;
        bitsReceived: uint8;
        addressSectionBits: uint16;
        commandSectionBits: uint16;
        hiword: uint16;
        loword: uint16;
    }

    let irState: IrState;
    function appendBitToDatagram(bit: number): number {
        irState.bitsReceived += 1;

        if (irState.bitsReceived <= 8) {
            irState.hiword = (irState.hiword << 1) + bit;
            if (irState.protocol === IrProtocol.Keyestudio && bit === 1) {
                // recover from missing message bits at the beginning
                // Keyestudio address is 0 and thus missing bits can be detected
                // by checking for the first inverse address bit (which is a 1)
                irState.bitsReceived = 9;
                irState.hiword = 1;
            }
        } else if (irState.bitsReceived <= 16) {
            irState.hiword = (irState.hiword << 1) + bit;
        } else if (irState.bitsReceived <= 32) {
            irState.loword = (irState.loword << 1) + bit;
        }

        if (irState.bitsReceived === 32) {
            irState.addressSectionBits = irState.hiword & 0xffff;
            irState.commandSectionBits = irState.loword & 0xffff;
            return IR_DATAGRAM;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function decode(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            // low bit
            return appendBitToDatagram(0);
        } else if (markAndSpace < 2700) {
            // high bit
            return appendBitToDatagram(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            // Repeat detected
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            // Start detected
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            const status = decode(mark + space);

            if (status !== IR_INCOMPLETE) {
                control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, status);
            }
        });
    }

    //% weight=90 block="红外|接口%port|协议%protocol"
    //% group="红外接收"
    //% color=#A5995B
    export function connectIrReceiver(
        port: SensorEnum,
        protocol: IrProtocol
    ): void {
        let pin: DigitalPin;
        if (irState) {
            return;
        }

        switch (port) {
            case SensorEnum.portA:
                pin = DigitalPin.P0;
                break;
            case SensorEnum.portB:
                pin = DigitalPin.P13;
                break;
            case SensorEnum.portC:
                pin = DigitalPin.P14;
                break;
            case SensorEnum.portD:
                pin = DigitalPin.P15;
                break;
        }

        irState = {
            protocol: protocol,
            bitsReceived: 0,
            hasNewDatagram: false,
            addressSectionBits: 0,
            commandSectionBits: 0,
            hiword: 0, // TODO replace with uint32
            loword: 0,
        };

        enableIrMarkSpaceDetection(pin);

        let activeCommand = -1;
        let repeatTimeout = 0;
        const REPEAT_TIMEOUT_MS = 120;

        control.onEvent(
            MICROBIT_MAKERBIT_IR_NEC,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                const irEvent = control.eventValue();

                // Refresh repeat timer
                if (irEvent === IR_DATAGRAM || irEvent === IR_REPEAT) {
                    repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
                }

                if (irEvent === IR_DATAGRAM) {
                    irState.hasNewDatagram = true;
                    control.raiseEvent(MICROBIT_MAKERBIT_IR_DATAGRAM, 0);

                    const newCommand = irState.commandSectionBits >> 8;

                    // Process a new command
                    if (newCommand !== activeCommand) {
                        if (activeCommand >= 0) {
                            control.raiseEvent(
                                MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                                activeCommand
                            );
                        }

                        activeCommand = newCommand;
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID,
                            newCommand
                        );
                    }
                }
            }
        );

        control.inBackground(() => {
            while (true) {
                if (activeCommand === -1) {
                    // sleep to save CPU cylces
                    basic.pause(2 * REPEAT_TIMEOUT_MS);
                } else {
                    const now = input.runningTime();
                    if (now > repeatTimeout) {
                        // repeat timed out
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                        activeCommand = -1;
                    } else {
                        basic.pause(REPEAT_TIMEOUT_MS);
                    }
                }
            }
        });
    }

    //% weight=80 block="红外|当按键%button|%action时"
    //% group="红外接收"
    //% color=#A5995B
    export function onIrButton(
        button: IrButton,
        action: IrButtonAction,
        handler: () => void
    ) {
        control.onEvent(
            action === IrButtonAction.Pressed
                ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
                : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
            button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
            () => {
                handler();
            }
        );
    }


    //% weight=70 block="红外|接收值"
    //% group="红外接收"
    //% color=#A5995B
    export function irButton(): number {
        basic.pause(0); // Yield to support background processing when called in tight loops
        if (!irState) {
            return IrButton.Any;
        }
        //return irState.commandSectionBits >> 8;
        switch (irState.commandSectionBits >> 8) {
            case 162: return 1;
            case 98: return 2;
            case 226: return 3;
            case 34: return 4;
            case 2: return 5;
            case 194: return 6;
            case 224: return 7;
            case 168: return 8;
            case 144: return 9;
            case 104: return 10;
            case 152: return 0;
            case 176: return 11;
            case 24: return 12;
            case 16: return 13;
            case 56: return 14;
            case 90: return 15;
            case 74: return 16;
            default: return 255;
        }
    }

    /*//% block="on IR datagram received"
    //% group="红外接收"
    //% weight=60*/
    function onIrDatagram(handler: () => void) {
        control.onEvent(
            MICROBIT_MAKERBIT_IR_DATAGRAM,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                handler();
            }
        );
    }

    /*//% block="IR datagram"
    //% group="红外接收"
    //% weight=50*/
    function irDatagram(): string {
        basic.pause(0); // Yield to support background processing when called in tight loops
        if (!irState) {
            return "0x00000000";
        }
        return (
            "0x" +
            ir_rec_to16BitHex(irState.addressSectionBits) +
            ir_rec_to16BitHex(irState.commandSectionBits)
        );
    }

    /*//% block="IR data was received"
    //% group="红外接收"
    //% weight=40*/
    function IsIrDataReceived(): boolean {
        basic.pause(0); // Yield to support background processing when called in tight loops
        if (!irState) {
            return false;
        }
        if (irState.hasNewDatagram) {
            irState.hasNewDatagram = false;
            return true;
        } else {
            return false;
        }
    }

    /*//% block="IR button code %button"
    //% group="红外接收"
    //% weight=30*/
    function irButtonCode(button: IrButton): number {
        basic.pause(0); // Yield to support background processing when called in tight loops
        return button as number;
    }

    function ir_rec_to16BitHex(value: number): string {
        let hex = "";
        for (let pos = 0; pos < 4; pos++) {
            let remainder = value % 16;
            if (remainder < 10) {
                hex = remainder.toString() + hex;
            } else {
                hex = String.fromCharCode(55 + remainder) + hex;
            }
            value = Math.idiv(value, 16);
        }
        return hex;
    }

    let strip = pins.createBuffer(9);
    //let strip: Buffer=hex`000000 000000 000000`;
    //% weight=98 block="RGB彩灯|接口%pin|彩灯%light|红%red|绿%green|蓝%blue"
    //% inlineInputMode=inline
    //% group="RGB彩灯"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% color=#CD9B9B
    export function SetRGBLight(pin: SensorEnum, light: LEDEnum, red: number, green: number, blue: number) {
        strip[light * 3 + 0] = green;
        strip[light * 3 + 1] = red;
        strip[light * 3 + 2] = blue;
        switch (pin) {
            case SensorEnum.portA:
                sendBuffer(strip, DigitalPin.P0);
                break;
            case SensorEnum.portB:
                sendBuffer(strip, DigitalPin.P13);
                break;
            case SensorEnum.portC:
                sendBuffer(strip, DigitalPin.P14);
                break;
            case SensorEnum.portD:
                sendBuffer(strip, DigitalPin.P15);
                break;
        }
        basic.pause(100);
    }

    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }
    //% shim=setBufferMode
    function setBufferMode(pin: DigitalPin, mode: number) {
    }
}