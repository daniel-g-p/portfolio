const dom = {
    nav: document.querySelector(".header__nav"),
    toggle: document.querySelector(".header__toggle"),
}

const f = {
    toggleState(element, className, classStateNew = "active", classStateOld) {
        if (!classStateOld) {
            element.classList.toggle(`${className}--${classStateNew}`)
        } else {
            element.classList.replace(`${className}--${classStateOld}`, `${className}--${classStateNew}`);
        }
    },
    disable(element, duration) {
        element.classList.toggle("disabled");
        setTimeout(() => {
            element.classList.toggle("disabled");
        }, duration);
    }
}

dom.toggle.addEventListener("click", () => {
    f.toggleState(dom.toggle, "header__toggle");
    f.disable(dom.toggle, 1000);
    if (dom.toggle.classList.contains("header__toggle--active")) {
        f.toggleState(dom.nav, "header__nav");
    } else {
        f.toggleState(dom.nav, "header__nav", "exit", "active");
        setTimeout(() => f.toggleState(dom.nav, "header__nav", "exit"), 1000);
    }
});