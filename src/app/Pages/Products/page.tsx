'use client'

import Alerts, { AlertType } from "@/app/Global/Alerts";
import DropDown from "@/app/Global/DropDown";
import Foot from "@/app/Global/Foot";
import Nav from "@/app/Global/Nav";
import { Contractor, Delivery, LocationType, Product, Shipping, ShipType } from "@/app/Schema/Schema"
import { useEffect, useState } from "react";

export default function Products(){
    const [ alerts, setAlerts ] = useState<AlertType[]>([]);

    const [Delivery, setDelivery] = useState<Delivery>({
            DeliveryID: 0,
            DeliveryProducts: [],
            DeliverySource: "",
            DeliveryDestination: {
                LocationAddress: "",
                LocationCity: "Please Select a City",
                LocationState: "Please Select a State",
                LocationCountry: "Please Select a Country",
            },
            DeliveryTransportContractor: {
                ContractorID: 0,
                ContractorName: "",
                ContractorRepresents: "",
                ContractorPhone : "",
                ContractorMobile : "",
                ContractorEmail : "",
                ContractorLocation: null
            },
            DeliveryRecipient: "",
            DeliveryDateStart: "",
            DeliveryDateExpectedFinish: "",
            DeliveryRaisedIssues: "",
            DeliveryExpectedCount: 0,
            DeliveryExpectedWeight: 0,
    });
    const [ needShipping, setNeedShipping ] = useState<boolean>(false);
    const [ deliveryTimeWeeks, setDeliveryTimeWeeks ] = useState<number>(0);
    const [ productsNeedShipping, setProductsNeedShipping ] = useState<Map<string, ShipType>>(new Map())
    
    function calculateShipping(ProductOrigin: LocationType, ProductName: string){
        const routes = Ships.filter(ship => 
            ship.ShippingCurrRoute.RouteFrom.PortLocation.LocationCountry == ProductOrigin.LocationCountry &&
            ship.ShippingCurrRoute.RouteTo.PortLocation.LocationCountry == Delivery.DeliveryDestination.LocationCountry
        );
        
        if (routes.length === 0) {
            Alert(`Product ${ProductName} Cannot be shipped, Please remove`, 200);
            return 0;
        }
        
        const shortestRoute = routes.reduce((minShip, currentShip) => {
            return currentShip.ShippingCurrRoute.RouteLength < minShip.ShippingCurrRoute.RouteLength ? currentShip : minShip;
        }, routes[0]);

  
        
        setProductsNeedShipping(prev => {
            const updated = new Map(prev);
            const existing = updated.get(shortestRoute.ShipName); 
            if (!existing) {
                updated.set(shortestRoute.ShipName, {
                    ShippingID: shortestRoute.ShippingID,
                    ShipName: shortestRoute.ShipName,
                    ShippingContractor: shortestRoute.ShippingContractor,
                    ShippingCurrRoute: shortestRoute.ShippingCurrRoute,
                    ShippingProducts: shortestRoute.ShippingProducts,
                })
            } else {
                updated.set(shortestRoute.ShipName, {
                    ShippingID: existing?.ShippingID,
                    ShipName: existing?.ShipName,
                    ShippingContractor: existing?.ShippingContractor,
                    ShippingCurrRoute: existing?.ShippingCurrRoute,
                    ShippingProducts: {
                        ...Delivery,
                        DeliveryProducts: Delivery.DeliveryProducts.filter(product =>
                            product.ProductSources.some(source =>
                                source.LocationCountry === shortestRoute.ShippingCurrRoute.RouteFrom.PortLocation.LocationCountry
                            )
                        )
                    }
                });
            }

            return updated;
        }); 

        setNeedShipping(true);

        return shortestRoute.ShippingCurrRoute.RouteLength;
    };

    function calculateTransport(ProductOrigin: LocationType, ProductDestination: LocationType) {
        let result = 0;    
        if (ProductOrigin.LocationState !== ProductDestination.LocationState){ result += 1};

        if (ProductOrigin.LocationCity !== ProductDestination.LocationCity){ result += 0.25};

        return result
    };

    function Alert(AlertText: string, Severity: number){
        setAlerts(alerts => [...alerts, {AlertText: AlertText, AlertSeverity: Severity}]);
    };

    useEffect(() => {
        setAlerts([]);
        let result: number = 0;
        const cityDistanceWeek = 0.25;

        const sources = Array.from(
            new Map(
                Delivery.DeliveryProducts.flatMap(product =>
                    product.ProductSources.map(source => {
                        const key = `${source.LocationCountry}|${source.LocationState}|${source.LocationCity}|${source.LocationAddress}`;
                        return [key, { ...source, ProductName: product.ProductName, Product: product }];
                    })
                )
            ).values()
        );

        const { LocationCountry: country, LocationState: state, LocationCity: city } = Delivery.DeliveryDestination;

        sources.forEach(productSource => {
            if (productSource.LocationCountry !== country){ 
                result += calculateShipping(productSource, productSource.ProductName);
            };
            if (productSource.LocationState !== state){ 
                result += calculateTransport(productSource, Delivery.DeliveryDestination); 
            };
            if (productSource.LocationCity !== city){ result += cityDistanceWeek; }
        });

        setDeliveryTimeWeeks(result);

    }, [Delivery.DeliveryProducts, Delivery.DeliveryDestination]);

    return (
        <main>
            <Nav />
            <Alerts key={alerts.length} ImportAlerts={alerts}/>
                <section className="flex flex-col">
                    <div className="w-[95%] flex flex-col items-center border rounded m-5 p-5">
                        <h1 className="font-bold border-b w-full text-center">
                            Select Destination
                        </h1>
                        <DropDown initialState={Delivery.DeliveryDestination.LocationCountry} initialOptions={CountryList.reduce((acc: string[], curr: Country) => {acc.push(curr.CountryName); return acc}, [])} 
                            onSelect={(option) => setDelivery(prev => ({...prev, DeliveryDestination: {...prev.DeliveryDestination, LocationCountry: option, LocationState: "Select a state", LocationCity: "Select a city"}}))} 
                        />
                        <DropDown key={Delivery.DeliveryDestination.LocationCountry} initialState={Delivery.DeliveryDestination.LocationState} 
                            initialOptions={CountryList.find(country => 
                                country.CountryName == Delivery.DeliveryDestination.LocationCountry)?.CountryStates.map((state, index) => state.StateName) || ["Please select a country first"]} 
                            onSelect={(option) => setDelivery(prev => ({...prev, DeliveryDestination: {...prev.DeliveryDestination, LocationState: option, LocationCity: "Select a city"}}))} 
                        />
                        <DropDown key={Delivery.DeliveryDestination.LocationState + Delivery.DeliveryDestination.LocationCountry} initialState={Delivery.DeliveryDestination.LocationCity} 
                            initialOptions={CountryList.find(country => 
                                country.CountryName == Delivery.DeliveryDestination.LocationCountry)?.CountryStates.find(s => 
                                    s.StateName == Delivery.DeliveryDestination.LocationState)?.StateCities.map(c => 
                                        c) || ["Please select a State first"]} 
                            onSelect={(option) => setDelivery(prev => ({...prev, DeliveryDestination: {...prev.DeliveryDestination, LocationCity: option}}))} 
                        />

                        <input type="text" placeholder="Enter address with building number" 
                            className="m-2 p-2 rounded border w-[80%]"
                            onChange={(e) => setDelivery(prev => ({...prev, DeliveryDestination: {...prev.DeliveryDestination, LocationAddress: e.target.value}}))}
                        />
                    </div>
                    <div className="w-[95%] flex flex-col items-center border rounded m-5 p-5">
                        <h1 className="font-bold border-b w-full text-center">
                            Choose Products
                        </h1>
                        <ul 
                            className="w-full flex flex-wrap justify-evenly text-center"
                        >
                            {ProductList.map((product: Product, index: number) => (
                                <li key={index}
                                    className="min-w-[30%] max-w-[95%] flex justify-evenly items-center rounded border p-1 m-1 bg-gradient-to-br from-green-200 hover:from-green-400 hover:cursor-pointer text-[0.7rem]"
                                    onClick={() => setDelivery(prev => ({
                                        ...prev,
                                        DeliveryProducts: [...prev.DeliveryProducts, product]
                                    }))}
                                >
                                    {product.ProductName}<br />                                     
                                    {product.ProductSources.map((s, i) => (
                                    <p key={i}>
                                        |Cntry: {s.LocationCountry
                                        .split(" ")
                                        .map(word => word[0])
                                        .join("")
                                        .toUpperCase()}|State: {s.LocationState.slice(0, 3).toUpperCase()}
                                    </p>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <section className="flex flex-row">
                    <div className="w-[50%] h-[50vh] flex flex-col items-center border rounded m-5 p-5">
                        <h1 className="font-bold border-b w-full text-center">
                            Contents
                        </h1>
                        <ul className="w-full h-[90%] divide-y overflow-auto p-1 m-1">
                            {Delivery.DeliveryProducts.map((product: Product, index: number) => (
                                <li key={index}
                                    className="w-[90%] p-1 m-1 rounded border bg-gradient-to-br from-green-200 hover:from-red-200 hover:cursor-pointer"
                                    onClick={() => setDelivery(prev => ({
                                        ...prev,
                                        DeliveryProducts: [
                                            ...prev.DeliveryProducts
                                            .filter((_, i) => i !== index)
                                        ]
                                    }))}
                                >
                                    {product.ProductName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-[50%] flex flex-col items-center border rounded m-5 p-5">
                        <h1 className="h-[10%] font-bold border-b w-full text-center">
                            Contractor
                        </h1>
                        <DropDown initialState={"Please select an available contractor"} key={Delivery.DeliveryDestination.LocationCountry}
                            initialOptions={ContractorList.reduce((acc: string[], curr: Contractor) => {
                                    if (curr.ContractorLocation?.LocationCountry === Delivery.DeliveryDestination.LocationCountry) {
                                        acc.push(curr.ContractorName);
                                    };
                                    return acc;
                                }, [])
                            } 
                            onSelect={(option: string) => {
                                const found = ContractorList.find(c => c.ContractorName === option && (c.ContractorLocation?.LocationCountry === Delivery.DeliveryDestination.LocationCountry));
                                if (found) {
                                    setDelivery(prev => ({...prev, DeliveryTransportContractor: found}));
                                } else {
                                    console.error("Contractor not found");
                                }
                            }} 
                        />
                        <div className="h-full w-full border rounded p-5 m-5 justify-space-between items-center [&>*]:border-bd [&>*]:h-[20%]">
                            <p>NM:{Delivery.DeliveryTransportContractor.ContractorName}</p>
                            <p>RE:{Delivery.DeliveryTransportContractor.ContractorRepresents}</p>
                            <p>EM:{Delivery.DeliveryTransportContractor.ContractorEmail}</p>
                            <p>PH:{Delivery.DeliveryTransportContractor.ContractorPhone}</p>
                            <p>MB:{Delivery.DeliveryTransportContractor.ContractorMobile}</p>
                        </div>
                    </div>
                </section>
                <section className="w-[90%]] flex flex-col items-center border rounded m-5 p-5" key={productsNeedShipping.size + 100}>
                    <h1 className="h-[10%] font-bold border-b w-full text-center">
                        Shipping requirements
                    </h1>
                    <ul 
                        className="w-full flex flex-col justify-evenly items-center"
                    >
                        {productsNeedShipping && Array.from(productsNeedShipping.entries()).map(([shipName, ship], index) => (
                            <li key={index}
                                className="flex flex-col justify-evenly w-[90%] p-2 m-2 rounded border bg-gradient-to-br from-green-200 hover:from-red-200 hover:cursor-pointer"
                            >
                                <h3 className="font-bold">{ship.ShipName}</h3>
                                <div>
                                    <h4 className="underline">Contractor</h4>
                                    {Object.entries(ship.ShippingContractor).map(([key, value], i) => (
                                        <p key={i}>{key}: {value}</p>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="underline">Route</h4>
                                    <p>From: {ship.ShippingCurrRoute.RouteFrom.PortLocation.LocationCountry}</p>
                                    <p>To: {ship.ShippingCurrRoute.RouteTo.PortLocation.LocationCountry}</p>
                                    <p>Length: {ship.ShippingCurrRoute.RouteLength} WKS</p>
                                </div>
                                <div>
                                    <h4 className="underline">Products</h4>
                                    {ship.ShippingProducts?.DeliveryProducts?.map((prod: Product, j) => (
                                        <p key={j}>
                                            {prod.ProductName}
                                        </p>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
                
                <section className="w-[90%]] flex flex-col items-center border rounded m-5 p-5">
                    <h1 className="h-[10%] font-bold border-b w-full text-center">
                        Completed Order
                    </h1>
                    <div className="w-[95%] border m-1 p-1">
                        <p>Current Date: {Date().toString().slice(0,15)}</p>
                        <p>
                        Expected Delivery: {
                            new Date(new Date().setMonth(new Date().getMonth() + deliveryTimeWeeks / 4)).toDateString()
                        }
                        </p>
                        <p>
                        Max Expiration: {Delivery.DeliveryProducts.length > 0
                            ? Math.max(
                                ...Delivery.DeliveryProducts.map(p =>
                                    parseInt(p.ProductExpirationAvg.replace(/\D/g, "")) || 0
                                )
                                ) + " months"
                            : "N/A"}
                        </p>
                        <div className="flex justify-evenly [&>p]:border-b p-1 m-1">Delivery by {Delivery.DeliveryTransportContractor.ContractorName} to {Object.entries(Delivery.DeliveryDestination).map(([key,value], index) => (<p key={index}>{value}</p>))}</div>
                    </div> 

                </section>
                                
            <Foot />
        </ main>
    )
};

export const ProductList: Product[] = [
    {
        ProductID: 0,
        ProductName: "Coke 270ml",
        ProductWeight: 0.75,
        ProductPrice: 1.25,
        ProductIsAvailable: true,
        ProductExpirationAvg: "12 months",
        ProductSources: [
            {
                LocationCountry: "United States",
                LocationState: "California",
                LocationCity: "Los Angeles",
                LocationAddress: "123 Sunset Blvd",
            },
            {
                LocationCountry: "United States",
                LocationState: "Texas",
                LocationCity: "Dallas",
                LocationAddress: "987 Commerce St",
            }
        ]
    },
    {
        ProductID: 1,
        ProductName: "Sprite 500ml",
        ProductWeight: 0.95,
        ProductPrice: 1.50,
        ProductIsAvailable: true,
        ProductExpirationAvg: "10 months",
        ProductSources: [
            {
                LocationCountry: "Canada",
                LocationState: "Ontario",
                LocationCity: "Toronto",
                LocationAddress: "10 Yonge Street",
            },
            {
                LocationCountry: "Canada",
                LocationState: "Quebec",
                LocationCity: "Montreal",
                LocationAddress: "55 Rue Sainte-Catherine",
            }
        ]
    },
    {
        ProductID: 2,
        ProductName: "Pepsi Max 330ml",
        ProductWeight: 1.0,
        ProductPrice: 1.40,
        ProductIsAvailable: false,
        ProductExpirationAvg: "11 months",
        ProductSources: [
            {
                LocationCountry: "United States",
                LocationState: "New York",
                LocationCity: "Buffalo",
                LocationAddress: "321 Elmwood Ave",
            },
            {
                LocationCountry: "United States",
                LocationState: "Ohio",
                LocationCity: "Cleveland",
                LocationAddress: "789 Euclid Ave",
            }
        ]
    },
    {
        ProductID: 3,
        ProductName: "Fanta Orange 1L",
        ProductWeight: 1.5,
        ProductPrice: 2.25,
        ProductIsAvailable: true,
        ProductExpirationAvg: "8 months",
        ProductSources: [
            {
                LocationCountry: "Australia",
                LocationState: "New South Wales",
                LocationCity: "Sydney",
                LocationAddress: "200 George Street",
            },
            {
                LocationCountry: "Australia",
                LocationState: "Queensland",
                LocationCity: "Brisbane",
                LocationAddress: "55 Queen Street",
            }
        ]
    },
    {
        ProductID: 4,
        ProductName: "Water Bottle 1.5L",
        ProductWeight: 1.6,
        ProductPrice: 0.99,
        ProductIsAvailable: true,
        ProductExpirationAvg: "24 months",
        ProductSources: [
            {
                LocationCountry: "Canada",
                LocationState: "British Columbia",
                LocationCity: "Vancouver",
                LocationAddress: "888 Granville Street",
            },
            {
                LocationCountry: "Canada",
                LocationState: "Alberta",
                LocationCity: "Calgary",
                LocationAddress: "101 Stephen Ave",
            }
        ]
    },
    {
        ProductID: 5,
        ProductName: "Apple Juice 750ml",
        ProductWeight: 1.2,
        ProductPrice: 1.80,
        ProductIsAvailable: false,
        ProductExpirationAvg: "6 months",
        ProductSources: [
            {
                LocationCountry: "United States",
                LocationState: "Washington",
                LocationCity: "Seattle",
                LocationAddress: "456 Pike Street",
            },
            {
                LocationCountry: "United States",
                LocationState: "Oregon",
                LocationCity: "Portland",
                LocationAddress: "789 Burnside Ave",
            }
        ]
    },
    {
        ProductID: 6,
        ProductName: "Iced Tea Lemon 500ml",
        ProductWeight: 1.1,
        ProductPrice: 1.65,
        ProductIsAvailable: true,
        ProductExpirationAvg: "9 months",
        ProductSources: [
            {
                LocationCountry: "Canada",
                LocationState: "Nova Scotia",
                LocationCity: "Halifax",
                LocationAddress: "33 Barrington Street",
            },
            {
                LocationCountry: "Canada",
                LocationState: "Newfoundland and Labrador",
                LocationCity: "St. John's",
                LocationAddress: "77 Water Street",
            }
        ]
    },
    {
        ProductID: 7,
        ProductName: "Energy Drink 250ml",
        ProductWeight: 0.6,
        ProductPrice: 2.50,
        ProductIsAvailable: false,
        ProductExpirationAvg: "18 months",
        ProductSources: [
            {
                LocationCountry: "Australia",
                LocationState: "Victoria",
                LocationCity: "Melbourne",
                LocationAddress: "99 Collins Street",
            },
            {
                LocationCountry: "Australia",
                LocationState: "South Australia",
                LocationCity: "Adelaide",
                LocationAddress: "202 Rundle Mall",
            }
        ]
    },
    {
        ProductID: 8,
        ProductName: "Chocolate Milk 330ml",
        ProductWeight: 0.9,
        ProductPrice: 1.95,
        ProductIsAvailable: true,
        ProductExpirationAvg: "5 months",
        ProductSources: [
            {
                LocationCountry: "United States",
                LocationState: "Wisconsin",
                LocationCity: "Milwaukee",
                LocationAddress: "112 Dairy Drive",
            },
            {
                LocationCountry: "United States",
                LocationState: "Minnesota",
                LocationCity: "Minneapolis",
                LocationAddress: "500 Milk Street",
            }
        ]
    },
    {
        ProductID: 9,
        ProductName: "Coconut Water 500ml",
        ProductWeight: 1.0,
        ProductPrice: 2.10,
        ProductIsAvailable: true,
        ProductExpirationAvg: "7 months",
        ProductSources: [
            {
                LocationCountry: "Australia",
                LocationState: "Northern Territory",
                LocationCity: "Darwin",
                LocationAddress: "15 Coconut Ave",
            },
            {
                LocationCountry: "Australia",
                LocationState: "Western Australia",
                LocationCity: "Perth",
                LocationAddress: "101 Beach Road",
            }
        ]
    }
];

interface Country 
{
    CountryName: string;
    CountryStates: State[];
}
interface State
{
    StateName: string;
    StateCities: string[]
}
const CountryList: Country[] = [
    {
        CountryName: "United States",
        CountryStates: [
            { StateName: "Alabama", StateCities: ["Birmingham", "Montgomery"] },
            { StateName: "Alaska", StateCities: ["Anchorage", "Fairbanks"] },
            { StateName: "Arizona", StateCities: ["Phoenix", "Tucson"] },
            { StateName: "Arkansas", StateCities: ["Little Rock", "Fayetteville"] },
            { StateName: "California", StateCities: ["Los Angeles", "San Francisco"] },
            { StateName: "Colorado", StateCities: ["Denver", "Colorado Springs"] },
            { StateName: "Connecticut", StateCities: ["Hartford", "New Haven"] },
            { StateName: "Delaware", StateCities: ["Wilmington", "Dover"] },
            { StateName: "Florida", StateCities: ["Miami", "Orlando"] },
            { StateName: "Georgia", StateCities: ["Atlanta", "Savannah"] },
            { StateName: "Hawaii", StateCities: ["Honolulu", "Hilo"] },
            { StateName: "Idaho", StateCities: ["Boise", "Idaho Falls"] },
            { StateName: "Illinois", StateCities: ["Chicago", "Springfield"] },
            { StateName: "Indiana", StateCities: ["Indianapolis", "Fort Wayne"] },
            { StateName: "Iowa", StateCities: ["Des Moines", "Cedar Rapids"] },
            { StateName: "Kansas", StateCities: ["Wichita", "Topeka"] },
            { StateName: "Kentucky", StateCities: ["Louisville", "Lexington"] },
            { StateName: "Louisiana", StateCities: ["New Orleans", "Baton Rouge"] },
            { StateName: "Maine", StateCities: ["Portland", "Augusta"] },
            { StateName: "Maryland", StateCities: ["Baltimore", "Annapolis"] },
            { StateName: "Massachusetts", StateCities: ["Boston", "Worcester"] },
            { StateName: "Michigan", StateCities: ["Detroit", "Grand Rapids"] },
            { StateName: "Minnesota", StateCities: ["Minneapolis", "Saint Paul"] },
            { StateName: "Mississippi", StateCities: ["Jackson", "Biloxi"] },
            { StateName: "Missouri", StateCities: ["Kansas City", "St. Louis"] },
            { StateName: "Montana", StateCities: ["Billings", "Missoula"] },
            { StateName: "Nebraska", StateCities: ["Omaha", "Lincoln"] },
            { StateName: "Nevada", StateCities: ["Las Vegas", "Reno"] },
            { StateName: "New Hampshire", StateCities: ["Manchester", "Concord"] },
            { StateName: "New Jersey", StateCities: ["Newark", "Jersey City"] },
            { StateName: "New Mexico", StateCities: ["Albuquerque", "Santa Fe"] },
            { StateName: "New York", StateCities: ["New York City", "Buffalo"] },
            { StateName: "North Carolina", StateCities: ["Charlotte", "Raleigh"] },
            { StateName: "North Dakota", StateCities: ["Fargo", "Bismarck"] },
            { StateName: "Ohio", StateCities: ["Columbus", "Cleveland"] },
            { StateName: "Oklahoma", StateCities: ["Oklahoma City", "Tulsa"] },
            { StateName: "Oregon", StateCities: ["Portland", "Eugene"] },
            { StateName: "Pennsylvania", StateCities: ["Philadelphia", "Pittsburgh"] },
            { StateName: "Rhode Island", StateCities: ["Providence", "Warwick"] },
            { StateName: "South Carolina", StateCities: ["Charleston", "Columbia"] },
            { StateName: "South Dakota", StateCities: ["Sioux Falls", "Rapid City"] },
            { StateName: "Tennessee", StateCities: ["Nashville", "Memphis"] },
            { StateName: "Texas", StateCities: ["Houston", "Dallas"] },
            { StateName: "Utah", StateCities: ["Salt Lake City", "Provo"] },
            { StateName: "Vermont", StateCities: ["Burlington", "Montpelier"] },
            { StateName: "Virginia", StateCities: ["Virginia Beach", "Richmond"] },
            { StateName: "Washington", StateCities: ["Seattle", "Spokane"] },
            { StateName: "West Virginia", StateCities: ["Charleston", "Morgantown"] },
            { StateName: "Wisconsin", StateCities: ["Milwaukee", "Madison"] },
            { StateName: "Wyoming", StateCities: ["Cheyenne", "Casper"] },
        ]
    },
    {
        CountryName: "Canada",
        CountryStates: [
            { StateName: "Alberta", StateCities: ["Calgary", "Edmonton"] },
            { StateName: "British Columbia", StateCities: ["Vancouver", "Victoria"] },
            { StateName: "Manitoba", StateCities: ["Winnipeg", "Brandon"] },
            { StateName: "New Brunswick", StateCities: ["Fredericton", "Moncton"] },
            { StateName: "Newfoundland and Labrador", StateCities: ["St. John's", "Corner Brook"] },
            { StateName: "Nova Scotia", StateCities: ["Halifax", "Sydney"] },
            { StateName: "Ontario", StateCities: ["Toronto", "Ottawa"] },
            { StateName: "Prince Edward Island", StateCities: ["Charlottetown", "Summerside"] },
            { StateName: "Quebec", StateCities: ["Montreal", "Quebec City"] },
            { StateName: "Saskatchewan", StateCities: ["Saskatoon", "Regina"] },
        ]
    },
    {
        CountryName: "Australia",
        CountryStates: [
            { StateName: "Australian Capital Territory", StateCities: ["Canberra", "Belconnen"] },
            { StateName: "New South Wales", StateCities: ["Sydney", "Newcastle"] },
            { StateName: "Northern Territory", StateCities: ["Darwin", "Alice Springs"] },
            { StateName: "Queensland", StateCities: ["Brisbane", "Gold Coast"] },
            { StateName: "South Australia", StateCities: ["Adelaide", "Mount Gambier"] },
            { StateName: "Tasmania", StateCities: ["Hobart", "Launceston"] },
            { StateName: "Victoria", StateCities: ["Melbourne", "Geelong"] },
            { StateName: "Western Australia", StateCities: ["Perth", "Fremantle"] },
        ]
    }
];
const ContractorList : Contractor[] = [
    {
        ContractorID: 0,
        ContractorName: "Jamieson",
        ContractorRepresents: "Jamieson & Trucking",
        ContractorPhone: "0 000 000 000",
        ContractorMobile: "0 000 000 001",
        ContractorEmail: "Jamieson@email.com",
        ContractorLocation: {
            LocationCountry: "Australia",
            LocationState : "Australian Capital Territory",
            LocationCity: "Canberra",
            LocationAddress: "18 street street"
        }
    },
    {
        ContractorID: 1,
        ContractorName: "Davidson",
        ContractorRepresents: "AloneAh",
        ContractorPhone: "0 000 000 000",
        ContractorMobile: "0 000 000 001",
        ContractorEmail: "Jamieson@email.com",
        ContractorLocation: {
            LocationCountry: "Canada",
            LocationState : "Alberta",
            LocationCity:"Calgary",
            LocationAddress: "Lucky blvd"
        }
    },
    {
        ContractorID: 2,
        ContractorName: "Warlock",
        ContractorRepresents: "Multiplex logistics",
        ContractorPhone: "0 000 000 000",
        ContractorMobile: "0 000 000 001",
        ContractorEmail: "Jamieson@email.com",
        ContractorLocation: {
            LocationCountry: "United States",
            LocationState : "Alabama",
            LocationCity:"Birmingham",
            LocationAddress: "Lets Rock Lane"
        }
    },
];
const Ships: ShipType[] = [
    // US to Canada
    {
        ShippingID: 0,
        ShipName: "Anabalastier",
        ShippingContractor: {
            ContractorID: 0,
            ContractorName: "Rickson Morters",
            ContractorRepresents: "Forsoon",
            ContractorEmail: "forsoon@email.com",
            ContractorPhone: "00 000 000 000",
            ContractorMobile: "00 000 000 000",
            ContractorLocation: null
        },
        ShippingProducts: null,
        ShippingCurrRoute: {
            RouteID: 0,
            RouteFrom: {
                PortID: 0,
                PortLocation: {
                    LocationCountry: "United States",
                    LocationState: "New York",
                    LocationCity: "Buffalo",
                    LocationAddress: ""
                }
            },
            RouteTo: {
                PortID: 1,
                PortLocation: {
                    LocationCountry: "Canada",
                    LocationState: "Ontario",
                    LocationCity: "Toronto",
                    LocationAddress: ""
                }
            },
            RouteLength: 2,
            RouteOceans: []
        }
    },
    // Canada to Australia
    {
        ShippingID: 1,
        ShipName: "Honest Mary",
        ShippingContractor: {
            ContractorID: 1,
            ContractorName: "Maple Haul",
            ContractorRepresents: "CanTrans",
            ContractorEmail: "cantrans@email.com",
            ContractorPhone: "11 111 111 111",
            ContractorMobile: "11 111 111 111",
            ContractorLocation: null
        },
        ShippingProducts: null,
        ShippingCurrRoute: {
            RouteID: 1,
            RouteFrom: {
                PortID: 2,
                PortLocation: {
                    LocationCountry: "Canada",
                    LocationState: "British Columbia",
                    LocationCity: "Vancouver",
                    LocationAddress: ""
                }
            },
            RouteTo: {
                PortID: 3,
                PortLocation: {
                    LocationCountry: "Australia",
                    LocationState: "New South Wales",
                    LocationCity: "Sydney",
                    LocationAddress: ""
                }
            },
            RouteLength: 5,
            RouteOceans: []
        }
    },
    // Australia to US
    {
        ShippingID: 2,
        ShipName: "Fell Omen",
        ShippingContractor: {
            ContractorID: 2,
            ContractorName: "Koala Shipping",
            ContractorRepresents: "OzTrans",
            ContractorEmail: "oztrans@email.com",
            ContractorPhone: "22 222 222 222",
            ContractorMobile: "22 222 222 222",
            ContractorLocation: null
        },
        ShippingProducts: null,
        ShippingCurrRoute: {
            RouteID: 2,
            RouteFrom: {
                PortID: 4,
                PortLocation: {
                    LocationCountry: "Australia",
                    LocationState: "Victoria",
                    LocationCity: "Melbourne",
                    LocationAddress: ""
                }
            },
            RouteTo: {
                PortID: 5,
                PortLocation: {
                    LocationCountry: "United States",
                    LocationState: "California",
                    LocationCity: "Los Angeles",
                    LocationAddress: ""
                }
            },
            RouteLength: 4,
            RouteOceans: []
        }
    },
    // Canada to US (new route)
    {
        ShippingID: 3,
        ShipName: "Moose and Tractor",
        ShippingContractor: {
            ContractorID: 3,
            ContractorName: "Northern Freight",
            ContractorRepresents: "GreatLakes Express",
            ContractorEmail: "nfreight@email.com",
            ContractorPhone: "33 333 333 333",
            ContractorMobile: "33 333 333 333",
            ContractorLocation: null
        },
        ShippingProducts: null,
        ShippingCurrRoute: {
            RouteID: 3,
            RouteFrom: {
                PortID: 6,
                PortLocation: {
                    LocationCountry: "Canada",
                    LocationState: "Quebec",
                    LocationCity: "Montreal",
                    LocationAddress: ""
                }
            },
            RouteTo: {
                PortID: 7,
                PortLocation: {
                    LocationCountry: "United States",
                    LocationState: "Vermont",
                    LocationCity: "Burlington",
                    LocationAddress: ""
                }
            },
            RouteLength: 3,
            RouteOceans: []
        }
    }
];