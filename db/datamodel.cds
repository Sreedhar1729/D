namespace capacitymanagement.db;

/**for custom type */
type string : String(40);

/**Defining entity */
define entity Materials {

    key sapProductno  : string;
        length        : String;
        width         : String;
        height        : String;
        volume        : String;
        vuom          : String;
        muom          : String;
        uom           : String;
        mCategory     : string;
        description   : String;
        EANUPC        : String;
        weight        : String;
        wuom          : String;
        quantity      : String;
        layers        : String;
        mass          : String;
        layersHeight  : String;
        selectedProduct:Association  to SelectedProduct on selectedProduct.Productno=$self
}
 
/**Defining Vehicle Entity */
define entity TruckTypes {
    key truckType   : String;
     freezed     : Boolean;
        length      : String;
        width       : String;
        height      : String;
        uom         : String;
        volume      : String;
        tvuom       : String;
        truckWeight : String;
        capacity    : String;
        tuom        : String;
}
define entity SelectedProduct {  
       key Productno     : Association to Materials;
        Truckdetails     : Association to TruckTypes;
        SelectedQuantity : String;
        color: String;
}
