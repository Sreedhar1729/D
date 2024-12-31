sap.ui.define(
  [
    "./BaseController",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent",
    "sap/m/Text",
    "sap/m/MessageToast",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
  ],
  function (Controller,GenericTile,TileContent,ImageContent,Text,MessageToast,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("com.app.artihcus.controller.ManuvalSimulation", {
      onInit: function () {
        this.ogenerictitesIdarray = []


      },
      onAfterRendering: function () {
        this._createGenericTile()
      },
      _createGenericTile: async function () {

        console.log("Called")

        var oTileContainer = this.getView().byId("idVBoxInSelectVehicleType_manuvalsimulate");

        var that = this;
        const oModel = this.getOwnerComponent().getModel("ModelV2"),
          oPath = "/TruckTypes";
        var oObject = {
          "14FT": "https://www.searates.com/design/images/apps/load-calculator/20st.svg",
          "14FTF": "https://www.searates.com/design/images/apps/load-calculator/20ref.svg",
          "17FT": "https://www.searates.com/design/images/apps/load-calculator/40st.svg",
          "17FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
          "22FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
          "22FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
          "32FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
          "32FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg"
        }

        function checkRange(num) {
          if (num < 14) {
            return 14;  // If the number is below 14, return 14
          } else if (num >= 14 && num <= 16) {
            return 14;  // If the number is between 14 and 16 (inclusive), return 14
          } else if (num >= 17 && num <= 21) {
            return 17;  // If the number is between 17 and 21 (inclusive), return 17
          } else if (num >= 22 && num <= 31) {
            return 22;  // If the number is between 22 and 31 (inclusive), return 22
          } else if (num >= 32) {
            return 32;  // If the number is 32 or above, return 32
          }
          return num; // If it doesn't fit any condition (although all cases are covered)
        }
        try {
          const oSuccessData = await this.readData(oModel, oPath, [])
          oSuccessData.results.forEach(
            function (item) {
              let alphanumeric = item.truckType;
              let numbers = alphanumeric.match(/\d+/g);  // This will find all sequences of digits

              // Join them back together if you want the number as a single string
              let result = parseInt(numbers.join(""));  // "123456"
              let otructype = checkRange(result);
              console.log(result);
              if (item.freezed) {
                var oId = item.truckType + "_f"
                var oImage = oObject[`${otructype}FTF`]
              }
              else {
                var oId = item.truckType
                var oImage = oObject[`${otructype}FT`]
              }
              if (!(that.ogenerictitesIdarray.includes(oId))) {


                that.ogenerictitesIdarray.push(oId)
                var oGenericTile = new GenericTile({
                  id: `id_generictile_M_${oId}`,
                  // class: "sapUiLargeMarginTop sapUiTinyMarginEnd tileLayout",
                  header: `${item.truckType}`,   // The tile's header
                  width: "150px",    // The tile's width

                  press: that.onPressGenericTilePress.bind(that)  // Event handler for press
                });
                oGenericTile.addStyleClass("sapUiSmallMarginEnd sapUiTinyMarginTop")
                // Create the TileContent control
                var oTileContent = new TileContent({
                  id: `id_idTileContent_M_${oId}`
                });

                // Create the ImageContent inside the TileContent
                var oImageContent = new ImageContent({
                  id: `id_idImageContentN_M_${oId}`,
                  src: `${oImage}`
                });

                // Add the ImageContent to the TileContent
                oTileContent.setContent(oImageContent);

                // Add the TileContent to the GenericTile
                oGenericTile.addTileContent(oTileContent);

                // Now, add the GenericTile to the container
                oTileContainer.addItem(oGenericTile);



              }
            }
          )

        } catch (error) {
          console.log(error)
          MessageToast.show(error)
        }

        // Create the GenericTile control dynamically

      },
      onPressGenericTilePress: function () {


      },

      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("MainPage")
        this.getView().getModel("resultModel").refresh();
      },

      onPressAddProductIn_ManualSimulate: async function () {
        debugger

        if (!this.oValueDialog) {
          this.oValueDialog = await this.loadFragment("ValueHelp");
        }
        this.oValueDialog.open();




      },
      onCancelPress_valueHelp: function () {
        this.oValueDialog.close();
      },

      onAddPress: function () {
        var oTable = this.byId("idTableAddProduct");
        var aSelectedItems = oTable.getSelectedItems();
        let count = 0;
        var oModel = this.getOwnerComponent().getModel("ModelV2");
        if (aSelectedItems.length > 0) {
          var selectedData = [];

          // Loop through the selected rows and collect data
          aSelectedItems.forEach(function (oItem) {
            var oBindingContext = oItem.getBindingContext();
            var oData = oBindingContext.getObject();  // Get the data object of the row

            // Get the Input control for Picking Quantity
            var oInput = oItem.getCells()[4].mProperties; // Assuming the Input control is the 4th cell (index 3)

            // Get the value entered in the Input field
            var sPickingQty = oInput.value;
            var actualQuantity = oData.quantity;
            if (parseInt(sPickingQty) > parseInt(actualQuantity) || parseInt(sPickingQty) <= 0 || !(sPickingQty)) {
              count = count + 1;
            }
          })
          if (count > 0) {
            MessageToast.show("Please Enter correct data")
            return
          }
          else {
            this.onAddPress1(aSelectedItems, oModel)
          }
        } else {
          MessageToast.show("Please select atleast one product");
        }


      },
      onAddPress1: function (aSelectedItems, oModel) {
        debugger
        // var oTable = this.byId("idTableAddProduct");
        var that = this;
        // Get the selected items (rows) from the table
        // const randomHexColor = (function () {
        //   const letters = '0123456789ABCDEF';
        //   let color = '#';
        //   for (let i = 0; i < 6; i++) {
        //     color += letters[Math.floor(Math.random() * 16)];
        //   }
        //   return color;
        // })();
        // var aSelectedItems = oTable.getSelectedItems();

        // var oModel = this.getOwnerComponent().getModel("ModelV2")
        // Check if there are selected items
        if (aSelectedItems.length > 0) {
          var selectedData = [];

          // Loop through the selected rows and collect data
          aSelectedItems.forEach(async function (oItem) {
            var oBindingContext = oItem.getBindingContext();
            var oData = oBindingContext.getObject();  // Get the data object of the row

            // Get the Input control for Picking Quantity
            var oInput = oItem.getCells()[4].mProperties; // Assuming the Input control is the 4th cell (index 3)

            // Get the value entered in the Input field
            var sPickingQty = oInput.value;
            // var actualQuantity = oData.quantity;



            // Add the relevant data along with the entered Picking Quantity
            var dummy = {
              Productno_ID: oData.ID,
              SelectedQuantity: sPickingQty

            };
            // var dummy2 = {
            //   Productno_ID: oData.ID,

            //   color: randomHexColor
            // };
            selectedData.push({
              product: oData.sapProductno,
              description: oData.description,
              actualQuantity: oData.quantity, // Replace with the correct field name from the data
              pickingQuantity: sPickingQty,
              // color: randomHexColor
            });
            try {

              var oProductExists = await that.productExists(oModel, dummy.Productno_ID)

              if (!(oProductExists)) {
                await that.createData(oModel, dummy, "/SelectedProduct");
                that.byId("idAddProductsTableIn_manuvalsimulate")?.getBinding("items")?.refresh();
                return
              }
              await oModel.read("/SelectedProduct", {
                filters: [
                  new Filter("Productno_ID", FilterOperator.EQ, dummy.Productno_ID),
                  //new Filter("password", FilterOperator.EQ, sPassword)

                ],
                success: async function (oData) {
                  console.log(oData)
                  var sID = oData.results[0].ID
                  await oModel.update("/SelectedProduct('" + sID + "')", { SelectedQuantity: sPickingQty }, {
                    success: function () {
                      that.byId("idAddProductsTableIn_manuvalsimulate")?.getBinding("items")?.refresh();
                    }.bind(this),
                    error: function (oError) {
                      sap.m.MessageBox.error("Failed " + oError.message);
                    }.bind(this)
                  });
                },
                error: function (oError) {
                  console.log(oError)
                }
              })


            }
            catch (error) {
              console.log(error)
              MessageToast.show(error)
            }

          });

          // Do something with the selected data, e.g., display it
          //MessageToast.show("Selected Products: " + JSON.stringify(selectedData.));
          this.oValueDialog.close();

        } else {
          MessageToast.show("No rows selected.");
        }

      },
      productExists: function (oModel, sId) {
        const that = this;
        return new Promise((resolve, reject) => {
          // oModel.read(`/SelectedProduct('${sId}')`, {
          //     success: function (oData, resp) {
          //         console.log(oData);
          //         that.flag = true;  // Set flag to true if product exists
          //         resolve();         // Resolve promise when success
          //     },
          //     error: function (error) {
          //         console.error(error.message);
          //         that.flag = false; // Set flag to false if product does not exist
          //         reject(error);     // Reject promise on error
          //     }
          // });
          oModel.read("/SelectedProduct", {
            filters: [
              new Filter("Productno_ID", FilterOperator.EQ, sId),
              //new Filter("password", FilterOperator.EQ, sPassword)

            ],
            success: function (oData) {
              resolve(oData.results.length > 0);

            },
            error: function () {
              reject(
                "An error occurred while checking username existence."
              );
            }
          })
        });
      },
      onlivechangeValue_: function (oEvent) {
        var oInput = oEvent.getSource();
        var oBindingContext = oInput.getBindingContext();
        var selectedQuantity = parseFloat(oInput.getValue());  // Picking Quantity
        var actualQuantity = parseFloat(oBindingContext.getProperty("quantity"));  // Actual Quantity

        // Validate: Picking Quantity should not be greater than Actual Quantity
        if (selectedQuantity > actualQuantity) {
          // Set error state on the input field
          oInput.setValueState(sap.ui.core.ValueState.Error);
          oInput.setValueStateText("Picking Quantity cannot be greaterthan Actual Quantity.");
        }
        else if (selectedQuantity <= 0) {
          oInput.setValueState(sap.ui.core.ValueState.Error);
          oInput.setValueStateText("Picking Quantity cannot be lessthan or equal to zero.");
        }
        else {
          // Clear error state
          oInput.setValueState(sap.ui.core.ValueState.None);
          oInput.setValueStateText("");
        }
      },

    });
  }
);

