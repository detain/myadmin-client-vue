export interface HomeResponse {
    last_login_ip: string;
    last_login: string;
    currency: string;
    amount: string;
    invoice_list: string;
    balance: string;
    full_name: string;
    email: string;
    tickets: HomeTicket[];
    data: any;
    ticketStatus: HomeTicketStatus;
    ticketStatusView: HomeTicketStatusView;
    details: HomeDetails;
    services: HomeServices;
    AFFILIATE_AMOUNT: string;
}

export interface HomeDetails {
    modules: {
        [key: string]: {
            icon: string;
            view_link: string;
            heading: string;
            buy_link: string;
            list_link: string;
        };
    };
}

export interface HomeTicket {
    ticketid: number;
    ticketstatusid: number;
    ticketmaskid: string;
    subject: string;
    lastreplier: string;
}

export interface HomeTicketStatus {
    [key: string]: number;
}

export interface HomeTicketStatusView {
    [key: number]: string;
}

export interface HomeServices {
    [key: string]: HomeServices;
}

