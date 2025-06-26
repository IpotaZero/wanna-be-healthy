"use strict";
class Typing extends HTMLElement {
    #interval;
    #originalHTML;
    #wrapper = document.createElement("div");
    #voice = null;
    #frame = 0;
    isEnd = false;
    ready;
    #resolve;
    constructor(html, speed, voice) {
        super();
        if (this.dataset["voice"]) {
            this.#voice = new Audio(voice ?? this.dataset["voice"]);
        }
        const text = html ?? this.innerHTML;
        this.innerHTML = "";
        this.#wrapper.className = "typing-wrapper";
        this.appendChild(this.#wrapper);
        this.#setupText(text);
        this.ready = new Promise((resolve) => {
            this.#resolve = resolve;
        });
        const s = speed ?? (this.dataset["speed"] ? parseFloat(this.dataset["speed"]) : 24);
        // アニメーション開始
        this.#interval = setInterval(() => {
            this.#updateText();
        }, 1000 / s);
    }
    #validationText(text) {
        return text.replace(/\s{2,}/g, " ").replace(/\n/g, "");
    }
    #setupText(text) {
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
                    element.replaceChild(new Typing.Char(text), node);
                }
            }
            else if (node.tagName === "RUBY") {
                const temp = document.createElement("span");
                temp.innerHTML = node.innerHTML;
                const rt = temp.querySelector("rt");
                const ruby = rt.innerText;
                rt.remove();
                const text = temp.innerText;
                element.replaceChild(new Typing.Ruby(text, ruby), node);
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
        const spans = [...this.#wrapper.querySelectorAll(".typing-component")].filter((char) => !char.isEnd);
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
        // this.#wrapper.innerHTML = this.#originalHTML
        this.isEnd = true;
        this.#resolve();
        const chars = [...this.#wrapper.querySelectorAll(".typing-component")];
        chars.forEach((char) => {
            if (char instanceof Typing.Char) {
                char.finish();
            }
            else if (char instanceof Typing.Ruby) {
                char.finish();
            }
        });
    }
    remove() {
        super.remove();
        clearInterval(this.#interval);
        this.#resolve();
        this.isEnd = true;
    }
    restart() {
        // this.#wrapper.innerHTML = this.#originalHTML
        // this.#processTextNodes(this.#wrapper)
        this.ready = new Promise((resolve) => {
            this.#resolve = resolve;
        });
        const chars = [...this.#wrapper.querySelectorAll(".typing-component")];
        chars.forEach((char) => char.restart());
        this.isEnd = false;
        clearInterval(this.#interval);
        const speed = this.dataset["speed"] ? parseFloat(this.dataset["speed"]) : 24;
        this.#interval = setInterval(() => {
            this.#updateText();
        }, 1000 / speed);
    }
}
customElements.define("i-typing", Typing);
(function (Typing) {
    class Char extends HTMLElement {
        isEnd = false;
        #text;
        #i = 0;
        constructor(text) {
            super();
            this.#text = text;
            this.className = "typing-component";
        }
        update() {
            this.innerText = this.#text.slice(0, this.#i);
            this.#i++;
            this.isEnd = this.#text.length === this.#i - 1;
        }
        restart() {
            this.#i = 0;
            this.isEnd = false;
            this.update();
        }
        finish() {
            this.isEnd = true;
            this.innerText = this.#text;
        }
    }
    Typing.Char = Char;
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
            this.className = "typing-component";
        }
        update() {
            this.innerHTML = `<ruby>${this.#text.slice(0, this.#i)}<rt>${this.#ruby.slice(0, this.#i)}</rt></ruby>`;
            this.#i++;
            if (Math.max(this.#text.length, this.#ruby.length) === this.#i - 1) {
                this.isEnd = true;
            }
        }
        restart() {
            this.#i = 0;
            this.isEnd = false;
            this.update();
        }
        finish() {
            this.isEnd = true;
            this.innerHTML = `<ruby>${this.#text}<rt>${this.#ruby}</rt></ruby>`;
        }
    }
    Typing.Ruby = Ruby;
    customElements.define("i-ruby", Ruby);
})(Typing || (Typing = {}));
