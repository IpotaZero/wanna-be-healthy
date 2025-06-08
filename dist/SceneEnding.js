"use strict";
class SceneEnding extends Scene {
    constructor() {
        super();
        // いい感じの分岐
        // if(state.dark)
        this.#ending0();
    }
    // 0ミス
    #ending0() {
        const texts = [
            "朝、カーテンの隙間から差し込む光で目を覚ました。",
            "のそのそとベッドから降り、半ば寝ぼけた頭でコーヒーを作る。",
            "私はミルクをたっぷりと入れたコーヒーが好きだ。",
            "シャワーを浴びて、制服に着替える。",
            "袖を通す感覚が、なぜか心地よくて、良い気分になった。",
            "玄関にある姿見で髪を整える。",
            "靴を履いて、ドアノブに手をかけて、振り返って言った。",
            "「おかーさん、朝練、行ってくるね。」",
            "Ending0「朝練」",
        ];
        this.#processTexts(texts);
    }
    async #processTexts(texts) {
        for (const text of texts) {
            const textElm = this.#createText(text);
            await Awaits.ok();
            if (!textElm.isEnd) {
                textElm.finish();
                await Awaits.ok();
            }
            textElm.remove();
        }
        await Awaits.fade(1000);
        currentScene = new SceneTitle();
    }
    #createText(text) {
        return new Itext(DOM.container, text, {
            css: {
                bottom: "8vh",
                fontFamily: "serif",
            },
        });
    }
}
