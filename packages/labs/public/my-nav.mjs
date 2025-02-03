import { attachShadow } from "./utils.mjs";

var expanded = false;
const navItems = [
    { name: "Home", href: "index.html" },
    { name: "Fun Facts", href: "funfacts.html" },
    { name: "Projects", href: "projects.html" }
];

let markup = `
  <style> 
  button {
    height: fit-content;
    width: fit-content;
    display: flex;
  }

  #main-nav {
    display: flex;
    flex-direction: column;
  }

  #upper-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #lower-items {
    display: none;
    flex-direction: column;
  }

  @media (min-width: 650px) {
    a {
      color: var(--color-link);
    }
    #main-nav {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }
    .selected {
      font-size: 1.6rem;
    }
    button {
      margin-right: 1em;
    }
    #lower-items {
      display: flex !important;
      flex-direction: row;
      gap: 1em;
    }
    button {
      display: none;
    }
  }
  </style>

  <nav id="main-nav">
    <div id="upper-items">
      <h1>Peter Ryan</h1>
      
      <button id="toggle-btn">Menu</button>
    </div>
    <div id="lower-items">
      ${navItems.map(item => 
        `<b><a href="${item.href}" ${window.location.href.includes(item.href) ? 'class="selected"' : ''}>${item.name}</a></b>`
      ).join('')}
    </div>
  </nav>`;

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = markup;


class MyNav extends HTMLElement {
    constructor() {
        super();
        // Attach shadow root ONCE
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
       
        if (!this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
            
            // Get elements inside shadow DOM
            const toggleButton = this.shadowRoot.getElementById("toggle-btn");
            const lowerDiv = this.shadowRoot.getElementById("lower-items");
            const mainContainer = document.getElementById("main-container");
            toggleButton.addEventListener("click", () => {
                console.log("clciked");
                expanded = !expanded;
                lowerDiv.style.display = expanded ? "flex" : "none";
                console.log("style");
                console.log(lowerDiv.style);
            });
            mainContainer.addEventListener("click", (e) => {
                if ( expanded){
                    expanded = !expanded;
                    lowerDiv.style.display = "none";
                }
            })
        }
      
    }
   
}


customElements.define("my-nav", MyNav);
