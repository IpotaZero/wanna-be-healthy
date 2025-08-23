export class Typing {
    #form: HTMLFormElement = document.getElementById("form") as HTMLFormElement
    #input: HTMLInputElement = document.getElementById("input") as HTMLInputElement
    #question = document.getElementById("question")!

    ready: Promise<void>

    #questions: string[]
    #questionNum = 0

    onClear = () => {}
    onStart = () => {}

    constructor(questions: string[]) {
        this.#questions = questions

        console.log(this.#questions)

        this.#form.onsubmit = (e) => {
            e.preventDefault()
            if (this.#input.value === this.#question.textContent) {
                this.onClear()
                this.#updateText()
            }
        }

        this.ready = new Promise((resolve) => {
            this.#input.addEventListener(
                "focus",
                () => {
                    this.onStart()
                    this.#updateText()
                    resolve()
                },
                { once: true },
            )
        })
    }

    finish() {
        this.#input.readOnly = true
    }

    #updateText() {
        this.#input.value = ""

        let num = 0

        do {
            num = Math.floor(Math.random() * this.#questions.length)
        } while (num === this.#questionNum)

        this.#questionNum = num
        this.#question.textContent = this.#questions[num]
    }
}
