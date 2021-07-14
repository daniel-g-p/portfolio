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
        return this.ref.addEventListener("click", (event) => {
            return f();
        });
    }
    adjustMaxHeight(boolean) {
        if (boolean) {
            this.ref.style.maxHeight = this.ref.scrollHeight + "px";
            console.log("max", this.ref.scrollHeight);
        } else {
            this.ref.style.maxHeight = 0;
            console.log("0", this.ref.scrollHeight);
        }
    }
}

const dom = {
    container: new Element("container"),
    nav: new Element("header__nav"),
    toggle: new Element("header__toggle"),
    aboutOptions: [],
    aboutContent: [],
    projects: [],
    projectsContent: [],
    projectsClose: []
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
    }
}

functions.fillArrays();
functions.enableNavigation();
functions.enableAbout();
functions.enableProjects();