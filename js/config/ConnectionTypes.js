// Connection types and their default colors
export const ConnectionTypes = {
    VIDEO: 'video',
    SDI: 'sdi',
    NETWORK: 'network',
    USB: 'usb'
};

// Default colors for each connection type
export const ConnectionColors = {
    [ConnectionTypes.VIDEO]: '#FFD700',      // Gold
    [ConnectionTypes.SDI]: '#FF4500',        // Orange Red
    [ConnectionTypes.NETWORK]: '#00CED1',    // Dark Turquoise
    [ConnectionTypes.USB]: '#9370DB'         // Medium Purple
};

// Default colors for custom objects
export const ObjectColors = {
    SERVER: '#2C3E50',           // Dark blue-gray
    NETWORK_SWITCH: '#27AE60',   // Green
    VIDEO_MATRIX: '#E74C3C',     // Red
    LED_PROCESSOR: '#F39C12',    // Orange
    SYNC_GENERATOR: '#8E44AD'    // Purple
};

// Port configuration
export const PortTypes = {
    INPUT: 'input',
    OUTPUT: 'output'
};
