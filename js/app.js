class Element {
    constructor(selector, index) {
        if (index) {
            this.ref = document.querySelector("." + selector + "--" + index);
        } else {
            this.ref = document.querySelector("." + selector);
        }
        this.className = selector;
        this.index = index;
    }
    toggleState(newState = "active", oldState) {
        if (!oldState) {
            this.ref.classList.toggle(`${this.className}--${newState}`);
        } else {
            this.ref.classList.replace(`${this.className}--${oldState}`, `${this.className}--${newState}`)
        }
        return;
    }
    removeState(state = "active") {
        this.ref.classList.remove(`${this.className}--${state}`)
    }
    testState(state = "active") {
        return this.ref.classList.contains(`${this.className}--${state}`);
    }
    disable(duration) {
        this.ref.classList.toggle("disabled");
        setTimeout(() => {
            this.ref.classList.toggle("disabled");
        }, duration);
        return;
    }
    clickListen(f) {
        return this.ref.addEventListener("click", () => {
            return f();
        });
    }
}

const dom = {
    container: new Element("container"),
    nav: new Element("header__nav"),
    toggle: new Element("header__toggle"),
    aboutOptions: [],
    aboutContent: []
}

const states = {
    about: 0
}

const functions = {
    fillArrays() {
        for (i = 1; i <= document.querySelectorAll(".about__option").length; i++) {
            dom.aboutOptions.push(new Element("about__option", i));
            dom.aboutContent.push(new Element("about__content", i));
        }
    },
    enableNavigation() {
        dom.toggle.clickListen(function() {
            const self = dom.toggle;
            dom.container.toggleState("fixed");
            self.toggleState();
            self.disable(1000);
            if (self.testState()) {
                dom.nav.toggleState();
            } else {
                dom.nav.toggleState("exit", "active");
                setTimeout(() => dom.nav.toggleState("exit"), 1000);
            }
        });
    },
    changeAbout(target, newIndex) {
        const oldOption = dom.aboutOptions[states.about];
        const oldContent = dom.aboutContent[states.about];
        states.about = newIndex;
        const newOption = target;
        const newContent = dom.aboutContent[states.about];
        oldOption.toggleState();
        oldContent.toggleState("exit", "active");
        newOption.toggleState();
        newContent.toggleState();
        setTimeout(() => oldContent.toggleState("exit"), 750);
    },
    enableAbout() {
        dom.aboutOptions.forEach(option => option.clickListen(function() {
            clearInterval(aboutInterval);
            functions.changeAbout(option, option.index - 1);
        }));
    },
    repeatAbout() {
        return setInterval(() => {
            let newIndex = states.about + 1;
            if (newIndex >= dom.aboutOptions.length) {
                newIndex = 0;
            }
            functions.changeAbout(dom.aboutOptions[newIndex], newIndex);
        }, 7500);
    }
}

functions.fillArrays();
functions.enableNavigation();
const aboutInterval = functions.repeatAbout();
functions.enableAbout();