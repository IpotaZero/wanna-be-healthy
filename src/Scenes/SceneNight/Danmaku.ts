import { Input } from "../../utils/Input"
import { Timer } from "../../utils/Timer"
import { G } from "./global"

export class Danmaku {
    readonly #grazeTimer = new Timer(30)
    onGraze() {}
    onDamage() {}

    update(ds: number) {
        for (let i = 0; i < Math.round(ds); i++) {
            G.player.update(1)
            G.enemies.forEach((e) => e.update(1))
            G.bullets.forEach((b) => b.update(1))
            this.#damage()
        }

        G.bullets.forEach((b) => {
            if (b.life <= 0) G.app.stage.removeChild(b)
        })
        G.bullets = G.bullets.filter((b) => b.life > 0)

        Input.update()
    }

    #damage() {
        G.bullets.forEach((b) => {
            if (this.#grazeTimer.timer === 0) {
                if (b.p.sub(G.player.p).magnitude() * 0.5 > b.r + G.player.r) return
                this.onGraze()
                this.#grazeTimer.action()
            }

            if (b.p.sub(G.player.p).magnitude() * 1.5 > b.r + G.player.r) return

            b.life = 0

            this.onDamage()
        })

        this.#grazeTimer.update()
    }
}
