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
    'sap/m/Token',
    'sap/ui/table/Column',
    'sap/m/SearchField',
    'sap/m/Column',
    'sap/m/Label',
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
  function (Controller, Fragment, Filter, FilterOperator, IconTabBar, IconTabFilter, JSONModel, MessageToast, ODataModel, MessageBox, UIComponent, GenericTile, TileContent,
    ImageContent, Tex, library, TypeString, ColumnListItem, Token, TableColumn, SearchField, MColumn, Label, exportLibrary, Spreadsheet) {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    return Controller.extend("com.app.artihcus.controller.MainPage", {
      onInit: function () {

        // Material upload
        this.MaterialModel = new JSONModel();
        this.getView().setModel(this.MaterialModel, "MaterialModel");

        // Container upload
        this.ContainerModel = new JSONModel();
        this.getView().setModel(this.ContainerModel, "ContainerModel");

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
        /**Constructing Product Model and set the model to the view */
        // const oJsonModel = new JSONModel({
        //   model: "",
        //   length: "",
        //   width: "",

        //   height: "",
        //   volume: "",
        //   uom: "",
        //   vuom: "",
        //   wuom: "",
        //   muom: "",
        //   mCategory: "",
        //   description: "",
        //   EAN: "",
        //   weight: "",
        //   color: ""
        // })
        // this.getView().setModel(oJsonModel, "ProductModel");

        // /**Constructing JSON Model and set the model to the view*/
        // const oJsonModelVeh = new JSONModel({
        //   truckType: "",
        //   length: "",
        //   width: "",
        //   height: "",
        //   uom: "",
        //   tvuom: "M³",
        //   tuom: "M",
        //   volume: "",
        //   truckWeight: "",
        //   capacity: "",
        //   freezed: "",
        // });
        // this.getView().setModel(oJsonModelVeh, "VehModel");

        // Constructing a combined JSON Model
        const oCombinedJsonModel = new JSONModel({
          Product: {
            model: "",
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
            netWeight: "",
            grossWeight: "",
            color: "",
            stack: ""
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

        //For the Product details editing this flag is required...
        this.isEditingRowRecord = false;
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
              // adding serial numbers
              excelData.forEach(function (item, index) {
                item.serialNumber = index + 1; // Serial number starts from 1
              });

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
        var addedProdCodeModel = this.getView().getModel("MaterialModel").getData();
        // var batchChanges = [];
        var oDataModel = this.getView().getModel("ModelV2");
        var batchGroupId = "batchCreateGroup";

        const oView = this.getView();

        // test
        // excel Validations

        let raisedErrors = []
        addedProdCodeModel.items.forEach(async (item, index) => {

          const aExcelInputs = [
            { value: item.model, regex: null, message: "Enter SAP product number" },
            { value: item.description, regex: null, message: "Enter description" },
            { value: item.mCategory, regex: null, message: "Enter category" },
            { value: item.length, regex: null, message: "Enter Length" },
            { value: item.width, regex: null, message: "Enter Width" },
            { value: item.height, regex: null, message: "Enter Height" },
            { value: item.quantity, regex: null, message: "Enter Quantity" },
            { value: item.uom, regex: null, message: "Enter UOM" },
            { value: item.grossWeight, regex: null, message: "Enter Gross Weight" },
            { value: item.netWeight, regex: null, message: "Enter Net Weight" },
            { value: item.length, regex: /^\d+(\.\d+)?$/, message: "Length should be numeric" },
            { value: item.width, regex: /^\d+(\.\d+)?$/, message: "Width should be numeric" },
            { value: item.height, regex: /^\d+(\.\d+)?$/, message: "Height should be numeric" },
            { value: item.quantity, regex: /^\d+$/, message: "Quantity should be numeric" },
            { value: item.grossWeight, regex: /^\d+(\.\d+)?$/, message: "Gross Weight should be numeric" },
            { value: item.netWeight, regex: /^\d+(\.\d+)?$/, message: "Net Weight should be numeric" },
            { value: item.wuom, regex: null, message: "Enter UOM for Weight" },
            { value: item.volume, regex: null, message: "Enter Volume" },
            { value: item.stack, regex: null, message: "Enter stack" },
            { value: item.stack, regex: /^\d+$/, message: "Stack should be numeric" },
            { value: item.uom, regex: /^[A-Za-z]{1,2}$/, message: "UOM should be a string with a maximum length of 2 characters" }
          ]
          for (let input of aExcelInputs) {
            let aValidations = this.validateField(oView, null, input.value, input.regex, input.message)
            if (aValidations.length > 0) {
              raisedErrors.push({ index: index, errorMsg: aValidations[0] }) // pushning error into empty array
            }
          }
        })

        if (raisedErrors.length > 0) {
          for (let error of raisedErrors) {
            MessageBox.information(`Check record number ${error.index + 1} ${error.errorMsg}`) // showing error msg 
            return;
          }
        }
        // test
        try {
          addedProdCodeModel.items.forEach(async (item, index) => {
            delete item.serialNumber
            item.length = String(item.length).trim();
            item.width = String(item.width).trim();
            item.height = String(item.height).trim();
            item.netWeight = String(item.netWeight).trim();
            item.grossWeight = String(item.grossWeight).trim();
            item.quantity = String(item.quantity).trim();
            item.volume = String(item.volume).trim();
            item.stack = String(item.stack).trim();

            // Create individual batch request 
            await oDataModel.create("/Materials", item, {

              //         let aErrors = []


              //         addedProdCodeModel.items.forEach((item, index) => {
              //           item.length = String(item.length).trim();
              //           item.width = String(item.width).trim();
              //           item.height = String(item.height).trim();
              //           item.weight = String(item.weight).trim();
              //           item.quantity = String(item.quantity).trim();
              //           item.volume = String(item.volume).trim();

              //           // Create individual batch request
              //           batchChanges.push(
              //             oDataModel.create("/Materials", item, {

              method: "POST",
              groupId: batchGroupId, // Specify the batch group ID here
              success: function (data, response) {
                if (addedProdCodeModel.items.length === index + 1) {
                  MessageBox.success("Materials created successfully");
                  if (that.oFragment) {
                    that.oFragment.close();
                    that.byId("ProductsTable").getBinding("items").refresh();
                  }
                }
              },
              error: function (err) {
                // Handle error for individual item
                if (JSON.parse(err.responseText).error.message.value.toLowerCase() === "entity already exists") {
                  MessageBox.error("You are trying to upload a material which is already exists");
                } else {
                  MessageBox.error("Please check the uploaded file and upload correct data");
                }
                console.error("Error creating material:", err);
              }
            })
          });

          // Now send the batch request using batch group
          await oDataModel.submitChanges({
            batchGroupId: batchGroupId,
            success: function (oData, response) {
              // MessageBox.success("Materials batch created successfully");
              console.log("Batch request submitted", oData);
              // Perform any final operations if needed after all batch operations succeed
            },
            error: function (err) {
              MessageBox.success("Error creating material batch");
              console.error("Error in batch request:", err);
              // Handle any failure in the batch submission (e.g., server issues)
            }
          });
        } catch (error) {
          console.log(error);
          MessageToast.show("Facing technical issue")
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
              product: oData.model,
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

      // onPressPrintModelTable: function () {

      //   var oTable = this.byId("ProductsTable");
      //   var aItems = oTable.getItems();
      //   var aData = [];
      //   // Push column headers as the first row
      //   var aHeaders = [
      //     "Model",
      //     "Description",
      //     "EAN",
      //     "Model Category",
      //     "Quantity",
      //     "Length",
      //     "Width",
      //     "Height",
      //     "UOM",
      //     "Volume(M³)",
      //     "Net Weight",
      //     "Gross Weight",
      //     "UOM",
      //     "Stack"
      //   ];
      //   aData.push(aHeaders);

      //   // Iterate through table items and collect data
      //   aItems.forEach(function (oItem) {
      //     var oCells = oItem.getCells();
      //     var rowData = [];
      //     oCells.forEach(function (oCell) {
      //       rowData.push(oCell.getText());
      //     });
      //     aData.push(rowData);
      //   });

      //   // Prepare Excel workbook
      //   var oSheet = XLSX.utils.aoa_to_sheet(aData);
      //   var oWorkbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(oWorkbook, oSheet, "ProductsTable");

      //   // Generate and download the Excel file
      //   XLSX.writeFile(oWorkbook, "ProductsTable.xlsx");
      // },


      onPressPrintModelTable: function () {
        var aCols, oBinding, oSettings, oSheet, oTable;

        oTable = this.byId('ProductsTable');
        oBinding = oTable.getBinding('items');
        aCols = this.createColumnConfig();

        oSettings = {
          workbook: { columns: aCols },
          dataSource: oBinding,
          fileName: 'Models data.xlsx'
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build()
          .then(function () {
            MessageToast.show('Spreadsheet export has finished');
          })
          .finally(function () {
            oSheet.destroy();
          });
      },


      createColumnConfig: function () {
        return [
          { label: 'Model', property: 'model', type: EdmType.String },
          { label: 'Description', property: 'description', type: EdmType.String },
          { label: 'Model Category', property: 'mCategory', type: EdmType.String, scale: 0 },
          { label: 'Quantity', property: 'quantity', type: EdmType.String },
          { label: 'Length', property: 'length', type: EdmType.String },
          { label: 'Width', property: 'width', type: EdmType.String },
          { label: 'Height', property: 'height', type: EdmType.String },
          { label: 'UOM', property: 'uom', type: EdmType.String },
          { label: 'Volume(m³)', property: 'volume', type: EdmType.String },
          { label: 'Net Weight', property: 'netWeight', type: EdmType.String },
          { label: 'Gross Weight', property: 'grossWeight', type: EdmType.String },
          { label: 'UOM', property: 'wuom', type: EdmType.String },
          { label: 'Stack', property: 'stack', type: EdmType.String },
        ];
      },


      //print in add Equipment 
      onPressDownloadContainerTable: function () {

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
        var oSelectedItem = this.byId("idContainerTypeTable").getSelectedItems();

        if (oSelectedItem.length > 0) {

          return MessageBox.error("Please unselect selected Items");

        }
        if (!this.oCreateContainerDialog) {
          this.oCreateContainerDialog = await this.loadFragment("CreateContainer");
        }
        this.oCreateContainerDialog.open();
        this.getView().getModel("CombinedModel").setProperty("/Vehicle", {});
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
        this.getView().getModel("CombinedModel").setProperty("/Product", {});

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
        this.getView().getModel("CombinedModel").setProperty("/Vehicle", {})
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

      /**************************   Creating New Product(Working Fine)  ***************************************************/
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
        let raisedErrors = [];
        // // Validation
        // const validationErrors = [];
        // const validateField = (fieldId, value, regex, errorMessage) => {
        //   const oField = oView.byId(fieldId);
        //   if (!value || (regex && !regex.test(value))) {
        //     oField.setValueState("Error");
        //     oField.setValueStateText(errorMessage);
        //     validationErrors.push(errorMessage);
        //   } else {
        //     oField.setValueState("None");
        //   }
        // };

        const aUserInputs = [
          // { Id: "idDesvbncriptionInput_InitialView", value: oPayload.EAN, regex: null, message: "Please enter EAN" },
          { Id: "idDescriptionInput_InitialView", value: oPayload.model, regex: null, message: "Enter SAP product number" },
          { Id: "idInstanceNumberInput_InitialView", value: oPayload.length, regex: /^\d+(\.\d+)?$/, message: "Length should be numeric" },
          { Id: "idClientInput_InitialView", value: oPayload.width, regex: /^\d+(\.\d+)?$/, message: "Width should be numeric" },
          { Id: "idApplicationServerInput_InitialView", value: oPayload.height, regex: /^\d+(\.\d+)?$/, message: "Height should be numeric" },
          { Id: "idSystemIdInput_InitialView", value: oPayload.mCategory, regex: null, message: "Enter category" },
          { Id: "idInputDes_InitialView", value: oPayload.description, regex: null, message: "Enter description" },
          { Id: "idWeightinput_InitialView", value: oPayload.netWeight, regex: /^\d+(\.\d+)?$/, message: "Net Weight should be numeric" },
          { Id: "idGWeightinput_InitialView", value: oPayload.grossWeight, regex: /^\d+(\.\d+)?$/, message: "Gross Weight should be numeric" },
          { Id: "idApplicationServerInput_MainPage", value: oPayload.quantity, regex: /^\d+$/, message: "Quantity should be numeric" },
          { Id: "idStackInput_MainPage", value: oPayload.stack, regex: /^\d+$/, message: "Stack should be numeric" }

          // { Id: "idWeightinput_InitialView", value: oPayload.netWeight, regex: /^\d+(\.\d+)?$/, message: "Net Weight should be numeric" },
          // { Id: "idGWeightinput_InitialView", value: oPayload.grossWeight, regex: /^\d+(\.\d+)?$/, message: "Gross Weight should be numeric" },
          // { Id: "idApplicationServerInput_MainPage", value: oPayload.quantity, regex: /^\d+$/, message: "Quantity should be numeric" },
          // { Id: "idStackinput_InitialView", value: oPayload.stack, regex: /^\d+$/, message: "Stack should be numeric" }
        ]

        aUserInputs.forEach(async input => {
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
        oPayload.wuom = oSelectedItem1;
        var oVolume;
        oPayload.color = randomHexColor
        if (oPayload.uom === 'CM') {
          // If UOM is in centimeters, convert to meters before calculating
          oVolume = (oPayload.length / 100) * (oPayload.width / 100) * (oPayload.height / 100);
          oPayload.volume = String(oVolume.toFixed(7)); // Volume in cubic meters with 7 decimal places
        }
        else if (oPayload.uom === 'mm') {
          oVolume = (oPayload.length / 1000) * (oPayload.width / 1000) * (oPayload.height / 1000);
          oPayload.volume = String(oVolume.toFixed(7)); // Volume in cubic meters with 7 decimal places
        }
        else {
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

      //****************************Deleting single or Multiple Models at a time  **************************/

      // onModelDelete: async function () {
      //   const oTable = this.byId("ProductsTable"),
      //     aSelectedItems = oTable.getSelectedItems(),
      //     oModel = this.getView().getModel("ModelV2");
      //   if (aSelectedItems.length === 0) {
      //     MessageBox.information("Please select at least one product to delete.");
      //     return;
      //   }
      //   if (aSelectedItems.length > 1) {
      //     MessageBox.information("Please select single Model to delete.");
      //     return;
      //   }
      //   try {
      //     await Promise.all(aSelectedItems.map(async (oItem) => {
      //       const oPath = oItem.getBindingContext().getPath();
      //       await this.deleteData(oModel, oPath);
      //     }));
      //     this.getView().byId("ProductsTable").getBinding("items").refresh();
      //     MessageToast.show('Successfully Deleted')
      //   } catch (error) {
      //     MessageToast.show('Error Occurs');
      //   }
      // },

      onModelDelete: async function () {
        const oTable = this.byId("ProductsTable"),
          aSelectedItems = oTable.getSelectedItems(),
          oModel = this.getView().getModel("ModelV2");
        if (aSelectedItems.length === 0) {
          MessageBox.information("Please select at least one product to delete.");
          return;
        }
        if (aSelectedItems.length > 1) {
          MessageBox.information("Please select single Model to delete.");
          return;
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

      //****************************Deleting single or Multiple Models at a time with table auto count logic **************************/
      //   onModelDelete: async function () {
      //     const oTable = this.byId("ProductsTable"),
      //         aSelectedItems = oTable.getSelectedItems(),
      //         oModel = this.getView().getModel("ModelV2");

      //     // Check if no item is selected
      //     if (aSelectedItems.length === 0) {
      //         MessageBox.information("Please select at least one product to delete.");
      //         return;
      //     }

      //     // Check if more than one item is selected
      //     if (aSelectedItems.length > 1) {
      //         MessageBox.information("Please select a single model to delete.");
      //         return;
      //     }

      //     try {
      //         // If only one item is selected, proceed with the delete operation
      //         const oPath = aSelectedItems[0].getBindingContext().getPath();

      //         // Perform the delete operation
      //         await this.deleteData(oModel, oPath);

      //         // Refresh the table after deletion
      //         this.getView().byId("ProductsTable").getBinding("items").refresh();

      //         // Fetch updated count and refresh the title
      //         const oDataModel = this.getView().getModel("ModelV2"); // Assuming ModelV2 is the main model
      //         const oTitle = this.byId("Titlesd1455896_AHUOBQ");
      //         const sPath = "/Materials/$count";  // Path to fetch the count

      //         // Fetch the updated count
      //         oDataModel.read(sPath, {
      //             success: (oData) => {
      //                 const updatedCount = oData;  // The updated count value
      //                 oTitle.setText(`Models Table: (${updatedCount})`);
      //             },
      //             error: (oError) => {
      //                 MessageToast.show("Error while fetching count.");
      //             }
      //         });

      //         // Show success message
      //         MessageToast.show('Successfully Deleted');
      //         this.getView().byId("ProductsTable").getBinding("items").refresh();
      //     } catch (error) {
      //         // Show error message in case of failure
      //         MessageToast.show('Error Occurred');
      //     }
      // },

      // // Function to delete data (for example, OData remove)
      // async deleteData(oModel, oPath) {
      //     try {
      //         // Perform OData removal (adjust as necessary for your service)
      //         await oModel.remove(oPath);  // Assuming you're using OData remove operation
      //         return true;  // Successful deletion
      //     } catch (error) {
      //         console.error("Deletion failed:", error);
      //         return false;  // Failed deletion
      //     }
      // },



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

      /** Creating New Containers */
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
        oPayload.truckType = `${oPayload.truckType}FT`
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        var oSelectedItem = this.byId("idContainerTypeUOM").getSelectedItem();
        if (!oSelectedItem.getKey()) {
          return MessageBox.warning("Please Select UOM!!");
        }
        oPayload.uom = oSelectedItem ? oSelectedItem.getKey() : "";
        try {
          await this.createData(oModel, oPayload, oPath);
          this.getView().getModel("CombinedModel").setProperty("/Vehicle", {}),
            this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInCreateVehicleDialog();
          this.byId("idContainerTypeUOM").setSelectedKey("");
          MessageToast.show("Successfully Created!");
        } catch (error) {
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
        var oSelectedItem = this.byId("idContainerTypeTable").getSelectedItems();
        if (oSelectedItem.length <= 0) {
          MessageBox.information("Please select at least one Row for edit!");
          return;
        }
        if (oSelectedItem.length > 1) {
          MessageBox.information("Please select only  one Row for edit!");
          return;
        }
        const oData = oSelectedItem[0].getBindingContext().getObject();
        await this.onPressEditInAddEquipmentTable();
        this.getView().getModel("CombinedModel").setProperty("/Vehicle", oData);
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
        const otruckType = oPayload.truckType;
        const oModel = this.getView().getModel("ModelV2");
        const oPath = `/TruckTypes(truckType='${otruckType}')`;
        try {
          await this.updateData(oModel, oPayload, oPath);
          this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInEditVehicleDialog();
          this.getView().getModel("ModelV2").setProperty("/Vehicle", {})
          MessageToast.show('Successfully Updated');
        } catch (error) {
          MessageToast.show('Error');
        } finally {
          this.byId("idContainerTypeTable").getBinding("items").refresh();
          this.onCancelInEditVehicleDialog();
          this.getView().getModel("ModelV2").setProperty("/Vehicle", {});
        }
      },

      /**Clearing Vehicle Editing Values */
      idTruckTypeTable: function () {
        this.getView().getModel("CombinedModel").setProperty("/Vehicle", {})
      },

      /**Editing Product Details for editable table */
      onRowSelectionForEditingRow: function (oEvent) {
        if (this.isEditingRowRecord) {
          var oTable = this.byId("ProductsTable");
          var oSelectedItem = oEvent.getParameter("listItem");
          oSelectedItem.setSelected(false); // Deselect the newly selected row
          sap.m.MessageToast.show("Please cancel the current editing before selecting another row.");
          return;
        }
        //sap.m.MessageToast.show("Row selected. Proceed with editing if required.");
      },
      onPressEditInProductsTable: function () {
        debugger
        var oTable = this.byId("ProductsTable");
        var aSelectedItem = oTable.getSelectedItems();
        if (aSelectedItem.length === 0) {
          sap.m.MessageToast.show("Please select atleast one row to edit.");
          return;
        }
        if (aSelectedItem.length > 1) {
          sap.m.MessageToast.show("Please select only one row to edit.");
          return;
        }
        this.isEditingRowRecord = true;

        // this.byId("idEditBtnIcon4_ProductsTable").setVisible(false);
        this.byId("idSaveBtnIcon4_ProductsTable").setVisible(true);
        this.byId("idCancelBtnIcon4_ProductsTable").setVisible(true);
        this.byId("idBtnProductDescription_AHUOBQ").setEnabled(false);
        this.byId("FileUploader").setEnabled(false);
        var oSelectedItem = aSelectedItem[0];
        var aCells = oSelectedItem.getCells();
        this.pastDescription = aCells[2].getItems()[0].getText(); // Adjust index as per your table structure
        //this.pastMCategory = aCells[3].getItems()[0].getText();
        this.pastQuantity = aCells[4].getItems()[0].getText();
        this.pastLength = aCells[5].getItems()[0].getText();
        this.pastWidth = aCells[6].getItems()[0].getText();
        this.pastHeight = aCells[7].getItems()[0].getText();
        this.pastUOM = aCells[8].getItems()[0].getText();
        this.pastNetWeight = aCells[10].getItems()[0].getText();
        this.pastGrossWeight = aCells[11].getItems()[0].getText();
        this.pastUOM1 = aCells[12].getItems()[0].getText();
        // Loop through selected items
        aSelectedItem.forEach(function (oItem) {
          var aCells = oItem.getCells();
          // Loop through the cells to find HBox elements
          aCells.forEach(function (oCell) {
            if (oCell.isA("sap.m.HBox")) {
              var aChildren = oCell.getItems();
              if (aChildren.length === 2) {
                aChildren[0].setVisible(false);
                aChildren[1].setVisible(true);
              }
            }
          });
        });
      },
      onPressSaveBtn_ProductsDetailsTable: async function () {
        debugger;
        var oTable = this.byId("ProductsTable");
        var aSelectedItem = oTable.getSelectedItems();

        var oSelectedItem = aSelectedItem[0];
        var aCells = oSelectedItem.getCells();

        // Get UOM and WUOM keys
        var oUOMComboBox = aCells[8].getItems()[1]; // UOM ComboBox
        var sUOMSelectedKey = oUOMComboBox.getSelectedKey();

        var oWUOMComboBox = aCells[12].getItems()[1]; // WUOM ComboBox
        var sWUOMSelectedKey = oWUOMComboBox.getSelectedKey();

        // Remove UOM/WUOM suffix from inputs
        var getTrimmedValue = (value) => {
          var match = value.match(/^\d+(\.\d+)?/); // Matches only the numeric part at the start of the string
          return match ? parseFloat(match[0]) : 0; // Return numeric value as a number, or 0 if no match
        };
        // Validate numbers only
        var testNumericValue = (value) => /^\d+(\.\d+)?$/.test(value); // Float or Integer validation
        var testIntegerValue = (value) => /^\d+$/.test(value);

        var description = aCells[2].getItems()[1].getValue().trim();
        var quantity = aCells[4].getItems()[1].getValue().trim();
        var lengthValue = getTrimmedValue(aCells[5].getItems()[1].getValue());
        var widthValue = getTrimmedValue(aCells[6].getItems()[1].getValue());
        var heightValue = getTrimmedValue(aCells[7].getItems()[1].getValue());
        var netWeightValue = getTrimmedValue(aCells[10].getItems()[1].getValue());
        var grossWeightValue = getTrimmedValue(aCells[11].getItems()[1].getValue());

        // Validation checks
        if (description.length < 4) {
          sap.m.MessageToast.show("Description must have at least 4 characters.");
          return;
        }
        if (!testIntegerValue(quantity) || isNaN(quantity)) {
          sap.m.MessageToast.show("Please enter a valid numeric quantity.");
          return;
        }
        if (!testNumericValue(lengthValue) || !testNumericValue(widthValue) || !testNumericValue(heightValue)) {
          sap.m.MessageToast.show("Please provide numeric values only(Length, Width, Height).");
          return;
        }
        if (!testIntegerValue(netWeightValue) || !testIntegerValue(grossWeightValue)) {
          sap.m.MessageToast.show("Please provide numeric values for weights (Net Weight, Gross Weight).");
          return;
        }
        if (!sUOMSelectedKey) {
          sap.m.MessageToast.show("Please select a Unit of Measurement (UOM).");
          return;
        }
        if (!sWUOMSelectedKey) {
          sap.m.MessageToast.show("Please select a Weight Unit of Measurement (WUOM).");
          return;
        }

        // Construct the payload
        var oPayload = {
          description: description,
          quantity: quantity,
          length: lengthValue.toString(),
          width: widthValue.toString(),
          height: heightValue.toString(),
          uom: sUOMSelectedKey,
          netWeight: netWeightValue.toString(),
          grossWeight: grossWeightValue.toString(),
          wuom: sWUOMSelectedKey,
        };

        // Calculate volume based on UOM
        if (sUOMSelectedKey === "CM") {
          oPayload.volume = ((lengthValue / 100) * (widthValue / 100) * (heightValue / 100)).toFixed(7).toString();
        } else if (sUOMSelectedKey === "mm") {
          oPayload.volume = ((lengthValue / 1000) * (widthValue / 1000) * (heightValue / 1000)).toFixed(7).toString();
        } else {
          oPayload.volume = (lengthValue * widthValue * heightValue).toFixed(7).toString();
        }

        var oModel = this.getView().getModel("ModelV2");
        var oPath = oSelectedItem.getBindingContext().getPath();

        // Save the payload using an OData update
        try {
          await this.updateData(oModel, oPayload, oPath);
          this.byId("ProductsTable").getBinding("items").refresh();
          sap.m.MessageToast.show("Product details updated successfully.");
        } catch (error) {
          console.error("Error saving changes:", error);
          sap.m.MessageToast.show("Failed to save changes.");
        }

        // Reset visibility
        // this.byId("idEditBtnIcon4_ProductsTable").setVisible(true);
        this.byId("idSaveBtnIcon4_ProductsTable").setVisible(false);
        this.byId("idCancelBtnIcon4_ProductsTable").setVisible(false);

        // Toggle cells back to view mode
        aCells.forEach(function (oCell) {
          if (oCell.isA("sap.m.HBox")) {
            var aChildren = oCell.getItems();
            if (aChildren.length === 2) {
              aChildren[0].setVisible(true); // Show text
              aChildren[1].setVisible(false); // Hide input
            }
          }
        });
      },

      //       /**Clear Product Editing Dialog */
      //       onClearEditProdDialog: function () {
      //         this.getView().getModel("CombinedModel").setProperty("/Product", {});

      onPressCancelBtnEdit_ProductsDetailsTable: function () {
        debugger;
        var oTable = this.byId("ProductsTable");
        var aSelectedItem = oTable.getSelectedItems();
        var oSelectedItem = aSelectedItem[0];
        var aCells = oSelectedItem.getCells();
        // Restore past values to the corresponding cells
        aCells[2].getItems()[0].setText(this.pastDescription);
        //aCells[3].getItems()[0].setText(this.pastMCategory);
        aCells[4].getItems()[0].setText(this.pastQuantity);
        aCells[5].getItems()[0].setText(this.pastLength);
        aCells[6].getItems()[0].setText(this.pastWidth);
        aCells[7].getItems()[0].setText(this.pastHeight);
        aCells[8].getItems()[0].setText(this.pastUOM);
        aCells[10].getItems()[0].setText(this.pastNetWeight);
        aCells[11].getItems()[0].setText(this.pastGrossWeight);
        aCells[12].getItems()[0].setText(this.pastUOM1);
        // Toggle visibility back to original state
        aCells.forEach(function (oCell) {
          if (oCell.isA("sap.m.HBox")) {
            var aChildren = oCell.getItems();
            if (aChildren.length === 2) {
              aChildren[0].setVisible(true);  // Show text
              aChildren[1].setVisible(false); // Hide input
            }
          }
        });
        this.isEditingRowRecord = false;
        this.byId("ProductsTable").getBinding("items").refresh();
        // Toggle button visibility
        // this.byId("idEditBtnIcon4_ProductsTable").setVisible(true);
        this.byId("idSaveBtnIcon4_ProductsTable").setVisible(false);
        this.byId("idCancelBtnIcon4_ProductsTable").setVisible(false);
        this.byId("idBtnProductDescription_AHUOBQ").setEnabled(true);
        this.byId("FileUploader").setEnabled(true);
        sap.m.MessageToast.show("Canceled editing of a record!");
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
        const oFilter = new Filter("model", FilterOperator.EQ, oProduct);
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
      // onLiveModelSearch: function (oEvent) {
      //   let aFilter = [];
      //   let sQuery = oEvent.getParameter("newValue");
      //   sQuery = sQuery.replace(/\s+/g, '');
      //   sQuery = sQuery.toUpperCase();
      //   if (sQuery && sQuery.length > 1) {
      //     // aFilter.push(new Filter("model", FilterOperator.EQ, sQuery));
      //     aFilter.push(new Filter("mCategory", FilterOperator.EQ, sQuery));
      //   }
      //   var oTable = this.byId("ProductsTable");
      //   var oBinding = oTable.getBinding("items");
      //   oBinding.filter(aFilter);
      // },
      onLiveModelSearch: function (oEvent) {
        let aFilter = [];
        let sQuery = oEvent.getParameter("newValue");

        // Remove extra spaces and convert the query to uppercase
        sQuery = sQuery.replace(/\s+/g, '').toUpperCase();

        // Only apply filters if the query has at least one character
        if (sQuery && sQuery.length > 0) {
          // Filter for 'model' field
          aFilter.push(new Filter("model", FilterOperator.Contains, sQuery));

          // // Filter for 'mCategory' field
          // aFilter.push(new Filter("mCategory", FilterOperator.Contains, sQuery));

          // // Filter for 'description' field
          aFilter.push(new Filter("description", FilterOperator.Contains, sQuery));
        }

        // Get the table and its binding
        var oTable = this.byId("ProductsTable");
        var oBinding = oTable.getBinding("items");

        // Apply the filters to the table binding
        oBinding.filter(aFilter, "Application");
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
              model: String(product['SAP Productno']), // Ensure it's a string
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
      checkProductExists: function (model) {
        if (!this.existingProducts || !Array.isArray(this.existingProducts)) {
          console.error("existingProducts is not initialized or not an array.");
          return false; // If not initialized, assume it doesn't exist.
        }
        return this.existingProducts.some(product => product.model === model);
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
        const sFilter = new Filter("model", FilterOperator.EQ, oMat);
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
        this.renderer.setSize(700, 540); // Increase canvas size
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





      //       _createProducts: function (selectedProducts, containerHeight, containerLength, containerWidth) {
      //         let currentX = -containerLength / 2;
      //         let currentZ = -containerWidth / 2;
      //         let currentY = 0;

      //         const positionMap = []; // Keeps track of occupied positions
      //         const chartData = [];

      //         let maxHeight = 0; // Max height for the current level (Y-axis tracking)
      //         let maxWidth = 0;  // Max width for the current row (Z-axis tracking)

      //         let totalQuantity = 0;
      //         let totalVolume = 0;
      //         let totalWeight = 0;

      //         const containerMaxVolume = containerHeight * containerLength * containerWidth;

      // //         const containerMaxWeight = 1000; // Example max weight in kg

      // //         selectedProducts.forEach(product => {
      // //           const SelectedQuantity = parseInt(product.SelectedQuantity);
      // //           const productLength = Math.max(parseFloat(product.Productno.length), 0.01);
      // //           const productHeight = Math.max(parseFloat(product.Productno.height), 0.01);
      // //           const productWidth = Math.max(parseFloat(product.Productno.width), 0.01);
      // //           const productColor = product.Productno.color;
      // //           const productWeight = parseFloat(product.Productno.weight);
      // //           const productName = product.Productno.description;

      // //           let totalChartVolume = 0;
      // //           let totalChartWeight = 0;

      // //           for (let i = 0; i < SelectedQuantity; i++) {
      // //             let isOverlap = true;

      // //             while (isOverlap) {
      // //               // Reset positions when bounds are reached
      // //               if (currentX + productLength > containerLength / 2) {
      // //                 currentX = -containerLength / 2;
      // //                 currentZ += productWidth;

      // //                 if (currentZ + productWidth > containerWidth / 2) {
      // //                   currentZ = -containerWidth / 2;
      // //                   currentY += productHeight;

      //         const containerMaxWeight = 1000; // Example container max weight (kg)

      //         selectedProducts.forEach(product => {
      //             const SelectedQuantity = parseInt(product.SelectedQuantity);
      //             const productLength = Math.max(parseFloat(product.Productno.length), 0.01);
      //             const productHeight = Math.max(parseFloat(product.Productno.height), 0.01);
      //             const productWidth = Math.max(parseFloat(product.Productno.width), 0.01);
      //             const productColor = product.Productno.color;
      //             const productWeight = parseFloat(product.Productno.weight);
      //             const productName = product.Productno.description;

      //             let totalChartVolume = 0;
      //             let totalChartWeight = 0;

      //             for (let i = 0; i < SelectedQuantity; i++) {
      //                 let isPlaced = false;

      //                 while (!isPlaced) {
      //                     console.log(`Attempting to place product: "${productName}" (Qty: ${SelectedQuantity}) at X: ${currentX}, Y: ${currentY}, Z: ${currentZ}`);

      //                     // Check if product fits within the container along the X axis (length)
      //                     if (currentX + productLength > containerLength / 2) {
      //                         currentX = -containerLength / 2;
      //                         currentZ += maxWidth; // Move to the next row (Z axis)
      //                         console.log(`  X overflow detected, shifting to next row. New X: ${currentX}, Z: ${currentZ}`);

      //                         maxWidth = 0; // Reset maxWidth for new row

      //                         // Check if product fits within the container along the Z axis (width)
      //                         if (currentZ + productWidth > containerWidth / 2) {
      //                             currentZ = -containerWidth / 2;
      //                             currentY += maxHeight; // Move to the next height level (Y axis)
      //                             console.log(`  Z overflow detected, shifting to next level. New Y: ${currentY}, Z: ${currentZ}`);

      //                             maxHeight = 0; // Reset maxHeight for new level

      //                             // Check if product fits within the height
      //                             if (currentY + productHeight > containerHeight) {
      //                                 console.log(`  Product "${productName}" cannot fit in the container.`);
      //                                 alert(`Product "${productName}" cannot fit in the container and will not be placed.`);
      //                                 return; // Skip product if it cannot fit
      //                             }
      //                         }
      //                     }

      //                     // Check for overlap with previously placed products
      //                     const isOverlap = positionMap.some(position => (
      //                         currentX < position.xEnd &&
      //                         (currentX + productLength) > position.xStart &&
      //                         currentZ < position.zEnd &&
      //                         (currentZ + productWidth) > position.zStart &&
      //                         currentY < position.yTop
      //                     ));

      //                     // If there's overlap, move currentX to the next available space in X direction
      //                     if (isOverlap) {
      //                         currentX += productLength;
      //                         console.log(`  Overlap detected, moving X to: ${currentX}`);
      //                     } else {
      //                         isPlaced = true; // Place product if there's no overlap
      //                         console.log(`  Product placed at X: ${currentX}, Y: ${currentY}, Z: ${currentZ}`);
      //                     }
      //                 }

      //                 if (isPlaced) {
      //                     // Create the product's 3D representation
      //                     const productGeometry = new THREE.BoxGeometry(productLength, productHeight, productWidth);
      //                     const productMaterial = new THREE.MeshStandardMaterial({
      //                         color: new THREE.Color(productColor),
      //                         metalness: 0.5,
      //                         roughness: 0.5
      //                     });

      //                     const productMesh = new THREE.Mesh(productGeometry, productMaterial);
      //                     productMesh.position.set(
      //                         currentX + productLength / 2,
      //                         currentY + productHeight / 2,
      //                         currentZ + productWidth / 2
      //                     );
      //                     this.scene.add(productMesh);

      //                     // Add wireframe for visualization
      //                     const edgesGeometry = new THREE.EdgesGeometry(productGeometry);
      //                     const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      //                     const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      //                     edges.position.copy(productMesh.position);
      //                     this.scene.add(edges);

      //                     // Update the occupied positions in the positionMap
      //                     positionMap.push({
      //                         xStart: currentX,
      //                         xEnd: currentX + productLength,
      //                         zStart: currentZ,
      //                         zEnd: currentZ + productWidth,
      //                         yTop: currentY + productHeight
      //                     });

      //                     // Update maximum height and width for the row/level
      //                     maxHeight = Math.max(maxHeight, productHeight);
      //                     maxWidth = Math.max(maxWidth, productWidth);

      //                     // Update totals
      //                     totalQuantity++;
      //                     const productVolume = productLength * productHeight * productWidth;
      //                     totalVolume += productVolume;
      //                     totalWeight += productWeight;
      //                     totalChartVolume += productVolume;
      //                     totalChartWeight += productWeight;

      //                     // Move to the next available position in the X axis for the next product
      //                     currentX += productLength;
      //                     console.log(`  Moving to next X position: ${currentX}`);

      //                 }
      //               }

      //               // Check for overlaps
      //               isOverlap = positionMap.some(position => (
      //                 currentX < position.xEnd && (currentX + productLength) > position.xStart &&
      //                 currentZ < position.zEnd && (currentZ + productWidth) > position.zStart &&
      //                 currentY < position.yTop
      //               ));

      //               if (isOverlap) {
      //                 currentX += productLength; // Adjust position to avoid overlap
      //               }
      //             }

      // //             if (!isOverlap) {
      // //               // Create 3D product representation
      // //               const productGeometry = new THREE.BoxGeometry(productLength, productHeight, productWidth);
      // //               const productMaterial = new THREE.MeshStandardMaterial({
      // //                 color: new THREE.Color(productColor),
      // //                 metalness: 0.5,
      // //                 roughness: 0.5
      // //               });

      // //               const productMesh = new THREE.Mesh(productGeometry, productMaterial);
      // //               productMesh.position.set(
      // //                 currentX + productLength / 2,
      // //                 currentY + productHeight / 2,
      // //                 currentZ + productWidth / 2
      // //               );
      // //               this.scene.add(productMesh);

      // //               // Add wireframe for visualization
      // //               const edgesGeometry = new THREE.EdgesGeometry(productGeometry);
      // //               const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      // //               const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      // //               edges.position.copy(productMesh.position);
      // //               this.scene.add(edges);

      // //               // Update position map
      // //               positionMap.push({
      // //                 xStart: currentX,
      // //                 xEnd: currentX + productLength,
      // //                 zStart: currentZ,
      // //                 zEnd: currentZ + productWidth,
      // //                 yTop: currentY + productHeight
      // //               });

      // //               totalQuantity++;
      // //               const productVolume = productLength * productHeight * productWidth;
      // //               totalVolume += productVolume;
      // //               totalWeight += productWeight;
      // //               totalChartVolume += productVolume;
      // //               totalChartWeight += productWeight;

      // //               currentX += productLength; // Move to the next position
      // //             }
      // //           }

      // //           // Add product data to chart
      // //           chartData.push({
      // //             Name: productName,
      // //             Packages: SelectedQuantity,
      // //             Volume: totalChartVolume.toFixed(1),
      // //             Weight: totalChartWeight.toFixed(1),
      // //             Color: productColor
      // //           });
      // //         });

      // //         // Calculate remaining volume and weight
      // //         const remainingVolume = containerMaxVolume - totalVolume;
      // //         const remainingWeight = containerMaxWeight - totalWeight;

      // //         // Add empty space data to chart
      // //         chartData.push({
      // //           Name: "Empty",
      // //           Packages: 0,
      // //           Volume: remainingVolume.toFixed(1),
      // //           Weight: 0,
      // //           Color: "#cccccc" // Gray color for "Empty"
      // //         });

      // //         // Update view models with calculated data

      //             // Collect the product data for chart visualization
      //             if (totalChartVolume > 0) {
      //                 chartData.push({
      //                     Name: productName,
      //                     Packages: SelectedQuantity,
      //                     Volume: totalChartVolume.toFixed(1),
      //                     Weight: totalChartWeight.toFixed(1),
      //                     Color: productColor
      //                 });
      //             }
      //         });

      //         // Calculate remaining available volume and weight in the container
      //         const remainingVolume = containerMaxVolume - totalVolume;
      //         const remainingWeight = containerMaxWeight - totalWeight;

      //         // Add empty space (unused space) in the chart data
      //         chartData.push({
      //             Name: "Empty",
      //             Packages: 0,
      //             Volume: remainingVolume.toFixed(1),
      //             Weight: 0,
      //             Color: "#cccccc" // Gray color for empty space
      //         });

      //         // Update the view models with total values and chart data
      //         this.getView().getModel("ChartData").setProperty("/chartData", chartData);
      //         this.getView().getModel("Calculation").setProperty("/", {
      //           TotalQuantity: totalQuantity,
      //           TotalVolume: `${totalVolume.toFixed(1)} m³ (${((totalVolume / containerMaxVolume) * 100).toFixed(1)}% filled)`,
      //           TotalWeight: `${totalWeight.toFixed(1)} kg`,
      //           RemainingCapacity: `${remainingVolume.toFixed(1)} m³ (${((remainingVolume / containerMaxVolume) * 100).toFixed(1)}% empty)`
      //         });


      // //         // Update pie chart visualization
      // //         const oVizFrame = this.getView().byId("idPieChart");
      // //         oVizFrame.setVizProperties({
      // //           plotArea: {
      // //             colorPalette: chartData.map(item => item.Color), // Dynamically set colors
      // //             dataLabel: {
      // //               visible: true


      //         // Update pie chart visualization based on filled/empty spaces
      //         const oVizFrame = this.getView().byId("idPieChart");
      //         oVizFrame.setVizProperties({
      //             plotArea: {
      //                 colorPalette: chartData.map(item => item.Color), // Use dynamic colors
      //                 dataLabel: {
      //                     visible: true
      //                 }
      //             },
      //             title: {
      //                 text: "Cargo Volume Breakdown"

      //             }
      //           },
      //           title: {
      //             text: "Cargo Volume Breakdown"
      //           }
      //         });
      //       },
      _createProducts: function (selectedProducts, containerHeight, containerLength, containerWidth) {
        let currentX = -containerLength / 2;
        let currentZ = -containerWidth / 2;
        let currentY = 0;

        const positionMap = []; // Keeps track of occupied positions
        const chartData = [];

        let maxHeight = 0; // Max height for the current level (Y-axis tracking)
        let maxWidth = 0;  // Max width for the current row (Z-axis tracking)

        let totalQuantity = 0;
        let totalVolume = 0;
        let totalWeight = 0;

        const containerMaxVolume = containerHeight * containerLength * containerWidth;
        const containerMaxWeight = 1000; // Example container max weight (kg)

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
            let isPlaced = false;

            while (!isPlaced) {
              console.log(`Attempting to place product: "${productName}" (Qty: ${SelectedQuantity}) at X: ${currentX}, Y: ${currentY}, Z: ${currentZ}`);

              // Check if product fits within the container along the X axis (length)
              if (currentX + productLength > containerLength / 2) {
                currentX = -containerLength / 2;
                currentZ += maxWidth; // Move to the next row (Z axis)
                console.log(`  X overflow detected, shifting to next row. New X: ${currentX}, Z: ${currentZ}`);

                maxWidth = 0; // Reset maxWidth for new row

                // Check if product fits within the container along the Z axis (width)
                if (currentZ + productWidth > containerWidth / 2) {
                  currentZ = -containerWidth / 2;
                  currentY += maxHeight; // Move to the next height level (Y axis)
                  console.log(`  Z overflow detected, shifting to next level. New Y: ${currentY}, Z: ${currentZ}`);

                  maxHeight = 0; // Reset maxHeight for new level

                  // Check if product fits within the height
                  if (currentY + productHeight > containerHeight) {
                    console.log(`  Product "${productName}" cannot fit in the container.`);
                    alert(`Product "${productName}" cannot fit in the container and will not be placed.`);
                    return; // Skip product if it cannot fit
                  }
                }
              }

              // Check for overlap with previously placed products
              const isOverlap = positionMap.some(position => (
                currentX < position.xEnd &&
                (currentX + productLength) > position.xStart &&
                currentZ < position.zEnd &&
                (currentZ + productWidth) > position.zStart &&
                currentY < position.yTop
              ));

              // If there's overlap, move currentX to the next available space in X direction
              if (isOverlap) {
                currentX += productLength;
                console.log(`  Overlap detected, moving X to: ${currentX}`);
              } else {
                isPlaced = true; // Place product if there's no overlap
                console.log(`  Product placed at X: ${currentX}, Y: ${currentY}, Z: ${currentZ}`);
              }
            }

            if (isPlaced) {
              // Create the product's 3D representation
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

              // Update the occupied positions in the positionMap
              positionMap.push({
                xStart: currentX,
                xEnd: currentX + productLength,
                zStart: currentZ,
                zEnd: currentZ + productWidth,
                yTop: currentY + productHeight
              });

              // Update maximum height and width for the row/level
              maxHeight = Math.max(maxHeight, productHeight);
              maxWidth = Math.max(maxWidth, productWidth);

              // Update totals
              totalQuantity++;
              const productVolume = productLength * productHeight * productWidth;
              totalVolume += productVolume;
              totalWeight += productWeight;
              totalChartVolume += productVolume;
              totalChartWeight += productWeight;

              // Move to the next available position in the X axis for the next product
              currentX += productLength;
              console.log(`  Moving to next X position: ${currentX}`);
            }
          }

          // Collect the product data for chart visualization
          if (totalChartVolume > 0) {
            chartData.push({
              Name: productName,
              Packages: SelectedQuantity,
              Volume: totalChartVolume.toFixed(1),
              Weight: totalChartWeight.toFixed(1),
              Color: productColor
            });
          }
        });

        // Calculate remaining available volume and weight in the container
        const remainingVolume = containerMaxVolume - totalVolume;
        const remainingWeight = containerMaxWeight - totalWeight;

        // Add empty space (unused space) in the chart data
        chartData.push({
          Name: "Empty",
          Packages: 0,
          Volume: remainingVolume.toFixed(1),
          Weight: 0,
          Color: "#cccccc" // Gray color for empty space
        });

        // Update the view models with total values and chart data
        this.getView().getModel("ChartData").setProperty("/chartData", chartData);
        this.getView().getModel("Calculation").setProperty("/", {
          TotalQuantity: totalQuantity,
          TotalVolume: `${totalVolume.toFixed(1)} m³ (${((totalVolume / containerMaxVolume) * 100).toFixed(1)}% filled)`,
          TotalWeight: `${totalWeight.toFixed(1)} kg`,
          RemainingCapacity: `${remainingVolume.toFixed(1)} m³ (${((remainingVolume / containerMaxVolume) * 100).toFixed(1)}% empty)`
        });

        // Update pie chart visualization based on filled/empty spaces
        const oVizFrame = this.getView().byId("idPieChart");
        oVizFrame.setVizProperties({
          plotArea: {
            colorPalette: chartData.map(item => item.Color), // Use dynamic colors
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


      /****************************************************Download Simulation Logic**************************************************************************************************/

      onDownloadSimulation: function () {
        // Define the predefined views with zoomed-in camera positions
        const views = [
          { name: 'Front', position: new THREE.Vector3(0, 10, 20), lookAt: new THREE.Vector3(0, 0, 0) },
          { name: 'Back', position: new THREE.Vector3(0, 10, -20), lookAt: new THREE.Vector3(0, 0, 0) },
          { name: 'Top', position: new THREE.Vector3(0, 20, 0), lookAt: new THREE.Vector3(0, 0, 0) },
          { name: 'Bottom', position: new THREE.Vector3(0, -20, 0), lookAt: new THREE.Vector3(0, 0, 0) },
          { name: 'Left', position: new THREE.Vector3(-20, 10, 0), lookAt: new THREE.Vector3(0, 0, 0) },
          { name: 'Right', position: new THREE.Vector3(20, 10, 0), lookAt: new THREE.Vector3(0, 0, 0) }
        ];

        // Initialize a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Capture each view and add it to the PDF
        const images = [];

        views.forEach(view => {
          this._captureView(view.name, view.position, view.lookAt, (imageData) => {
            images.push({ name: view.name, data: imageData });

            // If all images are captured, create the PDF
            if (images.length === views.length) {
              // Add images to PDF with titles
              images.forEach((img, index) => {
                if (index > 0) {
                  pdf.addPage(); // Add a new page for each view
                }
                pdf.text(img.name, 10, 10); // Add the heading (view name)
                pdf.addImage(img.data, 'PNG', 10, 20, 180, 160); // Add the image to the PDF
              });

              // Save the PDF file
              pdf.save('simulation_views.pdf');
            }
          });
        });
      },

      _captureView: function (viewName, cameraPosition, cameraLookAt, callback) {
        // Move the camera to the desired position and look at the center of the scene
        this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.camera.lookAt(cameraLookAt);

        // Increase camera zoom (adjust FOV) for better product visibility
        this.camera.fov = 10; // You can adjust this value for more zoomed-in effect
        this.camera.updateProjectionMatrix();

        // Update the controls for smooth transition (if you're using orbit controls)
        this.controls.update();

        // Render the scene
        this.renderer.render(this.scene, this.camera);

        // Capture the current canvas content as a base64 image (higher resolution)
        const imageData = this.renderer.domElement.toDataURL('image/png');

        // Pass the captured image to the callback function
        callback(imageData);
      },


      onPressManuvalSimulate: function () {
        var oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("ManuvalSimulation");

      },

      //***********************************Container Batch Upload ***********************************/

      //******Close container upload fragment******/
      onCloseUploadExcel: function () {
        if (this.oFragment.isOpen()) {
          this.oFragment.close();
        }
      },

      //******Upload file into fragment******/
      onbatchUploadContainers: async function (e) {
        if (!this.oFragment) {
          this.oFragment = await this.loadFragment("ContainerXLData");
        }
        this.oFragment.open();
        await this._importData(e.getParameter("files") && e.getParameter("files")[0]);
      },

      // _importData: function (file) {
      //   var that = this;
      //   var excelData = {};
      //   if (file && window.FileReader) {
      //     var reader = new FileReader();
      //     reader.onload = function (e) {
      //       var data = new Uint8Array(e.target.result);
      //       var workbook = XLSX.read(data, {
      //         type: 'array'
      //       });
      //       workbook.SheetNames.forEach(function (sheetName) {
      //         // Here is your object for every sheet in workbook
      //         excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      //         // adding serial numbers
      //         excelData.forEach(function (item, index) {
      //           item.serialNumber = index + 1; // Serial number starts from 1
      //         });

      //       });

      //       // Setting the data to the local model
      //       that.ContainerModel.setData({
      //         items: excelData
      //       });
      //       that.ContainerModel.refresh(true);
      //     };
      //     reader.onerror = function (ex) {
      //       console.log(ex);
      //     };
      //     reader.readAsArrayBuffer(file);
      //   }
      // },
      // onContainerBatchSave: async function () {
      //   var that = this;
      //   var addContainerModel = this.getView().getModel("ContainerModel").getData();
      //   // var batchChanges = [];
      //   var oDataModel = this.getView().getModel("ModelV2");
      //   var batchGroupId = "batchCreateContainerGroup";

      //   const oView = this.getView();

      //   // test
      //   // excel Validations

      //   let raisedErrors = []
      //   addContainerModel.items.forEach(async (item, index) => {

      //     const aExcelInputs = [
      //       { value: item.truckType, regex: null, message: "Enter Container type" },
      //       { value: item.length, regex: null, message: "Enter Container Length" },
      //       { value: item.width, regex: null, message: "Enter Container Width" },
      //       { value: item.height, regex: null, message: "Enter ContainerHeight" },
      //       { value: item.uom, regex: null, message: "Enter Container UOM" },
      //       { value: item.volume, regex: null, message: "Enter Volume" },
      //       { value: item.tvuom, regex: null, message: "Enter Volume UOM" },
      //       { value: item.truckWeight, regex: null, message: "Enter Container Weight" },
      //       { value: item.capacity, regex: null, message: "Enter Container Capacity" },
      //       { value: item.tuom, regex: null, message: "Enter Container Capacity UOM" },

      //       { value: item.truckType, regex: /^\d{2}[A-Za-z]{2}$/, message: "The container format should be in the following format: 12FT." },
      //       { value: item.length, regex: /^\d+(\.\d+)?$/, message: "Length should be numeric" },
      //       { value: item.width, regex: /^\d+(\.\d+)?$/, message: "Width should be numeric" },
      //       { value: item.height, regex: /^\d+(\.\d+)?$/, message: "Height should be numeric" },
      //       { value: item.uom, regex: /^[A-Za-z]{1,2}$/, message: "UOM should be a string with a maximum length of 2 characters" },
      //       { value: item.volume, regex: /^\d+(\.\d+)?$/, message: "Volume should be numeric" },
      //       // { value: item.tvuom, regex: /^\d+(\.\d+)?$/, message: "Net Weight should be numeric" },
      //       { value: item.truckWeight, regex: /^\d+(\.\d+)?$/, message: "Container Weight should be numeric" },
      //       { value: item.capacity, regex: /^\d+(\.\d+)?$/, message: "Container Capacity should be numeric" },
      //       { value: item.tuom, regex: /^[A-Za-z]{1,2}$/, message: "UOM should be a string with a maximum length of 2 characters" },
      //     ]
      //     for (let input of aExcelInputs) {
      //       let aValidations = this.validateField(oView, null, input.value, input.regex, input.message)
      //       if (aValidations.length > 0) {
      //         raisedErrors.push({ index: index, errorMsg: aValidations[0] }) // pushning error into empty array
      //       }
      //     }
      //   })

      //   if (raisedErrors.length > 0) {
      //     for (let error of raisedErrors) {
      //       MessageBox.information(`Check record number ${error.index + 1} ${error.errorMsg}`) // showing error msg 
      //       return;
      //     }
      //   }
      //   // test
      //   try {
      //     addContainerModel.items.forEach(async (item, index) => {
      //       delete item.serialNumber

      //       item.truckType = String(item.truckType).trim();
      //       item.length = String(item.length).trim();
      //       item.width = String(item.width).trim();
      //       item.height = String(item.height).trim();

      //       // Create individual batch request 
      //       await oDataModel.create("/TruckTypes", item, {

      //         //         let aErrors = []


      //         //         addContainerModel.items.forEach((item, index) => {
      //         //           item.length = String(item.length).trim();
      //         //           item.width = String(item.width).trim();
      //         //           item.height = String(item.height).trim();
      //         //           item.weight = String(item.weight).trim();
      //         //           item.quantity = String(item.quantity).trim();
      //         //           item.volume = String(item.volume).trim();

      //         //           // Create individual batch request
      //         //           batchChanges.push(
      //         //             oDataModel.create("/Materials", item, {

      //         method: "POST",
      //         groupId: batchGroupId, // Specify the batch group ID here
      //         success: function (data, response) {
      //           if (addContainerModel.items.length === index + 1) {
      //             MessageBox.success("Materials created successfully");
      //             if (that.oFragment) {
      //               that.oFragment.close();
      //               that.byId("idContainerTypeTable").getBinding("items").refresh();
      //             }
      //           }
      //         },
      //         error: function (err) {
      //           // Handle error for individual item
      //           if (JSON.parse(err.responseText).error.message.value.toLowerCase() === "entity already exists") {
      //             MessageBox.error("You are trying to upload a material which is already exists");
      //           } else {
      //             MessageBox.error("Please check the uploaded file and upload correct data");
      //           }
      //           console.error("Error creating material:", err);
      //         }
      //       })
      //     });

      //     // Now send the batch request using batch group
      //     await oDataModel.submitChanges({
      //       batchGroupId: batchGroupId,
      //       success: function (oData, response) {
      //         // MessageBox.success("Materials batch created successfully");
      //         console.log("Batch request submitted", oData);
      //         // Perform any final operations if needed after all batch operations succeed
      //       },
      //       error: function (err) {
      //         MessageBox.success("Error creating material batch");
      //         console.error("Error in batch request:", err);
      //         // Handle any failure in the batch submission (e.g., server issues)
      //       }
      //     });
      //   } catch (error) {
      //     console.log(error);
      //     MessageToast.show("Facing technical issue")
      //   }
      // },

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
              excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
              
              // Adding serial numbers and converting numeric values to strings
              excelData.forEach(function (item, index) {
                item.serialNumber = index + 1; // Serial number starts from 1
                // Convert numeric values to strings
                item.volume = String(item.volume);
                item.truckWeight = String(item.truckWeight);
                item.capacity = String(item.capacity);
              });
            });
      
            // Setting the data to the local model
            that.ContainerModel.setData({
              items: excelData
            });
            that.ContainerModel.refresh(true);
          };
          reader.onerror = function (ex) {
            console.log(ex);
          };
          reader.readAsArrayBuffer(file);
        }
      },
      onContainerBatchSave: async function () {
        var that = this;
        var addContainerModel = this.getView().getModel("ContainerModel").getData();
        var oDataModel = this.getView().getModel("ModelV2");
        var batchGroupId = "batchCreateContainerGroup";
        const oView = this.getView();
      
        let raisedErrors = []
        addContainerModel.items.forEach(async (item, index) => {
          const aExcelInputs = [
            { value: item.truckType, regex: null, message: "Enter Container type" },
            { value: item.length, regex: null, message: "Enter Container Length" },
            { value: item.width, regex: null, message: "Enter Container Width" },
            { value: item.height, regex: null, message: "Enter Container Height" },
            { value: item.uom, regex: null, message: "Enter Container UOM" },
            { value: item.volume, regex: null, message: "Enter Volume" },
            { value: item.tvuom, regex: null, message: "Enter Volume UOM" },
            { value: item.truckWeight, regex: null, message: "Enter Container Weight" },
            { value: item.capacity, regex: null, message: "Enter Container Capacity" },
            { value: item.tuom, regex: null, message: "Enter Container Capacity UOM" },
            { value: item.truckType, regex: /^\d{2}[A-Za-z]{2}$/, message: "The container format should be in the following format: 12FT." },
            { value: item.length, regex: /^\d+(\.\d+)?$/, message: "Length should be numeric" },
            { value: item.width, regex: /^\d+(\.\d+)?$/, message: "Width should be numeric" },
            { value: item.height, regex: /^\d+(\.\d+)?$/, message: "Height should be numeric" },
            { value: item.uom, regex: /^[A-Za-z]{1,2}$/, message: "UOM should be a string with a maximum length of 2 characters" },
            { value: item.volume, regex: /^\d+(\.\d+)?$/, message: "Volume should be numeric" },
            { value: item.truckWeight, regex: /^\d+(\.\d+)?$/, message: "Container Weight should be numeric" },
            { value: item.capacity, regex: /^\d+(\.\d+)?$/, message: "Container Capacity should be numeric" },
            { value: item.tuom, regex: /^[A-Za-z]{1,2}$/, message: "UOM should be a string with a maximum length of 2 characters" },
          ];
      
          for (let input of aExcelInputs) {
            let aValidations = this.validateField(oView, null, input.value, input.regex, input.message)
            if (aValidations.length > 0) {
              raisedErrors.push({ index: index, errorMsg: aValidations[0] });
            }
          }
        });
      
        if (raisedErrors.length > 0) {
          for (let error of raisedErrors) {
            MessageBox.information(`Check record number ${error.index + 1} ${error.errorMsg}`);
            return;
          }
        }
      
        // Proceed with batch saving the data
        try {
          addContainerModel.items.forEach(async (item, index) => {
            // Ensure numeric fields are converted to strings
            item.truckType = String(item.truckType).trim();
            item.length = String(item.length).trim();
            item.width = String(item.width).trim();
            item.height = String(item.height).trim();
            item.volume = String(item.volume).trim();
            item.truckWeight = String(item.truckWeight).trim();
            item.capacity = String(item.capacity).trim();
            item.tuom = String(item.tuom).trim();
      
            // Create individual batch request 
            await oDataModel.create("/TruckTypes", item, {
              method: "POST",
              groupId: batchGroupId,
              success: function (data, response) {
                if (addContainerModel.items.length === index + 1) {
                  MessageBox.success("Materials created successfully");
                  if (that.oFragment) {
                    that.oFragment.close();
                    that.byId("idContainerTypeTable").getBinding("items").refresh();
                  }
                }
              },
              error: function (err) {
                // Handle error for individual item
                if (JSON.parse(err.responseText).error.message.value.toLowerCase() === "entity already exists") {
                  MessageBox.error("You are trying to upload a material which already exists");
                } else {
                  MessageBox.error("Please check the uploaded file and upload correct data");
                }
                console.error("Error creating material:", err);
              }
            });
          });
      
          // Now send the batch request using batch group
          await oDataModel.submitChanges({
            batchGroupId: batchGroupId,
            success: function (oData, response) {
              console.log("Batch request submitted", oData);
            },
            error: function (err) {
              MessageBox.success("Error creating material batch");
              console.error("Error in batch request:", err);
            }
          });
        } catch (error) {
          console.log(error);
          MessageToast.show("Facing technical issue");
        }
      }
      
      
    });
  });