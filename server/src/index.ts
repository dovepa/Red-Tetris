import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as socket from 'socket.io';
import * as cors from 'cors';
import socketController from './controllers/socket.controller';
import { environment } from './environments/environment';

const port = environment.serverPort || 3002;
const app = express();
export const server = http.createServer(app);

app.io = socket(server, {
    pingTimeout: 500000,
    cookie: false
});

socketController(app.io);

const whitelist = [
    `http://localhost:${environment.clientPort}`,
    `http://localhost:${environment.serverPort}`
];
const corsOptions = {
    origin(origin, callback) {
        if (!environment.production || environment.online || origin === undefined) {
            callback(null, true);
        } else if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

// Implement Midlewares
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Implement Routes
const routerApp = express.Router();
routerApp.route('/api/')
    .all((req, res) => {
        res.json({
            message: 'Welcome to Red-Tetris API 🎮',
            methode: `you are using ${req.method} methode`,
            usage: `Socket.io no routes`
        });
    });


app.use(routerApp);

// Angular App only in production
if (environment.production) {
    const angularAppPath = path.join(__dirname, '..', '..', 'client', 'dist');
    app.use(express.static(angularAppPath));
    app.get('/*', (req, res) => res.sendFile(path.join(angularAppPath, 'index.html')));
} else {
    routerApp.route('/')
        .all((req, res) => {
            res.json({
                message: 'Welcome to Red-Tetris API 🎮',
                methode: `you are using ${req.method} methode`,
                usage: `Socket.io no routes`,
                front: `On dev port`
            });
        });
}


// tslint:disable-next-line:no-console
server.listen(port, () => console.log(`App running on: http://localhost:${port} 🎮`));
