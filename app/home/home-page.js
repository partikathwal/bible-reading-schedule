const HomeViewModel = require("./home-view-model");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const fileSystemModule = require("tns-core-modules/file-system");
const books = require("../localdata/books.json");
let page = null;

function onNavigatingTo(args) {
    page = args.object;
    page.bindingContext = new HomeViewModel();
    pullList();
}

function onSwitchTap(args){
    let s = args.object;
    let dc;
    let id = s.id.split("_")[1];
    let days = page.bindingContext.get("days").slice();
    let day = days.find(day => day.id == id);
    let index = days.indexOf(day);
    if(!s.checked){ //checked gives state before switching, need opposite
        //switched on
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date();
        let m = months[date.getMonth()];
        let d = date.getDate();
        dc = d + " " + m;
    }else{
        dc = "";
    }

    updateRow(id, dc).then(() => {
        day.dateCompleted = dc;
        page.bindingContext.get("days").setItem(index, day);
    })

}

function showDateModal(args){
    let view = args.object;
    let id = view.id.split("_")[1];
    let days = page.bindingContext.get("days").slice();
    let day = days.find(day => day.id == id);
    let index = days.indexOf(day);
    let dc = day.dateCompleted;

    if(!dc) return;

    view.showModal("date-modal/date-modal", {
        context: {dc: dc},
        closeCallback: function(new_dc){
            if(!new_dc) return;

            updateRow(id, new_dc).then(() => {
                day.dateCompleted = new_dc;
                page.bindingContext.get("days").setItem(index, day);
            })
        }
    });
}

//===========


function pullList(){
    // page.bindingContext.set("isLoading", true)
    
    //get file
    let documents = fileSystemModule.knownFolders.documents();
    let folder = documents.getFolder("mydata");
    let file = folder.getFile("mybooks.json");
    let bookData = JSON.parse(file.readTextSync() || "[]"); 
    
    //if first time, initialize
    if(bookData.length === 0){
        bookData = books;
        file.writeTextSync(JSON.stringify(bookData));
    }

    //set
    page.bindingContext.set("days", new ObservableArray(bookData));
    // page.bindingContext.set("isLoading", false)
}


function updateRow(id, dc){
    // page.bindingContext.set("isLoading", true)

    //get file
    let documents = fileSystemModule.knownFolders.documents();
    let folder = documents.getFolder("mydata");
    let file = folder.getFile("mybooks.json");
    let bookData = JSON.parse(file.readTextSync());

    //update
    bookData.find((book) => book.id === id).dateCompleted = dc;

    //write
    console.log("writing!")
    return file.writeText(JSON.stringify(bookData)).then(() => {
        // page.bindingContext.set("isLoading", false)
    })
}

exports.onNavigatingTo = onNavigatingTo;
exports.onSwitchTap = onSwitchTap;
exports.showDateModal = showDateModal