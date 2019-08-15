import DomNode from '../view/DomNode';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const popupIcon = require('../../images/messageIcon.png');

let arr = [];

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
        this.ws.onopen = () => this.openWS(this.ws);
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

    openWS(ws) {
        this.setStatus('ONLINE');
        if (localStorage.getItem('messages')) {
            let oldMessages = JSON.parse(localStorage.getItem('messages'));
            let username = localStorage.getItem('active');
            oldMessages.forEach((i)=>{
                ws.send(`{"from": "${username}", "message": "${i}"}`);
            });
            localStorage.removeItem('messages');
            arr = [];
        }
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
        let li;
        const divNameTime = new DomNode('div').addClass('message-info');
        const spanName = new DomNode('span').addClass('message-name');
        const spanTime = new DomNode('div').addClass('message-time');
        let divMessage = new DomNode('div').addClass('message-content');
        if (localStorage.getItem('active') === name){
            if (time === "⚠") {
                divMessage = new DomNode('div').addClass('message-content-error');
            }
            li = new DomNode('li').addClass('my-message-li');

        }
        else {
            li = new DomNode('li').addClass('message-li');
        }
        let date;

        if(time === "⚠"){
            date = "⚠";
        }
        else {
            date = new Date(time);
            date = date.toLocaleTimeString();
        }

        spanName.textContent = name || 'аноним';
        spanTime.textContent = date;
        divMessage.textContent = message;

        divNameTime.appendChild(spanName);
        li.appendChild(divNameTime);
        li.appendChild(divMessage);
        li.appendChild(spanTime);
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

    sendMessage = (ws, event) => {
        event.preventDefault();
        if (event.currentTarget.querySelector('.status').textContent === 'ONLINE') {
            const messageInput = event.currentTarget.querySelector('.message-input');
            const username = event.currentTarget.querySelector('.nickname').textContent;
            ws.send(`{"from": "${username}", "message": "${messageInput.value}"}`);
            messageInput.value = '';
        }
        else {
            const messageInput = event.currentTarget.querySelector('.message-input');
            if (JSON.parse(localStorage.getItem('messages')) === []){
                arr = [];
            }
            arr.push(messageInput.value);
            localStorage.setItem('messages', JSON.stringify(arr));
            const username = event.currentTarget.querySelector('.nickname').textContent;
            this.printMessage(username,"⚠", messageInput.value);
            this.messageArea.scrollTop = this.messageArea.scrollHeight;
            messageInput.value = '';
        }
    }
};
