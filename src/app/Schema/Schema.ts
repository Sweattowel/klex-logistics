export interface Location 
{
    LocationAddress: string;
    LocationCity: string;
    LocationState: string;
    LocationCountry: string;
}
export interface Contractor
{
    ContractorID: number;
    ContractorName: string;
    ContractorRepresents: string;
    ContractorPhone : string;
    ContractorMobile : string;
    ContractorEmail : string;
}
export interface Product
{
    ProductID: number;
    ProductName: string;
    ProductWeight: number;
    ProductPrice: number;
    ProductIsAvailable: boolean;
    ProductExpirationAvg: string;
    ProductSources: Location[]
}
export interface Delivery
{
    DeliveryID: number;
    DeliveryProducts: Product[];
    DeliverySource: string;
    DeliveryDestination: Location;
    DeliveryTransportContractor: Contractor;
    DeliveryRecipient: string;
    DeliveryDateStart: string;
    DeliveryDateExpectedFinish: string;
    DeliveryRaisedIssues: string;
    DeliveryExpectedCount: number;
    DeliveryExpectedWeight: number;
}
export interface Shipping 
{
    ShippingID: number;
    ShipName: string;
    ShippingContractor: Contractor;
    ShippingDeliveries: Delivery[];
    ShippingRoute: ShippingRoute;
}
export interface ShippingRoute 
{
    ShipCurrLocation: Location;
    ShipRoute: string;
    ShipNextLocation: Location;
}