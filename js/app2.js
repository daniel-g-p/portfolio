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
    clickListen(f, e = "click") {
        return this.ref.addEventListener(e, (event) => {
            return f();
        });
    }
}

const dom = {
    container: new Element("container"),
    nav: new Element("header__nav"),
    toggle: new Element("header__toggle"),
    form: new Element("contact__form"),
    name: new Element("name"),
    email: new Element("email"),
    subject: new Element("subject"),
    message: new Element("message"),
    sections: {
        start: new Element("hero"),
        about: new Element("about"),
        skills: new Element("skills"),
        projects: new Element("work"),
        contact: new Element("contact")
    },
    aboutOptions: [],
    aboutContent: [],
    projects: [],
    projectsContent: [],
    projectsClose: [],
    inputGroups: [],
}

const states = {
    about: 0,
    projects: 0
}

const functions = {
    fillArrays() {
        for (i = 1; i <= document.querySelectorAll(".about__option").length; i++) {
            dom.aboutOptions.push(new Element("about__option", i));
            dom.aboutContent.push(new Element("about__content", i));
        }
        for (i = 1; i <= document.querySelectorAll(".project").length; i++) {
            dom.projects.push(new Element("project", i));
            dom.projectsContent.push(new Element("project__content", i));
            dom.projectsClose.push(new Element("project__close", i));
        }
    },
    enableNavigation() {
        dom.toggle.clickListen(this.toggleHeader);
        const links = document.querySelectorAll(".header__link, .footer__link");
        links.forEach(l => l.addEventListener("click", (event) => {
            event.preventDefault();
            const target = l.getAttribute("href");
            if (l.classList.contains("header__link")) {
                this.toggleHeader();
                return setTimeout(() => { this.scrollTo(target) }, 750);
            } else {
                return this.scrollTo(target);
            }
        }));
    },
    scrollTo(target) {
        return dom.sections[target].ref.scrollIntoView({ behavior: "smooth" })
    },
    toggleHeader() {
        dom.container.toggleState("fixed");
        dom.toggle.toggleState();
        dom.toggle.disable(1000);
        if (dom.toggle.testState()) {
            dom.nav.toggleState();
        } else {
            dom.nav.toggleState("exit", "active");
            setTimeout(() => dom.nav.toggleState("exit"), 1000);
        }
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
        const aboutInterval = setInterval(() => {
            let newIndex = states.about + 1;
            if (newIndex >= dom.aboutOptions.length) {
                newIndex = 0;
            }
            functions.changeAbout(dom.aboutOptions[newIndex], newIndex);
        }, 7500);
        dom.aboutOptions.forEach(option => option.clickListen(() => {
            clearInterval(aboutInterval);
            functions.changeAbout(option, option.index - 1);
        }));
    },
    enableProjects() {
        dom.projects.forEach(p => p.clickListen(() => {
            if (!p.testState()) {
                const oldProject = dom.projects[states.projects];
                states.projects = p.index - 1;
                const newProject = p;
                if (oldProject.testState()) {
                    oldProject.toggleState();
                }
                newProject.toggleState();
            }
        }));
        dom.projectsClose.forEach(p => p.clickListen(() => {
            event.stopPropagation();
            dom.projects[p.index - 1].toggleState();
        }));
    },
    enableForm() {
        const checkInputs = [dom.name, dom.email, dom.subject, dom.message];
        dom.form.clickListen(() => {
            const valid = this.checkForm(checkInputs);
            valid ? console.log("error") : event.preventDefault();
        }, "submit");
        checkInputs.forEach(i => i.clickListen(() => {
            i.removeState("error");
        }, "input"))
    },
    checkForm(arr) {
        const checkInputs = arr;
        for (let item of checkInputs) {
            if (!item.ref.value) {
                item.addState("error")
            }
            if (!dom.email.ref.value.match(/\S+@\S+\.\S+/) && !dom.email.testState("error")) {
                dom.email.addState("error");
            }
        };
        return !checkInputs.some((item) => item.testState("error"));
    },
    removeFOUC() {
        document.body.style.visibility = "visible";
        document.body.style.opacity = 1;
    },

}

functions.fillArrays();
functions.enableNavigation();
functions.enableAbout();
functions.enableProjects();
functions.enableForm();
window.addEventListener("load", () => functions.removeFOUC());