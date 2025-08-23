import { Scenes } from "./Scenes/Scenes"
import { BGM } from "./utils/BGM"
import { Input } from "./utils/Input"
import { ETyping } from "./utils/ETyping"

ETyping

document.addEventListener("DOMContentLoaded", async () => {
    BGM.init()
    Input.init()

    const { ScenePretitle } = await import("./Scenes/ScenePretitle.js")

    Scenes.init(new ScenePretitle())
})
