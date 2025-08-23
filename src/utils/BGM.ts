export class BGM {
    static #context: AudioContext
    static #gain: GainNode
    static audio: HTMLAudioElement | null = null
    static #source: MediaElementAudioSourceNode | null = null

    static #volume = 0.3

    static path: string = ""

    static #initialized = false
    static init() {
        if (this.#initialized) throw new Error("すでにinitialized!")
        this.#initialized = true

        this.#context = new AudioContext()
        this.#gain = this.#context.createGain()
        this.#gain.connect(this.#context.destination)
    }

    static fetch(path: string, loop = true) {
        this.audio?.pause()
        this.#source?.disconnect()

        this.path = path

        return new Promise<void>((resolve) => {
            this.audio = new Audio(path)
            this.audio.loop = loop

            this.#source = this.#context.createMediaElementSource(this.audio)
            this.#source.connect(this.#gain)

            if (this.audio.readyState >= 2) {
                resolve()
                this.setVolume(this.#volume)
            } else {
                this.audio.oncanplay = () => {
                    resolve()
                    this.setVolume(this.#volume)
                }
            }
        })
    }

    static async play() {
        await this.#context.resume()
        await this.audio?.play()
    }

    static pause() {
        this.audio?.pause()
    }

    static async fadeOut(durationMS: number) {
        await this.fade(0, durationMS)
        this.pause()
    }

    static async fade(volume: number, durationMS: number) {
        this.#gain.gain.cancelScheduledValues(this.#context.currentTime)
        this.#gain.gain.linearRampToValueAtTime(volume, this.#context.currentTime + durationMS / 1000)

        await new Promise((resolve) => setTimeout(resolve, durationMS))
    }

    static setVolume(volume: number) {
        this.#volume = volume

        this.#gain.gain.cancelScheduledValues(0)
        this.#gain.gain.value = this.#volume
    }
}
