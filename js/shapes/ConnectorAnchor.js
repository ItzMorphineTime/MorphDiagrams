/**
 * @module shapes/ConnectorAnchor
 * @description Universal connection point / junction. Exposes a single `anchor_point` anchor that accepts
 * any connection type in any direction, so it can be used as a waypoint hub, a patch point or a
 * "to be defined" endpoint. A connection type may optionally be pinned on it.
 *
 * @see module:core/Connector
 */

import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';

export class ConnectorAnchor extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(x, y, 16, 16);
        this.type = 'connector_anchor';
        this.fill = '#ffffff';
        this.stroke = '#2c3e50';
        this.strokeWidth = 2;
        /** @type {boolean} Anchors have a fixed size */
        this.resizable = false;
        /** @type {string|null} Pinned connection type, or null to accept anything */
        this.connectionType = null;
        /** @type {string} Anchors accept inputs and outputs */
        this.portType = 'both';
        this.label = '';
        this.labelPosition = 'above';
        this.labelFontSize = 11;
    }

    /**
     * Single wildcard anchor at the centre.
     * @returns {Object<string, AnchorPoint>}
     */
    getAnchorPoints() {
        const c = this.getCenter();
        return {
            anchor_point: {
                x: c.x,
                y: c.y,
                normal: null,
                connectionType: this.connectionType || null,
                portType: 'both',
                label: this.label || 'Anchor'
            }
        };
    }

    /**
     * The legacy default label "Anchor" is treated as "no label" so older files do not sprout captions.
     * @param {function(string, string): number} [measure]
     * @returns {Object|null}
     */
    getLabelLayout(measure) {
        if ((this.label || '').trim() === 'Anchor') return null;
        return super.getLabelLayout(measure);
    }

    /**
     * Draws the anchor as a ring with a centre dot (tinted by the pinned connection type).
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.visible) return;
        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        const c = this.getCenter();
        const radius = Math.abs(this.width) / 2;
        const tint = this.connectionType ? ConnectionTypeRegistry.colorFor(this.connectionType) : this.stroke;

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = tint;
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = tint;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }

    /** @returns {Object} */
    toJSON() {
        return {
            ...super.toJSON(),
            connectionType: this.connectionType,
            portType: this.portType
        };
    }
}
