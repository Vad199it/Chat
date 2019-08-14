import User from '../model/User';
import RegistrationForm from '../view/RegistrationForm';
import MessageFormController from './MessageForm';

export default class RegistrationFormController {
    constructor(parent, url) {
        this.parent = parent;
        this.url = url;
        this.form = new RegistrationForm(this.parent).create();
        this.listenSubmit = this.createUser.bind(null, this);
        this.form.signUpForm.addEventListener('submit', this.listenSubmit);
    }

    createUser(that, event) {
        event.preventDefault();
        that.form.nickName.value = that.form.nickName.value.trim() || 'аноним';
        let user = new User(that.form.nickName.value);
        user.setToStorage();
        that.form.signUpForm.removeEventListener('submit', that.listenSubmit);
        that.parent.removeChild(that.form.signUpForm);
        new MessageFormController(that.parent, that.url, user);
    }
};
