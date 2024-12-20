namespace capacitymanagement.db;

/**for custom type */
type string : String(40);

/**Defining entity */

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
        SelectedQuantity:String;
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
    key Productno        : Association to Materials;
        Truckdetails     : Association to TruckTypes;
}
