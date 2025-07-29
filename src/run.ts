import { Scenes } from "./Scenes/Scenes"
import { Typing } from "./utils/Typing"

Typing

document.addEventListener("DOMContentLoaded", async () => {
    const { SceneTitle } = await import("./Scenes/SceneTitle.js")

    Scenes.init(new SceneTitle())
})
