import DomNode from './DomNode';

export default class RegistrationForm {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.signUpForm = new DomNode('form').addClass('register-form');
        this.greetingText = new DomNode('p').addClass('register-greeting');
        this.containerRegister = new DomNode('div').addClass('container-register');
        this.signInText = new DomNode('p').addClass('sign-in');
        this.nickName = new DomNode('input').addClass('register-name');
        this.regFormSubmit = new DomNode('button').addClass('register-submit');
        this.rsText = new DomNode('p').addClass('rolling-scopes');
        this.creatorText = new DomNode('p').addClass('creator');
    }

    create() {
        this.appendNodes().setAttributes();
        this.parentNode.appendChild(this.signUpForm);
        return this;
    }

    appendNodes() {
        this.signUpForm.appendChild(this.greetingText);
        this.signUpForm.appendChild(this.containerRegister);
        this.containerRegister.appendChild(this.signInText);
        this.containerRegister.appendChild(this.nickName);
        this.containerRegister.appendChild(this.regFormSubmit);
        this.signUpForm.appendChild(this.rsText);
        this.signUpForm.appendChild(this.creatorText);
        return this;
    }

    setAttributes() {
        this.greetingText.textContent = 'Welcome to Chat!';
        this.signInText.textContent = 'Sign in:';
        this.nickName.setAttribute('placeholder', 'Nickname');
        this.nickName.setAttribute('required', true);
        this.nickName.setAttribute('maxlength', 8);
        this.regFormSubmit.textContent = 'Sign up';
        this.regFormSubmit.setAttribute('type', 'submit');
        this.parentNode.appendChild(this.signUpForm);
        this.rsText.textContent = 'The Rolling Scopes School';
        this.creatorText.textContent = 'Created by Vadzim Minin';
        return this;
    }
};
