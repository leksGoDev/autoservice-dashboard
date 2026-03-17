import type { Vehicle } from "@/entities/vehicle/model/types";

export const vehiclesFixture: Vehicle[] = [
  {
    id: "veh_001",
    customerId: "cust_001",
    vin: "1HGCM82633A123001",
    plateNumber: "TX-1842",
    make: "Honda",
    model: "Accord",
    year: 2019,
  },
  {
    id: "veh_002",
    customerId: "cust_002",
    vin: "1N4AL3AP2JC123002",
    plateNumber: "CA-6631",
    make: "Nissan",
    model: "Altima",
    year: 2018,
  },
  {
    id: "veh_003",
    customerId: "cust_003",
    vin: "2FTRX18W1XCA12303",
    plateNumber: "WA-4427",
    make: "Ford",
    model: "F-150",
    year: 2020,
  },
  {
    id: "veh_004",
    customerId: "cust_004",
    vin: "WBA8E9G55GNU12304",
    plateNumber: "NY-7784",
    make: "BMW",
    model: "330i",
    year: 2021,
  },
  {
    id: "veh_005",
    customerId: "cust_005",
    vin: "5YJSA1E26JF123005",
    plateNumber: "NV-2914",
    make: "Tesla",
    model: "Model S",
    year: 2022,
  },
];
