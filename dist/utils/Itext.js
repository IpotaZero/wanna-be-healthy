"use strict";
class Itext extends Ielement {
    #interval;
    #originalHTML;
    #wrapper = document.createElement("div");
    #voice = null;
    #frame = 0;
    isEnd = false;
    ready;
    #resolve;
    constructor(container, text, options = {}) {
        super(container, options);
        this.#voice = options.voice ?? null;
        this.#wrapper.className = "i-text-wrapper";
        this.appendChild(this.#wrapper);
        this.#setupText(String(text), options.typing ?? true);
        this.ready = new Promise((resolve) => {
            this.#resolve = resolve;
        });
        // アニメーション開始
        this.#interval = setInterval(() => {
            this.#updateText();
        }, 1000 / (options.speed ?? 24));
    }
    #validationText(text) {
        return text.replace(/\s{2,}/g, " ").replace(/\n/g, "");
    }
    #setupText(text, typing) {
        if (!typing) {
            this.innerHTML = text;
            return;
        }
        this.#originalHTML = this.#validationText(text);
        this.#wrapper.innerHTML = this.#originalHTML;
        this.#processTextNodes(this.#wrapper);
    }
    // テキストノードを再帰的に処理
    #processTextNodes(element) {
        const childNodes = [...element.childNodes];
        childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text) {
                    element.replaceChild(new Itext.Char(text), node);
                }
            }
            else if (node.tagName === "RUBY") {
                const temp = document.createElement("span");
                temp.innerHTML = node.innerHTML;
                const rt = temp.querySelector("rt");
                const ruby = rt.innerText;
                rt.remove();
                const text = temp.innerText;
                element.replaceChild(new Itext.Ruby(text, ruby), node);
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                // 要素ノードの場合は、その子要素も処理
                this.#processTextNodes(node);
            }
        });
    }
    #updateText() {
        // ボイス再生
        this.#voice && this.#frame++ % 2 == 0 && this.#voice.play();
        const spans = [...this.#wrapper.querySelectorAll(".i-text-component")].filter((ichar) => !ichar.isEnd);
        if (spans.length === 0) {
            this.finish();
            return;
        }
        const mainSpan = spans[0];
        mainSpan && mainSpan.update();
    }
    // アニメーションを即座に完了
    finish() {
        clearInterval(this.#interval);
        this.#wrapper.innerHTML = this.#originalHTML;
        this.isEnd = true;
        this.#resolve();
    }
    remove() {
        super.remove();
        clearInterval(this.#interval);
        this.#resolve();
        this.isEnd = true;
    }
}
customElements.define("i-text", Itext);
(function (Itext) {
    class Char extends HTMLElement {
        isEnd = false;
        #text;
        #i = 0;
        constructor(text) {
            super();
            this.#text = text;
            this.className = "i-text-component";
        }
        update() {
            this.innerText = this.#text.slice(0, this.#i);
            this.#i++;
            this.isEnd = this.#text.length === this.#i - 1;
        }
    }
    Itext.Char = Char;
    customElements.define("i-char", Char);
    class Ruby extends HTMLElement {
        isEnd = false;
        #text;
        #ruby;
        #i = 0;
        constructor(text, ruby) {
            super();
            this.#text = text;
            this.#ruby = ruby;
            this.className = "i-text-component";
        }
        update() {
            this.innerHTML = `<ruby>${this.#text.slice(0, this.#i)}<rt>${this.#ruby.slice(0, this.#i)}</rt></ruby>`;
            this.#i++;
            if (Math.max(this.#text.length, this.#ruby.length) === this.#i - 1) {
                this.isEnd = true;
            }
        }
    }
    Itext.Ruby = Ruby;
    customElements.define("i-ruby", Ruby);
})(Itext || (Itext = {}));
