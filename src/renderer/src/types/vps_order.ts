import { ServiceTypes } from './view-service-common.ts';

export interface CouponInfo {
    applies?: number | string;
    type?: number | string;
    amount?: number | string;
    onetime?: number | string;
    usable?: number | string;
    used?: number | string;
    amounts?: {
        [key: string]: number | string;
    };
}

export interface VpsOrderResponse {
    bwSlice: number;
    bwTotal: number;
    bwType: number;
    cpanelCost: number;
    currency: string;
    currencySymbol: string;
    daCost: number;
    hdSlice: number;
    hdStorageSlice: number;
    locationNames: LocationNames;
    locationStock: LocationStock;
    maxSlices: number;
    osNames: OsNames;
    packageCosts: PackageCosts;
    platformNames: PlatformNames;
    platformPackages: PlatformPackages;
    ramSlice: number;
    serviceTypes: ServiceTypes;
    templates: Templates;
    vpsNyCost: number;
    vpsSliceHypervCost: number;
    vpsSliceKvmLCost: number;
    vpsSliceKvmStorageCost: number;
    vpsSliceKvmWCost: number;
    vpsSliceLxcCost: number;
    vpsSliceOvzCost: number;
    vpsSliceSsdOvzCost: number;
    vpsSliceSsdVirtuozzoCost: number;
    vpsSliceVirtuozzoCost: number;
    vpsSliceVmwareCost: number;
    vpsSliceXenCost: number;
}

export interface PlatformPackages {
    [key: string]: number;
}

export interface PlatformNames {
    [key: string]: string;
}

export interface PackageCosts {
    [key: number]: number;
}

export interface LocationStock {
    [key: number]: {
        [key: string]: boolean;
    };
}

export interface LocationNames {
    [key: number]: string;
}

export interface OsNames {
    [key: string]: string;
}

export interface Templates {
    [key: string]: {
        [key: string]: {
            [key: string]: string;
        };
    };
}
