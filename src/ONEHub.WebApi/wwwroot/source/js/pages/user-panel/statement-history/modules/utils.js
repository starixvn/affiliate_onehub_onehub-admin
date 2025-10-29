const getBobyContentElement = () => {
    return document.getElementsByClassName("body-content")[0];
}
export const getScrollTopPosition = () => {
    const bodyContent = getBobyContentElement();
    return !!bodyContent ? bodyContent.scrollTop : 0;
}

export const setScrollTop = (position) => {
    const bodyContent = getBobyContentElement();

    if (!!bodyContent) {
        bodyContent.scrollTop = position;
    }
}