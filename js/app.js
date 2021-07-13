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
    nav: new Element("header__nav"),
    toggle: new Element("header__toggle"),
    options: []
}

for (i = 1; i <= document.querySelectorAll(".about__option").length; i++) {
    dom.options.push(new Element("about__option", i));
}

dom.toggle.clickListen(function() {
    const self = dom.toggle;
    self.toggleState();
    self.disable(1000);
    if (self.testState()) {
        dom.nav.toggleState();
    } else {
        dom.nav.toggleState("exit", "active");
        setTimeout(() => dom.nav.toggleState("exit"), 1000);
    }
});

dom.options.forEach(option => option.clickListen(function() {
    dom.options.forEach(option => option.removeState());
    option.toggleState();
}))

// dom.options.forEach(o => o.addEventListener("click", () => {
//     const currentOption = document.querySelector(".about__option--active");
//     f.toggleState(currentOption, "about__option");
//     f.toggleState(o, "about__option");
// }));