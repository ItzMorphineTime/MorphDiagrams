import { Rectangle } from '../shapes/Rectangle.js';
import { TextShape } from '../shapes/TextShape.js';
import { Connector } from '../core/Connector.js';
import { IconLibrary } from './IconLibrary.js';

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

    static getAllTemplates() {
        return [
            { id: 'flowchart', name: 'Basic Flowchart', create: this.createBasicFlowchart },
            { id: 'three-tier', name: '3-Tier Architecture', create: this.createThreeTierArchitecture },
            { id: 'network', name: 'Network Diagram', create: this.createNetworkDiagram },
            { id: 'org-chart', name: 'Organization Chart', create: this.createOrgChart }
        ];
    }
}
