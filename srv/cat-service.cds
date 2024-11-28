using {capacitymanagement.db as db} from '../db/datamodel';

@path: 'CapSRV'

define service MyService {
    define entity Materials  as projection on db.Materials;
    define entity TruckTypes as projection on db.TruckTypes;
}
