import { Application } from "pixi.js"
import { Player } from "./Player"
import { Bullet } from "./Bullet"
import { Enemy } from "./Enemy"

export class G {
    static player: Player
    static app: Application
    static bullets: Bullet[] = []
    static enemies: Enemy[] = []
}
