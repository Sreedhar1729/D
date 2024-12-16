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
  function (Controller, Fragment, Filter, FilterOperator, IconTabBar, IconTabFilter, JSONModel, MessageToast, ODataModel, MessageBox, UIComponent, GenericTile, TileContent, ImageContent,Tex,library,TypeString,ColumnListItem,Label,SearchField,Token, UIColumn, MColumn ) {
    "use strict";

    return Controller.extend("com.app.artihcus.controller.MainPage", {
      onInit: function () {
       this.oObject={
        "14FT":"https://www.searates.com/design/images/apps/load-calculator/20st.svg",
        "14FTF":"https://www.searates.com/design/images/apps/load-calculator/20ref.svg",
        "17FT":"https://www.searates.com/design/images/apps/load-calculator/40st.svg",
        "17FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
        "22FT":"https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
        "22FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
        "32FT":"https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
        "32FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg"
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
        const oJsonModel = new JSONModel({
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
          EANUPC: "",
          weight: "",
        })
        this.getView().setModel(oJsonModel, "ProductModel");

        /**Constructing JSON Model and set the model to the view*/
        const oJsonModelVeh = new JSONModel({
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
          freezed: "",
        });
        this.getView().setModel(oJsonModelVeh, "VehModel");

      
        
      
      },
      _createGenericTile: async function () {
        
        console.log("Called")
        // Get the container where the tile will be placed
        var oTileContainer = this.byId("idVBoxInSelectVehicleType");
        //getting model
        var that=this;
        const oModel = this.getOwnerComponent().getModel("ModelV2"),
          oPath = "/TruckTypes";
          var oObject={
            "14FT":"https://www.searates.com/design/images/apps/load-calculator/20st.svg",
            "14FTF":"https://www.searates.com/design/images/apps/load-calculator/20ref.svg",
            "17FT":"https://www.searates.com/design/images/apps/load-calculator/40st.svg",
            "17FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
            "22FT":"https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
            "22FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg",
            "32FT":"https://www.searates.com/design/images/apps/load-calculator/40hq.svg",
            "32FTF":"https://www.searates.com/design/images/apps/load-calculator/40ref.svg"
           }
        try {
          const oSuccessData = await this.readData(oModel, oPath, [])
          oSuccessData.results.forEach(
            function(item){
              if(item.freezed){
                var oId=item.truckType+"_f"
                var oImage=oObject[`${item.truckType}F`]
              }
              else{
                var oId=item.truckType
                var oImage=oObject[`${item.truckType}`]
              }
              var oGenericTile = new GenericTile({
                id:`id_generictile_${oId}`,
                class: "sapUiLargeMarginTop sapUiTinyMarginEnd tileLayout",
                header: `${item.truckType}`,   // The tile's header
                width: "150px",    // The tile's width
                
                press: that.onPressGenericTilePress.bind(that)  // Event handler for press
              });
      
              // Create the TileContent control
              var oTileContent = new TileContent({
                id: `id_idTileContent_${oId}`
              });
      
              // Create the ImageContent inside the TileContent
              var oImageContent = new ImageContent({
                id: `id_idImageContentN_${oId}` ,
                src:`${oImage}`
              });
      
              // Add the ImageContent to the TileContent
              oTileContent.setContent(oImageContent);
      
              // Add the TileContent to the GenericTile
              oGenericTile.addTileContent(oTileContent);
      
              // Now, add the GenericTile to the container
              oTileContainer.addItem(oGenericTile);
              oTileContainer.addItem(new Text({ text: "",width:"10Px" })); 
            }
          )
         
        } catch (error) {
          console.log(error)
          MessageToast.show(error)
        }

        // Create the GenericTile control dynamically
       
      },

      onAddPress:function(){
        var oTable = this.byId("idTableAddProduct");
        var that=this;
        // Get the selected items (rows) from the table
        var aSelectedItems = oTable.getSelectedItems();
        var oModel=this.getOwnerComponent().getModel("ModelV2")
        // Check if there are selected items
        if (aSelectedItems.length > 0) {
            var selectedData = [];

            // Loop through the selected rows and collect data
            aSelectedItems.forEach(function (oItem) {
                var oBindingContext = oItem.getBindingContext();
                var oData = oBindingContext.getObject();  // Get the data object of the row

                // Get the Input control for Picking Quantity
                var oInput = oItem.getCells()[3]; // Assuming the Input control is the 4th cell (index 3)

                // Get the value entered in the Input field
                var sPickingQty = oInput.getValue();

                // Add the relevant data along with the entered Picking Quantity
                var dummy={
                  Productno_sapProductno: oData.sapProductno,
                  SelectedQuantity:sPickingQty
                };
                selectedData.push({
                    product: oData.sapProductno,
                    description: oData.description,
                    actualQuantity: oData.quantity, // Replace with the correct field name from the data
                    pickingQuantity: sPickingQty
                });
                try{
                  
                  var oProductExistStatus =  that.productExists(oModel, dummy.Productno_sapProductno)
                  if(oProductExistStatus){
                    console.log("exixts")
                    oModel.update("/SelectedProduct('" + dummy.Productno_sapProductno + "')", dummy, {
                      success: function () {
                        
                      }.bind(this),
                      error: function (oError) {
                          sap.m.MessageBox.error("Failed " + oError.message);
                      }.bind(this)
                  });
                    return
                  }
                  that.createData(oModel,dummy,"/SelectedProduct")
                  
                }
                catch(error){
                  console.log(error)
                  MessageToast.show(error)
                }
                
            });

            // Do something with the selected data, e.g., display it
            MessageToast.show("Selected Products: " + JSON.stringify(selectedData));
            this.oValueDialog.close();

        } else {
            MessageToast.show("No rows selected.");
        }
    
      },

    
      onPressGenericTilePress: function () {
     
        var oWizard = this.byId("idWizardIn_simulate");
        var oCurrentStep = oWizard.getCurrentStep();

        oWizard.nextStep();

      },

      onCancelPress_valueHelp:function(){
        this.oValueDialog.close();
      },
      productExists: async function (oModel, product) {
        console.log(product)
        return new Promise((resolve, reject) => {
            oModel.read("/SelectedProduct", {
                filters: [
                    new Filter("Productno_sapProductno", FilterOperator.EQ, product),
 
 
                ],
                success: function (oData) {
                    resolve(oData);
                },
                error: function () {
                    reject(
                        "An error occurred while checking username existence."
                    );
                }
            })
        })
    },


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
          "EANUPC",
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
      onPressDownloadInAddVehicleTable: function () {

        var oTable = this.byId("idTruckTypeTable");
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
        XLSX.writeFile(oWorkbook, "VehicleTable.xlsx");
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
        XLSX.writeFile(oWorkbook, "ListOfProductsInVehicle.xlsx");
      },



      // Create fragment in products table
      // onPressAddInProductsTable: async function () {
      //   if (!this.oCreateStarDialog) {
      //     this.oCreateStarDialog = await this.loadFragment("CreateDialog");
      //   }
      //   this.oCreateStarDialog.open();
      // },

      onCancelInCreateProductDialog: function () {
        this.byId("idCreateProduc33tDialog").close();
      },
      // create fragment in add Eqipment page
      onPressInAddEquipment: async function () {
        if (!this.oCreateInAddEquipmentDialog) {
          this.oCreateInAddEquipmentDialog = await this.loadFragment("CreateVehicleType");
        }
        this.oCreateInAddEquipmentDialog.open();
      },
      onCancelInCreateVehicleDialog: function () {
        this.byId("idCreateInAddddEquipmentDialog").close();
        this.ClearVeh();
      },
      // edit  fragment in products table
      oOpenProductEdit: async function () {
        if (!this.oEditDialog) {
          this.oEditDialog = await this.loadFragment("EditProduct");
        }
        this.oEditDialog.open();
      },
      onCancelInEditProductDialog: function () {
        this.byId("idEditProductDssialog").close();
      },
      // edit  fragment in Add equipment table
      onPressEditInAddEquipmentTable: async function () {
        if (!this.oEditInAddEquipment) {
          this.oEditInAddEquipment = await this.loadFragment("EditTruckType");
        }
        this.oEditInAddEquipment.open();
      },
      onCancelInEditVehicleDialog: function () {
        this.byId("idEditInssAddEquipmentDialog").close();
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
        const oPayloadModel = this.getView().getModel("ProductModel"),
          oPayload = oPayloadModel.getProperty("/"),
          oModel = this.getView().getModel("ModelV2"),
          oPath = '/Materials';
        // Check if oPayload is empty
        if (
          !oPayload.sapProductno ||
          !oPayload.length ||
          !oPayload.width ||
          !oPayload.height ||
          !oPayload.mCategory ||
          !oPayload.description ||
          !oPayload.weight ||
          !oPayload.quantity 
        ) {
          console.log("Please Enter All Values");
          MessageBox.information("Please Enter All Values");
          return;
        }
        // Get the selected item from the event parameters
        var oSelectedItem = this.byId("idselectuom").getSelectedItem();
        if (oSelectedItem.getKey() === '') {
          MessageBox.error("Please Select UOM!!");
          return;
        }
        oPayload.uom = oSelectedItem.getKey();
        //get the selected item
        var oSelectedItem1 = this.byId("uomSelect").getSelectedItem();
        if (oSelectedItem1.getKey() === '') {
          MessageBox.error("Please Select UOM!!");
          return;
        }
        oPayload.muom = 'PC';
        oPayload.vuom = "M³";
        oPayload.wuom = oSelectedItem1 ? oSelectedItem1.getKey() : "";
        var oVolume;

        if (oPayload.uom === 'CM') {
          // If UOM is in meters, calculate normally
          oVolume = String((oPayload.length) / 100) * String((oPayload.width) / 100) * String((oPayload.height) / 100);
          oPayload.volume = String(oVolume.toFixed(7));
        } else {
          // If UOM is in centimeters, convert to meters before calculating
          oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
          oPayload.volume = String((Math.round(oVolume)));
        }
        try {
          await this.createData(oModel, oPayload, oPath);
          debugger
          this.getView().byId("ProductsTable").getBinding("items").refresh();
          this.byId("idselectuom").setSelectedKey("");
          this.byId("uomSelect").setSelectedKey("");
          MessageToast.show("Successfully Created!");
          this.ClearingModel(true);
          MessageToast.show("Successfully Created!");
        } catch (error) {
          MessageToast.show("Error at the time of creation");
        }
      },

      /**Clearing Properties after creation */
      ClearingModel: function () {
        const oPayloadModel = this.getView().getModel("ProductModel");
        oPayloadModel.setProperty("/", {
          sapProductno: "",
          length: "",
          width: "",
          height: "",
          volume: "",
          uom: "",
          mCategory: "",
          description: "",
          EANUPC: "",
          weight: "",
          quantity:""
        })
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

      /**Creating Vehicles */
      onCreateVeh: async function () {
        const oPayloadModel = this.getView().getModel("VehModel"),
          oPayload = oPayloadModel.getProperty("/"),
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
        if(!oFreeze){
          MessageBox.warning("Please Enter all Values");
          return;
        }
        const oFreezeVal = oFreeze === 'Yes'?true:false;
        oPayload.freezed = oFreezeVal;
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        // Get the selected item from the event parameters
        var oSelectedItem = this.byId("idvehtypeUOM").getSelectedItem();
        oPayload.uom = oSelectedItem ? oSelectedItem.getKey() : "";
        try {
          await this.createData(oModel, oPayload, oPath);
          debugger
          this.ClearVeh();
          this.byId("idTruckTypeTable").getBinding("items").refresh();
          this.onCancelInCreateVehicleDialog();
          this.byId("idvehtypeUOM").setSelectedKey("");
          this.byId("parkingLotSelect").getBinding("items").refresh();
          
          MessageToast.show("Successfully Created!");
        } catch (error) {
          this.onCancelInCreateVehicleDialog();
          MessageToast.show("Error at the time of creation");
        }
      },

      /**Clearing Vehicle Model */
      ClearVeh: function () {
        const oPayloadModel = this.getView().getModel("VehModel");
        oPayloadModel.setProperty("/", {
          truckType: "",
          length: "",
          width: "",
          height: "",
          uom: "",
          volume: "",
          truckWeight: "",
          capacity: "",
        })
      },

      /**Deleting Vehicles */
      onVehDel: async function () {
        const oTable = this.byId("idTruckTypeTable"),
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
          this.getView().byId("idTruckTypeTable").getBinding("items").refresh();
          this.byId("parkingLotSelect").getBinding("items").refresh();
          MessageToast.show('Successfully Deleted')
        } catch (error) {
          MessageToast.show('Error Occurs');
        }
      },
      onRow: function (oEvent) {
        var path = oEvent.getSource();
      },

      /**Editing vehical types */
      onEdit: async function () {
        var oSelectedItem = this.byId("idTruckTypeTable").getSelectedItem();
        if (!oSelectedItem) {
          MessageBox.information("Please select at least one Row for edit!");
          return;
        }
        const oData = oSelectedItem.getBindingContext().getObject();
        await this.onPressEditInAddEquipmentTable();
        this.byId("editTruckTypeInput").setValue(oData.truckType);
        this.byId("editLengthInput").setValue(oData.length);
        this.byId("editWidthInput").setValue(oData.width);
        this.byId("editHeightInput").setValue(oData.height);
        this.byId("editTruckWeightInput").setValue(oData.truckWeight);
        this.byId("editCapacityInput").setValue(oData.capacity);
      },

      /**Updading Edited Values */
      onSave: async function () {
        const updatedData = {
          truckType: this.byId("editTruckTypeInput").getValue(),
          length: this.byId("editLengthInput").getValue(),
          width: this.byId("editWidthInput").getValue(),
          height: this.byId("editHeightInput").getValue(),
          volume: "",
          truckWeight: this.byId("editTruckWeightInput").getValue(),
          capacity: this.byId("editCapacityInput").getValue()
        };
        const oPayload = updatedData;
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        const truckType = this.byId("editTruckTypeInput").getValue();
        const oModel = this.getView().getModel("ModelV2");
        const oPath = `/TruckTypes('${truckType}')`;
        try {
          await this.updateData(oModel, oPayload, oPath);
          this.byId("idTruckTypeTable").getBinding("items").refresh();
          this.onCancelInEditVehicleDialog();
          this.onClearEditDialog();
          MessageToast.show('Successfully Updated');
        } catch (error) {
          this.onCancelInEditVehicleDialog();
          this.onClearEditDialog();
          MessageToast.show('Error');
        }
      },

      /**Clearing Vehicle Editing Values */
      idTruckTypeTable: function () {
        this.byId("editTruckTypeInput").setValue(""); // Set to empty string
        this.byId("editLengthInput").setValue(""); // Set to empty string
        this.byId("editWidthInput").setValue(""); // Set to empty string
        this.byId("editHeightInput").setValue(""); // Set to empty strin
        this.byId("editTruckWeightInput").setValue(""); // Set to empty string
        this.byId("editCapacityInput").setValue("");
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
        this.byId("editProductNoInput").setValue(oData.sapProductno); // SAP Product Number
        this.byId("editDescriptionInput").setValue(oData.description); // Description
        this.byId("editEANUPCInput").setValue(oData.EANUPC); // EAN/UPC Code
        this.byId("editCategoryInput").setValue(oData.mCategory); // Material Category
        this.byId("editproLengthInput").setValue(oData.length); // Length
        this.byId("editprodWidthInput").setValue(oData.width); // Width
        this.byId("editprodHeightInput").setValue(oData.height); // Height
        // this.byId("editVolumeInput").setValue(oData.volume); // Volume
        this.byId("editUOMInput").setValue(oData.uom); // Unit of Measure (UOM)
        this.byId("editWeightInput").setValue(oData.weight); // Weight
        this.byId("editQuantityInput").setValue(oData.quantity);
      },
      /**Updadting the Changed Product Value */
      onSaveProduct: async function () {
        const updatedData = {
          sapProductno: this.byId("editProductNoInput").getValue(), // SAP Product Number
          description: this.byId("editDescriptionInput").getValue(), // Description
          EANUPC: this.byId("editEANUPCInput").getValue(),          // EAN/UPC Code
          mCategory: this.byId("editCategoryInput").getValue(),      // Material Category
          length: this.byId("editproLengthInput").getValue(),        // Length
          width: this.byId("editprodWidthInput").getValue(),         // Width
          height: this.byId("editprodHeightInput").getValue(),       // Height
          volume: "",                                                // Volume (currently set to an empty string)
          uom: this.byId("editUOMInput").getValue(),                                                   // Unit of Measure (UOM, currently set to an empty string)
          weight: this.byId("editWeightInput").getValue(), 
          quantity:this.byId("editQuantityInput").getValue()           // Weight
        };
        const oPayload = updatedData;
        var oVolume = String(oPayload.length) * String(oPayload.width) * String(oPayload.height);
        oPayload.volume = (parseFloat(oVolume)).toFixed(2);
        const sapProductno = this.byId("editProductNoInput").getValue();
        const oModel = this.getView().getModel("ModelV2");
        const oPath = `/Materials('${sapProductno}')`;
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
        this.byId("editProductNoInput").setValue(""); // SAP Product Number
        this.byId("editDescriptionInput").setValue(""); // Description
        this.byId("editEANUPCInput").setValue(""); // EAN/UPC Code
        this.byId("editCategoryInput").setValue(""); // Material Category
        this.byId("editproLengthInput").setValue(""); // Length
        this.byId("editprodWidthInput").setValue(""); // Width
        this.byId("editprodHeightInput").setValue(""); // Height
        // this.byId("editVolumeInput").setValue(""); // Volume (currently commented out)
        this.byId("editUOMInput").setValue(""); // Unit of Measure (UOM, currently commented out)
        this.byId("editWeightInput").setValue(""); // Weight
        this.byId("editQuantityInput").setValue("");
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

          // Load truck details
          await this.onTruckDetailsLoad().then(Trucks => {
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

      /** Truck Details reading */
      onTruckDetailsLoad: function () {
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

      /**Loading Required Trucks */

      onLoadRequiredTrucks: async function () {
        if (!this.oReqTruckDialog) {
          this.oReqTruckDialog = await this.loadFragment("RequiredTruck");
        }
        this.oReqTruckDialog.setModel(this.getView().getModel("resultModel"), "resultModel")
        // Get the count of trucks
        const products = this.getView().getModel("resultModel").getProperty("/Products");
        const productCount = products ? products.length : 0;
        this.oReqTruckDialog.open();
      },

      onTruckDialogClose: function () {
        this.byId("truckLoadingDialog").close();
      },
      MoveToNextScreen: function () {
        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("ReqTruck");
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

            console.log(excelData);
            // Call createProducts with the parsed excel data
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
              EANUPC: String(product.EANUPC),                  // Ensure it's a string
              weight: String(product.Weight),
              quantity:String(product.Quantity)                    // Ensure it's a string
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
      onPressStackBtn:async function () {
          if (!this.oStackDialog) {
            this.oStackDialog = await this.loadFragment("Stack");
          }
          this.oStackDialog.open();
        },
        onCancelInStackDialog: function () {
          this.oStackDialog.close();
        }, 

// creating stak tile in the Stack dialog
_createGenericStackTile : function() {
  // Get the container where the tile will be placed
  var oTileContainer = this.byId("VboxIdStacktiles");
  //getting model 
  
},
onNextPressInSeconsSrInAddVehicleType:function(){
  debugger

  this.getView().byId("idProcessQueueStep_changeQueue").setVisible(true);
  

},
/*  ****************************************************************************Simulation code**************************************************************************** */




onPressGenericTilePress: function (oEvent) {
  debugger;

  const oTile = oEvent.getSource();
  const header = oTile.getHeader();

  // Move to the next step in the wizar
  const oWizard = this.byId("idProcesstWizard_changeQueue");
  oWizard.nextStep();

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

onPressAddProductInSimulate:function() {
  // this.getView().byId("idHBoxInAddSimulate").setVisible(true);
},
onPressAddProductInSimulate:async function() {
  if (!this.oValueDialog) {
    this.oValueDialog = await this.loadFragment("ValueHelp");
  }
  this.oValueDialog.open();
 
  // this._oBasicSearchFieldWithSuggestions = new SearchField();

  // Fragment.load({
  //   name: `com.app.artihcus.fragment.ValueHelp`
  // }).then(function(oDialogSuggestions) {
  //   var oFilterBar = oDialogSuggestions.getFilterBar(), oColumnProductCode, oColumnProductName;
  //   this._oVHDWithSuggestions = oDialogSuggestions;

  //   this.getView().addDependent(oDialogSuggestions);

  //   // Set key fields for filtering in the Define Conditions Tab
  //   oDialogSuggestions.setRangeKeyFields([{
  //     label: "Product Code",
  //     key: "ProductCode",
  //     type: "string",
  //     typeInstance: new TypeString({}, {
  //       maxLength: 7
  //     })
  //   }]);

  //   // Set Basic Search for FilterBar
  //   oFilterBar.setFilterBarExpanded(false);
  //   oFilterBar.setBasicSearch(this._oBasicSearchFieldWithSuggestions);

  //   // Trigger filter bar search when the basic search is fired
  //   this._oBasicSearchFieldWithSuggestions.attachSearch(function() {
  //     oFilterBar.search();
  //   });

  //   oDialogSuggestions.getTableAsync().then(function (oTable) {

  //     //oTable.setModel(this.oProductsModel);

  //     //For Desktop and tabled the default table is sap.ui.table.Table
  //     if (oTable.bindRows) {
  //       // Bind rows to the ODataModel and add columns
  //       // oTable.bindAggregation("rows", {
  //       //   path: "/ZSALESREPORTSuggestions",
  //       //   events: {
  //       //     dataReceived: function() {
  //       //       oDialogSuggestions.update();
  //       //     }
  //       //   }
  //       // });
  //       oColumnProductCode = new UIColumn({label: new Label({text: "Product Code"}), template: new Text({wrapping: false, text: "{ProductCode}"})});
  //       oColumnProductCode.data({
  //         fieldName: "ProductCode"
  //       });
  //       oTable.addColumn(oColumnProductCode);

  //       oColumnProductName = new UIColumn({label: new Label({text: "Quantity"}), template: new Text({wrapping: false, text: "{Quantity}"})});
  //       oColumnProductName.data({
  //         fieldName: "Quantity"
  //       });
  //       oTable.addColumn(oColumnProductName);

  //       // oColumnDis = new UIColumn({label: new Label({text: "Dis"}), template: new Text({wrapping: false, text: "{Dis}"})});
  //       // oColumnDis.data({
  //       //   fieldName: ""
  //       // });
  //       // oTable.addColumn(oColumnQuantity);
  //     }

  //     //For Mobile the default table is sap.m.Table
  //     // if (oTable.bindItems) {
  //     //   // Bind items to the ODataModel and add columns
  //     //   oTable.bindAggregation("items", {
  //     //     path: "/ZSALESREPORTSuggestions",
  //     //     template: new ColumnListItem({
  //     //       cells: [new Label({text: "{ProductCode}"}), new Label({text: "{ProductName}"})]
  //     //     }),
  //     //     events: {
  //     //       dataReceived: function() {
  //     //         oDialogSuggestions.update();
  //     //       }
  //     //     }
  //     //   });
  //     //   oTable.addColumn(new MColumn({header: new Label({text: "Product Code"})}));
  //     //   oTable.addColumn(new MColumn({header: new Label({text: "Product Name"})}));
  //     // }
  //     oDialogSuggestions.update();
  //   }.bind(this));

  //  // oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
  //   oDialogSuggestions.open();
  // }.bind(this));
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





onPressAddButtonValueHelp:function(){
  var oTable = this.byId("idAssignedQueueTable_changeQueue");
			var aSelectedItems = oTable.getSelectedItems();
},


onPressBigBagsTile:function(){
  var oModel1 = new JSONModel({

    //  newImageUrl : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-layers.svg", 
    //  newImageUrl1 : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-mass.svg", 
    //  newImageUrl2 : "https://www.searates.com/design/images/apps/load-calculator/product-form/bigbags-height.svg", // Update with your logic
    
});
this.getView().byId("idVbox4InStack").setModel(oModel1,"oimage");
 
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
}
    });
  });