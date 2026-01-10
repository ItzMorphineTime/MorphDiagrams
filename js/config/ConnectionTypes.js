/**
 * @module config/ConnectionTypes
 * @description Configuration constants for connection types, colors, and port types. Defines the available connection types (video, SDI, network, USB) and their associated colors, as well as default colors for system objects and port direction types.
 *
 * @remarks
 * - Connection types enable typed network diagrams with color-coded connections.
 * - Object colors provide default styling for system device shapes.
 * - Port types define input/output directionality for connection validation.
 *
 * @example
 * import { ConnectionTypes, ConnectionColors, ObjectColors } from './config/ConnectionTypes.js';
 * const connector = new Connector(start, 'right', end, 'left', ConnectionTypes.VIDEO);
 * connector.stroke = ConnectionColors.video; // '#FFD700'
 *
 * @see module:core/Connector
 * @see module:shapes/Server
 */

/**
 * Supported connection types for network diagram connectors.
 *
 * @readonly
 * @enum {string}
 */
export const ConnectionTypes = {
    /** Video connection type */
    VIDEO: 'video',
    /** SDI (Serial Digital Interface) connection type */
    SDI: 'sdi',
    /** Network/Ethernet connection type */
    NETWORK: 'network',
    /** USB connection type */
    USB: 'usb'
};

/**
 * Default colors for each connection type.
 *
 * Colors are used to visually distinguish different connection types on the canvas.
 *
 * @readonly
 * @enum {string}
 */
export const ConnectionColors = {
    /** Gold color for video connections */
    [ConnectionTypes.VIDEO]: '#FFD700',
    /** Orange red color for SDI connections */
    [ConnectionTypes.SDI]: '#FF4500',
    /** Dark turquoise color for network connections */
    [ConnectionTypes.NETWORK]: '#00CED1',
    /** Medium purple color for USB connections */
    [ConnectionTypes.USB]: '#9370DB'
};

/**
 * Default fill colors for system object types.
 *
 * Used to visually distinguish different device types on the canvas.
 *
 * @readonly
 * @enum {string}
 */
export const ObjectColors = {
    /** Dark blue-gray for server objects */
    SERVER: '#2C3E50',
    /** Green for network switch objects */
    NETWORK_SWITCH: '#27AE60',
    /** Red for video matrix objects */
    VIDEO_MATRIX: '#E74C3C',
    /** Orange for LED processor objects */
    LED_PROCESSOR: '#F39C12',
    /** Purple for sync generator objects */
    SYNC_GENERATOR: '#8E44AD'
};

/**
 * Port direction types for defining input/output ports.
 *
 * @readonly
 * @enum {string}
 */
export const PortTypes = {
    /** Input port direction */
    INPUT: 'input',
    /** Output port direction */
    OUTPUT: 'output'
};
