var r = require("electron");

window.sendToHost = (a, b) => {
    console.log("Reporting Data (ipc) evt:", a)
    r.ipcRenderer.sendToHost(a, b); //jail break
};

var ipcRenderer = r.ipcRenderer;

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Patch - jQuery");
    window.$ = window.jQuery = require("./node_modules/jquery/dist/jquery.min.js");
    try {
        $(".password input").val("paic8888");
        $(".username input").val("qst0001");
        $(".login-button").click();
    } catch (e) {
        //auto login..
    }
});

document.addEventListener("load", function (event) {
    sendToHost('loaded');
});
