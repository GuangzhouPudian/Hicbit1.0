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
    //% block="彩灯1"
    led1 = 0,
    //% block="彩灯2"
    led2 = 1,
    //% block="彩灯3"
    led3 = 2,
}

enum IrButton {
    //% block="any"
    Any = -1,
    //% block="▲"
    Up = 0x62,
    //% block=" "
    Unused_2 = -2,
    //% block="◀"
    Left = 0x22,
    //% block="OK"
    Ok = 0x02,
    //% block="▶"
    Right = 0xc2,
    //% block=" "
    Unused_3 = -3,
    //% block="▼"
    Down = 0xa8,
    //% block=" "
    Unused_4 = -4,
    //% block="1"
    Number_1 = 0x68,
    //% block="2"
    Number_2 = 0x98,
    //% block="3"
    Number_3 = 0xb0,
    //% block="4"
    Number_4 = 0x30,
    //% block="5"
    Number_5 = 0x18,
    //% block="6"
    Number_6 = 0x7a,
    //% block="7"
    Number_7 = 0x10,
    //% block="8"
    Number_8 = 0x38,
    //% block="9"
    Number_9 = 0x5a,
    //% block="*"
    Star = 0x42,
    //% block="0"
    Number_0 = 0x4a,
    //% block="#"
    Hash = 0x52,
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
//% weight=100 color=#7CCD7C icon="" block="海客智能套件"
//% groups='["主机", "电机", "蜂鸣器", "RGB彩灯", "超声波", "红外测距", "光敏", "温湿度", "旋钮", "声音", "碰撞", "循迹", "按键", "摇杆", "红外接收"]'
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
        basic.pause(1500);
        let i: number;
        for (i = 1; i <= 4; i++){
            SetMotorSpeed(i, 0);
        }
        ClearLCD(2, 8);
        SetLCDString(8, "Loading Success!");
        basic.pause(1000);
        ClearLCD(8, 8);
    }

    //% sn.defl=RowEnum.row2
    //% weight=80 block="LCD|第%sn行|文本%str"
    //% group="主机"
    //% color=#7CCD7C
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
        basic.pause(100);
    }

    //% sn.defl=RowEnum.row2
    //% weight=70 block="LCD|第%sn行|数值%dat"
    //% group="主机"
    //% color=#7CCD7C
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
        basic.pause(100);
    }

    //% sn1.defl=RowEnum.row2
    //% sn2.defl=RowEnum.row8
    //% weight=60 block="清屏|第%sn1行至第%sn2行"
    //% group="主机"
    //% color=#7CCD7C
    export function ClearLCD(sn1: RowEnum, sn2: RowEnum): void {
        let buf = pins.createBuffer(10);
        if (sn1 > sn2) sn2 = sn1;
        buf[0] = 0xfe;
        buf[1] = 0xd0;
        buf[2] = sn1;
        buf[3] = sn2;
        buf[4] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(100);
    }

    //% weight=50 block="方向键|%directkey按下"
    //% group="主机"
    //% color=#7CCD7C
    export function IsDirectKeyPress(directkey: DirectKeyEnum): boolean {
        let IsKeyPress: boolean = false;
        switch(directkey){
            case DirectKeyEnum.up:
                if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                        IsKeyPress = true;
                        while (pins.digitalReadPin(DigitalPin.P5) == 0);
                    }
                }
                break;
            case DirectKeyEnum.down:
                if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                        IsKeyPress = true;
                        while (pins.digitalReadPin(DigitalPin.P9) == 0);
                    }
                }
                break;
            case DirectKeyEnum.left:
                if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                        IsKeyPress = true;
                        while (pins.digitalReadPin(DigitalPin.P11) == 0);
                    }
                }
                break;
            case DirectKeyEnum.right:
                if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                        IsKeyPress = true;
                        while (pins.digitalReadPin(DigitalPin.P7) == 0);
                    }
                }
                break;
        }
        return IsKeyPress;
    }

    //% weight=40 block="当方向键|%directkey按下时"
    //% group="主机"
    //% color=#7CCD7C
    export function whenDirectKeyPress(directkey: DirectKeyEnum, body: () => void): void {
        switch(directkey){
            case DirectKeyEnum.up:
                if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
                        body();
                        while (pins.digitalReadPin(DigitalPin.P5) == 0);
                    }
                }
                break;
            case DirectKeyEnum.down:
                if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P7) == 0) {
                        body();
                        while (pins.digitalReadPin(DigitalPin.P7) == 0);
                    }
                }
                break;
            case DirectKeyEnum.left:
                if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                        body();
                        while (pins.digitalReadPin(DigitalPin.P11) == 0);
                    }
                }
                break;
            case DirectKeyEnum.right:
                if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                    control.waitMicros(200);
                    if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                        body();
                        while (pins.digitalReadPin(DigitalPin.P9) == 0);
                    }
                }
                break;
        }
    }

    //% weight=90 block="按键|接口%pin|%keypress按下"
    //% group="按键"
    //% color=#C4281B     
    export function IsKeyPress(pin: PinEnum, presskey: KeyEnum): boolean {
        let IsKeyPress: boolean = false;
        switch(pin){
            case PinEnum.portA:
                if (presskey == KeyEnum.keya) {
                    if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P15) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P1) == 0);
                        }
                    }
                }
                break;
            case PinEnum.portB:
                if (presskey == KeyEnum.keya) {
                    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P13) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P2) == 0);
                        }
                    }
                }
                break;
            case PinEnum.portC:
                if (presskey == KeyEnum.keya) {
                    if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P14) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P3) == 0);
                        }
                    }
                }
                break;
            case PinEnum.portD:
                if (presskey == KeyEnum.keya) {
                    if (pins.digitalReadPin(DigitalPin.P10) == 0) {
                        control.waitMicros(200);
                        if (pins.digitalReadPin(DigitalPin.P10) == 0) {
                            IsKeyPress = true;
                            while (pins.digitalReadPin(DigitalPin.P10) == 0);
                        }
                    }
                }
                else if (presskey == KeyEnum.keyb) {
                    if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                        control.waitMicros(200);
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
    export function WhenKeyPress(pin: PinEnum, presskey: KeyEnum, body: () => void): void {
            switch(pin){
                case PinEnum.portA:
                    if (presskey == KeyEnum.keya) {
                        if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P15) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P15) == 0);
                            }
                        }
                    }
                    else if (presskey == KeyEnum.keyb) {
                        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P1) == 0);
                            }
                        }
                    }
                    break;
                case PinEnum.portB:
                    if (presskey == KeyEnum.keya) {
                        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P13) == 0);
                            }
                        }
                    }
                    else if (presskey == KeyEnum.keyb) {
                        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P2) == 0);
                            }
                        }
                    }
                    break;
                case PinEnum.portC:
                    if (presskey == KeyEnum.keya) {
                        if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P14) == 0);
                            }
                        }
                    }
                    else if (presskey == KeyEnum.keyb) {
                        if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P3) == 0);
                            }
                        }
                    }
                    break;
                case PinEnum.portD:
                    if (presskey == KeyEnum.keya) {
                        if (pins.digitalReadPin(DigitalPin.P10) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P10) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P10) == 0);
                            }
                        }
                    }
                    else if (presskey == KeyEnum.keyb) {
                        if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                            control.waitMicros(200);
                            if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                                body();
                                while (pins.digitalReadPin(DigitalPin.P4) == 0);
                            }
                        }
                    }
                    break;
            }
        }

    //% direct.defl=DirectEnum.direct1
    //% speed.min=-100 speed.max=100
    //% weight=90 block="电机|接口%sn|速度%speed"
    //% group="电机"
    //% color=#5E9B9D
    export function SetMotorSpeed(sn: MotorEnum, speed: number): void {
        let direct: number = 0;
        let buf = pins.createBuffer(10);
        if (speed > 0) direct = 1;
        else if (speed < 0) {
            direct = 2;
            speed = Math.abs(speed);
        }
        buf[0] = 0xfe;
        buf[1] = 0xa0;
        buf[2] = sn;
        buf[3] = direct;
        buf[4] = speed;
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
        let buf = pins.createBuffer(10);
        if (angle > 0) direct = 1;
        else if (angle < 0) {
            direct = 2;
            angle = Math.abs(angle);
        } 
        buf[0] = 0xfe;
        buf[1] = 0xb0;
        buf[2] = sn;
        buf[3] = direct;
        buf[4] = ((angle >> 8) & 0xff);
        buf[5] = (angle & 0xff);
        buf[6] = 0xef;
        serial.writeBuffer(buf);
        basic.pause(100);
    }

    //% weight=90 block="光敏|接口%pin|值(0~255)"
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

    //% weight=90 block="循迹|接口%pin|值(0~255)"
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

    //% weight=90  block="旋钮|接口%pin|值(0~255)"
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

    //% weight=90 block="蜂鸣器|接口%pin|%act"
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

    //% weight=90 block="声音|接口%pin|值(0~255)"
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

    //% weight=90 block="碰撞|接口%pin|触发" 
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

    //% weight=98 block="超声波|接口%pin|距离(mm)"
    //% group="超声波"
    //% color=#8470FF
    export function GetUltrasonicDistance(pin: PinEnum): number {
        let echoPin: DigitalPin;
        let trigPin: DigitalPin;
        let distance = 0;
        switch (pin) {
            case PinEnum.portA:
                echoPin = DigitalPin.P1;
                trigPin = DigitalPin.P15;
                break;
            case PinEnum.portB:
                echoPin = DigitalPin.P2;
                trigPin = DigitalPin.P13;
                break;
            case PinEnum.portC:
                echoPin = DigitalPin.P3;
                trigPin = DigitalPin.P14;
                break;
            case PinEnum.portD:
                echoPin = DigitalPin.P4;
                trigPin = DigitalPin.P10;
                break;
        }
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);

        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(100);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(20);
        pins.digitalWritePin(trigPin, 0);
        let time_echo_us = pins.pulseIn(echoPin, PulseValue.High, 60000);
        if ((time_echo_us < 60000) && (time_echo_us > 1)) {
            distance = time_echo_us * 17 / 100;//time_echo_us*340/2/1000(mm)
            //distance = Math.idiv(time_echo_us, 58)
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

    //% weight=98 block="温湿度|接口%pin|值%dhtResult"
    //% group="温湿度"
    //% pin_arg.fieldEditor="gridpicker" pin_arg.fieldOptions.columns=4
    //% pin_arg.fieldOptions.tooltips="false" pin_arg.fieldOptions.width="300"
    //% color=#E29B3F
    export function Get_DHT11_value(pin: PinEnum, dhtResult: Dht11Result): number {
        let pin_arg: DigitalPin;
        switch (pin) {
            case PinEnum.portA:
                pin_arg = DigitalPin.P15;
                break;
            case PinEnum.portB:
                pin_arg = DigitalPin.P13;
                break;
            case PinEnum.portC:
                pin_arg = DigitalPin.P14;
                break;
            case PinEnum.portD:0;
                pin_arg = DigitalPin.P10;
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
    let strip = pins.createBuffer(3);
    //% weight=98 block="RGB彩灯|接口%pin|彩灯%light|红%red|绿%green|蓝%blue"
    //% group="RGB彩灯"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% color=#CD9B9B
    export function SetRGBLight(pin: PinEnum, light: LEDEnum, red: number, green: number, blue: number) {
        let grb: number;
        grb = ((green & 0xFF) << 16) | ((red & 0xFF) << 8) | (blue & 0xFF);
        strip[light] = grb;
        switch (pin) {
            case PinEnum.portA:
                sendBuffer(strip, DigitalPin.P15);
                break;
            case PinEnum.portB:
                sendBuffer(strip, DigitalPin.P13);
                break;
            case PinEnum.portC:
                sendBuffer(strip, DigitalPin.P14);
                break;
            case PinEnum.portD:
                sendBuffer(strip, DigitalPin.P10);
                break;
        }
    }

    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }
    //% shim=setBufferMode
    function setBufferMode(pin: DigitalPin, mode: number) {
    }*/
  


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
        // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
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
        port: PinEnum,
        protocol: IrProtocol
    ): void {
        let pin: DigitalPin;
        if (irState) {
        return;
        }

        switch(port){
            case PinEnum.portA:
                pin = DigitalPin.P15;
                break;
            case PinEnum.portB:
                pin = DigitalPin.P13;
                break;
            case PinEnum.portC:
                pin = DigitalPin.P14;
            break;
            case PinEnum.portD:
                pin = DigitalPin.P10;
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
        return irState.commandSectionBits >> 8;
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
    function wasIrDataReceived(): boolean {
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
}