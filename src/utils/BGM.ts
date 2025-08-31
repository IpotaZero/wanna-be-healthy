export class BGM {
    static context: AudioContext
    static gain: GainNode
    static source: AudioBufferSourceNode | null = null

    static #volume = 0.3

    static #initialized = false
    static init() {
        if (this.#initialized) throw new Error("すでにinitialized!")
        this.#initialized = true

        this.context = new AudioContext()
        this.gain = this.context.createGain()
        this.gain.connect(this.context.destination)
    }
    static async fetch(
        path: string,
        {
            loopStart,
            loopEnd,
            loop,
            volume,
            detune,
        }: { loopStart?: number; loopEnd?: number; loop?: boolean; volume?: number; detune?: number } = {},
    ) {
        this.source?.stop()
        this.source?.disconnect()
        this.pause()
        this.#setVolume(this.#volume * (volume ?? 1))

        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = await this.context.decodeAudioData(arrayBuffer)
        this.source = this.context.createBufferSource()
        this.source.buffer = buffer

        this.source.loop = loop ?? true
        this.source.loopStart = loopStart ?? 0
        this.source.loopEnd = loopEnd ?? this.source.buffer.duration

        if (detune !== undefined) {
            this.source.detune.value = detune
        }

        this.source.connect(this.gain)
        this.source.start()
    }

    static async play() {
        await this.context.resume()
    }

    static async pause() {
        await this.context.suspend()
    }

    static async fadeOut(durationMS: number) {
        await this.fade(0, durationMS)
        this.pause()
    }

    static async fade(volume: number, durationMS: number) {
        this.gain.gain.cancelScheduledValues(this.context.currentTime)
        this.gain.gain.linearRampToValueAtTime(volume, this.context.currentTime + durationMS / 1000)

        await new Promise<void>((resolve) => setTimeout(() => resolve(), durationMS))
    }

    static #setVolume(volume: number) {
        this.gain.gain.cancelScheduledValues(0)
        this.gain.gain.value = volume
    }
}
