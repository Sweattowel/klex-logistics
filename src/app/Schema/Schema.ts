export interface LocationType 
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
    ContractorLocation: LocationType | null;
}
export interface Product
{
    ProductID: number;
    ProductName: string;
    ProductWeight: number;
    ProductPrice: number;
    ProductIsAvailable: boolean;
    ProductExpirationAvg: string;
    ProductSources: LocationType[]
}
export interface Delivery
{
    DeliveryID: number;
    DeliveryProducts: Product[];
    DeliverySource: string;
    DeliveryDestination: LocationType;
    DeliveryTransportContractor: Contractor;
    DeliveryRecipient: string;
    DeliveryDateStart: string;
    DeliveryDateExpectedFinish: string;
    DeliveryRaisedIssues: string;
    DeliveryExpectedCount: number;
    DeliveryExpectedWeight: number;
}
export interface ShipType 
{
    ShippingID: number;
    ShipName: string;
    ShippingContractor: Contractor;
    ShippingProducts: Delivery | null;
    ShippingCurrRoute: Route;
}
export interface Route 
{
    RouteID: number;
    RouteFrom: PortDesignation;
    RouteTo: PortDesignation;
    RouteOceans: string[];
    RouteLength: number;
}
export interface PortDesignation
{
    PortID: number;
    PortLocation: LocationType;
}
export interface Shipping 
{
    Origin: LocationType;
    Destination: LocationType;
    Route: Shipping;
    Deliveries: Delivery[];
};