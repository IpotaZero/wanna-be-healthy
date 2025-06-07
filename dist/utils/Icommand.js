"use strict";
class Icommand extends Ielement {
    static seSelect;
    static seCancel;
    static seOK;
    #cancelerDict = new Idict({});
    #handlerDict = new Idict({});
    #optionDict = new Idict({});
    #titleDict = new Idict({});
    #branch = "";
    #num = 0;
    #input;
    #currentState = {
        optionList: undefined,
        title: undefined,
    };
    constructor(container, dict, options = {}) {
        super(container, options);
        this.#optionDict = dict;
        this.#titleDict = options.title ?? new Idict({});
        this.#setupInput();
        this.#update();
    }
    cancel(depth) {
        for (let i = 0; i < depth; i++) {
            this.#cancelerDict.get(this.#branch)?.();
            if (this.#branch == "")
                break;
            this.#num = Number.parseInt(this.#branch.slice(-1), 36);
            this.#branch = this.#branch.slice(0, -1);
        }
        Icommand.seCancel?.play();
        const handler = this.#handlerDict.get(this.#branch);
        if (handler && !handler.onMove) {
            handler(this.#num, this.#branch, this);
        }
        this.#update();
    }
    select() {
        if (this.#currentState.optionList && this.#currentState.optionList[this.#num][0] != "!")
            Icommand.seOK?.play();
        this.#branch += this.#num.toString(36);
        const num = this.#num;
        this.#num = 0;
        const h = this.#handlerDict.get(this.#branch);
        if (h && !h.onMove) {
            h(num, this.#branch, this);
        }
        this.#update();
    }
    on(regex, handler, option = {}) {
        const handlerWithOption = Object.assign(handler, { onMove: !!option.onMove });
        this.#handlerDict.dict[regex] = handlerWithOption;
    }
    onLeft(regex, handler) {
        this.#cancelerDict.dict[regex] = handler;
    }
    isMatch(regex) {
        return !!this.#branch.match(regex);
    }
    setNum(num) {
        this.#num = num;
        console.log(num);
        this.#updateArrow();
    }
    remove() {
        super.remove();
        this.#input.remove();
    }
    setOption(regex, optionList) {
        this.#optionDict.dict[regex] = optionList;
    }
    setTitle(regex, title) {
        this.#titleDict.dict[regex] = title;
    }
    #setupArrow() {
        new Itext(this, "→", {
            css: {
                position: "absolute",
                top: "0%",
                left: "0%",
                lineHeight: "1",
                " .wrapper": {
                    animation: "rev infinite 3s ease-in-out",
                },
            },
            className: "arrow",
        });
    }
    #setupInput() {
        this.#input = new Iinput(document, "keydown", (E) => {
            const e = E;
            if (!Input.canInput)
                return;
            if (Input.keyConfig.cancel.includes(e.code)) {
                if (this.#branch == "") {
                    this.#cancelerDict.get("")?.();
                }
                else {
                    this.cancel(1);
                }
                return;
            }
            if (!this.#currentState.optionList)
                return;
            if (Input.keyConfig.up.includes(e.code)) {
                this.#num += this.#currentState.optionList.length - 1;
                this.#num %= this.#currentState.optionList.length;
                this.#updateArrow();
                Icommand.seSelect?.play();
            }
            else if (Input.keyConfig.down.includes(e.code)) {
                this.#num++;
                this.#num %= this.#currentState.optionList.length;
                this.#updateArrow();
                Icommand.seSelect?.play();
            }
            else if (Input.keyConfig.ok.includes(e.code)) {
                if (typeof this.#currentState.optionList[this.#num] === "string")
                    this.select();
            }
            else if (Input.keyConfig.right.includes(e.code)) {
                this.#onLeftRight(1);
            }
            else if (Input.keyConfig.left.includes(e.code)) {
                this.#onLeftRight(-1);
            }
        });
    }
    #onLeftRight(i) {
        const data = this.#currentState.optionList[this.#num];
        if (typeof data === "string")
            return;
        // 以下、input要素なら
        const irange = this.children[this.#num + 1];
        const input = irange.input;
        input.value = String(+input.value + i);
        this.#handlerDict.get(this.#branch + this.#num.toString(36))?.(+input.value, this.#branch, this);
        data[1] = +input.value;
        Icommand.seSelect?.play();
    }
    #updateArrow() {
        if (!this.#currentState.optionList)
            return;
        const arrow = this.querySelector(".arrow");
        arrow.style.marginTop = `${this.#num}em`;
        const options = this.querySelectorAll(".option");
        options[this.#num].scrollIntoView({
            behavior: "smooth",
        });
        this.#updateTextState();
        const handler = this.#handlerDict.get(this.#branch);
        handler && handler.onMove && handler(this.#num, this.#branch, this);
    }
    #updateOptions() {
        if (!this.#currentState.optionList)
            return;
        this.#setupArrow();
        this.#currentState.optionList.forEach((option, i) => {
            if (typeof option == "string") {
                let label = option;
                if (label[0] == "!")
                    label = label.slice(1);
                this.#setText(label, i);
            }
            else {
                this.#setRange(option, i);
            }
        });
    }
    #setText(text, i) {
        const itext = new Itext(this, text, {
            css: {
                position: "relative",
                marginLeft: "1em",
                display: "block",
                width: "fit-content",
                lineHeight: "1",
                cursor: "pointer",
                opacity: "0.5",
                whiteSpace: "nowrap",
                ".selected": {
                    opacity: "1",
                    animation: "shake infinite 0.5s",
                    textShadow: "0.2vh 0.3vh 0.3vh rgba(0, 0, 0, 0.4)",
                },
                " span": {
                    display: "flex",
                    pointerEvents: "none",
                },
            },
            className: `option branch-${this.#branch}`,
        });
        itext.onmouseover = () => {
            this.#num = i;
            this.#updateTextState();
        };
        itext.onclick = () => {
            if (!Input.canInput)
                return;
            this.select();
        };
    }
    /**
     * テキストの選択状態を更新する
     */
    #updateTextState() {
        const options = [...this.querySelectorAll(".option")];
        options.forEach((option, i) => {
            option.classList.toggle("selected", i === this.#num);
        });
    }
    #setRange(option, i) {
        const range = new Irange(this, {
            label: option[0],
            value: option[1],
            min: option[2],
            max: option[3],
            css: {
                display: "flex",
                position: "relative",
                height: "1em",
                marginLeft: "1em",
                whiteSpace: "nowrap",
                opacity: "0.5",
                " input": {
                    position: "absolute",
                    height: "0.8em",
                    left: "14em",
                    top: "0.5em",
                },
                ".selected": {
                    opacity: "1",
                    textShadow: "0.2vh 0.3vh 0.3vh rgba(0, 0, 0, 0.4)",
                },
            },
            className: "option",
        });
        range.input.addEventListener("input", (E) => {
            const t = E.target;
            this.#handlerDict.get(this.#branch + i.toString(36))?.(+t.value, this.#branch, this);
            option[1] = +t.value;
        });
    }
    #updateTitle() {
        if (!this.#currentState.title)
            return;
        new Itext(this, this.#currentState.title, {
            css: {
                position: "relative",
                display: "block",
                width: "fit-content",
                lineHeight: "1",
            },
            className: "title",
        });
    }
    #updateState() {
        this.#currentState.optionList = this.#optionDict.get(this.#branch);
        this.#currentState.title = this.#titleDict.get(this.#branch);
        [...this.children].forEach((n) => n.remove());
    }
    #update() {
        this.#updateState();
        this.#updateOptions();
        this.#updateTitle();
        this.#updateArrow();
    }
}
customElements.define("i-command", Icommand);
