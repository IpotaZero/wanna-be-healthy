export class Awaits {
    static fadeOut(container: HTMLElement): Promise<void> {
        container.style.transition = "opacity 0.2s"
        container.style.opacity = "0"
        container.style.pointerEvents = "none"

        return this.sleep(200)
    }

    static async fadeIn(container: HTMLElement) {
        container.style.transition = "opacity 0.2s"
        container.style.opacity = "1"

        await this.sleep(200)

        container.style.pointerEvents = "all"
    }

    static sleep(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}
