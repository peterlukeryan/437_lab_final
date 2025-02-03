import { toHtmlElement } from "./toHtmlElement.mjs";

const header = toHtmlElement(` <header id="heading-container">
    
    <h2>Cal Poly San Luis Obispo</h2>
    <p><b>"We're all in the gutter, but </b> <i>some of us are looking at the stars." </i> - Oscar Wilde</p>
    <img src="me.jpg" width="150px" height="200px" alt="Me"/>
     </header>`)
window.addEventListener("load", () => {
    const main = document.getElementById("main-container")
    main.prepend(header)
})
