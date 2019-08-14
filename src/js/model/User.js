export default class User {
    constructor(nickname) {
        this.nickname = nickname;
    }

    setToStorage() {
        localStorage.setItem('active', `${this.nickname}`);
        localStorage.setItem('messages', JSON.stringify([]));
    }
};
