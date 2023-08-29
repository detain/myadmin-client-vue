import { ServiceType } from './view-service-common';

export interface SearchDomainResult {
    'continue': boolean;
    currencySymbol: string;
    domain: string;
    domain_type: string;
    domain_result: DomainResult;
    errors: string[];
    lookups: Lookups;
    lookups_old: LookupsOld;
    package_info: ServiceType;
    suggestions: Suggestions;
}

export interface DomainResult extends SuggestionRow {
    raw: {
        cost: number;
        'new': number;
        renewal: number;
        transfer: number;
    }
}

export interface Lookups {
    items: {
        [key: number]: SuggestionRow;
    }
}

export interface LookupsOld {
    count: number;
    is_success: number;
    items: {
        [key: number]: SuggestionRow;
    }
    response_code: number;
    response_text: string;
}

export interface Suggestions {
    items: SuggestionRow[];
}

export interface SuggestionRow {
    cost     : string;
    domain   : string;
    id       : number;
    'new'    : string;
    renewal  : string;
    status   : string;
    tld      : string;
    transfer : string;
    premium ?: string;
}

export interface DomainFieldsResponse {
    domainFields: DomainFields;
}

export interface DomainFields {
    [key: string]: DomainField;
}

export interface DomainField {
    validations : string[];
    value       : string;
    label       : string;
    input       : string | DomainFieldInputArray;
    required    : boolean;
    tip        ?: string;
}

type DomainFieldInputArray = [string, DomainFieldSelectValues];

export interface DomainFieldSelectValues {
    [key: string]: string;
}
