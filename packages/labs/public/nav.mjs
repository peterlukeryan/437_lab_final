import { toHtmlElement } from "./toHtmlElement.mjs";


const navItems = [
    { name: "Home", href: "index.html" },
    { name: "Fun Facts", href: "funfacts.html" },
    { name: "Projects", href: "projects.html" }
];

let markup = `<nav id="main-nav">
    <h1>Peter Ryan</h1>
    ${navItems.map(item => 
        `<b><a href="${item.href}" ${window.location.href.includes(item.href) ? 'class="selected"' : ''}>${item.name}</a></b>`
    ).join('')}
</nav>`;


window.addEventListener("load", () => {
   


const nav = toHtmlElement(markup)
    const body = document.querySelector("body")
    body.prepend(nav)
})