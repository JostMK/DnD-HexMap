const http = require('http');
const path = require('path');
const fs = require('fs');


const host = 'localhost';
const port = 34343;

const websiteFilesPath = "./website";
const resFolderPath = "./res";
const savedDataFolderPath = "./data";

var serverFiles = {};
var contentTypes;


module.exports = function startServer() {
    console.log('-----Starting-----');

    let dirPath = path.join(__dirname, websiteFilesPath);
    loadFiles(dirPath);
    loadFiles(savedDataFolderPath, 'data/');
    loadContentTypes();

    http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (req.method == 'GET') {
            handleGetFileRequest(req, res);
        }

    }).listen(port, host, () => { console.log(`Server listening on port: ${port}.`) });
}

function handleGetFileRequest(req, res) {
    let fileName = req.url.substring(1)
    if (fileName.length == 0) fileName = "index.html";

    let contentTyp = contentTypes[path.extname(fileName)];
    let data = serverFiles[fileName];
    if (contentTyp && data) {
        res.writeHead(200, { "Content-Type": contentTyp });
        res.end(data);
    } else {
        res.writeHead(404, { "Content-Type": "text/json" });
        res.end(JSON.stringify("404 : Resource not found!"));
    }
}

function loadFiles(dirPath, prefix = '') {
    let files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(function(file) {
        if (file.isFile()) {
            let data = fs.readFileSync(path.join(dirPath, file.name), 'utf8');

            serverFiles[prefix + file.name] = data;
            console.log(`> Added ${prefix + file.name} to server files.`);
        } else if (file.isDirectory()) {
            let nextDirPath = path.join(dirPath, file.name);
            loadFiles(nextDirPath);
        }
    });
}

function loadContentTypes() {
    let filePath = path.join(__dirname, resFolderPath, 'MIME.json');
    let result = fs.readFileSync(filePath);
    contentTypes = JSON.parse(result);
}