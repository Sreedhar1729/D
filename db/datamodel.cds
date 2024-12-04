namespace capacitymanagement.db;

/**for custom type */
type string : String(40);

/**Defining entity */
define entity Materials {
    key sapProductno : string;
        length       : String;
        width        : String;
        height       : String;
        volume       : String;
        vuom         : String; //volume uom
        muom         : String; //Material dimensions uom
        uom          : String; //Material UOM ,i.e,each,pack,KG,
        mCategory    : string;
        description  : String;
        EANUPC       : String;
        weight       : String;
        wuom         : String; //weight uom
        layerCount   : String;
        mass         : String;
}
 
/**Defining Vehicle Entity */
define entity TruckTypes {
    key truckType : string;
        length    : String;
        width     : String;
        height    : String;
        uom       : String;
        volume    : String; //dimesnisons uom
        maxweight : String;
}

define entity  SelectedProduct {
    key ID : UUID;
        Productno : Association to Materials;
        Truckdetails : Association to TruckTypes;
        SelectedQuantity : String; 
}
