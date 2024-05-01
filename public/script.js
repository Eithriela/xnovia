var i = 0;

function addParagraph(parentId) {
            var text = 'new';

            document.getElementById(parentId).innerHTML += '<textarea id="' + i +'"></textarea><button onclick="sendParagraph(' + i +')">Send</button>';
            i++;
        }
        
        function sendParagraph(id) {
            const req = new XMLHttpRequest();
            req.open('POST', 'http://localhost:3000/');
            req.send(id + document.getElementById(''+id+'').value);
            console.log('Paragraph sent with id: ', id);
            req.addEventListener('load', function() {
                console.log(req.responseText);
            });

        }
        
function getFields(url, args) {
    const req = new XMLHttpRequest();
    req.open('POST', url);
    req.send(args);
    req.addEventListener('load', () => {
        let fields = JSON.parse(req.responseText);
        console.log(fields);
    });
}
function generateValues(parentId, values) {
    getFields('/getstars', 'Orion Constellation');
    
    
}
function Search(text) {
    let oldtext;
    if (text == '') {document.getElementById('search-result').innerHTML = '';}
    
    else {
        
        let url = 'http://localhost:3000/search?search='+text;
    const req = new XMLHttpRequest();
    
    req.open('GET', url);
    req.send();
    
    req.addEventListener('load', () => {
        let fields = JSON.parse(req.responseText);
        console.log(fields);
        document.getElementById('search-result').innerHTML = '';
        fields.forEach(element => {
            document.getElementById('search-result').innerHTML += `<p class='search-item'><a href="/planet?id=${element.id}">${element.name}</a></p>`;
        });
    });
    }
}
