import { Rectangle } from '../shapes/Rectangle.js';
import { TextShape } from '../shapes/TextShape.js';
import { Connector } from '../core/Connector.js';
import { IconLibrary } from './IconLibrary.js';
import { Server } from '../shapes/Server.js';
import { VideoMatrix } from '../shapes/VideoMatrix.js';
import { SyncGenerator } from '../shapes/SyncGenerator.js';
import { LEDProcessor } from '../shapes/LEDProcessor.js';
import { NetworkSwitch } from '../shapes/NetworkSwitch.js';

export class Templates {
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
        syncGen.ports = {
            sdi: { input: 2, output: 4 }
        };
        objects.push(syncGen);

        // Create Network Switch with ports: Network[6,6] - Left, bottom
        const networkSwitch = new NetworkSwitch(230, 350, 100, 100);
        networkSwitch.ports = {
            network: { input: 6, output: 6 }
        };
        objects.push(networkSwitch);

        // Create Server with ports: Video[0,4], SDI[1,0], Network[2,0], USB[4,0] - Center left
        const server = new Server(500, 200, 120, 180);
        server.ports = {
            video: { input: 0, output: 4 },
            sdi: { input: 1, output: 0 },
            network: { input: 2, output: 0 },
            usb: { input: 4, output: 0 }
        };
        objects.push(server);

        // Create Video Matrix with ports: Video[4,4], SDI[1,4] - Center right
        const videoMatrix = new VideoMatrix(950, 200, 120, 180);
        videoMatrix.ports = {
            video: { input: 4, output: 4 },
            sdi: { input: 1, output: 4 }
        };
        objects.push(videoMatrix);

        // Create LED Processor with ports: Video[4,1], SDI[1,0] - Far right
        const ledProcessor = new LEDProcessor(1250, 50, 120, 100);
        ledProcessor.ports = {
            video: { input: 4, output: 1 },
            sdi: { input: 1, output: 0 }
        };
        objects.push(ledProcessor);

        // Import ConnectionColors
        const ConnectionColors = {
            video: '#FFD700',
            sdi: '#FF4500',
            network: '#00CED1',
            usb: '#9370DB'
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

    static getAllTemplates() {
        return [
            { id: 'flowchart', name: 'Basic Flowchart', create: this.createBasicFlowchart },
            { id: 'three-tier', name: '3-Tier Architecture', create: this.createThreeTierArchitecture },
            { id: 'network', name: 'Network Diagram', create: this.createNetworkDiagram },
            { id: 'org-chart', name: 'Organization Chart', create: this.createOrgChart },
            { id: 'system-diagram', name: 'System Diagram', create: this.createSystemDiagram }
        ];
    }
}
