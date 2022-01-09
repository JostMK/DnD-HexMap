const dataFileName = 'data/characters.json';
var dataCache;
var previewTemplate = document.getElementById('character-preview').innerHTML;

var selectedCharacter;


populateCharacterList();

function onClickCharacter(name) {
    selectedCharacter = name;
    populateCharacterPreview(name);
}


function populateCharacterList() {
    getCharacterList((charList) => {
        let template = document.getElementsByClassName('character-list-item')[0];

        let listItems = [];
        charList.forEach(char => {
            let item = template.cloneNode(true);
            item.innerHTML = replaceTemplateStrings(item.innerHTML, char);
            item.addEventListener('click', () => onClickCharacter(char.name));
            listItems.push(item);
        });
        template.parentElement.replaceChildren(...listItems);

        selectedCharacter = charList[0].name;
        populateCharacterPreview(charList[0]['name']);
    });
}

function populateCharacterPreview(name) {
    getCharacterData(name, (character) => {
        let preview = document.getElementById('character-preview');
        preview.innerHTML = replaceTemplateStrings(previewTemplate, character);
    });
}

function confirmSelectedCharacter(name) {
    // check if character is available -> Three way handshake
    // change window to playing site and add character name to url
}


function getCharacterList(callback) {
    getData(function(characters) {
        let chars = [];
        Object.keys(characters).forEach(e => {
            chars.push({
                name: e,
                level: characters[e].level
            });
        });
        callback(chars);
    });
}

function getCharacterData(name, callback) {
    getData((characters) =>
        callback(characters[name])
    );
}

function replaceTemplateStrings(input, data) {
    let output = input;
    Object.keys(data).forEach(e => {
        //console.log(`Replacing: {{Template:${e}}}`);
        output = output.replace(`{{Template:${e}}}`, data[e]);
    });
    return output;
}

function getData(callback) {
    if (!dataCache) {
        requestData(function(req) {
            dataCache = JSON.parse(req.responseText);
            callback(dataCache);
        });
    } else {
        callback(dataCache);
    }
}

function requestData(callback) {
    let req = new XMLHttpRequest();
    req.open('GET', dataFileName, true);
    req.setRequestHeader('Content-type', 'application/json');
    req.onload = function(e) {
        if (req.readyState !== 4)
            return;

        req.status === 200 ?
            callback(req) :
            console.error(req.statusText);
    };
    req.onerror = (e) => console.error(req.statusText, e);
    req.send();
}