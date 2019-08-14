import DomNode from '../view/DomNode';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const popupIcon = require('../../images/messageIcon.png');

export default class WebSocketModel {
    constructor(url, messageArea, statusConnection, messageForm, connectBtn) {
        this.url = url;
        this.messageArea = messageArea;
        this.statusConnection = statusConnection;
        this.messageForm = messageForm;
        this.connectBtn = connectBtn;
        this.connectionValue = false;
        this.messageHistory = {};
        this.start();
    }

    start() {
        this.ws = new W3CWebSocket(this.url);
        this.ws.onopen = () => this.openWS();
        this.ws.onmessage = (event) => this.getMessage(event);
        this.ws.onclose = () => this.closeWS();
        this.listenConnect = this.changeStatus.bind(null, this);
        this.connectBtn.addEventListener('click', this.listenConnect);
        this.listenSend = this.sendMessage.bind(null, this.ws);
        this.messageForm.addEventListener('submit', this.listenSend);
    }

    setStatus(value) {
        this.statusConnection.textContent = value;
        value === 'OFFLINE'
            ? this.statusConnection.classList.add('error-status')
            : this.statusConnection.classList.remove('error-status');
    }

    openWS() {
        this.setStatus('ONLINE');
    }

    closeWS() {
        this.setStatus('OFFLINE');
        if (!this.connectionValue) {
            this.messageForm.removeEventListener('submit', this.listenSend);
            this.connectBtn.removeEventListener('click', this.listenConnect);
            this.start();
        }
    }

    changeStatus(that, event) {
        event.preventDefault();
        if (that.statusConnection.textContent === 'OFFLINE') {
            that.connectBtn.textContent = 'Disconnect';
            that.connectionValue = false;
            that.messageForm.removeEventListener('submit', that.listenSend);
            that.connectBtn.removeEventListener('click', that.listenConnect);
            that.start();
        } else {
            that.connectBtn.textContent = 'Connect';
            that.connectionValue = true;
            that.ws.close();
        }
    }

    getMessage(event) {
        let data = JSON.parse(event.data);
        data = data.sort((a, b) => a.time - b.time);
        data.forEach(el => {
            if (!this.messageHistory[el.id]) {
                this.messageHistory[el.id] = el;
                this.printMessage(el.from, el.time, el.message)
            }
        });
        if (document.hidden) {
            let dataItem = data[0];
            this.notify(dataItem.from, dataItem.message);
        }
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }

    printMessage(name, time, message) {
        const li = new DomNode('li').addClass('message-li');
        const divNameTime = new DomNode('div').addClass('message-info');
        const spanName = new DomNode('span').addClass('message-name');
        const spanTime = new DomNode('span').addClass('message-time');
        const divMessage = new DomNode('div').addClass('message-content');

        let date = new Date(time);
        date = date.toLocaleTimeString();

        spanName.textContent = name || 'аноним';
        spanTime.textContent = date;
        divMessage.textContent = message;

        divNameTime.appendChild(spanName);
        divNameTime.appendChild(spanTime);
        li.appendChild(divNameTime);
        li.appendChild(divMessage);
        this.messageArea.appendChild(li);
    }

    notify(username, text) {
        if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission((status) => {
                if (status === "granted") {
                    new Notification(username, { "body": text, "icon": popupIcon });
                }
            })
        }
    }

    sendMessage(ws, event) {
        event.preventDefault();
        if (event.currentTarget.querySelector('.status').textContent === 'ONLINE') {
            const messageInput = event.currentTarget.querySelector('.message-input');
            const username = event.currentTarget.querySelector('.nickname').textContent;
            ws.send(`{"from": "${username}", "message": "${messageInput.value}"}`);
            messageInput.value = '';
        }
    }
};
