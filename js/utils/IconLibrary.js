/**
 * @module utils/IconLibrary
 * @description Utilities for `IconLibrary`.
 *
 * @see module:main
 *
 * @example
 * import { IconLibrary } from './utils/IconLibrary.js';
 */

import { Rectangle } from '../shapes/Rectangle.js';
import { Circle } from '../shapes/Circle.js';
import { Cylinder } from '../shapes/Cylinder.js';
import { TextShape } from '../shapes/TextShape.js';
/**
 * Utility class `IconLibrary`.
 *
 * @class IconLibrary
 *
 * @example
 * const instance = new IconLibrary();
 */

export class IconLibrary {
    /**
     * Performs `createServerIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createServerIcon(x, y) {
        const group = [];

        // Server body
        const server = new Cylinder(x, y, 80, 100);
        server.fill = '#34495e';
        server.stroke = '#2c3e50';
        group.push(server);

        // Server lights
        for (let i = 0; i < 3; i++) {
            const light = new Circle(x + 10, y + 20 + i * 15, 8, 8);
            light.fill = '#27ae60';
            light.stroke = '#229954';
            group.push(light);
        }

        return group;
    }

    /**
     * Performs `createDatabaseIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createDatabaseIcon(x, y) {
        const group = [];

        // Database cylinder
        const db = new Cylinder(x, y, 70, 90);
        db.fill = '#3498db';
        db.stroke = '#2980b9';
        group.push(db);

        // DB label
        const label = new TextShape(x, y, 'DB');
        label.width = 70;
        label.height = 90;
        label.fill = '#ffffff';
        label.fontSize = 20;
        label.fontWeight = 'bold';
        group.push(label);

        return group;
    }

    /**
     * Performs `createUserIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createUserIcon(x, y) {
        const group = [];

        // Head
        const head = new Circle(x + 20, y, 40, 40);
        head.fill = '#e74c3c';
        head.stroke = '#c0392b';
        group.push(head);

        // Body
        const body = new Circle(x, y + 35, 60, 60);
        body.fill = '#e74c3c';
        body.stroke = '#c0392b';
        group.push(body);

        return group;
    }

    /**
     * Performs `createCloudIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createCloudIcon(x, y) {
        const group = [];

        // Cloud circles
        const circles = [
            { x: x + 30, y: y + 15, r: 20 },
            { x: x + 55, y: y + 10, r: 25 },
            { x: x + 80, y: y + 15, r: 20 },
            { x: x + 55, y: y + 30, r: 30 }
        ];

        circles.forEach(c => {
            const circle = new Circle(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2);
            circle.fill = '#ecf0f1';
            circle.stroke = '#bdc3c7';
            group.push(circle);
        });

        return group;
    }

    /**
     * Performs `createNetworkIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createNetworkIcon(x, y) {
        const group = [];

        // Network node positions
        const nodes = [
            { x: x + 40, y: y + 10 },
            { x: x + 10, y: y + 40 },
            { x: x + 70, y: y + 40 },
            { x: x + 40, y: y + 70 }
        ];

        // Create nodes
        nodes.forEach(node => {
            const circle = new Circle(node.x - 8, node.y - 8, 16, 16);
            circle.fill = '#9b59b6';
            circle.stroke = '#8e44ad';
            group.push(circle);
        });

        return group;
    }

    /**
     * Performs `createProcessIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createProcessIcon(x, y) {
        const rect = new Rectangle(x, y, 100, 60);
        rect.fill = '#16a085';
        rect.stroke = '#138d75';
        rect.cornerRadius = 5;

        const label = new TextShape(x, y, 'Process');
        label.width = 100;
        label.height = 60;
        label.fill = '#ffffff';
        label.fontSize = 14;
        label.fontWeight = 'bold';

        return [rect, label];
    }

    /**
     * Performs `createDecisionIcon`.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     */
    static createDecisionIcon(x, y) {
        // Note: Diamond needs to be imported dynamically or at module level
        const diamond = new Rectangle(x, y, 100, 80);
        diamond.fill = '#f39c12';
        diamond.stroke = '#e67e22';

        const label = new TextShape(x, y, '?');
        label.width = 100;
        label.height = 80;
        label.fill = '#ffffff';
        label.fontSize = 24;
        label.fontWeight = 'bold';

        return [diamond, label];
    }

    /**
     * Returns the `AllIcons` value.
     * @returns {*} Result value.
     */
    static getAllIcons() {
        return {
            'server': { name: 'Server', create: this.createServerIcon },
            'database': { name: 'Database', create: this.createDatabaseIcon },
            'user': { name: 'User', create: this.createUserIcon },
            'cloud': { name: 'Cloud', create: this.createCloudIcon },
            'network': { name: 'Network', create: this.createNetworkIcon },
            'process': { name: 'Process', create: this.createProcessIcon },
            'decision': { name: 'Decision', create: this.createDecisionIcon }
        };
    }
}
