class AudioEngine {
    #context: AudioContext
    #gain: GainNode

    ready: Promise<void>

    constructor(url: string) {
        this.#context = new AudioContext()
        this.#context.suspend()
        this.#gain = this.#context.createGain()
        this.#gain.connect(this.#context.destination)
        this.#gain.gain.value = 0.5 // Set default volume

        this.ready = this.#createBufferSource(url)
    }

    play() {
        if (this.#context.state === "suspended") {
            return this.#context.resume()
        }
        return Promise.resolve()
    }

    fadeOut() {
        return new Promise<void>((resolve) => {
            this.#gain.gain.setValueAtTime(this.#gain.gain.value, this.#context.currentTime)
            this.#gain.gain.linearRampToValueAtTime(0, this.#context.currentTime + 1)

            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }

    getCurrentTime(): number {
        return this.#context.currentTime
    }

    async #createBufferSource(url: string): Promise<void> {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.#context.decodeAudioData(arrayBuffer)

        const source = this.#context.createBufferSource()
        source.buffer = audioBuffer
        source.connect(this.#gain)
        source.start(0)
    }
}
