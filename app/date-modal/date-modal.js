const observableModule = require("tns-core-modules/data/observable");
let closeCallback;

function onShow(args){
    closeCallback = args.closeCallback;
    let months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = args.context.dc;
    let year = new Date().getFullYear();
    let day = date.split(" ")[0];
    let month = months.indexOf(date.split(" ")[1]);
    args.object.bindingContext = observableModule.fromObject({
        year, month, day
    });
}

function onUpdate(args){
    let page = args.object.page;
    let year = page.bindingContext.get("year");
    let month = page.bindingContext.get("month");
    let day = page.bindingContext.get("day");

    let months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let m = months[parseInt(month)];
    closeCallback(day + " " + m);
}

function onCancel(args){
    closeCallback();
}

exports.onShow = onShow;
exports.onUpdate = onUpdate;
exports.onCancel = onCancel;
