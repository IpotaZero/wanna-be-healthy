"use strict";
let currentScene;
document.addEventListener("DOMContentLoaded", () => {
    Input.init();
    BGM.init();
    // currentScene = new SceneTitle()
    // currentScene = new SceneDay()
    currentScene = new SceneNight(true);
    requestAnimationFrame(mainLoop);
});
class DOM {
    static container = document.getElementById("container");
    static dark;
    static awakeness;
    static setParameter() {
        this.container.innerHTML += `
            <div id="parameter">
                <div class="parameter">
                    <span class="label"> やみ゜: </span>
                    <span class="value-box">
                        <span class="value" style="width: 0"></span>
                    </span>
                </div>
                <div class="parameter">
                    <span class="label"> かくせい゜: </span>
                    <span class="value-box">
                        <span class="value"></span>
                    </span>
                </div>
            </div>
        `;
        this.dark = document.querySelectorAll("#parameter .parameter .value-box .value")[0];
        this.awakeness = document.querySelectorAll("#parameter .parameter .value-box .value")[1];
    }
}
const state = {
    dark: [],
    usedSleepingMedicine: true,
    OD: false,
    day: 1,
    wannaMedicine: 0,
};
let lastUpdateTime = performance.now();
function mainLoop(currentTime) {
    const elapsedTime = currentTime - lastUpdateTime;
    currentScene.loop(elapsedTime);
    lastUpdateTime = currentTime;
    requestAnimationFrame(mainLoop);
}
