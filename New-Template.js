"use strict";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        /* @import url()  */
        :host {
            /* Applies to shadow root only */
            background-color: lightgray;
            display: block;
        }
        :host(.azul) {
            /* This is a method. Color all web components that have a class of azul or that match a queryselector*/
            background-color: blue;
        }
        ::slotted(*) {
            /* Any elements that have a slot inside the Web Component*/
            color: gold;
        }
        div {
            border: 1px solid lightgray;
            border-radius: 4px;
            padding: 5px;
        }
    </style>

    <div>
        <h3 id="thetitle">Inside component</h3>
        <p id="message"></p>
        <slot name="footer"></slot>
    </div>
`;

class NewTemplate extends HTMLElement {
    #message;
    constructor() {
        super();
        this.root =  this.attachShadow({ mode: 'closed' });

        let clone = template.content.cloneNode(true);
        this.root.append(clone);

        //Set default state variables
        this.#message = "I am #message a private state variable";
    }

    // ************** Attribute Getters and Setters **********************
    get name() {
        return this.getAttribute("name");
    };
    set name(value) {
        this.setAttribute('name', value);
    };

    //***************** End *********************************************** */


    // ************** Class State Getters and Setters **********************
    get message () {
        return this.#message;
    }
    set message(value) {
        this.#message = value;
        this.root.getElementById('message').textContent = value;
    }
    //***************** End *********************************************** */

    connectedCallback() {
        //As soon as component is loaded in page
        console.log('connectedCallback');
        this.root.getElementById('message').textContent = this.#message;
    }
    disconnectedCallback() {
        // When component is removed from page
        console.log('connectedCallback');
    }

    static get observedAttributes() {
        //Define which attributes we are going to observed for any changes
        return ["name"];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        console.log('attributeChangedCallBack');

        if (attrName.toLowerCase() === "name") {
            console.log(`Attribute name changed from '${oldValue}' to '${newValue}'`);
            this.root.getElementById('thetitle').textContent = newValue;
        }
    }
    
    #sentEventUp(eventName,objData) {
        //Factory to bubble up events

        //console.log('sending event',eventName);
        let id = this.getAttribute('id');
        if (id) objData['componentId'] = id;
        
        this.dispatchEvent(new CustomEvent(eventName,{
            bubbles: true,
            cancelable : false,
            composed: true,
            detail: objData
        }));
    }

}

window.customElements.define('new-template', NewTemplate);
