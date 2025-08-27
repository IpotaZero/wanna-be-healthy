export class State {
    static day = 0
    static yami = 0

    static usedMedicine = false
    static dark = false

    static reset() {
        this.day = 0
        this.dark = false
        this.usedMedicine = false
        this.yami = 0
    }

    static display(container: HTMLElement) {
        container.innerHTML += `
            <div id="state">
                ${this.day + 1}にちめ
                <div id="yami-area">
                   <span>やみ゜: </span>
                   <span id="yami"></span>
                </div>
            </div>
        `

        container.querySelector<HTMLElement>("#yami")!.style.width = `${(this.yami * 23) / 2}%`
    }
}
