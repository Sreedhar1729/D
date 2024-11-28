sap.ui.define(
    [
        "./BaseController",
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.artihcus.controller.ReqTruck", {
            onInit: function () {
                // const oModel = this.getOwnerComponent().getModel("resultModel");
                // debugger
                // console.log(oModel) // Get the model set in previous view
                // this.getView().setModel(oModel,"resultModel"); // Set the model to this view
                //     // Optionally, bind data to controls if needed
                //     const products = oModel.getProperty("/Products");

                //     console.log("Products:", products);

                //     // Bind data to UI elements (example)
                //     this.byId("productList").bindItems({
                //         path: "resultModel>/Products",
                //         template: new sap.m.StandardListItem({
                //             title: "{resultModel>Product}",
                //             description: "{resultModel>Description}",
                //             info: "{resultModel>Quantity} units, Volume: {resultModel>Volume}"
                //         })
                //     });

                //     // Display overall total volume
                //     const overallTotalVolume = oModel.getProperty("/OverallTotalVolume");
                //     this.byId("overallTotalVolumeText").setText(`Overall Total Volume: ${overallTotalVolume} m³`);

                //     // Bind required trucks to the required trucks list
                //     this.byId("requiredTrucksList").bindItems({
                //         path: "resultModel>/RequiredTrucks",
                //         template: new sap.m.StandardListItem({
                //             title: "{resultModel>truckType}",
                //             info: "{resultModel>numberOfTrucksNeeded} truck(s) needed, Volume: {resultModel>volume} Kgs"
                //         })
                //     });


            },
            onBackPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("MainPage")
                this.getView().getModel("resultModel").refresh();
            }

        });
    }
);