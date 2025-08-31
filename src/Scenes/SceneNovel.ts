import { SE } from "../SE"
import { State } from "../State"
import { Awaits } from "../utils/Awaits"
import { ETyping } from "../utils/ETyping"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Scenes } from "./Scenes"

export class SceneNovel extends Scene {
    ready: Promise<void>

    #page!: Pages

    #first

    constructor(first: boolean) {
        super()
        this.#first = first
        this.ready = this.#setup()
    }

    async #setup() {
        const html = await (await fetch("pages/novel.html")).text()

        this.#page = new Pages(document.querySelector("#container")!, "#novel", html)

        const story = this.#getStory()

        this.#loop(story)
    }

    #getStory() {
        if (this.#first) {
            return texts[0]
        }

        const story = texts[State.yami + (State.dark ? 4 : 0) + 1]

        return story
    }

    async #loop(story: string[]) {
        const bottom = document.querySelector("#bottom")!

        for (const text of story) {
            const t = new ETyping(text, SE.voice)
            bottom.appendChild(t)

            await Promise.race([t.end, Awaits.ok()])
            t.classList.add("text-end")

            if (!t.isEnd) {
                t.finish()
            }

            await Awaits.ok()

            t.remove()
        }

        if (this.#first) {
            const { SceneDay } = await import("./SceneDay")
            Scenes.goto(() => new SceneDay(), { msIn: 1000, msOut: 1000 })
        } else {
            const { SceneTitle } = await import("./SceneTitle")
            Scenes.goto(() => new SceneTitle(), { msIn: 1000, msOut: 1000 })
        }
    }
}

const texts = [
    [
        "私はちょっと眠たがり屋さん。",
        "私服のセンスが終わってるってよく言われる中学生。",
        "このゲームは、そんな私が頑張って夜に眠るゲームです。",
        "目覚まし時計の音、カーテンから差し込む朝の光、コーヒーの香り……",
        "でも、時には寝坊しちゃったり、ぼんやりしちゃったり。あなたの選択で、4日後の私の1日がどうなるかが変わります。",
        "おかーさんの眠剤を1つだけくすねてあるから難しい所で使おう。",
        "いろんなエンディングを見つけて、私と一緒に健康な毎日を目指してみてね！",
    ],
    [
        "朝、カーテンの隙間から差し込む光で目を覚ました。",
        "のそのそとベッドから降り、半ば寝ぼけた頭でコーヒーを作る。",
        "私はミルクをたっぷりと入れたコーヒーが好きだ。",
        "シャワーを浴びて、制服に着替える。",
        "袖を通す感覚が、どうしてか心地よくて、良い気分になった。",
        "玄関にある姿見で髪を整える。",
        "靴を履いて、ドアノブに手をかけて、振り返って言った。",
        "「おかーさん、朝練、行ってくるね」",
        "Ending0「朝練」",
    ],
    [
        "煩く鳴り響く目覚まし時計の音。",
        "布団から腕だけを出し、音源を探る。",
        "寝ぼけたままベッドから転がり落ち、なんとか止めることに成功した。",
        "のそのそと制服に着替え、ふらりふらりとした足取りで家を出る。",
        "「......ねむい」",
        "Ending1「朝は眠い」",
    ],
    [
        "目覚まし時計が鳴った......ような気がした。",
        "......",
        "......",
        "ぱちりと目を開けると、時計の針は10時を指している。",
        "静かな家の中、急いで準備をして、玄関の前に立つ。",
        "あと一歩が、どうしても出ない。",
        "そのまま踵を返して、ベッドに倒れこんだ。",
        "Ending2「お昼からは行くよ」",
    ],
    [
        "バキバキになった体をなんとか起こす。",
        "窓の外で真っ赤な太陽が沈んでいくのが見えた。",
        "あーあ。",
        "Ending3「絶起」",
    ],
    [
        "授業中、ぼんやりしていることが増えた......らしい。 自覚は無いのだけど。",
        "だけど、学校に来て、友達と居られるだけで、幸せなのかもしれない。",
        "Ending4「ぼんやり」 次は眠剤を使い過ぎずにクリアしよう!",
    ],
    [
        "結局、朝は起きられない。",
        "無理やり体を動かして学校へと向かう。",
        "途中、あまりに青い空に吐き気がして、立ち止まった。",
        "立ち止まってしまったんだ。",
        "Ending5「青い空」 次は眠剤を使い過ぎずにクリアしよう!",
    ],
    [
        "布団の中、夢を見た。",
        "修学旅行のような、曖昧な夢。",
        "もう、一日中、眠っていたい。",
        "Ending6「夢を見させて」 次は眠剤を使い過ぎずにクリアしよう!",
    ],
]
