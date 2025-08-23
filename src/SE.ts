export class Sound {
    #audio: HTMLAudioElement

    constructor(path: string, volume: number = 1) {
        this.#audio = new Audio(path)
        this.#audio.volume = volume
    }

    get duration() {
        return this.#audio.duration
    }

    play() {
        this.#audio.currentTime = 0
        this.#audio.play()
    }

    setVolume(volume: number) {
        this.#audio.volume = volume
    }
}

export class SE {
    static click = new Sound("assets/sounds/クリック.mp3")
    static voice = new Sound("assets/sounds/select.wav")
    static damage = new Sound("assets/sounds/damage.mp3", 0.3)
    static MCR = new Sound("assets/sounds/MCR.wav", 0.3)

    static setVolume(volume: number) {
        Object.values(this).forEach((se) => {
            se.setVolume(volume)
        })
    }
}
