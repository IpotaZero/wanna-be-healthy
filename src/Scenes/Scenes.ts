import { Awaits } from "../utils/Awaits.js"
import { Scene } from "./Scene.js"

export class Scenes {
    static #currentScene: Scene

    static init(firstScene: Scene) {
        this.#currentScene = firstScene
    }

    static async goto(
        newScene: () => Scene,
        {
            showLoading = this.#showLoading,
            hideLoading = this.#hideLoading,
        }: { showLoading?: () => void; hideLoading?: () => void } = {},
    ) {
        this.#currentScene.end()

        const container = document.getElementById("container")!

        await Awaits.fadeOut(container)

        let done = false
        let showed = false

        // 1秒タイマーを並行実行
        Awaits.sleep(1000).then(() => {
            if (!done) {
                showLoading() // ローディング画面表示
                showed = true
            }
        })

        this.#currentScene = newScene()
        await this.#currentScene.ready // メイン処理実行
        done = true // 1秒以内に終わればローディングは表示されない

        if (showed) {
            hideLoading()
        }

        await Awaits.fadeIn(container)
    }

    static #showLoading() {
        const p = document.createElement("p")
        p.textContent = "Loading..."
        p.classList.add("loading")
        document.body.appendChild(p)
    }

    static #hideLoading() {
        document.querySelectorAll(".loading").forEach((e) => e.remove())
    }
}
