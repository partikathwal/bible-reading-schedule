const observableModule = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        days: new ObservableArray([]),
        isLoading: false
    });

    return viewModel;
}

module.exports = HomeViewModel;
