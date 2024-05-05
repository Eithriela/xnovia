const getFields = (url, args) => {
    const req = new XMLHttpRequest();
    req.open('POST', url);
    req.send(args);
    req.addEventListener('load', () => {
        let fields = JSON.parse(req.responseText);
        console.log(fields);
    });
}
const Search = (text) => {
    if (text == '') {
        document.getElementById('search-results').innerHTML = '';
    }
    else {
        let url = 'http://localhost:3000/entries/search?search='+text;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.send();
        req.addEventListener('load', () => {
            let fields = JSON.parse(req.responseText);
            if(fields.length>0) {
                document.getElementById('search-results').innerHTML = '';
                fields.forEach(element => {
                    document.getElementById('search-results').innerHTML += `<p class='search-item'><a href="/entries/${element.id}">${element.title}</a></p>`; 
                });
            }
            else{
                document.getElementById('search-results').innerHTML = '<p>No entry found</p>';
            }
        });
    }
}
