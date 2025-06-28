"use strict";
class Sound {
    static context;
    static gain;
    static initialized = false;
    gain;
    audioBuffer;
    reversedBuffer;
    isReversed = false;
    lastPlayTime = 0;
    isReady;
    static init() {
        if (this.initialized)
            throw new Error("Sound is already initialized!");
        this.initialized = true;
        this.context = new AudioContext();
        this.gain = this.context.createGain();
        this.gain.connect(this.context.destination);
    }
    static setWholeVolume(volume) {
        Sound.checkInit();
        this.gain.gain.value = volume;
    }
    constructor({ src, volume = 0.4 }) {
        Sound.checkInit();
        this.gain = Sound.context.createGain();
        this.gain.connect(Sound.gain);
        this.gain.gain.value = volume;
        // プリロードしておく
        this.isReady = this.fetch(src);
    }
    async play() {
        if (Date.now() - this.lastPlayTime < 33)
            return;
        this.lastPlayTime = Date.now();
        // AudioContextがsuspendされていたらresume
        if (Sound.context.state === "suspended") {
            await Sound.context.resume();
        }
        // プリロード完了まで待つ
        await this.isReady;
        const buffer = this.isReversed ? this.reversedBuffer : this.audioBuffer;
        if (!buffer)
            return;
        const source = Sound.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.gain);
        source.start();
    }
    reverse() {
        this.isReversed = !this.isReversed;
    }
    clearReversal() {
        this.isReversed = false;
    }
    async fetch(src) {
        const arrayBuffer = await (await fetch(src)).arrayBuffer();
        const audioBuffer = await Sound.context.decodeAudioData(arrayBuffer);
        this.audioBuffer = audioBuffer;
        this.reversedBuffer = this.reverseBuffer(audioBuffer);
    }
    reverseBuffer(buffer) {
        const reversedBuffer = Sound.context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const originalData = buffer.getChannelData(channel);
            const reversedData = reversedBuffer.getChannelData(channel);
            for (let i = 0; i < originalData.length; i++) {
                reversedData[i] = originalData[originalData.length - i - 1];
            }
        }
        return reversedBuffer;
    }
    static checkInit() {
        if (!this.context)
            throw new Error("Sound is not initialized. Call Sound.init() before using Sound.");
    }
}
