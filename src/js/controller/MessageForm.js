import MessageForm from '../view/MessageForm';
import WebSocketModel from '../model/WS';
import RegistrationFormController from './RegistrationForm';

export default class MessageFormController {
    constructor(parent, url, user) {
        this.parent = parent;
        this.url = url;
        this.user = user;
        this.chat = new MessageForm(this.parent, this.user).create();
        this.ws = new WebSocketModel(this.url, this.chat.messageArea, this.chat.status, this.chat.messageForm, this.chat.connectBtn);
        this.listenLogout = this.logout.bind(null, this);
        this.chat.logoutBtn.addEventListener('click', this.listenLogout);
    }

    logout(that, event) {
        event.preventDefault();
        localStorage.removeItem('active');
        that.ws.ws.close();
        that.ws.connectionValue = true;
        that.chat.messageForm.removeEventListener('submit', that.listenLogout);
        that.parent.removeChild(that.chat.messageForm);
        localStorage.removeItem('messages');
        new RegistrationFormController(that.parent, that.url);
    }
};
