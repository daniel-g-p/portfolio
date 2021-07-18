class Element {
    constructor(selector) {
        this.ref = document.querySelector("." + selector);
        this.className = selector;
    }
    toggleState(newState = "active", oldState) {
        if (!oldState) {
            this.ref.classList.toggle(`${this.className}--${newState}`);
        } else {
            this.ref.classList.replace(`${this.className}--${oldState}`, `${this.className}--${newState}`)
        }
        return;
    }
    addState(state = "active") {
        this.ref.classList.add(`${this.className}--${state}`)
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
    listen(callback, action = "click") {
        return this.ref.addEventListener(action, (event) => {
            callback();
        });
    }
    scrollTo() {
        this.ref.scrollIntoView({ behavior: "smooth" });
    }
};

class inputElement extends Element {
    constructor(selector, modifier, format) {
        super();
        this.ref = document.querySelector("." + selector + "--" + modifier);
        this.className = selector;
        this.format = format;
    }
    isPresent() {
        return this.ref.value ? true : false;
    }
    isValid() {
        return this.ref.value.match(this.format) ? true : false;
    }
}

class elementGroup {
    constructor(selector) {
        this.ref = document.querySelectorAll("." + selector);
        this.className = selector;
        this.length = this.ref.length;
    };
    findItem(modifier = "active") {
        let active;
        this.ref.forEach(item => {
            if (item.classList.contains(this.className + "--" + modifier)) {
                active = item;
            }
        });
        return active;
    }
    findIndex(child) {
        let index;
        for (let i = 0; i <= this.length; i++) {
            if (this.ref.item(i) === child) {
                index = i;
            }
        }
        return index;
    }
    removeActive() {
        const active = this.findItem();
        if (active) { active.classList.remove(this.className + "--active") };
    }
    addState(index, state = "active") {
        this.ref[index - 1].classList.add(this.selector + "--" + state);
    }
    toggleState(index, newState = "active", oldState) {
        if (!oldState) {
            this.ref[index].classList.toggle(`${this.className}--${newState}`);
        } else {
            this.ref[index].classList.replace(`${this.className}--${oldState}`, `${this.className}--${newState}`)
        }
    }
    listenAll(callback, action = "click") {
        return this.ref.forEach(element => element.addEventListener(action, (event) => {
            callback.call(this, this.findIndex(element));
        }));
    }
    interval(callback, interval) {
        return setInterval(() => {
            callback.call(this);
        }, interval);
    }
}

const dom = {
    container: new Element("container"),
    header: {
        nav: new Element("header__nav"),
        toggle: new Element("header__toggle"),
    },
    about: {
        toggles: new elementGroup("about__option"),
        items: new elementGroup("about__content"),
    },
    projects: {
        items: new elementGroup("project"),
        toggles: new elementGroup("project__close")
    },
    contact: {
        form: new Element("contact__form"),
        name: new inputElement("input-group__input", "name"),
        email: new inputElement("input-group__input", "email", /\S+@\S+\.\S+/),
        subject: new inputElement("input-group__input", "subject"),
        message: new inputElement("input-group__input", "message"),
    },
    sections: {
        start: new Element("hero"),
        about: new Element("about"),
        skills: new Element("skills"),
        projects: new Element("work"),
        contact: new Element("contact")
    },
    links: new elementGroup("header__link, .footer__link")
}

const f = {
    toggleHeader() {
        dom.container.toggleState("fixed");
        dom.header.toggle.toggleState();
        dom.header.toggle.disable(1000);
        if (dom.header.toggle.testState()) {
            dom.header.nav.toggleState();
        } else {
            dom.header.nav.toggleState("exit", "active");
            setTimeout(() => dom.header.nav.toggleState("exit"), 1000);
        }
    },
    toggleAbout(current, next) {
        setTimeout(() => { dom.about.items.toggleState(current, "exit") }, 750);
        dom.about.toggles.removeActive();
        dom.about.toggles.toggleState(next);
        dom.about.items.toggleState(current, "exit", "active");
        dom.about.items.toggleState(next);
    }
}

dom.header.toggle.listen(function() {
    f.toggleHeader();
});

dom.about.toggles.listenAll(function(next) {
    clearInterval(dom.about.loop);
    const active = this.findIndex(this.findItem())
    f.toggleAbout(active, next);
});

dom.about.loop = dom.about.toggles.interval(function() {
    let active = this.findIndex(this.findItem());
    let next = (active + 1 === this.length) ? 0 : active + 1;
    f.toggleAbout(active, next);
}, 5000);

dom.projects.items.listenAll(function(index) {
    this.removeActive();
    this.toggleState(index);
});

dom.projects.toggles.listenAll(function(index) {
    event.stopPropagation();
    dom.projects.items.removeActive();
});

dom.contact.inputs = [dom.contact.name, dom.contact.email, dom.contact.subject, dom.contact.message];

dom.contact.form.listen(function() {
    dom.contact.inputs.forEach(i => {
        if (!i.isPresent() || !i.isValid()) {
            event.preventDefault();
            i.addState("error");
        }
    })
}, "submit");

dom.contact.inputs.forEach(i => i.listen(function() {
    i.removeState("error");
}, "input"));

dom.links.listenAll(function(index) {
    event.preventDefault();
    const target = this.ref[index].getAttribute("href");
    if (this.ref[index].classList.contains("header__link")) {
        f.toggleHeader();
        setTimeout(() => { dom.sections[target].scrollTo() }, 750);
    } else {
        dom.sections[target].scrollTo();
    }
});

window.addEventListener("load", () => {
    document.body.style.visibility = "visible";
    document.body.style.opacity = 1;
});