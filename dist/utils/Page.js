"use strict";
function page(container, currentPageId, html) {
    const history = [currentPageId];
    container.innerHTML = html;
    container.querySelectorAll(".page").forEach((page) => {
        if (page.id !== currentPageId) {
            page.classList.add("hidden");
        }
    });
    container.querySelectorAll("[data-link]").forEach((button) => {
        button.addEventListener("click", () => {
            const targetPageId = button.getAttribute("data-link");
            if (targetPageId) {
                history.push(targetPageId);
                changePage(targetPageId);
            }
        });
    });
    container.querySelectorAll("[data-back]").forEach((backButton) => {
        backButton.addEventListener("click", () => {
            if (history.length > 1) {
                history.pop();
                const previousPageId = history[history.length - 1];
                changePage(previousPageId);
            }
        });
    });
    const changePage = (pageId) => {
        container.querySelectorAll(".page").forEach((page) => {
            if (page.id === pageId) {
                page.classList.remove("hidden");
            }
            else {
                page.classList.add("hidden");
            }
        });
    };
}
