import{E as c,S as d,A as s,a as r}from"../run.js";import{S as y,P as l,a as m}from"./ScenePretitle-84PJl96k.js";class a{static day=0;static yami=0;static usedMedicine=!1;static dark=!1;static reset(){this.day=0,this.dark=!1,this.usedMedicine=!1,this.yami=0}static display(t){t.innerHTML+=`
            <div id="state">
                ${this.day+1}にちめ
                <div id="yami-area">
                   <span>やみ゜: </span>
                   <span id="yami"></span>
                </div>
            </div>
        `,t.querySelector("#yami").style.width=`${this.yami*23/2}%`}}class S extends y{ready;#t;constructor(){super(),this.ready=this.#e()}async#e(){const t=await(await fetch("pages/novel.html")).text();this.#t=new l(document.querySelector("#container"),"#novel",t),this.#s()}async#s(){const t=document.querySelector("#bottom"),o=h[Math.min(a.yami,4)];for(const n of o){const e=new c(n,d.voice);t.appendChild(e),await Promise.race([e.end,s.ok()]),e.classList.add("text-end"),e.isEnd||e.finish(),await s.ok(),e.remove()}a.reset(),r.goto(()=>new m)}}const h=[[""]];export{S as SceneNovel};
//# sourceMappingURL=SceneNovel-Cy-DZ5z6.js.map
