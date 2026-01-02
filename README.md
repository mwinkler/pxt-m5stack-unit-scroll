# M5Stack Unit Scroll MakeCode Extension

A MakeCode PXT extension for the M5Stack Unit Scroll - a rotary encoder with integrated RGB LED and push button.

## Features

- **Rotary Encoder Control**: Read absolute and incremental encoder values
- **Push Button**: Get button status and event-driven button press/release detection
- **RGB LED**: Set LED color with color picker support
- **Event Handlers**: Single unified event system for button and encoder changes
- **I2C Communication**: Direct I2C communication with the device

## Supported Hardware

- M5Stack Unit Scroll (STM32F030)
- M5Stack Core and compatible boards
- Other M5Stack devices with I2C capability

## Quick Start

### Basic Usage

```typescript
// Read encoder position
let value = m5scroll.getEncoderValue()

// Check if button is pressed
if (m5scroll.getButtonStatus()) {
    // Button is pressed
}

// Set LED color
m5scroll.setLEDColor(0xFF0000)  // Red
```

### Event-Driven Usage

```typescript
// Handle button events
m5scroll.onButton((pressed: boolean) => {
    if (pressed) {
        console.log("Button pressed")
    } else {
        console.log("Button released")
    }
})

// Handle encoder changes
m5scroll.onEncoderChange((value: number, delta: number) => {
    console.log("Encoder value: " + value + " Delta: " + delta)
})
```

## API Reference

### Encoder Functions

- `getEncoderValue()`: Get the absolute encoder position (0-65535)
- `getIncEncoderValue()`: Get incremental encoder change since last read
- `setEncoderValue(value)`: Set encoder position (advanced)
- `resetEncoder()`: Reset encoder to zero (advanced)

### Button Functions

- `getButtonStatus()`: Get current button state (true = pressed)
- `onButton(handler)`: Register handler for button press/release events

### LED Functions

- `setLEDColor(color)`: Set RGB LED color using hex color value
- `turnLEDOff()`: Turn off the LED

### Event Handlers

- `onButton(handler)`: Called when button is pressed (true) or released (false)
- `onEncoderChange(handler)`: Called when encoder value changes, receives new value and delta change

## LED Colors

Set colors using hex values:

```typescript
m5scroll.setLEDColor(0xFF0000)  // Red
m5scroll.setLEDColor(0x00FF00)  // Green
m5scroll.setLEDColor(0x0000FF)  // Blue
m5scroll.setLEDColor(0xFFFF00)  // Yellow
m5scroll.setLEDColor(0xFF00FF)  // Magenta
m5scroll.setLEDColor(0x00FFFF)  // Cyan
m5scroll.setLEDColor(0xFFFFFF)  // White

// Or use the convenience function
m5scroll.turnLEDOff()  // Turn off LED
m5scroll.setLEDColor(0x000000)  // Off/Black
```

## Advanced

### I2C Address

Default I2C address is 0x40 (64 in decimal). The extension uses a single unified background control loop that monitors both button and encoder changes at 50ms intervals.

## Examples

### Volume Control with LED Feedback, delta: number) => {
    // Use encoder value as volume level
    let volume = Math.map(value, 0, 65535, 0, 100)
    console.log("Volume: " + volume + "%")
    console.log("Changed by: " + delta=> {
    // Use encoder value as volume level
    let volume = Math.map(value, 0, 65535, 0, 100)
    console.log("Volume: " + volume + "%")
    
    // Color LED based on volume
    if (volume < 33) {
        m5scroll.setLEDColor(0x00FF00)  // Green
    } else if (volume < 66) {
        m5scroll.setLEDColor(0xFFFF00)  // Yellow
    } else {
        m5scroll.setLEDColor(0xFF0000)  // Red
    }
})
```

### Button Click Detection

```typescript
m5scroll.onButtonturnLEDOff()  // Off when released
    }
})
```

### Directional Control Using Delta

```typescript
m5scroll.onEncoderChange((value: number, delta: number) => {
    if (delta > 0) {
        console.log("Turned clockwise by " + delta)
        m5scroll.setLEDColor(0x00FF00)  // Green for clockwise
    } else if (delta < 0) {
        console.log("Turned counter-clockwise by " + delta)
        m5scroll.setLEDColor(0xFF0000)  // Red for counter-clockwise
    if (pressed) {
        m5scroll.setLEDColor(0x0000FF)  // Blue when pressed
    } else {
        m5scroll.setLEDColor(0x00FF00)  // Green when released
    }
})
```

## License

MIT

## References

- [M5Stack Unit Scroll Documentation](https://docs.m5stack.com/en/unit/UNIT-Scroll)
- [M5Stack Reference Implementation](https://github.com/m5stack/M5Unit-Scroll)
- [M5Stack Official Site](https://m5stack.com/)
