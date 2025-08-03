import { Scenes } from "./Scenes/Scenes"
import { Input } from "./utils/Input"
import { Typing } from "./utils/Typing"

Typing

document.addEventListener("DOMContentLoaded", async () => {
    Input.init()

    const { SceneTitle } = await import("./Scenes/SceneTitle.js")

    Scenes.init(new SceneTitle())
})
