export const htmlDecode = (text) => {
    const span = document.createElement("span");
    span.innerHTML = text;

    return span.textContent;
}