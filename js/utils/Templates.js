/**
 * @fileoverview Pre-configured diagram templates for quick start.
 * Provides factory methods for creating common diagram layouts including
 * flowcharts, org charts, network diagrams, and system diagrams.
 */

import { Rectangle } from '../shapes/Rectangle.js';
import { TextShape } from '../shapes/TextShape.js';
import { Connector } from '../core/Connector.js';
import { IconLibrary } from './IconLibrary.js';
import { Server } from '../shapes/Server.js';
import { VideoMatrix } from '../shapes/VideoMatrix.js';
import { SyncGenerator } from '../shapes/SyncGenerator.js';
import { LEDProcessor } from '../shapes/LEDProcessor.js';
import { NetworkSwitch } from '../shapes/NetworkSwitch.js';
import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';
import { Diagram } from '../core/Diagram.js';

/**
 * Provides static methods for creating pre-configured diagram templates.
 * Each template returns an object with a name and an array of shape/connector objects.
 * @class Templates
 */
export class Templates {
    /**
     * Creates a basic flowchart template with start, process, decision, and end nodes.
     * @static
     * @returns {{name: string, objects: Array}} Template with flowchart shapes and connectors
     */
    static createBasicFlowchart() {
        const objects = [];

        // Start
        const start = new Rectangle(200, 50, 120, 60);
        start.fill = '#27ae60';
        start.cornerRadius = 30;
        objects.push(start);

        const startText = new TextShape(200, 50, 'Start');
        startText.width = 120;
        startText.height = 60;
        startText.fill = '#ffffff';
        objects.push(startText);

        // Process 1
        const process1 = new Rectangle(200, 150, 120, 60);
        process1.fill = '#3498db';
        objects.push(process1);

        const process1Text = new TextShape(200, 150, 'Process');
        process1Text.width = 120;
        process1Text.height = 60;
        process1Text.fill = '#ffffff';
        objects.push(process1Text);

        // Process 2
        const process2 = new Rectangle(200, 250, 120, 60);
        process2.fill = '#3498db';
        objects.push(process2);

        const process2Text = new TextShape(200, 250, 'Process');
        process2Text.width = 120;
        process2Text.height = 60;
        process2Text.fill = '#ffffff';
        objects.push(process2Text);

        // End
        const end = new Rectangle(200, 350, 120, 60);
        end.fill = '#e74c3c';
        end.cornerRadius = 30;
        objects.push(end);

        const endText = new TextShape(200, 350, 'End');
        endText.width = 120;
        endText.height = 60;
        endText.fill = '#ffffff';
        objects.push(endText);

        // Connectors
        const conn1 = new Connector(start, 'bottom', process1, 'top');
        const conn2 = new Connector(process1, 'bottom', process2, 'top');
        const conn3 = new Connector(process2, 'bottom', end, 'top');

        objects.push(conn1, conn2, conn3);

        return { name: 'Basic Flowchart', objects };
    }

    static createThreeTierArchitecture() {
        const objects = [];

        // Presentation Layer
        const pres = new Rectangle(50, 100, 150, 100);
        pres.fill = '#3498db';
        objects.push(pres);

        const presText = new TextShape(50, 100, 'Presentation\nLayer');
        presText.width = 150;
        presText.height = 100;
        presText.fill = '#ffffff';
        objects.push(presText);

        // Business Layer
        const business = new Rectangle(250, 100, 150, 100);
        business.fill = '#27ae60';
        objects.push(business);

        const businessText = new TextShape(250, 100, 'Business\nLogic');
        businessText.width = 150;
        businessText.height = 100;
        businessText.fill = '#ffffff';
        objects.push(businessText);

        // Data Layer
        const data = new Rectangle(450, 100, 150, 100);
        data.fill = '#e67e22';
        objects.push(data);

        const dataText = new TextShape(450, 100, 'Data\nLayer');
        dataText.width = 150;
        dataText.height = 100;
        dataText.fill = '#ffffff';
        objects.push(dataText);

        // Connectors
        const conn1 = new Connector(pres, 'right', business, 'left');
        const conn2 = new Connector(business, 'right', data, 'left');
        conn1.arrowEnd = true;
        conn1.arrowStart = true;
        conn2.arrowEnd = true;
        conn2.arrowStart = true;

        objects.push(conn1, conn2);

        return { name: '3-Tier Architecture', objects };
    }

    static createNetworkDiagram() {
        const objects = [];

        // Using icon library
        const server = IconLibrary.createServerIcon(100, 50);
        const db = IconLibrary.createDatabaseIcon(300, 50);
        const users = [
            IconLibrary.createUserIcon(50, 200),
            IconLibrary.createUserIcon(150, 200),
            IconLibrary.createUserIcon(250, 200)
        ];

        objects.push(...server, ...db);
        users.forEach(user => objects.push(...user));

        return { name: 'Network Diagram', objects };
    }

    static createOrgChart() {
        const objects = [];

        // CEO
        const ceo = new Rectangle(250, 50, 100, 60);
        ceo.fill = '#8e44ad';
        objects.push(ceo);

        const ceoText = new TextShape(250, 50, 'CEO');
        ceoText.width = 100;
        ceoText.height = 60;
        ceoText.fill = '#ffffff';
        objects.push(ceoText);

        // Managers
        const positions = [
            { x: 100, y: 150, title: 'CTO' },
            { x: 250, y: 150, title: 'CFO' },
            { x: 400, y: 150, title: 'COO' }
        ];

        positions.forEach(pos => {
            const box = new Rectangle(pos.x, pos.y, 100, 60);
            box.fill = '#3498db';
            objects.push(box);

            const text = new TextShape(pos.x, pos.y, pos.title);
            text.width = 100;
            text.height = 60;
            text.fill = '#ffffff';
            objects.push(text);

            const conn = new Connector(ceo, 'bottom', box, 'top');
            objects.push(conn);
        });

        return { name: 'Organization Chart', objects };
    }

    static createSystemDiagram() {
        const objects = [];

        // Create Sync Generator with ports: SDI[2,4] - Left, top
        const syncGen = new SyncGenerator(230, 50, 100, 100);
        syncGen.label = 'Sync Gen';
        syncGen.ports = {
            sdi: { input: 2, output: 4 }
        };
        objects.push(syncGen);

        // Create Network Switch with ports: Network[6,6] - Left, bottom
        const networkSwitch = new NetworkSwitch(230, 350, 100, 100);
        networkSwitch.label = 'Switch';
        networkSwitch.ports = {
            network: { input: 6, output: 6 }
        };
        objects.push(networkSwitch);

        // Create Server with ports: Video[0,4], SDI[1,0], Network[2,0], USB[4,0] - Center left
        const server = new Server(500, 200, 120, 180);
        server.label = 'Media Server';
        server.ports = {
            video: { input: 0, output: 4 },
            sdi: { input: 1, output: 0 },
            network: { input: 2, output: 0 },
            usb: { input: 4, output: 0 }
        };
        objects.push(server);

        // Create Video Matrix with ports: Video[4,4], SDI[1,4] - Center right
        const videoMatrix = new VideoMatrix(950, 200, 120, 180);
        videoMatrix.label = 'Video Matrix';
        videoMatrix.ports = {
            video: { input: 4, output: 4 },
            sdi: { input: 1, output: 4 }
        };
        objects.push(videoMatrix);

        // Create LED Processor with ports: Video[4,1], SDI[1,0] - Far right
        const ledProcessor = new LEDProcessor(1250, 50, 120, 100);
        ledProcessor.label = 'LED Processor';
        ledProcessor.ports = {
            video: { input: 4, output: 1 },
            sdi: { input: 1, output: 0 }
        };
        objects.push(ledProcessor);

        const ConnectionColors = {
            video: ConnectionTypeRegistry.colorFor('video'),
            sdi: ConnectionTypeRegistry.colorFor('sdi'),
            network: ConnectionTypeRegistry.colorFor('network'),
            usb: ConnectionTypeRegistry.colorFor('usb')
        };

        // Connect Sync Generator SDI outputs to Server, Video Matrix, and LED Processor SDI inputs
        // Sync Gen output 0 -> Server SDI input 0
        const conn1 = new Connector(syncGen, 'sdi_output_0', server, 'sdi_input_0', 'sdi');
        conn1.style = 'orthogonal';
        conn1.stroke = ConnectionColors.sdi;
        objects.push(conn1);

        // Sync Gen output 1 -> Video Matrix SDI input 0
        const conn2 = new Connector(syncGen, 'sdi_output_1', videoMatrix, 'sdi_input_0', 'sdi');
        conn2.style = 'orthogonal';
        conn2.stroke = ConnectionColors.sdi;
        objects.push(conn2);

        // Sync Gen output 2 -> LED Processor SDI input 0
        const conn3 = new Connector(syncGen, 'sdi_output_2', ledProcessor, 'sdi_input_0', 'sdi');
        conn3.style = 'orthogonal';
        conn3.stroke = ConnectionColors.sdi;
        objects.push(conn3);

        // Connect Server Video outputs to Video Matrix Video inputs
        // Server video output 0 -> Video Matrix video input 0
        const conn4 = new Connector(server, 'video_output_0', videoMatrix, 'video_input_0', 'video');
        conn4.style = 'orthogonal';
        conn4.stroke = ConnectionColors.video;
        objects.push(conn4);

        // Server video output 1 -> Video Matrix video input 1
        const conn5 = new Connector(server, 'video_output_1', videoMatrix, 'video_input_1', 'video');
        conn5.style = 'orthogonal';
        conn5.stroke = ConnectionColors.video;
        objects.push(conn5);

        // Connect Video Matrix Video outputs to LED Processor Video inputs
        // Video Matrix video output 0 -> LED Processor video input 0
        const conn6 = new Connector(videoMatrix, 'video_output_0', ledProcessor, 'video_input_0', 'video');
        conn6.style = 'orthogonal';
        conn6.stroke = ConnectionColors.video;
        objects.push(conn6);

        // Video Matrix video output 1 -> LED Processor video input 1
        const conn7 = new Connector(videoMatrix, 'video_output_1', ledProcessor, 'video_input_1', 'video');
        conn7.style = 'orthogonal';
        conn7.stroke = ConnectionColors.video;
        objects.push(conn7);

        // Connect Network Switch output to Server Network input
        // Network Switch output 0 -> Server network input 0
        const conn8 = new Connector(networkSwitch, 'network_output_0', server, 'network_input_0', 'network');
        conn8.style = 'orthogonal';
        conn8.stroke = ConnectionColors.network;
        objects.push(conn8);

        return { name: 'System Diagram', objects };
    }

    /**
     * Extra-large virtual production LED volume: 10 render servers (2 outputs each) and a video matrix
     * feeding 4 LED processors, 4 LED distros and 4 wall sections; 4 control machines on 2 KVMs;
     * a core switch with 4 separated VLANs (render, tracking, control/management, media & camera);
     * 10 tracking cameras and a tracking server; a show camera with genlock; 2 comfort monitors;
     * 4 PDUs. Everything is wired through typed ports so the signal path can be traced.
     * @static
     * @returns {{name: string, objects: Array}}
     */
    static createVirtualProductionVolume() {
        const d = new Diagram();
        const add = (type, props) => d.createShape(type, props);
        const link = (from, to, connectionType, extra = {}) => d.connect({ from, to, connectionType, ...extra });
        const netIn = n => ({ network: { input: n, output: 0 } });

        // --- Column A: sync, show camera, tracking cameras ------------------------------------
        const sync = add('sync_generator', { id: 'vp_sync', label: 'Sync Generator', x: 60, y: 60, width: 140, height: 320,
            ports: { sdi: { input: 0, output: 16 } }, description: 'Tri-level sync / genlock reference for servers, camera, matrix and LED processors' });
        const showCam = add('camera', { id: 'vp_show_cam', label: 'Show Camera (Cine)', x: 60, y: 420, width: 130, height: 90,
            ports: { sdi: { input: 1, output: 2 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } },
            description: 'Genlocked cinema camera; SDI program feed to the matrix, tracking data via the tracking system' });
        const trackingCams = [];
        for (let i = 1; i <= 10; i++) {
            trackingCams.push(add('camera', { id: `vp_track_cam_${i}`, label: `Tracking Cam ${i}`, x: 60, y: 560 + (i - 1) * 80, width: 120, height: 60,
                ports: netIn(1), description: 'PoE optical tracking camera' }));
        }

        // --- Column B: render servers, control machines, tracking server, PDU A ----------------
        const servers = [];
        for (let i = 1; i <= 10; i++) {
            servers.push(add('server', { id: `vp_render_${i}`, label: `Render ${i}`, x: 400, y: 60 + (i - 1) * 100, width: 130, height: 80,
                ports: { video: { input: 0, output: 2 }, sdi: { input: 1, output: 0 }, network: { input: 2, output: 0 }, power: { input: 1, output: 0 } },
                description: 'Render node: 2 genlocked video outputs, render + management VLANs' }));
        }
        const controls = [];
        for (let i = 1; i <= 4; i++) {
            controls.push(add('device', { id: `vp_control_${i}`, label: `Control ${i}`, x: 400, y: 1100 + (i - 1) * 100, width: 130, height: 80,
                ports: { video: { input: 0, output: 1 }, usb: { input: 1, output: 0 }, network: { input: 2, output: 0 }, power: { input: 1, output: 0 } },
                description: 'Operator / brain-bar workstation reached through the KVM' }));
        }
        const trackingServer = add('server', { id: 'vp_tracking_server', label: 'Tracking Server', x: 400, y: 1540, width: 130, height: 80,
            ports: { network: { input: 2, output: 0 }, power: { input: 1, output: 0 } },
            description: 'Solves camera tracking and publishes it to the render nodes' });

        // --- Column C: core switch + 4 VLAN switches ------------------------------------------
        const switchPorts = (outputs) => ({ network: { input: 2, output: outputs }, fibre: { input: 1, output: 0 }, power: { input: 1, output: 0 } });
        const core = add('network_switch', { id: 'vp_core', label: 'Core Switch', x: 740, y: 60, width: 160, height: 220,
            ports: { fibre: { input: 0, output: 4 }, power: { input: 1, output: 0 } }, description: 'Fibre trunks to the four VLAN switches' });
        const vlanRender = add('network_switch', { id: 'vp_vlan10', label: 'VLAN 10 · Render', x: 740, y: 320, width: 170, height: 320,
            ports: switchPorts(12), description: 'Render traffic (servers, tracking data in)' });
        const vlanControl = add('network_switch', { id: 'vp_vlan30', label: 'VLAN 30 · Control & Mgmt', x: 740, y: 680, width: 170, height: 420,
            ports: switchPorts(28), description: 'Out-of-band management and control' });
        const vlanTracking = add('network_switch', { id: 'vp_vlan20', label: 'VLAN 20 · Tracking', x: 740, y: 1140, width: 170, height: 260,
            ports: switchPorts(12), description: 'PoE tracking cameras and tracking server' });
        const vlanMedia = add('network_switch', { id: 'vp_vlan40', label: 'VLAN 40 · Media & Camera', x: 740, y: 1440, width: 170, height: 200,
            ports: switchPorts(8), description: 'Show camera control, comfort monitors, operator media' });

        // --- Column D: video matrix, KVMs ---------------------------------------------------
        const matrix = add('video_matrix', { id: 'vp_matrix', label: 'Video Matrix', x: 1100, y: 60, width: 170, height: 480,
            ports: { video: { input: 20, output: 12 }, sdi: { input: 2, output: 2 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } },
            description: '20 render inputs → LED processors and comfort monitors' });
        const kvmA = add('kvm', { id: 'vp_kvm_a', label: 'KVM A (Brain Bar)', x: 1100, y: 1100, width: 150, height: 120,
            ports: { video: { input: 2, output: 1 }, usb: { input: 1, output: 2 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } } });
        const kvmB = add('kvm', { id: 'vp_kvm_b', label: 'KVM B (Operators)', x: 1100, y: 1260, width: 150, height: 120,
            ports: { video: { input: 2, output: 1 }, usb: { input: 1, output: 2 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } } });

        // --- Column E: LED processors, comfort monitors ---------------------------------------
        const processors = [];
        for (let i = 1; i <= 4; i++) {
            processors.push(add('led_processor', { id: `vp_proc_${i}`, label: `LED Processor ${i}`, x: 1440, y: 60 + (i - 1) * 140, width: 150, height: 110,
                ports: { video: { input: 2, output: 4 }, sdi: { input: 1, output: 0 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } } }));
        }
        const monitors = [];
        for (let i = 1; i <= 2; i++) {
            monitors.push(add('monitor', { id: `vp_monitor_${i}`, label: `Comfort Monitor ${i}`, x: 1440, y: 720 + (i - 1) * 140, width: 140, height: 100,
                ports: { video: { input: 1, output: 0 }, sdi: { input: 1, output: 0 }, network: { input: 1, output: 0 }, power: { input: 1, output: 0 } },
                description: 'Program / camera return for director and talent' }));
        }

        // --- Columns F/G: LED distros and wall sections --------------------------------------
        const wallNames = ['LED Wall · Main', 'LED Wall · Ceiling', 'Wild Wall · SL', 'Wild Wall · SR'];
        const distros = [];
        const walls = [];
        for (let i = 1; i <= 4; i++) {
            distros.push(add('led_distro', { id: `vp_distro_${i}`, label: `LED Distro ${i} (XD)`, x: 1780, y: 60 + (i - 1) * 170, width: 140, height: 150,
                ports: { video: { input: 2, output: 4 }, power: { input: 1, output: 4 } } }));
            walls.push(add('device', { id: `vp_wall_${i}`, label: wallNames[i - 1], x: 2120, y: 60 + (i - 1) * 170, width: 170, height: 150,
                fill: '#1B2631', ports: { video: { input: 2, output: 0 }, power: { input: 2, output: 0 } }, description: 'LED panel section (data + power from the distro)' }));
        }

        // --- Power row ---------------------------------------------------------------------
        const pduPorts = n => ({ power: { input: 1, output: n }, network: { input: 1, output: 0 } });
        const pduA = add('power_supply', { id: 'vp_pdu_a', label: 'PDU A (Render 1–5)', x: 400, y: 1740, width: 130, height: 170, ports: pduPorts(8) });
        const pduB = add('power_supply', { id: 'vp_pdu_b', label: 'PDU B (Render 6–10)', x: 740, y: 1740, width: 130, height: 170, ports: pduPorts(8) });
        const pduC = add('power_supply', { id: 'vp_pdu_c', label: 'PDU C (Network & Processing)', x: 1100, y: 1740, width: 130, height: 170, ports: pduPorts(12) });
        const pduD = add('power_supply', { id: 'vp_pdu_d', label: 'PDU D (Display & Camera)', x: 1440, y: 1740, width: 130, height: 170, ports: pduPorts(8) });

        // --- Genlock ---------------------------------------------------------------------
        servers.forEach(s => link(sync, s, 'sdi'));
        link(sync, showCam, 'sdi', { label: 'Genlock' });
        link(sync, matrix, 'sdi');
        processors.forEach(p => link(sync, p, 'sdi'));

        // --- Video path ------------------------------------------------------------------
        servers.forEach(s => { link(s, matrix, 'video'); link(s, matrix, 'video'); });
        processors.forEach(p => { link(matrix, p, 'video'); link(matrix, p, 'video'); });
        monitors.forEach(m => link(matrix, m, 'video'));
        link(showCam, matrix, 'sdi', { label: 'Program' });
        monitors.forEach(m => link(matrix, m, 'sdi', { label: 'Cam return' }));
        processors.forEach((p, i) => { link(p, distros[i], 'video'); link(p, distros[i], 'video'); });
        distros.forEach((x, i) => { link(x, walls[i], 'video'); link(x, walls[i], 'video'); link(x, walls[i], 'power'); link(x, walls[i], 'power'); });

        // --- Networks --------------------------------------------------------------------
        [vlanRender, vlanControl, vlanTracking, vlanMedia].forEach(sw => link(core, sw, 'fibre', { label: 'Trunk' }));
        servers.forEach(s => { link(vlanRender, s, 'network'); link(vlanControl, s, 'network'); });
        link(vlanRender, trackingServer, 'network');
        link(vlanTracking, trackingServer, 'network');
        trackingCams.forEach(c => link(vlanTracking, c, 'network'));
        controls.forEach(c => { link(vlanControl, c, 'network'); link(vlanMedia, c, 'network'); });
        [kvmA, kvmB, matrix, ...processors, pduA, pduB, pduC, pduD].forEach(dev => link(vlanControl, dev, 'network'));
        link(vlanMedia, showCam, 'network');
        monitors.forEach(m => link(vlanMedia, m, 'network'));

        // --- KVM -------------------------------------------------------------------------
        [[kvmA, [controls[0], controls[1]]], [kvmB, [controls[2], controls[3]]]].forEach(([kvm, machines]) => {
            machines.forEach(m => { link(m, kvm, 'video'); link(kvm, m, 'usb'); });
        });

        // --- Power -----------------------------------------------------------------------
        [...servers.slice(0, 5), controls[0], controls[1]].forEach(dev => link(pduA, dev, 'power'));
        [...servers.slice(5), controls[2], controls[3]].forEach(dev => link(pduB, dev, 'power'));
        [core, vlanRender, vlanControl, vlanTracking, vlanMedia, matrix, ...processors, kvmA, kvmB].forEach(dev => link(pduC, dev, 'power'));
        [...distros, ...monitors, showCam, trackingServer].forEach(dev => link(pduD, dev, 'power'));

        return { name: 'XL Virtual Production LED Volume', objects: d.objects };
    }

    static getAllTemplates() {
        return [
            { id: 'flowchart', name: 'Basic Flowchart', create: this.createBasicFlowchart },
            { id: 'three-tier', name: '3-Tier Architecture', create: this.createThreeTierArchitecture },
            { id: 'network', name: 'Network Diagram', create: this.createNetworkDiagram },
            { id: 'org-chart', name: 'Organization Chart', create: this.createOrgChart },
            { id: 'system-diagram', name: 'System Diagram', create: this.createSystemDiagram },
            { id: 'vp-volume', name: 'XL Virtual Production LED Volume', create: this.createVirtualProductionVolume }
        ];
    }
}
