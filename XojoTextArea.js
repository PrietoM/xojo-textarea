"use strict";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        div {
            padding: 5px;
        }
        textarea {
            resize: none;
            border: 1px solid gray;
            border-radius: 4px;
        }
        .normal {
            color:green;
        }
        .sepaso {
            color:red;
        }
    </style>

    <div>
        <textarea id="txtArea" cols="20" rows="5"></textarea><br>
        <span id="info" class="normal">0/0</span>
    </div>
`;

class XojoTextArea extends HTMLElement {
    #state = {};

    constructor() {
        super();
        this.root =  this.attachShadow({ mode: 'closed' });

        let clone = template.content.cloneNode(true);
        this.root.append(clone);

    }

    // ************** Attribute Getters and Setters **********************
    get limit() {
        return this.getAttribute("limit");
    };
    set limit(value) {
        if (!isNaN(value)) this.setAttribute('limit', value); //If number update attribute
    };

    //***************** End *********************************************** */


    connectedCallback() {
        //As soon as component is loaded in page
        console.log('connectedCallback');

        //Register Event for textarea
        this.root.getElementById('txtArea').addEventListener('input', (e) => {
            this.#showInfo();
        });
        
    }
    disconnectedCallback() {
        // When component is removed from page
        console.log('connectedCallback');
    }

    static get observedAttributes() {
        //Define which attributes we are going to observed for any changes
        return ["limit"];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        console.log('attributeChangedCallBack');

        if (attrName.toLowerCase() === "limit") {
            console.log(`Attribute limit changed from '${oldValue ? oldValue : 0}' to '${newValue}'`);
            //Send Event up
            this.#sentEventUp('Limit changed',{oldLimit:oldValue,newLimit:newValue});

            this.#showInfo();
        }
    }

    #showInfo() {
        let txtArea = this.root.getElementById('txtArea');
        let pInfo = this.root.getElementById('info');

        if (txtArea && pInfo) {
            let chars = txtArea.value.length;
            let limit = this.limit;

            pInfo.textContent = "";
            pInfo.textContent = `${chars}/${limit}`;

            //Check limit and set class
            if (chars > limit) pInfo.classList.replace('normal','sepaso');
            else pInfo.classList.replace('sepaso','normal');
        }
        
    }
    
    #sentEventUp(eventName,objToPass) {
        //Factory to bubble up events

        //console.log('sending event',eventName);
        let id = this.getAttribute('id');
        if (id) objToPass['componentId'] = id;
        
        this.dispatchEvent(new CustomEvent(eventName,{
            bubbles: true,
            cancelable : false,
            composed: true,
            detail: objToPass
        }));
    }

}

window.customElements.define('xojo-textarea', XojoTextArea);
