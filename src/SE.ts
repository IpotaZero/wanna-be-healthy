export class Sound {
    #audio: HTMLAudioElement

    constructor(path: string) {
        this.#audio = new Audio(path)
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
    static voice = new Sound("assets/sounds/select.wav")
    static damage = new Sound("assets/sounds/damage.mp3")

    static setVolume(volume: number) {
        Object.values(this).forEach((se) => {
            se.setVolume(volume)
        })
    }
}
