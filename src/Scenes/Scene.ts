export abstract class Scene {
    abstract ready: Promise<void>
    async end() {}
}
