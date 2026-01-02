//% color="#0079B9" icon="\uf25d" block="M5 Scroll"
namespace m5scroll {
    // I2C address and registers
    const SCROLL_ADDR = 0x40;
    const ENCODER_REG = 0x10;
    const BUTTON_REG = 0x20;
    const RGB_LED_REG = 0x30;
    const RESET_REG = 0x40;
    const INC_ENCODER_REG = 0x50;
    const BOOTLOADER_VERSION_REG = 0xFC;
    const JUMP_TO_BOOTLOADER_REG = 0xFD;
    const FIRMWARE_VERSION_REG = 0xFE;
    const I2C_ADDRESS_REG = 0xFF;

    let _addr: number = SCROLL_ADDR;
    let _buttonState: boolean = false;
    let _onButtonHandler: (pressed: boolean) => void = null;
    let _previousEncoderValue: number = 0;
    let _onEncoderChangeHandler: (value: number, delta: number) => void = null;
    let _controlLoopStarted: boolean = false;

    /**
     * Write a byte to a register
     */
    function writeReg(reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(_addr, buf);
    }

    /**
     * Write multiple bytes to a register
     */
    function writeBytes(reg: number, data: Buffer): void {
        let buf = pins.createBuffer(data.length + 1);
        buf[0] = reg;
        for (let i = 0; i < data.length; i++) {
            buf[i + 1] = data[i];
        }
        pins.i2cWriteBuffer(_addr, buf);
    }

    /**
     * Read bytes from a register
     */
    function readBytes(reg: number, length: number): Buffer {
        pins.i2cWriteNumber(_addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadBuffer(_addr, length);
    }

    /**
     * Start the background control loop for button events
     */
    function startControlLoop(): void {
        if (_controlLoopStarted) {
            return;
        }
        _controlLoopStarted = true;
        control.inBackground(() => {
            while (true) {
                let currentState = getButtonStatus();
                
                // Detect state change from released to pressed
                if (currentState && !_buttonState) {
                    _buttonState = true;
                    if (_onButtonHandler) {
                        _onButtonHandler(true);
                    }
                }
                // Detect state change from pressed to released
                else if (!currentState && _buttonState) {
                    _buttonState = false;
                    if (_onButtonHandler) {
                        _onButtonHandler(false);
                    }
                }
                
                // Check for encoder value change
                let currentEncoderValue = getEncoderValue();
                if (currentEncoderValue != _previousEncoderValue) {
                    let delta = currentEncoderValue - _previousEncoderValue;
                    _previousEncoderValue = currentEncoderValue;
                    if (_onEncoderChangeHandler) {
                        _onEncoderChangeHandler(currentEncoderValue, delta);
                    }
                }
                
                basic.pause(50);
            }
        });
    }

    /**
     * Read the encoder value from the device
     * @return encoder value as a signed 16-bit integer
     */
    //% blockId=m5scroll_encoder_value
    //% block="encoder value"
    //% group="Encoder"
    //% weight=90
    //% blockGap=8
    export function getEncoderValue(): number {
        let buf = readBytes(ENCODER_REG, 2);
        return (buf[1] << 8) | buf[0];
    }

    /**
     * Read the incremental encoder value
     * @return incremental encoder value as a signed 16-bit integer
     */
    //% blockId=m5scroll_inc_encoder_value
    //% block="incremental encoder value"
    //% group="Encoder"
    //% weight=85
    //% blockGap=8
    //% advanced=true
    export function getIncEncoderValue(): number {
        let buf = readBytes(INC_ENCODER_REG, 2);
        return (buf[1] << 8) | buf[0];
    }

    /**
     * Get the status of the rotary encoder button
     * @return true if button is pressed, false otherwise
     */
    //% blockId=m5scroll_button_pressed
    //% block="button pressed"
    //% group="Button"
    //% weight=80
    //% blockGap=8
    export function getButtonStatus(): boolean {
        let buf = readBytes(BUTTON_REG, 1);
        return buf[0] == 0x00;
    }

    /**
     * Set the LED color
     * @param color RGB color value (0x000000 to 0xFFFFFF)
     */
    //% blockId=m5scroll_set_led_color
    //% group="LED"
    //% block="set LED color $color"
    //% color.shadow="colorNumberPicker"
    //% weight=75
    //% blockGap=8
    export function setLEDColor(color: number): void {
        let data = pins.createBuffer(4);
        data[0] = 0;
        data[1] = (color >> 16) & 0xFF;
        data[2] = (color >> 8) & 0xFF;
        data[3] = color & 0xFF;
        writeBytes(RGB_LED_REG, data);
    }

    /**
     * Turn off the LED
     */
    //% blockId=m5scroll_led_off
    //% group="LED"
    //% block="turn LED off"
    //% weight=70
    //% blockGap=8
    export function turnLEDOff(): void {
        setLEDColor(0x000000);
    }

    /**
     * Set the encoder value
     * @param value encoder value to set
     */
    //% group="Encoder"
    //% blockId=m5scroll_set_encoder_value
    //% block="set encoder value to $value"
    //% weight=65
    //% advanced=true
    //% blockGap=8
    export function setEncoderValue(value: number): void {
        let data = pins.createBuffer(2);
        data[0] = value & 0xFF;
        data[1] = (value >> 8) & 0xFF;
        writeBytes(ENCODER_REG, data);
    }

    /**
     * Reset the encoder value to zero
     */
    //% group="Encoder"
    //% blockId=m5scroll_reset_encoder
    //% block="reset encoder"
    //% weight=60
    //% advanced=true
    //% blockGap=8
    export function resetEncoder(): void {
        writeReg(RESET_REG, 1);
    }

    /**
     * Register handler for button events
     * @param handler code to run when button state changes, receives true when pressed, false when released
     */
    //% blockId=m5scroll_on_button
    //% block="on button $pressed"
    //% group="Button"
    //% draggableParameters="reporter"
    //% weight=55
    //% blockGap=8
    export function onButton(handler: (pressed: boolean) => void): void {
        _onButtonHandler = handler;
        startControlLoop();
    }

    /**
     * Register handler for encoder value changes and delta change
     */
    //% blockId=m5scroll_on_encoder_change
    //% block="on encoder value $value delta $delta"
    //% group="Encoder"
    //% draggableParameters="reporter"
    //% weight=50
    //% blockGap=8
    export function onEncoderChange(handler: (value: number, delta: number) => void): void {
        _onEncoderChangeHandler = handler;
        startControlLoop();
    }
}
