btnTxt = "コピー";
btnTxtMkdn = "markdownでコピー";
btnTxtCncl = "キャンセル";
execFunc = function(ele) {
    if (this.mode == "mkdn") {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            alert('テキストが選択されていません。');
            return;
        }
        const range = selection.getRangeAt(0);
        const container = document.createElement('div');
        container.appendChild(range.cloneContents());
        const images = container.querySelectorAll('img');
        images.forEach(img => {
            const imgMarkdown = `![](${img.src})`;
            const textNode = document.createTextNode(imgMarkdown);
            if (img.nextSibling) {
                img.parentNode.insertBefore(textNode, img.nextSibling);
            } else {
                img.parentNode.appendChild(textNode);
            }
        });
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const linkMarkdown = `[${link.textContent}](${link.href})`;
            const textNode = document.createTextNode(linkMarkdown);
            if (link.nextSibling) {
                link.parentNode.insertBefore(textNode, link.nextSibling);
            } else {
                link.parentNode.appendChild(textNode);
            }
        });
        const processedText = container.innerText.replace(/^(\r\n|\n|\r){2,}$/gm, '\n\n');
        copyTxt = "[" + document.title + "](" + location.href + ")\n";
        copyTxt += processedText;
    } else if (this.mode == "cncl") {
        console.log("Copy Cancelled.");
        document.querySelector(".div-cntr").remove();
        return;
    } else {
        copyTxt = document.title + "\n" + location.href + "\n" + window.getSelection().toString();
    }
    console.log(copyTxt);
    navigator.clipboard.writeText(copyTxt);
    document.querySelector(".div-cntr").remove();
};

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('クリップボードにコピーされました');
    }, function(err) {
        console.error('クリップボードへのコピーに失敗しました', err);
        fallbackCopyTextToClipboard(text);
    });
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback:Copying text command was' + msg);
    } catch (err) {
        console.error('Fallback:Oops,unable to copy', err);
    }
    document.body.removeChild(textArea);
}
btnCSS = `<style>.btn-copy{width:100%;height:100px;color:white;background-color:black;font-size:xx-large;border:solid thick white;text-align:center;}.div-cntr{position:fixed;top:60%;z-index:999;width:100%;}</style>`;
document.head.insertAdjacentHTML("beforeend", btnCSS);
createBtn = function(div, txt) {
    var btn = document.createElement("button");
    btn.textContent = txt;
    btn.classList.add("btn-copy");
    div.appendChild(btn);
    return btn;
};
btnDiv = document.createElement("div");
btnDiv.classList.add("div-cntr");
btnEle = createBtn(btnDiv, btnTxt);
btnEleMkdn = createBtn(btnDiv, btnTxtMkdn);
btnEleCncl = createBtn(btnDiv, btnTxtCncl);
btnEle.addEventListener('click', {
    mode: "txt",
    handleEvent: execFunc
});
btnEleMkdn.addEventListener('click', {
    mode: "mkdn",
    handleEvent: execFunc
});
btnEleCncl.addEventListener('click', {
    mode: "cncl",
    handleEvent: execFunc
});
document.body.prepend(btnDiv);
