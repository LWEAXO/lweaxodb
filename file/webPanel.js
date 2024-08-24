const { EventEmitter } = require('node:events');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); // To parse JSON data in POST requests
const app = express();

class WebPanel extends EventEmitter {
    constructor(port, adapter) {
        super();
        this.port = port;
        this.adapter = adapter;
        this.server = null; // Sunucu referansını saklamak için

        // View engine setup
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '../webpanel/views'));

        // Serve static files
        app.use(express.static(path.join(__dirname, '../webpanel/static')));

        // Parse JSON bodies
        app.use(bodyParser.json());

        // Define routes
        app.get('/', (req, res) => {
            this.getDataFromJson()
                .then(data => {
                    res.render('index', {
                        owner: "lweaxodb",
                        data: JSON.stringify(data, null, 2) // Pretty-print JSON
                    });
                })
                .catch(() => {
                    res.send('DataBase Algılanmadı! Database Adını ve Klasörünün Adının Doğru Olduğunu Ve Ana Dizin\'de olduğundan emin olunuz.')
                });
        });

        // lweaxo routes
        app.get('/lweaxo', (req, res) => {
            const packageJsonPath = path.resolve(__dirname, '../package.json');
            const packageJson = require(packageJsonPath);
            const versyonu = packageJson.version;
            const Veri = [
                {
                    username: 'lweaxo',
                    module: 'lweaxodb',
                    Discord: 'https://discord.gg/X7F9swzFR6',
                    version: versyonu
                }
            ];
        
            res.render('lweaxo', {
                owner: "lweaxodb",
                data: Veri
            });
        });

        // POST route to save the JSON data
        app.post('/save', (req, res) => {
            const newData = req.body; // Get the new data from the request body
            this.saveDataToJson(newData)
                .then(() => {
                    res.status(200).json({ message: 'Data saved successfully!' });
                })
                .catch(err => {
                    console.error(`[LweaxoDB]: Error saving data - ${err.message}`);
                    res.status(500).json({ message: 'Failed to save data' });
                });
        });

        // 404 Middleware - bilinmeyen bir yola erişildiğinde çalışır
        app.use((req, res, next) => {
            res.status(404).render('404');
        });

        // Start the server
        this.startServer();
    }

    // Start the server
    startServer() {
        try {
            this.server = app.listen(this.port, () => {
                this.emit('on');
                console.log(`[LweaxoDB]: Web panel is active on http://localhost:${this.port}`);
            });
        } catch (err) {
            console.error(`[LweaxoDB]: Error starting web panel - ${err.message}`);
            this.emit('error', err);
        }
    }

    // Stop the server
    stopServer() {
        if (this.server) {
            this.server.close((err) => {
                if (err) {
                    console.error(`[LweaxoDB]: Error stopping web panel - ${err.message}`);
                    this.emit('error', err);
                } else {
                    console.log(`[LweaxoDB]: Web panel stopped`);
                    this.emit('off');
                }
            });
        }
    }

    // JSON verisini bulmak için ana dizindeki lweaxodb klasörünü ve ardından diğer klasörleri kontrol eder
    async getDataFromJson() {
        const rootDir = path.join(__dirname, '../../../'); // Ana dizin
        const lweaxodbPath = path.join(rootDir, 'lweaxodb', 'lweaxodb.json');
    
        // İlk olarak lweaxodb klasörünü kontrol et
        if (fs.existsSync(lweaxodbPath)) {
            const data = fs.readFileSync(lweaxodbPath, 'utf-8');
            return JSON.parse(data);
        }
    
        // Eğer lweaxodb klasöründe dosya yoksa, ana dizindeki diğer klasörleri kontrol et
        const folders = fs.readdirSync(rootDir).filter(file => fs.statSync(path.join(rootDir, file)).isDirectory());
    
        for (const folder of folders) {
            const jsonPath = path.join(rootDir, folder, 'lweaxodb.json');
            
            if (fs.existsSync(jsonPath)) {
                const data = fs.readFileSync(jsonPath, 'utf-8');
                return JSON.parse(data);
            }
        }
    
        // Eğer hiçbir yerde dosya bulunamazsa hata fırlat
        console.log('[DEBUG]: lweaxodb.json dosyası bulunamadı. (WebPanel)');
        throw new Error('Dosya bulunamadı');
    }

    // Save JSON data to file
    async saveDataToJson(data) {
        const rootDir = path.join(__dirname, '../../../');
        const lweaxodbPath = path.join(rootDir, 'lweaxodb', 'lweaxodb.json');

        try {
            fs.writeFileSync(lweaxodbPath, JSON.stringify(data, null, 2)); // Save with pretty-print
        } catch (err) {
            console.error('[DEBUG]: Error saving data -', err.message);
            throw err;
        }
    }
}

module.exports = WebPanel;
