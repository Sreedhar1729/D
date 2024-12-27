sap.ui.define(
    [
        "./BaseController",
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.artihcus.controller.ManuvalSimulation", {
            onInit: function () {
             


            },
            onBackPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("MainPage")
                this.getView().getModel("resultModel").refresh();
            },
          
        });
    }
);

