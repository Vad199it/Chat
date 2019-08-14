import { connect } from 'react-redux';
import MessageFormController from './MessageForm';
import RegistrationFormController from './RegistrationForm';

class ChatController {
    constructor() {
        this.parent = document.querySelector('.App');
        this.url = 'wss://wssproxy.herokuapp.com/';

        if (localStorage.getItem('active')) {
            const user = {};
            user.nickname = localStorage.getItem('active');
            this.form = new MessageFormController(this.parent, this.url, user);
        } else {
            this.form = new RegistrationFormController(this.parent, this.url);
        }
    }

    static start() {
        new ChatController(this.parent, this.url);
    }
};

export default connect()(ChatController);
