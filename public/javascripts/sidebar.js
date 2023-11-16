let sidebarDashboard = document.getElementById('sidebarDashboard');
let sidebarAdmins = document.getElementById('sidebarAdmins');
let sidebarClients = document.getElementById('sidebarClients');
let sidebarBills = document.getElementById('sidebarBills');
let sidebarBillsPro = document.getElementById('sidebarBillsPro');
let sidebarProducts = document.getElementById('sidebarProducts');
let sidebarDiscounts = document.getElementById('sidebarDiscounts');
let sidebarBlogs = document.getElementById('sidebarBlogs');

document.addEventListener('readystatechange', async event => {
    // When HTML/DOM elements are ready:
    console.log(window.location.href);
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        console.log("interactive");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        console.log(window.location.href);
        if (!sidebarDashboard.classList.contains('bg-success') && window.location.href.indexOf('/admin/dashboard') > -1) {
            sidebarDashboard.classList.add("bg-success");
        }
    }
});