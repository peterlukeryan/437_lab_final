import { attachShadow } from "./utils.mjs";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
    <style> 
    header {
    background-color: var(--color-background-header);
    color: var(--color-text-header);
    padding: 1em;
    } 
     </style>
    <header>
    
    <h2>Cal Poly San Luis Obispo</h2>
    <p><b>"We're all in the gutter, but </b> <i>some of us are looking at the stars." </i> - Oscar Wilde</p>
    <img src="me.jpg" width="150px" height="200px" alt="Me"/>
     </header>
`;

class MyHeader extends HTMLElement {
    connectedCallback() {
        const shadowRoot = attachShadow(this, TEMPLATE);
        shadowRoot.append(TEMPLATE)
    }
}

customElements.define("my-header", MyHeader);