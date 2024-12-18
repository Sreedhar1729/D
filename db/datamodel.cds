namespace capacitymanagement.db;

/**for custom type */
type string : String(40);

/**Defining entity */
<<<<<<< HEAD

// for unique fields
@assert.unique: {
    sapProductno: [sapProductno],
    EANUPC      : [EANUPC]

}

define entity Materials {
    key ID           : UUID;
        sapProductno : string;
        EANUPC       : String;
        length       : String;
        width        : String;
        height       : String;
        volume       : String;
        vuom         : String;
        muom         : String;
        uom          : String;
        mCategory    : string;
        description  : String;
        weight       : String;
        wuom         : String;
        quantity     : String;
        layers       : String;
        mass         : String;
        layersHeight : String;
}

/**Defining Vehicle Entity */
define entity TruckTypes {
    key truckType   : String;
=======
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
        layars_height : string;

}

/**Defining Vehicle Entity */
define entity TruckTypes {
    key truckType   : string;
>>>>>>> 85e8d7d18b33587cc78e9e671c82285acd30657e
    key freezed     : Boolean;
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
<<<<<<< HEAD

define entity SelectedProduct {
    key Productno        : Association to Materials;
=======
define entity SelectedProduct {
    
       key Productno     : Association to Materials;
>>>>>>> 85e8d7d18b33587cc78e9e671c82285acd30657e
        Truckdetails     : Association to TruckTypes;
        SelectedQuantity : String;
}
