import { attachShadow } from "./utils.mjs";

const navItems = [
    { name: "Home", href: "index.html" },
    { name: "Fun Facts", href: "funfacts.html" },
    { name: "Projects", href: "projects.html" }
];

let markup = `
  <style> 
    a {
    color: var(--color-link);
}
    nav {
    display: flex;
    min-width: 258px;
    width: 50%;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    }
    .selected {
    font-size: 1.6rem;
}
    button {
    margin-right: 1em;
    }
     </style>
<nav id="main-nav">
    <h1>Peter Ryan</h1>
    ${navItems.map(item => 
        `<b><a href="${item.href}" ${window.location.href.includes(item.href) ? 'class="selected"' : ''}>${item.name}</a></b>`
    ).join('')}
    <button type = "button">Menu </button>
</nav>`;

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = markup;

class MyNav extends HTMLElement {
    connectedCallback() {
        const shadowRoot = attachShadow(this, TEMPLATE);
        shadowRoot.append(TEMPLATE)
    }
}

customElements.define("my-nav", MyNav);