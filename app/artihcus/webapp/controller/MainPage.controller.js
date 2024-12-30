
sap.ui.define(
  [
    "./BaseController",
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/m/IconTabBar",
    "sap/m/IconTabFilter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent",
    "sap/m/Text",
    'sap/ui/comp/library',
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/SearchField',
    'sap/m/Token',
    'sap/ui/table/Column',
    'sap/m/Column',



  ],
  function (Controller, Fragment, Filter, FilterOperator, IconTabBar, IconTabFilter, JSONModel, MessageToast, ODataModel, MessageBox, UIComponent, GenericTile, TileContent, ImageContent, Tex, library, TypeString, ColumnListItem, Label, SearchField, Token, UIColumn, MColumn) {
    "use strict";

    return Controller.extend("com.app.artihcus.controller.MainPage", {
      onInit: function () {

        // Material upload
        this.MaterialModel = new JSONModel();
        this.getView().setModel(this.MaterialModel, "MaterialModel");

        this.ogenerictitesIdarray = []
        this.oObject = {
          "14FT": "https://www.searates.com/design/images/apps/load-calculator/20st.svg",
          "14FTF": "https://www.searates.com/design/images/apps/load-calculator/20ref.svg",
          "17FT": "https://www.searates.com/design/images/apps/load-calculator/40st.svg",
          "17FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
          "22FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
          "22FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
          "32FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
          "32FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg"
        }
        let link = this.oObject["14ft"];
        console.log(link);
        // Initialize your JSON model
        const oJsonModel1 = new sap.ui.model.json.JSONModel({ products: [] });
        this.getView().setModel(oJsonModel1, "oJsonModelProd");
        /***storing table  */
        this.loadProductsFromLocalStorage();


        this.localModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.localModel, "localModel");


        // Constructing a combined JSON Model
        const oCombinedJsonModel = new JSONModel({
          Product: {
            sapProductno: "",
            length: "",
            width: "",
            height: "",
            volume: "",
            uom: "",
            vuom: "",
            wuom: "",
            muom: "",
            mCategory: "",
            description: "",
            EAN: "",
            weight: "",
            color: ""
          },
          Vehicle: {
            truckType: "",
            length: "",
            width: "",
            height: "",
            uom: "",
            tvuom: "M³",
            tuom: "M",
            volume: "",
            truckWeight: "",
            capacity: "",
            freezed: ""
          }
        });

        // Set the combined model to the view
        this.getView().setModel(oCombinedJsonModel, "CombinedModel")
        const oJsonModelCal = new JSONModel({

          TotalQuantity: "",
          TotalVolume: "",
          TotalWeight: "",
          RemainingCapacity: "",
        });
        this.getView().setModel(oJsonModelCal, "Calculation");
        const chartDataModel = new sap.ui.model.json.JSONModel({ chartData: [] });
        const calculationModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(chartDataModel, "ChartData");
      },

      onbatchUpload: async function (e) {
        if (!this.oFragment) {
          this.oFragment = await this.loadFragment("MaterialXlData");
        }
        this.oFragment.open();
        await this._importData(e.getParameter("files") && e.getParameter("files")[0]);
      },

      _importData: function (file) {
        var that = this;
        var excelData = {};
        if (file && window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {
              type: 'array'
            });
            workbook.SheetNames.forEach(function (sheetName) {
              // Here is your object for every sheet in workbook
              excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            });
            // Setting the data to the local model
            that.MaterialModel.setData({
              items: excelData
            });
            that.MaterialModel.refresh(true);
          };
          reader.onerror = function (ex) {
            console.log(ex);
          };
          reader.readAsArrayBuffer(file);
        }
      },
      onBatchSave: async function () {
        var that = this;
        var addedProdCodeModel = that.getView().getModel("MaterialModel").getData();
        var batchChanges = [];
        var oDataModel = this.getView().getModel("ModelV2");
        var batchGroupId = "batchCreateGroup";
        let aErrors = []

                
        addedProdCodeModel.items.forEach((item,index) => {
          item.length = String(item.length).trim();
          item.width = String(item.width).trim();
          item.height = String(item.height).trim();
          item.weight = String(item.weight).trim();
          item.quantity = String(item.quantity).trim();
          item.volume = String(item.volume).trim();

          // Create individual batch request
          batchChanges.push(
            oDataModel.create("/Materials", item, {
              method: "POST",
              groupId: batchGroupId, // Specify the batch group ID here
              success: function (data, response) {
                // Handle success for individual item
                // MessageBox.success("Materials created successfully");
                // You can also perform other operations here based on the success response
              },
              error: function (err) {
                // Handle error for individual item
                aErrors.push(JSON.parse(err.responseText).error.message.value)
                console.error("Error creating material:", err);
              }
            })
          );
        });

        // Now send the batch request using batch group
        oDataModel.submitChanges({
          batchGroupId: batchGroupId,
          success: function (oData, response) {
            MessageBox.success("Materials batch created successfully");
            console.log("Batch request submitted successfully", oData);
            // Perform any final operations if needed after all batch operations succeed
          },
          error: function (err) {
            MessageBox.success("Error creating material batch");
            console.error("Error in batch request:", err);
            // Handle any failure in the batch submission (e.g., server issues)
          }
        });

        // working
        // var that = this;
        // var addedProdCodeModel = that.getView().getModel("MaterialModel").getData();
        // var batchChanges = [];
        // var oDataModel = this.getView().getModel("ModelV2");

        // var batchGroupId = "batchCreateGroup";

        // // Collect all create operations into the batchChanges array
        //   addedProdCodeModel.items.forEach(async item => {
        //   item.length = String(item.length).trim();
        //   item.width = String(item.width).trim();
        //   item.height = String(item.height).trim();
        //   item.weight = String(item.weight).trim();
        //   item.quantity = String(item.quantity).trim();
        //   item.volume = String(item.volume).trim();

        //   // Create individual batch request
        //   await oDataModel.create("/Materials", item, {
        //     method: "POST",
        //     groupId: batchGroupId // Specify the batch group ID here
        //   });
        // });


        // // Submit all changes in the batch
        // oDataModel.submitChanges({
        //   groupId: batchGroupId,
        //   success: function (data, response) {
        //     MessageBox.show("Batch create operation successful.");
        //   },
        //   error: function (e) {
        //     // Parse the error response and show a meaningful message
        //     var errorMessage = e.message || "An error occurred";
        //     MessageBox.show("Error: " + errorMessage);
        //   }
        // });
        if (this.oFragment) {
          this.oFragment.close();
          this.byId("ProductsTable").getBinding("items").refresh();
        }
      },
      onClosePressXlData: function () {
        if (this.oFragment.isOpen()) {
          this.oFragment.close();
        }
      },
      // _createGenericTile: async function () {

      //   console.log("Called")
      //   // Get the container where the tile will be placed
      //   var oTileContainer = this.byId("idVBoxInSelectVehicleType");
      //   //getting model
      //   var that = this;
      //   const oModel = this.getOwnerComponent().getModel("ModelV2"),
      //     oPath = "/TruckTypes";
      //   var oObject = {
      //     "14FT": "https://www.searates.com/design/images/apps/load-calculator/20st.svg",
      //     "14FTF": "https://www.searates.com/design/images/apps/load-calculator/20ref.svg",
      //     "17FT": "https://www.searates.com/design/images/apps/load-calculator/40st.svg",
      //     "17FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
      //     "22FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
      //     "22FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
      //     "32FT": "https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
      //     "32FTF": "https://www.searates.com/design/images/apps/load-calculator/40ref.svg"
      //   }
      //   try {
      //     const oSuccessData = await this.readData(oModel, oPath, [])
      //     oSuccessData.results.forEach(
      //       function (item) {
      //         if (item.freezed) {
      //           var oId = item.truckType + "_f"
      //           var oImage = oObject[`${item.truckType}F`]
      //         }
      //         else {
      //           var oId = item.truckType
      //           var oImage = oObject[`${item.truckType}`]
      //         }
      //         var oGenericTile = new GenericTile({
      //           id: `id_generictile_${oId}`,
      //           class: "sapUiLargeMarginTop sapUiTinyMarginEnd tileLayout",
      //           header: `${item.truckType}`,   // The tile's header
      //           width: "150px",    // The tile's width

      //           press: that.onPressGenericTilePress.bind(that)  // Event handler for press
      //         });

      //         // Create the TileContent control
      //         var oTileContent = new TileContent({
      //           id: `id_idTileContent_${oId}`
      //         });

      //         // Create the ImageContent inside the TileContent
      //         var oImageContent = new ImageContent({
      //           id: `id_idImageContentN_${oId}`,
      //           src: `${oImage}`
      //         });

      //         // Add the ImageContent to the TileContent
      //         oTileContent.setContent(oImageContent);

      //         // Add the TileContent to the GenericTile
      //         oGenericTile.addTileContent(oTileContent);

      //         // Now, add the GenericTile to the container
      //         oTileContainer.addItem(oGenericTile);
      //         oTileContainer.addItem(new Text({ text: "", width: "10Px" }));
      //       }
      //     )

      //   } catch (error) {
      //     console.log(error)
      //     MessageToast.show(error)
      //   }

      //   // Create the GenericTile control dynamically

      // },


      _createGenericTile: async function () {

        console.log("Called")

        var oTileContainer = this.getView().byId("idVBoxInSelectVehicleType");

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
                  id: `id_generictile_${oId}`,
                  // class: "sapUiLargeMarginTop sapUiTinyMarginEnd tileLayout",
                  header: `${item.truckType}`,   // The tile's header
                  width: "150px",    // The tile's width

                  press: that.onPressGenericTilePress.bind(that)  // Event handler for press
                });
                oGenericTile.addStyleClass("sapUiSmallMarginEnd sapUiTinyMarginTop")
                // Create the TileContent control
                var oTileContent = new TileContent({
                  id: `id_idTileContent_${oId}`
                });

                // Create the ImageContent inside the TileContent
                var oImageContent = new ImageContent({
                  id: `id_idImageContentN_${oId}`,
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
      onDeletePressInSimulate: async function () {
        const oModel = this.getView().getModel("ModelV2");
        const oSelectedItems = this.byId("idAddProductsTableIn_simulate").getSelectedItems();
        if (!oSelectedItems) {
          return MessageBox.error("Please select atleast one item for deletion")
        }
        oSelectedItems.forEach(ele => {
          let oPath = ele.getBindingContext().getPath();
          oModel.remove(oPath, {
            success: function () {
              this.byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
              MessageToast.show("Deleted successfully")
            }.bind(this), error: function (oError) {
              this.byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
              MessageBox.error(oError);


            }.bind(this)
          })
        })

        // var oModel = this.getOwnerComponent().getModel("ModelV2");


        // await oModel.read("/SelectedProduct", {
        //   success: function (oData) {
        //     oData.results.forEach(async (item) => {
        //       var sId = item.ID;
        //       await this.deleteData(oModel, `/SelectedProduct('${sId}')`)
        //       this.byId("idAddProductsTableIn_simulate")?.getBinding("items")?.refresh();
        //       this.byId("idTableAddProduct")?.getBinding("items")?.refresh();
        //     })

        //   }.bind(this),
        //   error: function () {

        //   }
        // });


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
                that.byId("idAddProductsTableIn_simulate")?.getBinding("items")?.refresh();
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
                      that.byId("idAddProductsTableIn_simulate")?.getBinding("items")?.refresh();
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



      // onPressGenericTilePress: function () {

      //   var oWizard = this.byId("idWizardIn_simulate");
      //   var oCurrentStep = oWizard.getCurrentStep();

      //   oWizard.nextStep();

      // },

      onCancelPress_valueHelp: function () {
        this.oValueDialog.close();
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

      // productExists: async function (oModel, sId) {
      //   console.log(sId)
      //   const that = this
      //  await oModel.read(`/SelectedProduct('${sId}')`,{
      //           // filters: [new Filter("Productno_ID", FilterOperator.EQ, sId)],
      //           success:function (oData,resp) {
      //             console.log(oData);
      //             that.flag = true;
      //           },
      //           error:function (error) {
      //             console.error(error.message);
      //             that.flag = false;
      //           },
      //         })

      //   // return new Promise((resolve, reject) => {
      //   //   oModel.read("/SelectedProduct", {
      //   //     filters: [
      //   //         new Filter("Productno_ID", FilterOperator.EQ, sId),


      //   //     ],
      //   //     success: function (oData) {
      //   //       // console.log(oData.results)
      //   //       // var oProduct1 = oData.results.filter(checkProduct)
      //   //       // function checkProduct(v) {
      //   //       //   console.log(v)
      //   //       //   return v.Productno_ID === product;
      //   //       // }
      //   //       // console.log(oProduct1)
      //   //       // console.log(oProduct1.length)
      //   //       resolve(oProduct1.length > 0);


      //   //     },
      //   //     error: function () {
      //   //       reject(
      //   //         "An error occurred while checking username existence."
      //   //       );
      //   //     }
      //   //   })
      //   // })
      // },



      // Define your press handler
      // onPressGenericTilePress: function (oEvent) {
      //   // Handle the press event here
      //   alert("Tile pressed!");
      //   console.log(oEvent.oSource.mProperties.header)
      // },
      handleValueHelp: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        // create value help dialog
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "com.app.artihcus.fragment.ProductsDialog",
            controller: this
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }

        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          oValueHelpDialog.open(sInputValue);
        });
      },

      handleValueHelpProductType: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
        // create value help dialog
        if (!this._pProductsDialog) {
          this._pProductsDialog = Fragment.load({
            id: oView.getId(),
            name: "com.app.artihcus.fragment.vehicleTypeDialog",
            controller: this
          }).then(function (oProductsDialog) {
            oView.addDependent(oProductsDialog);
            return oProductsDialog;
          });
        }

        this._pProductsDialog.then(function (oProductsDialog) {
          oProductsDialog.open(sInputValue);
        });

      },

      onPrintPressInProductsTable: function () {

        var oTable = this.byId("ProductsTable");
        var aItems = oTable.getItems();
        var aData = [];
        // Push column headers as the first row
        var aHeaders = [
          "SAP Productno",
          "Description",
          "EAN",
          "Material Category",
          "Length",
          "Width",
          "Height",
          "Volume",
          "UOM",
          "Weight",
          "Quantity",
          "Layers",
          "Mass",
          "Layers_height"
        ];
        aData.push(aHeaders);

        // Iterate through table items and collect data
        aItems.forEach(function (oItem) {
          var oCells = oItem.getCells();
          var rowData = [];
          oCells.forEach(function (oCell) {
            rowData.push(oCell.getText());
          });
          aData.push(rowData);
        });

        // Prepare Excel workbook
        var oSheet = XLSX.utils.aoa_to_sheet(aData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "ProductsTable");

        // Generate and download the Excel file
        XLSX.writeFile(oWorkbook, "ProductsTable.xlsx");
      },

      //print in add Equipment 
      onPressDownloadInAddContainerTable: function () {

        var oTable = this.byId("idContainerTypeTable");
        var aItems = oTable.getItems();
        var aData = [];

        // Push column headers as the first row
        var aHeaders = [
          "TruckType",
          "Length(M)",
          "Width(M)",
          "Height(M)",
          "Volume(M)",
          "Capacity",
          "TruckWeight",
        ];
        aData.push(aHeaders);

        // Iterate through table items and collect data
        aItems.forEach(function (oItem) {
          var oCells = oItem.getCells();
          var rowData = [];
          oCells.forEach(function (oCell) {
            rowData.push(oCell.getText());
          });
          aData.push(rowData);
        });

        // Prepare Excel workbook
        var oSheet = XLSX.utils.aoa_to_sheet(aData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "idProductsTableEdit");

        // Generate and download the Excel file
        XLSX.writeFile(oWorkbook, "ContainerTable.xlsx");
      },

      // 
      //print in list  
      onPressPrintInListTable: function () {

        var oTable = this.byId("idListTable");
        var aItems = oTable.getItems();
        var aData = [];

        // Push column headers as the first row
        var aHeaders = [
          "S.No",
          "Vehicle",
          "Vehicle Type",
          "Product",
          "Product Type",
          "Product Description",
          "Dimensions",
          "Volume",
          "Weight",
          "Capacity Used",
          "Remaining Capacity",
        ];
        aData.push(aHeaders);

        // Iterate through table items and collect data
        aItems.forEach(function (oItem) {
          var oCells = oItem.getCells();
          var rowData = [];
          oCells.forEach(function (oCell) {
            rowData.push(oCell.getText());
          });
          aData.push(rowData);
        });

        // Prepare Excel workbook
        var oSheet = XLSX.utils.aoa_to_sheet(aData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "idListTable");

        // Generate and download the Excel file
        XLSX.writeFile(oWorkbook, "ListOfProductsInContainer.xlsx");
      },

      // create fragment in add Eqipment page
      onPressInAddEquipment: async function () {
        if (!this.oCreateContainerDialog) {
          this.oCreateContainerDialog = await this.loadFragment("CreateContainer");
        }
        this.oCreateContainerDialog.open();
        this.getView().getModel("CombinedModel").setProperty("/Vehicle",{});
      },
      onCancelInCreateVehicleDialog: function () {
        this.byId("idCreateInContainerDialog").close();
        this.ClearVeh();
      },
      // edit  fragment in products table
      oOpenProductEdit: async function () {
        if (!this.oEditDialog) {
          this.oEditDialog = await this.loadFragment("EditProductDialog");
        }
        this.oEditDialog.open();
      },
      onCancelInEditProductDialog: function () {
        this.byId("idEditProductDssialog").close();
        this.getView().getModel("CombinedModel").setProperty("/Product",{});

      },
      // edit  fragment in Add equipment table
      onPressEditInAddEquipmentTable: async function () {
        if (!this.oEditInAddEquipment) {
          this.oEditInAddEquipment = await this.loadFragment("EditContainer");
        }
        this.oEditInAddEquipment.open();
      },
      onCancelInEditVehicleDialog: function () {
        this.byId("idEditContainerDialog").close();
        this.getView().getModel("CombinedModel").setProperty("/Vehicle",{})
      },

      //create dialog in list 
      onPressAddInListTable: async function () {
        if (!this.oCreateInListDialog) {
          this.oCreateInListDialog = await this.loadFragment("CreateInList");
        }
        this.oCreateInListDialog.open();
      },
      onCancelInListCreateDialog: function () {
        this.byId("idListssCreateDialog").close();
      },
      //edit dialog in list 
      onPressEditInListTable: async function () {
        if (!this.oListEditDialog) {
          this.oListEditDialog = await this.loadFragment("ListEditDialog");
        }
        this.oListEditDialog.open();
      },
      onCancelInListEditDialog: function () {
        this.byId("idListEdiwtDialog").close();
      },

      /** ************************Creating New Product  ***************************************************/
      onCreateProduct: async function () {
        const randomHexColor = (function () {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        })();
        const oPayloadModel = this.getView().getModel("CombinedModel"),
          oPayload = oPayloadModel.getProperty("/Product"),
          oModel = this.getView().getModel("ModelV2"),
          oView = this.getView(),
          oPath = '/Materials';

        // Validation
        const validationErrors = [];
        const validateField = (fieldId, value, regex, errorMessage) => {
          const oField = oView.byId(fieldId);
          if (!value || (regex && !regex.test(value))) {
            oField.setValueState("Error");
            oField.setValueStateText(errorMessage);
            validationErrors.push(errorMessage);
          } else {
            oField.setValueState("None");
          }
        };

        const aUserInputs = [
          { Id: "idDesvbncriptionInput_InitialView", value: oPayload.EAN, regex: null, message: "Please enter EAN" },
          { Id: "idDescriptionInput_InitialView", value: oPayload.sapProductno, regex: null, message: "Enter SAP product number" },
          { Id: "idInstanceNumberInput_InitialView", value: oPayload.length, regex: /^\d+(\.\d+)?$/, message: "Length should be numeric" },
          { Id: "idClientInput_InitialView", value: oPayload.width, regex: /^\d+(\.\d+)?$/, message: "Width should be numeric" },
          { Id: "idApplicationServerInput_InitialView", value: oPayload.height, regex: /^\d+(\.\d+)?$/, message: "Height should be numeric" },
          { Id: "idSystemIdInput_InitialView", value: oPayload.mCategory, regex: null, message: "Enter category" },
          { Id: "idInputDes_InitialView", value: oPayload.description, regex: null, message: "Enter description" },
          { Id: "idWeightinput_InitialView", value: oPayload.weight, regex: /^\d+$/, message: "Weight should be numeric" },
          { Id: "idApplicationServerInput_MainPage", value: oPayload.quantity, regex: /^\d+$/, message: "Quantity should be numeric" }
        ]

        aUserInputs.forEach(async input => {
          validateField(input.Id, input.value, input.regex, input.message)
        })

        if (validationErrors.length > 0) {
          MessageBox.information("Please enter correct data");
          return;
        }

        // Get the selected item from the event parameters
        var oSelectedItem = this.byId("idselectuom").getSelectedKey();
        if (oSelectedItem === 'Select') {
          MessageBox.error("Please Select UOM!!");
          return;
        }
        oPayload.uom = oSelectedItem;
        //get the selected item
        var oSelectedItem1 = this.byId("uomSelect").getSelectedKey()
        if (oSelectedItem1 === 'Select') {
          MessageBox.error("Please Select UOM!!");
          return;
        }
        oPayload.muom = 'PC';
        oPayload.vuom = "M³";
        oPayload.wuom = oSelectedItem1 ? oSelectedItem1 : "";
        var oVolume;
        oPayload.color = randomHexColor

        if (oPayload.uom === 'CM') {
          // If UOM is in centimeters, convert to meters before calculating
          oVolume = (oPayload.length / 100) * (oPayload.width / 100) * (oPayload.height / 100);
          oPayload.volume = String(oVolume.toFixed(7)); // Volume in cubic meters with 7 decimal places
        } else {
          // If UOM is in meters, calculate normally in cubic meters
          oVolume = oPayload.length * oPayload.width * oPayload.height;
          oPayload.volume = String(oVolume.toFixed(7)); // Volume in cubic meters with 7 decimal places
        }

        try {
          await this.createData(oModel, oPayload, oPath);
          this.getView().byId("ProductsTable").getBinding("items").refresh();
          this.byId("idselectuom").setSelectedKey("");
          this.byId("uomSelect").setSelectedKey("");
          MessageToast.show("Successfully Created!");
          this.getView().getModel("CombinedModel").setProperty("/Product", {}) // clear data after successful creation
          // this.ClearingModel(true);
          MessageToast.show("Successfully Created!");
        } catch (error) {
          console.error(error);
          if (error.statusCode === "400" && JSON.parse(error.responseText).error.message.value.toLowerCase() === "entity already exists") {
            MessageBox.information("Product Number Should be unique enter different value")
          } else {
            MessageToast.show("Facing technical issue");
          }
        }
      },

      /**Clearing Properties after creation */
      ClearingModel: function () {
        const oPayloadModel = this.getView().getModel("CombinedModel");
        oPayloadModel.setProperty("/Product", {})

      },

      /**Deleting Products */
      onProductDel: async function () {
        const oTable = this.byId("ProductsTable"),
          aSelectedItems = oTable.getSelectedItems(),
          oModel = this.getView().getModel("ModelV2");
        if (aSelectedItems.length === 0) {
          MessageBox.information("Please select at least one product to delete.");
          return; // Exit the function if no items are selected
        }
        try {
          await Promise.all(aSelectedItems.map(async (oItem) => {
            const oPath = oItem.getBindingContext().getPath();
            await this.deleteData(oModel, oPath);
          }));
          this.getView().byId("ProductsTable").getBinding("items").refresh();
          MessageToast.show('Successfully Deleted')
        } catch (error) {
          MessageToast.show('Error Occurs');
        }
      },

      onliveContainerSearch: function (oEvent) {

        let sQuery = oEvent.getParameter("newValue");
        sQuery = sQuery.replace(/\s+/g, '');
        sQuery = sQuery.toUpperCase();

        // test
        if (sQuery && sQuery.length > 0) {
          const truckfilter = new Filter("truckType", FilterOperator.Contains, sQuery),
            capacityfilter = new Filter("capacity", FilterOperator.Contains, sQuery);
          //  freezfilter = new Filter("freezed", FilterOperator.Contains, sQuery);
          var allFilter = new Filter([truckfilter, capacityfilter]);
        }

        var oTableBinding = this.byId("ProductsTable").getBinding("items")
        oTableBinding.filter(allFilter);
      },

      /**Creating Containers */
      onCreateContainer: async function () {
        const oPayloadModel = this.getView().getModel("CombinedModel"),
          oPayload = oPayloadModel.getProperty("/Vehicle"),
          oModel = this.getView().getModel("ModelV2"),
          oPath = '/TruckTypes';
        if (!oPayload.truckType ||
          !oPayload.length ||
          !oPayload.width ||
          !oPayload.height ||
          !oPayload.truckWeight ||
          !oPayload.capacity) {
          MessageBox.warning("Please Enter all Values");
          return;
        }
        const oFreeze = this.byId("idFreezedInput").getSelectedKey();
        if (!oFreeze) {
          MessageBox.warning("Please Enter all Values");
          return;
        }
        const oFreezeVal = oFreeze === 'Yes' ? true : false;
        oPayload.freezed = oFreezeVal;
        oPayload.truckType = `${oPayload.truckType}FT`
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        // Get the selected item from the event parameters
        var oSelectedItem = this.byId("idContainerTypeUOM").getSelectedItem();
        oPayload.uom = oSelectedItem ? oSelectedItem.getKey() : "";
        try {
          await this.createData(oModel, oPayload, oPath);

          this.getView().getModel("CombinedModel").setProperty("/Vehicle", {}),
          this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInCreateVehicleDialog();
          this.byId("idFreezedInput").setSelectedKey("");
          this.byId("idContainerTypeUOM").setSelectedKey("");
          MessageToast.show("Successfully Created!");
        } catch (error) {
          this.byId("idFreezedInput").setSelectedKey("");
          this.getView().getModel("CombinedModel").setProperty("/Vehicle", {}),
          this.onCancelInCreateVehicleDialog();
          MessageToast.show("Error at the time of creation");
        }
      },

      /**Clearing Vehicle Model */
      ClearVeh: function () {
        const oPayloadModel = this.getView().getModel("CombinedModel");

        oPayloadModel.setProperty("/Vehicle", {})

      },

      /**Deleting Vehicles */
      onContainerDel: async function () {
        const oTable = this.byId("idContainerTypeTable"),
          aSelectedItems = oTable.getSelectedItems(),
          oModel = this.getView().getModel("ModelV2");
        if (aSelectedItems.length === 0) {
          MessageBox.information("Please select at least one product to delete.");
          return; // Exit the function if no items are selected
        }
        try {
          await Promise.all(aSelectedItems.map(async (oItem) => {
            const oPath = oItem.getBindingContext().getPath();
            await this.deleteData(oModel, oPath);
          }));
          this.getView().byId("idContainerTypeTable").getBinding("items").refresh();
          MessageToast.show('Successfully Deleted')
        } catch (error) {
          if (error) {
            MessageBox.error('Error Occurs');
            return;
          }
        }
      },
      onRow: function (oEvent) {
        var path = oEvent.getSource();
      },

      /**Editing Container types */
      onEditContainer: async function () {
        var oSelectedItem = this.byId("idContainerTypeTable").getSelectedItem();
        if (!oSelectedItem) {
          MessageBox.information("Please select at least one Row for edit!");
          return;
        }
        const oData = oSelectedItem.getBindingContext().getObject();
        await this.onPressEditInAddEquipmentTable();
        this.getView().getModel("CombinedModel").setProperty("/Vehicle",oData);
      },

      /**Updading Edited Values */
      onSave: async function () {
        const oData = this.getView().getModel("CombinedModel").getProperty("/Vehicle"),
        oView = this.getView();
        // validations
        const aUserInput = [
          { Id: "idVehInplength", value: oData.length, regex: /^\d+(\.\d+)?$/, message: "Enter length as a numeric value" },
          { Id: "idVehInpWidth", value: oData.width, regex: /^\d+(\.\d+)?$/, message: "Enter width as a numeric value" },
          { Id: "idVehInpheight", value: oData.height, regex: /^\d+(\.\d+)?$/, message: "Enter height as a numeric value" },
          { Id: "idVehInptruckweight", value: oData.truckWeight, regex: /^\d+(\.\d+)?$/, message: "Enter truck weight as numeric value" },
          { Id: "idVehInpcapacity", value: oData.capacity, regex: /^\d+(\.\d+)?$/, message: "Enter capacity" }
        ]

        // here interating through the above arrayv "aUserInputs" and calling "validateField" with arguments 
        let raisedErrors = []
        aUserInput.forEach(async input => {
          let aValidations = this.validateField(oView, input.Id, input.value, input.regex, input.message)
          if (aValidations.length > 0) {
            raisedErrors.push(aValidations[0]) // pushning error into empty array
          }
        })

        if (raisedErrors.length > 0) {
          for (let error of raisedErrors) {
            MessageBox.information(error) // showing error msg 
            return;
          }
        }

         const updatedData = oData;
        const oPayload = updatedData;
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        const otruckType = oPayload.truckType,
              ofreezed = oPayload.freezed;
        const oModel = this.getView().getModel("ModelV2");
        const oPath = `/TruckTypes(truckType='${otruckType}',freezed='${ofreezed}')`;
        try {

          await this.updateData(oModel, oPayload, oPath);
          this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInEditVehicleDialog();
          this.getView().getModel("ModelV2").setProperty("/Vehicle",{})
          MessageToast.show('Successfully Updated');
        } catch (error) {
          MessageToast.show('Error');
        } finally {
          this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInEditVehicleDialog();
          this.getView().getModel("ModelV2").setProperty("/Vehicle",{});
        }
      },

      /**Clearing Vehicle Editing Values */
      idTruckTypeTable: function () {
        this.getView().getModel("CombinedModel").setProperty("/Vehicle", {})
      },

      /**Editing Product Details */
      onPressEditInProductsTable: async function () {
        var oSelectedItem = this.byId("ProductsTable").getSelectedItem();
        if (!oSelectedItem) {
          MessageBox.information("Please select at least one Row for edit!");
          return;
        }
        const oData = oSelectedItem.getBindingContext().getObject();
        await this.oOpenProductEdit();
        /**Getting the model and setting data */
        var DummyModel = this.getView().getModel("CombinedModel");
        DummyModel.setProperty("/Product", oData);
      },
      /**Updadting the Changed Product Value */
      onSaveProduct: async function () {
          const updatedData = this.getView().getModel("CombinedModel").getProperty("/Product");
        const oPayload = updatedData;
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        var oID = updatedData.ID;
        /**If key is missing returns error */
        if (!oID) {
          sap.m.MessageBox.error("ID is not Found/Key Missing");
          return;
        }
        const oModel = this.getView().getModel("ModelV2");
        const oPath = `/Materials('${oID}')`;
        try {
          await this.updateData(oModel, oPayload, oPath);
          this.getView().byId("ProductsTable").getBinding("items").refresh();
          this.onCancelInEditProductDialog();
          this.onClearEditProdDialog();
          MessageToast.show('Successfully Updated');
        } catch (error) {
          this.onCancelInEditProductDialog();
          this.onClearEditProdDialog();
          MessageToast.show('Error');
        }
      },
      /**Clear Product Editing Dialog */
      onClearEditProdDialog: function () {
        this.getView().getModel("CombinedModel").setProperty("/Product",{});
      },

      /**Product Simulation */
      onTruckDetails: function () {
        const oVehType = this.byId("idcdsse").getValue(),
          oModel = this.getView().getModel("ModelV2"),
          sPath = "/TruckTypes";
        /**constructing Filter */
        const oFilter = new Filter("truckType", FilterOperator.EQ, oVehType);
        var that = this;
        /**Reading data */
        oModel.read(sPath, {
          filters: [oFilter], success: function (odata) {
            const oVolume = odata.results[0].volume,
              oCapacity = odata.results[0].capacity;
            // that.byId("idSystemvddsgehjdfghkIdIhjnput_InitialView").setValue(oVolume);
            // that.byId("idSystemvgwhjkIdInput_InitialView").setValue(oCapacity);
            /**total */
            // that.byId("idSystemvgwddshjkIdInput_InitialView").setValue(oVolume);
            // that.byId("idSystemvgehjdfghkIdIhjnput_InitialView").setValue(oCapacity);
          },
          error: function (oError) {

          }
        })
      },
      /**Product details submit event */
      onProdDetails: function () {
        const oProduct = this.byId("idproducthelp").getValue(),
          oModel = this.getView().getModel("ModelV2"),
          sPath = "/Materials";
        /**constructing Filter */
        const oFilter = new Filter("sapProductno", FilterOperator.EQ, oProduct);
        var that = this;
        /**Reading data */
        oModel.read(sPath, {
          filters: [oFilter], success: function (odata) {
            const oVolume = odata.results[0].volume;
            const tVolume = that.byId("idSystemvgwddshjkIdInput_InitialView").getValue();
            const oCVole = tVolume / oVolume;
            that.byId("idSystemvghjdfghkIdIhjnput_InitialView").setValue(oCVole);
          },
          error: function (oError) {

          }
        })
      },

      /**Uploading excel sheet,reading data and displaying data into table  */
      onUpload: function (e) {
        this._import(e.getParameter("files") && e.getParameter("files")[0]);
      },

      _import: function (file) {
        var that = this;
        let oTempProduct = that.getView().getModel("oJsonModelProd"),
          existData = oTempProduct.getData().products;
        var excelData = {};
        if (file && window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
              type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
              // Here is your object for every sheet in workbook
              excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

            });
            console.log(excelData);
            excelData.forEach(record => {
              if (record.Weight) { // Check if Weight field exists
                record.Weight += 'KG'; // Concatenate 'kg' to the Weight field
              }
            });
            var uniqueData = [...new Set(excelData)];
            console.log(uniqueData)
            // Step 2: Store new Excel data in local storage
            const combinedData = [...existData, ...uniqueData]; // Combine existing and new data
            localStorage.setItem("productsData", JSON.stringify(combinedData)); // Store combined data back in local storage

            // Step 3: Set the combined data to the local model
            oTempProduct.setData({ "products": combinedData }); // Update model with combined products
            oTempProduct.refresh(true); // Refresh the model to update UI bindings
          };
          reader.onerror = function (ex) {
            console.log(ex);

          };
          reader.readAsBinaryString(file);
        }
      },
      /** Simulating excel sheet products */
      onClickSimulate: async function () {
        var oTable = this.byId("idAddProductsTableIn_simulate");
        var aSelectedItems = oTable.getSelectedItems(); // Get selected items
        var aSelectedItems = oTable.getSelectedItems(); // Get selected items
        console.log("Selected Items Count:", aSelectedItems.length);
        console.log("Selected Items:", aSelectedItems); // Log selected items for debugging
        const oDropdown = this.byId("parkingLotSelect");
        const oSelectedKey = oDropdown.getSelectedKey();
        // Check if there are any selected items
        if (aSelectedItems.length > 0) {
          var selectedData = []; // Array to hold data of all selected items

          // Iterate over each selected item
          aSelectedItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContext("oJsonModelProd"); // Get the binding context for each item

            if (oContext) {
              // Retrieve properties from the context
              var rowData = {
                Product: oTable.getModel("oJsonModelProd").getProperty("Product", oContext),
                MaterialDescription: oTable.getModel("oJsonModelProd").getProperty("MaterialDescription", oContext),
                Quantity: oTable.getModel("oJsonModelProd").getProperty("Quantity", oContext),
                Volume: oTable.getModel("oJsonModelProd").getProperty("Volume", oContext),
                Weight: oTable.getModel("oJsonModelProd").getProperty("Weight", oContext)
              };
              // Push the row data into the selectedData array
              selectedData.push(rowData);
            } else {
              console.error("Binding context is undefined for a selected item.");
            }
          });

          // Log the data of all selected items
          console.log("Selected Items Data:", selectedData);

          // Calculate overall total volume across all rows
          const overallTotalVolume = selectedData.reduce((accumulator, item) => {
            return accumulator + item.Volume; // Use TotalVolume calculated for each row
          }, 0);
          function extractWeight(weightString) {
            // Use regex to match the numeric part of the string
            let match = weightString.match(/(\d+\.?\d*)/);
            // Return the parsed float or 0 if no match is found
            return match ? parseFloat(match[0]) : 0;
          }

          // Calculate overall total weight
          const overallTotalWeight = selectedData.reduce((accumulator, item) => {
            return accumulator + extractWeight(item.Weight); // Extract numeric weight and add to accumulator
          }, 0);

          console.log("Overall Total Weight:", overallTotalWeight); // Output the total weight

          console.log("Overall Total Volume:", overallTotalVolume);
          console.log("Overall Total Volume:", overallTotalWeight);

          // Load Container details
          await this.onContainerDetailsLoad().then(Trucks => {
            let requiredTrucks = [];
            Trucks.forEach(truck => {
              if (!oSelectedKey || truck.truckType === oSelectedKey) {
                const numberOfTrucksNeeded = Math.ceil(overallTotalVolume / truck.volume);
                const trucksToUse = numberOfTrucksNeeded > 0 ? numberOfTrucksNeeded : 1;
                requiredTrucks.push({
                  truckType: truck.truckType,
                  volume: truck.volume,
                  numberOfTrucksNeeded: trucksToUse
                });
              }
            });

            console.log("Required Trucks for Loading:");
            requiredTrucks.forEach(truck => {
              console.log(`- ${truck.truckType}: ${truck.numberOfTrucksNeeded} truck(s) needed (Capacity: ${truck.volume} Kgs)`);
            });

            // Construct JSON model for storing overall total volume and product details
            const jsonModelData = {
              OverallTotalVolume: overallTotalVolume,
              overallTotalWeight: overallTotalWeight,
              Products: selectedData,
              TProducts: selectedData.length,
              RequiredTrucks: requiredTrucks
            };

            // Assuming you want to set this data to a model named "resultModel"
            const resultModel = new sap.ui.model.json.JSONModel(jsonModelData);

            // Set the model to your view or component
            this.getView().setModel(resultModel, "resultModel");
            this.getOwnerComponent().setModel(resultModel, "resultModel");
            // this.byId("idReq").setModel(resultModel, "resultModel");
            const modelData = this.getView().getModel("resultModel").getData();
            console.log(modelData);

            // this.onLoadRequiredTrucks();

            this.getView().byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
            this.getView().getModel("resultModel").refresh();
            this.MoveToNextScreen();
            this.getView().byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
            this.getView().getModel("resultModel").refresh();
          }).catch(error => {
            console.error("Error loading truck details:", error);
          });

        } else {
          console.log("No items are selected.");
        }
      },

      /** Container Details reading */
      onContainerDetailsLoad: function () {
        return new Promise((resolve, reject) => {
          const oPath = "/TruckTypes";
          const oModel = this.getView().getModel("ModelV2");

          oModel.read(oPath, {
            success: function (odata) {
              resolve(odata.results); // Resolve with the truck data array
            },
            error: function (oError) {
              reject(oError); // Reject with error information
            }
          });
        });
      },

      /**Loading Required Container */

      onLoadRequiredTrucks: async function () {
        if (!this.oReqContainerDialog) {
          this.oReqContainerDialog = await this.loadFragment("RequiredContainer");
        }
        this.oReqContainerDialog.setModel(this.getView().getModel("resultModel"), "resultModel")
        // Get the count of trucks
        const products = this.getView().getModel("resultModel").getProperty("/Products");
        const productCount = products ? products.length : 0;
        this.oReqContainerDialog.open();
      },

      onTruckDialogClose: function () {
        this.byId("truckLoadingDialog").close();
      },
      MoveToNextScreen: function () {
        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("ManuvalSimulation");
      },
      /**Filtering Based on Material number */
      onLiveBinNumberTAble: function (oEvent) {
        let aFilter = [];
        let sQuery = oEvent.getParameter("newValue");
        sQuery = sQuery.replace(/\s+/g, '');
        sQuery = sQuery.toUpperCase();
        if (sQuery && sQuery.length > 1) {
          aFilter.push(new Filter("sapProductno", FilterOperator.EQ, sQuery));
        }
        var oTable = this.byId("ProductsTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilter);
      },


      /**For creating n number of products at a time */
      onUploadMaterialCreation: function (e) {
        this._import1(e.getParameter("files") && e.getParameter("files")[0]);
      },
      _import1: function (file) {
        var that = this;
        if (file && window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var excelData = []; // Initialize an array to hold the data

            workbook.SheetNames.forEach(function (sheetName) {
              // Convert each sheet to an array of objects
              const sheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              excelData = excelData.concat(sheetData); // Combine data from all sheets
            });

            console.log(excelData)

            that.createProducts(excelData);
            // Refresh the local model if necessary
            that.localModel.refresh(true);
          };

          reader.onerror = function (ex) {
            console.error("Error reading file:", ex);
          };

          reader.readAsBinaryString(file);
        } else {
          console.error("No file selected or FileReader not supported.");
        }
      },

      createProducts: async function (data) {
        const oModel = this.getView().getModel("ModelV2");
        const oPath = "/Materials";
        const errorMessages = [];
        for (const product of data) {
          try {
            // Check if the product already exists
            const exists = this.checkProductExists(product['SAP Productno']);
            if (exists) {
              console.warn(`Product with SAP Productno ${product['SAP Productno']} already exists. Skipping creation.`);
              continue; // Skip to the next product
            }

            const oPayload = {
              sapProductno: String(product['SAP Productno']), // Ensure it's a string
              length: String(product.Length),                  // Ensure it's a string
              width: String(product.Width),                    // Ensure it's a string
              height: String(product.Height),                  // Ensure it's a string
              volume: String(product.Volume),                                      // Set volume if needed
              uom: String(product.UOM),                        // Ensure it's a string
              mCategory: String(product['Material Category']), // Ensure it's a string
              description: String(product.Description),        // Ensure it's a string
              EAN: String(product.EAN),                  // Ensure it's a string
              weight: String(product.Weight),
              quantity: String(product.Quantity)                    // Ensure it's a string
            };

            await this.createData(oModel, oPayload, oPath);
            console.log(`Product created successfully: ${product.Description}`);
            this.byId("ProductsTable").getBinding("items").refresh();
          } catch (error) {
            const errorMessage = `Error creating product ${product['SAP Productno']}: ${error.message}`;
            console.error(errorMessage);
            errorMessages.push(errorMessage); // Store the error message in the array

            // Optionally show an error message box for immediate feedback to the user
            MessageBox.error(errorMessage);

          }
        }
      },

      // Function to check if the product already exists in memory
      checkProductExists: function (sapProductNo) {
        if (!this.existingProducts || !Array.isArray(this.existingProducts)) {
          console.error("existingProducts is not initialized or not an array.");
          return false; // If not initialized, assume it doesn't exist.
        }
        return this.existingProducts.some(product => product.sapProductno === sapProductNo);
      },


      // Function to load existing products from the OData service into memory
      loadExistingProducts: async function () {
        const oModel = this.getView().getModel("ModelV2");
        const oPath = "/Materials";

        return new Promise((resolve, reject) => {
          oModel.read(oPath, {
            success: (odata) => {
              this.existingProducts = odata.results; // Store existing products in memory
              resolve();
            },
            error: (oError) => {
              console.error('Error loading existing products:', oError);
              reject(oError);
            }
          });
        });
      },
      /***modified by viswam */
      onClickSimulate11: function () {
        this.byId("Productarea").setVisible(false);
        this.byId("3dSimulator").setVisible(true);
      },
      onPressBacktomaterialupload: function () {
        this.byId("3dSimulator").setVisible(false);
        this.byId("Productarea").setVisible(true);
      },
      /*** -------------------------------------------------*/

      /**Simulating single products with simulations */
      onSimulate: function () {
        var oSelKey = this.byId("parkingLotSelect").getSelectedKey();
        if (!oSelKey) {
          MessageBox.warning("Please Select Truck Type");
          return;
        }
        var oMat = this.byId("idproducthelp").getValue(),
          oQuan = this.byId('idSystemvghjdfghkIdIhjnput_InitialView').getValue();
        if (!oMat) {
          MessageBox.information("Please Enter Material!");
          return;
        }
        if (!oQuan) {
          MessageBox.information("Please Enter  Quantity!");
          return;
        }
        this.oProductRead(oMat, oQuan);
      },

      /**reading material */

      oProductRead: async function (oMat, oQuan) {
        const oPath = "/Materials",
          oModel = this.getView().getModel("ModelV2");
        const sFilter = new Filter("sapProductno", FilterOperator.EQ, oMat);
        try {
          const oSuccessData = await this.readData(oModel, oPath, sFilter);
          console.log("success");
          console.log(oSuccessData)
          const oTemp = oSuccessData.results[0].volume;
          const oTempW = oSuccessData.results[0].weight;
          const oNews = parseFloat(oTempW);
          const oWeight = oNews * oQuan + "KG";
          const oVolume = oTemp * oQuan;
          const oTempJSon = this.getView().getModel("oJsonModelProd");

          // Update the JSON model with product details
          const newProduct = {
            Product: oMat,
            MaterialDescription: oSuccessData.results[0].description,
            Quantity: oQuan,
            Volume: oVolume,
            Weight: oWeight
          };

          // Assuming you want to store multiple products in an array
          let products = oTempJSon.getProperty("/products") || []; // Get existing products or initialize an empty array
          products.push(newProduct); // Add new product to the array
          oTempJSon.setProperty("/products", products); // Update the model with the new array
          this.byId("idproducthelp").setValue();
          this.byId('idSystemvghjdfghkIdIhjnput_InitialView').setValue();
          this.Blocking();
          // Save updated products to local storage
          localStorage.setItem("productsData", JSON.stringify(products));
          MessageToast.show("Materials read successfully!");
        } catch (oErrorData) {
          MessageBox.warning("Please Enter Valid Material");
        }
      },
      /***Blocking the truck type in simulations */
      Blocking: function () {
        var oLength = this.byId("idAddProductsTableIn_simulate").getItems().length;
        if (oLength > 0) {
          this.byId("parkingLotSelect").setEditable(false);
        }
      },
      // Call this method on initialization to load products from local storage
      loadProductsFromLocalStorage: function () {
        const oTempJSon = this.getView().getModel("oJsonModelProd");

        if (!oTempJSon) {
          console.error("JSON Model 'oJsonModelProd' is not defined.");
          return; // Exit if model is not available
        }

        const savedProducts = localStorage.getItem("productsData");
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          console.log("Loaded products from local storage:", products);

          // Ensure the structure is correct
          if (Array.isArray(products)) {
            oTempJSon.setProperty("/products", products);
            console.log("Products set in model:", oTempJSon.getProperty("/products"));

            // Refresh the table binding
            // this.getView().byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
            this.getView().getModel("oJsonModelProd").refresh(true);
          } else {
            console.error("Loaded data is not an array:", products);
          }
        } else {
          console.log("No products found in local storage.");
        }
      },
      /**Removing all Products i.e local storage */
      onRemoveSelectedProducts: function () {
        // Get the current model
        const oTempJSon = this.getView().getModel("oJsonModelProd");

        // Get the table and selected items
        const oTable = this.getView().byId("idAddProductsTableIn_simulate");
        const aSelectedItems = oTable.getSelectedItems();

        // If there are selected items, remove them
        if (aSelectedItems.length > 0) {
          const aProducts = oTempJSon.getProperty("/products");

          // Create a set of selected product keys for easier lookup
          const aSelectedKeys = aSelectedItems.map(item => {
            return item.getBindingContext("oJsonModelProd").getProperty("Product");
          });

          console.log("Selected Keys:", aSelectedKeys); // Log selected keys
          console.log("All Products:", aProducts); // Log all products

          // Filter out products that are in the selected keys
          const aFilteredProducts = aProducts.filter(product => {
            const isSelected = aSelectedKeys.includes(product.Product);
            console.log(`Checking product: ${product.Product}, is selected: ${isSelected}`); // Log each check
            return !isSelected; // Keep products that are not selected
          });

          console.log("Filtered Products:", aFilteredProducts); // Log filtered products

          // Update the model with filtered products
          oTempJSon.setProperty("/products", aFilteredProducts);

          // Update local storage with the new array
          localStorage.setItem("productsData", JSON.stringify(aFilteredProducts));

          // Refresh table binding to reflect changes
          oTable.getBinding("items").refresh();

          // Inform the user that selected products have been removed
          sap.m.MessageToast.show("Selected products have been removed.");
          this.Blocking();
        } else {
          // If no items are selected, remove all products
          oTempJSon.setProperty("/products", []);

          // Clear local storage
          localStorage.removeItem("productsData");

          // Refresh table binding to reflect changes
          oTable.getBinding("items").refresh();

          // Inform the user that all products have been removed
          sap.m.MessageToast.show("All products have been removed.");
        }
      },

      // for the simluate second screen add vehicle type 

      onNextInAddProduct: function () {

        // this.getView().byId("idAddVehicleTypeSrInSimulate_changeQueue").setVisible("true");

        var oWizard = this.byId("idWizardIn_simulate");

        var oCurrentStep = oWizard.getCurrentStep();

        oWizard.nextStep();
        this._createGenericTile()
        //this.getView().byId("idVBoxInSelectVehicleType").setVisible("false");

      },



      // dialog for the Stack
      onPressStackBtn: async function () {
        if (!this.oStackDialog) {
          this.oStackDialog = await this.loadFragment("Stack");
        }
        this.oStackDialog.open();
      },
      onCancelInStackDialog: function () {
        this.oStackDialog.close();
      },

      // creating stak tile in the Stack dialog
      _createGenericStackTile: function () {
        // Get the container where the tile will be placed
        var oTileContainer = this.byId("VboxIdStacktiles");
        //getting model 

      },
      onNextPressInSeconsSrInAddVehicleType: function () {
        debugger

        this.getView().byId("idProcessQueueStep_changeQueue").setVisible(true);


      },
      /*  ****************************************************************************Simulation code**************************************************************************** */




      onPressGenericTilePress: function (oEvent) {
        debugger;
        var oWizard = this.byId("idWizardIn_simulate");
        var oCurrentStep = oWizard.getCurrentStep();
 
        oWizard.nextStep();
        const oTile = oEvent.getSource();
        const header = oTile.getHeader();
 
 
 
 
        // Reinitialize the 3D scene
        this._init3DScene();
 
        // Fetch dimensions based on truck type
        const oModel = this.getOwnerComponent().getModel("ModelV2");
        const sPath = "/TruckTypes";
        const oFilter = new Filter("truckType", FilterOperator.EQ, header);
 
        oModel.read(sPath, {
          filters: [oFilter],
          success: function (odata) {
            if (odata.results.length > 0) {
              const height = parseFloat(odata.results[0].height);
              const length = parseFloat(odata.results[0].length);
              const width = parseFloat(odata.results[0].width);
 
              // Create a new container
              this._createContainer(height, length, width);
            } else {
              console.error("No data found for the selected truck type.");
            }
          }.bind(this),
          error: function (oError) {
            console.error("Error fetching truck type data:", oError);
          }
        });
      },
 


      onPressAddProductInSimulate: async function () {
        debugger

        if (!this.oValueDialog) {
          this.oValueDialog = await this.loadFragment("ValueHelp");
        }
        this.oValueDialog.open();




      },
      onValueHelpWithSuggestionsCancelPress: function () {
        this._oVHDWithSuggestions.close();
      },
      onPressTile: function (oEvent) {
        var sHeader = oEvent.getSource().getHeader(); // Get the header of the clicked tile
        var oObjectImage = {
          Box: [
            "https://www.searates.com/design/images/apps/load-calculator/boxes-layers.svg",
            "https://www.searates.com/design/images/apps/load-calculator/boxes-height.svg",
            "https://www.searates.com/design/images/apps/load-calculator/boxes-mass.svg"
          ],
          Bigbags: [
            "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-layers.svg",
            "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-mass.svg",
            "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-height.svg"
          ],
          Sacks: [
            "https://www.searates.com/design/images/apps/load-calculator/product-form/sacks-layers.svg?3",
            "https://www.searates.com/design/images/apps/load-calculator/product-form/sacks-height.svg?3",
            "https://www.searates.com/design/images/apps/load-calculator/product-form/sacks-mass.svg?3"
          ],
          Barrels: [
            "https://www.searates.com/design/images/apps/load-calculator/barrels-layers.svg",
            "https://www.searates.com/design/images/apps/load-calculator/barrels-height.svg",
            "https://www.searates.com/design/images/apps/load-calculator/barrels-mass.svg"
          ],
          Roll: [
            "https://www.searates.com/design/images/apps/load-calculator/rolls-layers.svg",
            "https://www.searates.com/design/images/apps/load-calculator/rolls-height.svg",
            "https://www.searates.com/design/images/apps/load-calculator/rolls-mass.svg"
          ],
          Pipes: [
            "https://www.searates.com/design/images/apps/load-calculator/rolls-layers.svg",
            "https://www.searates.com/design/images/apps/load-calculator/rolls-height.svg",
            "https://www.searates.com/design/images/apps/load-calculator/rolls-mass.svg"
          ],
          Bulk: [
            // Add URLs for Bulk images if needed
          ]
        };

        // Check if there are images for the clicked tile
        if (oObjectImage[sHeader]) {
          var aImages = oObjectImage[sHeader];

          this.byId("idImageInStack").setSrc(aImages[0]);
          this.byId("idImage3InStack").setSrc(aImages[1]);
          this.byId("idImage43InStack").setSrc(aImages[2]);

          // Show the image display section
          this.byId("imageDisplayHBox").setVisible(true);
        }
      },





      onPressAddButtonValueHelp: function () {
        var oTable = this.byId("idAssignedQueueTable_changeQueue");
        var aSelectedItems = oTable.getSelectedItems();
      },


      onPressBigBagsTile: function () {
        var oModel1 = new JSONModel({

          //  newImageUrl : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-layers.svg", 
          //  newImageUrl1 : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-mass.svg", 
          //  newImageUrl2 : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-height.svg", // Update with your logic

        });
        this.getView().byId("idVbox4InStack").setModel(oModel1, "oimage");

        var oModel = this.getView().byId("idVbox4InStack").getModel();
        // var newImageUrl = "https://www.searates.com/design/images/apps/load-calculator/rolls-mass.svg"; // Update with your logic
        // var newImageUrl = "https://www.searates.com/design/images/apps/load-calculator/rolls-mass.svg"; // Update with your logic
        // var newImageUrl = "https://www.searates.com/design/images/apps/load-calculator/rolls-mass.svg"; // Update with your logic
        //     oModel.setProperty("/imageUrl", newImageUrl);
        // /this.getView()by.setModel(oJsonModelVeh, "VehModel");
        const oPayload = this.getView().byId("idVbox4InStack").getModel("oimage").getProperty("/");
        console.log(oPayload);
      },




      _init3DScene: function () {
        // If the scene and renderer exist, clear them
        if (this.scene) {
          while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
          }
        } else {
          this.scene = new THREE.Scene();
          this.scene.background = new THREE.Color(0xFFA500); // Orange background
        }

        // If the renderer exists, dispose of its DOM element
        if (this.renderer) {
          this.renderer.domElement.remove();
          this.renderer.dispose();
        }

        // Set up the renderer and append it to the canvas container
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        const canvasContainer = document.getElementById("threejsCanvas");
        if (!canvasContainer) {
          console.error("Canvas container not found");
          return;
        }
        this.renderer.setSize(800, 600); // Increase canvas size
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        canvasContainer.appendChild(this.renderer.domElement);

        // Set up the camera with increased initial zoom
        this.camera = new THREE.PerspectiveCamera(40, 1000 / 700, 0.1, 1000); // Reduced FOV to make objects appear larger
        this.camera.position.set(10, 10, 20); // Position closer to the scene for larger appearance
        // Set up orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Add lighting
        this._addLighting();

        // Start the animation loop
        this._animate();
      },

      _createContainer: function (height, length, width) {
        // Remove any existing container
        if (this.container) {
          this.scene.remove(this.container);
          this.container.geometry.dispose();
          this.container.material.dispose();
        }

        // Create geometry for the container
        const geometry = new THREE.BoxGeometry(length, height, width);

        // Create a material with transparency and metallic properties
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x007BFF, // Blue color
          metalness: 0.8, // Metallic effect
          roughness: 0.4, // Smooth metallic surface
          opacity: 0.5, // Transparent effect
          transparent: true, // Enable transparency
          side: THREE.DoubleSide // Render both sides
        });

        // Create the container mesh
        this.container = new THREE.Mesh(geometry, material);
        this.container.castShadow = true;
        this.container.receiveShadow = true;

        // Position the container at the origin
        this.container.position.set(0, height / 2, 0);

        // Add the container to the scene
        this.scene.add(this.container);

        console.log("Container created with dimensions:", { height, length, width });

        // Get selected products from the table
        const oTable = this.getView().byId("idAddProductsTableIn_simulate");
        const aSelectedItems = oTable.getSelectedItems();
        const aSelectedData = aSelectedItems.map(item => item.getBindingContext().getObject());

        console.log("Selected Items Data as Objects:", aSelectedData);

        // Call the _createProducts method to add products to the container
        this._createProducts(aSelectedData, height, length, width);
      },

      _createProducts: function (selectedProducts, containerHeight, containerLength, containerWidth) {
        let currentX = -containerLength / 2;
        let currentZ = -containerWidth / 2;
        let currentY = 0;
        const positionMap = []; // Reset position map
        const chartData = [];
    
        let totalQuantity = 0;
        let totalVolume = 0;
        let totalWeight = 0;
    
        const containerMaxVolume = containerHeight * containerLength * containerWidth;
        const containerMaxWeight = 1000; // Example max weight in kg
    
        selectedProducts.forEach(product => {
            const SelectedQuantity = parseInt(product.SelectedQuantity);
            const productLength = Math.max(parseFloat(product.Productno.length), 0.01);
            const productHeight = Math.max(parseFloat(product.Productno.height), 0.01);
            const productWidth = Math.max(parseFloat(product.Productno.width), 0.01);
            const productColor = product.Productno.color;
            const productWeight = parseFloat(product.Productno.weight);
            const productName = product.Productno.description;
    
            let totalChartVolume = 0;
            let totalChartWeight = 0;
    
            for (let i = 0; i < SelectedQuantity; i++) {
                let isOverlap = true;
    
                while (isOverlap) {
                    // Reset positions when bounds are reached
                    if (currentX + productLength > containerLength / 2) {
                        currentX = -containerLength / 2;
                        currentZ += productWidth;
    
                        if (currentZ + productWidth > containerWidth / 2) {
                            currentZ = -containerWidth / 2;
                            currentY += productHeight;
                        }
                    }
    
                    // Check for overlaps
                    isOverlap = positionMap.some(position => (
                        currentX < position.xEnd && (currentX + productLength) > position.xStart &&
                        currentZ < position.zEnd && (currentZ + productWidth) > position.zStart &&
                        currentY < position.yTop
                    ));
    
                    if (isOverlap) {
                        currentX += productLength; // Adjust position to avoid overlap
                    }
                }
    
                if (!isOverlap) {
                    // Create 3D product representation
                    const productGeometry = new THREE.BoxGeometry(productLength, productHeight, productWidth);
                    const productMaterial = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(productColor),
                        metalness: 0.5,
                        roughness: 0.5
                    });
    
                    const productMesh = new THREE.Mesh(productGeometry, productMaterial);
                    productMesh.position.set(
                        currentX + productLength / 2,
                        currentY + productHeight / 2,
                        currentZ + productWidth / 2
                    );
                    this.scene.add(productMesh);
    
                    // Add wireframe for visualization
                    const edgesGeometry = new THREE.EdgesGeometry(productGeometry);
                    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
                    edges.position.copy(productMesh.position);
                    this.scene.add(edges);
    
                    // Update position map
                    positionMap.push({
                        xStart: currentX,
                        xEnd: currentX + productLength,
                        zStart: currentZ,
                        zEnd: currentZ + productWidth,
                        yTop: currentY + productHeight
                    });
    
                    totalQuantity++;
                    const productVolume = productLength * productHeight * productWidth;
                    totalVolume += productVolume;
                    totalWeight += productWeight;
                    totalChartVolume += productVolume;
                    totalChartWeight += productWeight;
    
                    currentX += productLength; // Move to the next position
                }
            }
    
            // Add product data to chart
            chartData.push({
                Name: productName,
                Packages: SelectedQuantity,
                Volume: totalChartVolume.toFixed(1),
                Weight: totalChartWeight.toFixed(1),
                Color: productColor
            });
        });
    
        // Calculate remaining volume and weight
        const remainingVolume = containerMaxVolume - totalVolume;
        const remainingWeight = containerMaxWeight - totalWeight;
    
        // Add empty space data to chart
        chartData.push({
            Name: "Empty",
            Packages: 0,
            Volume: remainingVolume.toFixed(1),
            Weight: 0,
            Color: "#cccccc" // Gray color for "Empty"
        });
    
        // Update view models with calculated data
        this.getView().getModel("ChartData").setProperty("/chartData", chartData);
        this.getView().getModel("Calculation").setProperty("/", {
            TotalQuantity: totalQuantity,
            TotalVolume: `${totalVolume.toFixed(1)} m³ (${((totalVolume / containerMaxVolume) * 100).toFixed(1)}% filled)`,
            TotalWeight: `${totalWeight.toFixed(1)} kg`,
            RemainingCapacity: `${remainingVolume.toFixed(1)} m³ (${((remainingVolume / containerMaxVolume) * 100).toFixed(1)}% empty)`
        });
    
        // Update pie chart visualization
        const oVizFrame = this.getView().byId("idPieChart");
        oVizFrame.setVizProperties({
            plotArea: {
                colorPalette: chartData.map(item => item.Color), // Dynamically set colors
                dataLabel: {
                    visible: true
                }
            },
            title: {
                text: "Cargo Volume Breakdown"
            }
        });
    },
    
      _addLighting: function () {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const lightPositions = [
          { x: 50, y: 50, z: 50 },
          { x: -50, y: 50, z: 50 },
          { x: 50, y: 50, z: -50 },
          { x: -50, y: 50, z: -50 }
        ];

        lightPositions.forEach((pos) => {
          const light = new THREE.DirectionalLight(0xffffff, 0.5);
          light.position.set(pos.x, pos.y, pos.z);
          this.scene.add(light);
        });
      },

      _animate: function () {
        const animate = () => {
          requestAnimationFrame(animate);
          this.controls.update();
          this.renderer.render(this.scene, this.camera);
        };
        animate();
      },
      // downloding the products list selected for the simulation
      onDownloadPressInSimulate: function () {

        var oTable = this.byId("idAddProductsTableIn_simulate");
        var aItems = oTable.getItems();
        var aData = [];
        // Push column headers as the first row
        var aHeaders = [
          "Product",
          "Description",
          "Quantity",
          "Volume",
          "Weight",
          "Length",
          "Width",
          "Height",
          "Color",
          "Stack"

        ];
        aData.push(aHeaders);

        // Iterate through table items and collect data
        aItems.forEach(function (oItem) {
          var oCells = oItem.getCells();
          var rowData = [];
          oCells.forEach(function (oCell) {
            rowData.push(oCell.getText());
          });
          aData.push(rowData);
        });

        // Prepare Excel workbook
        var oSheet = XLSX.utils.aoa_to_sheet(aData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "ProductsListTable");

        // Generate and download the Excel file
        XLSX.writeFile(oWorkbook, "ProductsListTable.xlsx");
      },

   

      /**logic for material upload and simulation */
      onSelectedProductSimulations: function (e) {
        this._ProductUploads(e.getParameter("files") && e.getParameter("files")[0]);
      },
      _ProductUploads: function (file) {
        var that = this;
        if (file && window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var excelData = []; // Initialize an array to hold the data
            workbook.SheetNames.forEach(function (sheetName) {
              // Convert each sheet to an array of objects
              const sheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              excelData = excelData.concat(sheetData); // Combine data from all sheets
            });
            console.log("Products table data for Simulation:", excelData);

            that.onMaterialRead(excelData);
          };
          reader.onerror = function (ex) {
            console.error("Error reading file:", ex);
          };
          reader.readAsBinaryString(file);
        } else {
          console.error("No file selected or FileReader not supported.");
        }
      },
      /**Reading products */
      onMaterialRead: async function (excelData) {
        const oModel = this.getView().getModel('ModelV2');
        const oPath = "/Materials";
        let oFilter = [];

        try {
          // Fetch product data from the model
          const oProductData = await this.readData(oModel, oPath, oFilter);
          console.log("oProduct Data:", oProductData);

          // Extract Productno values from excelData
          const oTempData = excelData.map(item => item["Productno"]); // Assuming "Productno " has a trailing space
          console.log("TempData:", oTempData);

          // Extract sapProductno values from fetched product data
          const oTest = oProductData.results.map(ele => ele.sapProductno);
          console.log("oTest Data:", oTest);

          // Check if all elements in excelData exist in oTest
          const allExist = oTempData.every(item => oTest.includes(item));
          if (!allExist) {
            return MessageBox.error("Some products do not exist.");
          }

          // If all products exist, filter IDs based on excelData and include SelectedQuantity
          const filteredIDs = excelData
            .filter(item => oTest.includes(item["Productno"])); // Filter based on Productno

          const result = filteredIDs.map(item => {
            const product = oProductData.results.find(product => product.sapProductno === item["Productno"]);
            return {
              ID: product ? product.ID : null, // Get ID if product exists
              SelectedQuantity: item["SelectedQuantity"] // Get corresponding SelectedQuantity
            };
          });
          this.onCreateSelProduct(result);

          console.log("Filtered IDs with Selected Quantities:", result); // Log the filtered IDs with quantities

        } catch (error) {
          // Handle errors and display error message
          MessageBox.error("An error occurred");
        }
      },

      /**Creating  selected Products*/
      onCreateSelProduct: async function (oEvent) {
        const oModel = this.getView().getModel("ModelV2"),
          sPath = "/SelectedProduct";


        try {
          // Initialize an empty array for the payload
          let oPayload = [];

          // Iterate over each element in oEvent
          oEvent.forEach(ele => {
            // Log the current element for debugging
            console.log("Processing element:", ele);

            // Create an object for the payload based on the current element
            const payloadItem = {
              Productno_ID: ele.ID, // Adjust property names as necessary
              SelectedQuantity: String(ele.SelectedQuantity) // Adjust property names as necessary
            };        // Push the created object into the payload array
            oPayload.push(payloadItem);
          });
          // Log the complete payload for debugging
          console.log("Payload to be sent:", oPayload);
          // Create data using the constructed payload
          await this.createData(oModel, oPayload, sPath);
          // Refresh the binding of the items in the table
          this.byId("idAddProductsTableIn_simulate").getBinding("items").refresh();
          // Show success message
          MessageToast.show("Created Successfully");
        } catch (oError) {
          // Refresh the binding of the items in case of error as well
          this.byId("idAddProductsTableIn_simulate").getBinding("items").refresh();

          // Show error message
          MessageBox.error(oError.message || "An error occurred");
        }

      }
    });
  });