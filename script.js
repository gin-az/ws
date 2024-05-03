const websocket = new WebSocket(`wss://echo.websocket.org`);

const app = document.querySelector('.app');
const input = document.querySelector('.input');
const submit = document.querySelector('.submit');

const addMessage = (text, color) => {
    const p = document.createElement('p');
    p.innerText = text;
    p.style.color = color;
    app.appendChild(p)

}
websocket.onopen = function() {
    console.log('Websocket connected');
}

websocket.onmessage = function({data, type}) {
    console.log('Message', data, type);
    if (type === 'message') {
        addMessage(`Сервер: ${data}`, 'red');
    }
}

submit.addEventListener('click', (e) => {
    e.preventDefault();
    const value = input.value;
    addMessage(`Я: ${value}`, 'blue');
    websocket.send(value);
})