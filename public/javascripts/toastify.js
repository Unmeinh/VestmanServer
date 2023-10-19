let toast = document.getElementById('toastify');
var toastObject = document.currentScript.getAttribute('toastObject');

function closeToast() {
    toast.classList.remove("d-block");
}

function showToast() {
    const url = new URL(location.href);
    url.searchParams.set("toastify", {type: 'error', message: "Hiện toast thất bại!"});
    toast.classList.add("d-block");
    setTimeout(
        () => {
            toast.classList.remove("d-block");
        }
        , 3000);
}

document.addEventListener('readystatechange', async event => {
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        console.log("interactive");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        if (toast.classList.contains('d-block') && toastObject != "") {
            setTimeout(
                () => {
                    toast.classList.remove("d-block");
                }
                , 3000);
        }
    }
});