export default class DomNode {
    constructor(node) {
        this.element = document.createElement(node);
    }

    addClass(classList) {
        this.element.classList.add(classList);
        return this.element;
    }
};
