m5scroll.onEncoderChange(function (value, delta) {
    serial.writeLine("v: " + value + " d: " + delta)
})
m5scroll.onButton(function (pressed) {
    if (pressed) {
        m5scroll.setLEDColor(0xff0000)
    } else {
        m5scroll.setLEDColor(0x00ff00)
    }
})
m5scroll.turnLEDOff()
