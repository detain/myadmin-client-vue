// test/visual/mocks/visualHandlers.ts — Extended MSW handlers for visual regression tests
// Builds on src/mocks/handlers.ts with populated data for all pages
import { http, HttpResponse } from 'msw';
import { handlers as baseHandlers } from '@/mocks/handlers';

const BASE_URL = 'https://my.interserver.net/apiv2';

// Module metadata needed by siteStore.checkInfoLoaded()
const modulesMeta = {
    vps: { SERVICE_ID_OFFSET: 10000, TABLE: 'vps', TITLE: 'VPS', PREFIX: 'vps', TITLE_FIELD: 'vps_hostname' },
    domains: { SERVICE_ID_OFFSET: 20000, TABLE: 'domains', TITLE: 'Domains', PREFIX: 'domain', TITLE_FIELD: 'domain_hostname' },
    servers: { SERVICE_ID_OFFSET: 30000, TABLE: 'servers', TITLE: 'Dedicated Servers', PREFIX: 'server', TITLE_FIELD: 'server_hostname' },
    websites: { SERVICE_ID_OFFSET: 80000, TABLE: 'websites', TITLE: 'Web Hosting', PREFIX: 'website', TITLE_FIELD: 'website_hostname' },
    licenses: { SERVICE_ID_OFFSET: 40000, TABLE: 'licenses', TITLE: 'Licenses', PREFIX: 'license', TITLE_FIELD: 'license_ip' },
    ssl: { SERVICE_ID_OFFSET: 50000, TABLE: 'ssl', TITLE: 'SSL Certificates', PREFIX: 'ssl', TITLE_FIELD: 'ssl_hostname' },
    mail: { SERVICE_ID_OFFSET: 60000, TABLE: 'mail', TITLE: 'Mail', PREFIX: 'mail', TITLE_FIELD: 'mail_username' },
    backups: { SERVICE_ID_OFFSET: 70000, TABLE: 'backups', TITLE: 'Storage', PREFIX: 'backup', TITLE_FIELD: 'backup_username' },
    quickservers: { SERVICE_ID_OFFSET: 90000, TABLE: 'quickservers', TITLE: 'Rapid Deploy Servers', PREFIX: 'qs', TITLE_FIELD: 'qs_hostname' },
    floating_ips: { SERVICE_ID_OFFSET: 100000, TABLE: 'floating_ips', TITLE: 'Floating IPs', PREFIX: 'floating_ip', TITLE_FIELD: 'floating_ip_ip' },
    scrub_ips: { SERVICE_ID_OFFSET: 110000, TABLE: 'scrub_ips', TITLE: 'Scrub IPs', PREFIX: 'scrub_ip', TITLE_FIELD: 'scrub_ip_ip' },
    dns: { SERVICE_ID_OFFSET: 0, TABLE: 'dns', TITLE: 'DNS Manager', PREFIX: 'dns', TITLE_FIELD: 'dns_hostname' },
};

// Shared billing detail template for service detail pages
const billingDetails = {
    service_last_invoice_date: '2024-01-15',
    service_payment_status: 'paid',
    service_frequency: 'Monthly',
    next_date: '2024-02-15',
    service_next_invoice_date: '2024-02-15',
    service_currency: 'USD',
    service_currency_symbol: '$',
    service_cost_info: '$10.00/month',
    service_extra: {},
};

/**
 * Visual-test-specific handlers that override base handlers where needed.
 * Order matters: these are checked first, base handlers are fallbacks.
 */
const visualOverrides = [
    // ==================== Site Info (populated) ====================
    http.get(`${BASE_URL}/info`, () => {
        return HttpResponse.json({
            modules: modulesMeta,
            services: {},
            serviceTypes: {},
            serviceCategories: {},
        });
    }),

    // ==================== Home / Dashboard ====================
    http.get(`${BASE_URL}/home`, () => {
        return HttpResponse.json({
            last_login_ip: '192.168.1.100',
            last_login: '2024-01-15 10:30:00',
            currency: 'USD',
            amount: '150.00',
            balance: '50.00',
            invoice_list: '3',
            full_name: 'Test User',
            email: 'test@example.com',
            tickets: [
                { ticketid: '1', subject: 'Server Migration', ticketstatustitle: 'Open', lastactivity: '2024-01-14' },
            ],
            ticketStatus: { Open: 1, Closed: 5 },
            ticketStatusView: {},
            details: { modules: modulesMeta },
            services: {
                vps: { count: 3, links: {} },
                domains: { count: 2, links: {} },
                servers: { count: 1, links: {} },
                websites: { count: 2, links: {} },
                ssl: { count: 1, links: {} },
                licenses: { count: 2, links: {} },
            },
            AFFILIATE_AMOUNT: '25.00',
        });
    }),

    // ==================== Domain Detail ====================
    http.get(`${BASE_URL}/domains/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                domain_id: Number(params.id), domain_hostname: 'example.com', domain_status: 'active',
                domain_expire_date: '2025-12-31', domain_registrar: 'InterServer',
                domain_address: '123 Test St', domain_city: 'Testville', domain_state: 'NJ',
                domain_zip: '07001', domain_country: 'US', domain_phone: '555-1234',
                domain_fax: '', domain_email: 'admin@example.com',
            },
            billingDetails,
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { domain_id: 1, domain_hostname: 'node1' },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'domains',
        });
    }),

    // ==================== Server Detail ====================
    http.get(`${BASE_URL}/servers/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                server_id: Number(params.id), server_hostname: 'dedicated1.example.com', server_status: 'active',
                server_ip: '10.0.0.1', server_root: 'root', server_os: 'Ubuntu 22.04',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$99.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { server_id: 1, server_name: 'node1' },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'servers',
            bandwidth_xaxis: [], bandwidth_yaxis: [],
        });
    }),

    // ==================== Website Detail ====================
    http.get(`${BASE_URL}/websites/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                website_id: Number(params.id), website_hostname: 'mysite.com', website_status: 'active',
                website_ip: '10.0.0.50', website_server_hostname: 'web1.example.com',
                website_username: 'mysite', website_type: 'cPanel',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$5.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { website_id: 1, website_name: 'web1' },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'websites',
        });
    }),

    // ==================== License Detail ====================
    http.get(`${BASE_URL}/licenses/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                license_id: Number(params.id), license_ip: '10.0.0.1', license_status: 'active',
                license_hostname: 'lic1.example.com', license_type: 'cPanel',
                license_extra: '',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$15.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { license_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'licenses',
        });
    }),

    // ==================== SSL Detail ====================
    http.get(`${BASE_URL}/ssl/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                ssl_id: Number(params.id), ssl_hostname: 'secure.example.com', ssl_status: 'active',
                ssl_order_id: 'SSL-001', ssl_type: 'PositiveSSL',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$8.00/year', service_frequency: 'Yearly' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { ssl_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'ssl',
        });
    }),

    // ==================== Mail Detail ====================
    http.get(`${BASE_URL}/mail/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                mail_id: Number(params.id), mail_username: 'user@example.com', mail_status: 'active',
                mail_ip: '10.0.0.60', mail_type: 'Mail Baby',
            },
            billingDetails,
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { mail_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'mail',
        });
    }),

    // ==================== Backup Detail ====================
    http.get(`${BASE_URL}/backups/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                backup_id: Number(params.id), backup_username: 'backup1', backup_status: 'active',
                backup_ip: '10.0.0.70', backup_type: 'Storage VPS',
            },
            billingDetails,
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { backup_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'backups',
        });
    }),

    // ==================== Quick Server Detail ====================
    http.get(`${BASE_URL}/qs/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                qs_id: Number(params.id), qs_hostname: 'qs1.example.com', qs_status: 'active',
                qs_ip: '10.0.0.90', qs_os: 'Ubuntu 22.04',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$30.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { qs_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'quickservers',
        });
    }),

    // ==================== Floating IP Detail ====================
    http.get(`${BASE_URL}/floating_ips/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                floating_ip_id: Number(params.id), floating_ip_ip: '10.0.0.100', floating_ip_status: 'active',
                floating_ip_target_ip: '192.168.1.50',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$3.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { floating_ip_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'floating_ips',
        });
    }),

    // ==================== Scrub IP Detail ====================
    http.get(`${BASE_URL}/scrub_ips/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                scrub_ip_id: Number(params.id), scrub_ip_ip: '10.0.0.200', scrub_ip_status: 'active',
                scrub_ip_target_ip: '192.168.1.100',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$5.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { scrub_ip_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            module: 'scrub_ips',
        });
    }),

    // ==================== DNS ====================
    http.get(`${BASE_URL}/dns`, () => {
        return HttpResponse.json([
            { dns_id: 101, dns_hostname: 'example.com', dns_type: 'master', dns_status: 'active' },
            { dns_id: 102, dns_hostname: 'test.org', dns_type: 'master', dns_status: 'active' },
        ]);
    }),

    http.get(`${BASE_URL}/dns/:id`, ({ params }) => {
        return HttpResponse.json({
            domain: { dns_id: Number(params.id), dns_hostname: 'example.com', dns_type: 'master' },
            records: [
                { id: 1, name: 'example.com', type: 'A', content: '93.184.216.34', ttl: 3600, prio: 0 },
                { id: 2, name: 'example.com', type: 'MX', content: 'mail.example.com', ttl: 3600, prio: 10 },
                { id: 3, name: 'www.example.com', type: 'CNAME', content: 'example.com', ttl: 3600, prio: 0 },
                { id: 4, name: 'example.com', type: 'NS', content: 'ns1.interserver.net', ttl: 86400, prio: 0 },
                { id: 5, name: 'example.com', type: 'NS', content: 'ns2.interserver.net', ttl: 86400, prio: 0 },
            ],
        });
    }),

    // ==================== Billing ====================
    http.get(`${BASE_URL}/billing/prepays`, () => {
        return HttpResponse.json({
            custid: 1,
            balance: '50.00',
            currency: 'USD',
            prepays: [
                { id: 1, date: '2024-01-01', amount: '100.00', remaining: '50.00', type: 'Manual' },
            ],
        });
    }),

    http.get(`${BASE_URL}/billing/payment_types`, () => {
        return HttpResponse.json({
            custid: 1,
            payment_types: [
                { id: 1, type: 'cc', name: 'Visa ending in 4242', is_default: true },
            ],
        });
    }),

    http.get(`${BASE_URL}/billing/cart`, () => {
        return HttpResponse.json({
            items: [],
            total: '0.00',
            currency: 'USD',
        });
    }),

    // ==================== Ticket Detail ====================
    http.get(`${BASE_URL}/tickets/:id`, ({ params }) => {
        return HttpResponse.json({
            ticket: {
                ticketid: params.id, ticketmaskid: `TKT-${params.id}`, subject: 'Server Migration Request',
                ticketstatustitle: 'Open', prioritytitle: 'Normal', departmenttitle: 'Technical Support',
                fullname: 'Test User', email: 'test@example.com', created: '2024-01-10 09:00:00',
            },
            replies: [
                { id: 1, fullname: 'Test User', message: 'I need help migrating my server.', date: '2024-01-10 09:00:00', type: 'client' },
                { id: 2, fullname: 'Support Agent', message: 'We can help with that. Let me check your account.', date: '2024-01-10 10:30:00', type: 'staff' },
            ],
        });
    }),

    // ==================== Users ====================
    http.get(`${BASE_URL}/users`, () => {
        return HttpResponse.json([
            { id: 1, login: 'testuser', name: 'Test User', email: 'test@example.com', role: 'admin', status: 'active' },
            { id: 2, login: 'staffuser', name: 'Staff User', email: 'staff@example.com', role: 'user', status: 'active' },
        ]);
    }),

    http.get(`${BASE_URL}/users/:id`, ({ params }) => {
        return HttpResponse.json({
            id: Number(params.id), login: 'testuser', name: 'Test User',
            email: 'test@example.com', role: 'admin', status: 'active',
        });
    }),

    // ==================== Account ====================
    http.get(`${BASE_URL}/account/settings`, () => {
        return HttpResponse.json({
            settings: {
                language: 'en-US',
                timezone: 'America/New_York',
                notifications: true,
            },
        });
    }),

    // ==================== Affiliate ====================
    http.get(`${BASE_URL}/affiliate`, () => {
        return HttpResponse.json({
            affiliate_id: 1,
            total_sales: '1250.00',
            total_commission: '125.00',
            pending_commission: '25.00',
            paid_commission: '100.00',
            referral_url: 'https://my.interserver.net/r/testuser',
            signups: 15,
        });
    }),

    http.get(`${BASE_URL}/affiliate/banners`, () => {
        return HttpResponse.json([
            { id: 1, name: 'VPS Banner 728x90', size: '728x90', url: 'https://via.placeholder.com/728x90?text=VPS+Hosting' },
            { id: 2, name: 'Web Hosting 300x250', size: '300x250', url: 'https://via.placeholder.com/300x250?text=Web+Hosting' },
        ]);
    }),

    http.get(`${BASE_URL}/affiliate/banners/:id`, ({ params }) => {
        return HttpResponse.json({
            id: Number(params.id), name: 'VPS Banner 728x90', size: '728x90',
            url: 'https://via.placeholder.com/728x90?text=VPS+Hosting',
            html: '<a href="#"><img src="https://via.placeholder.com/728x90?text=VPS+Hosting" /></a>',
        });
    }),

    http.get(`${BASE_URL}/affiliate/signups`, () => {
        return HttpResponse.json({
            signups: [
                { id: 1, date: '2024-01-10', amount: '10.00', status: 'approved' },
                { id: 2, date: '2024-01-12', amount: '15.00', status: 'pending' },
            ],
        });
    }),

    http.get(`${BASE_URL}/affiliate/sales_graph`, () => {
        return HttpResponse.json({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [150, 200, 180, 250, 300, 175],
        });
    }),

    http.get(`${BASE_URL}/affiliate/traffic_graph`, () => {
        return HttpResponse.json({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [500, 600, 550, 700, 800, 650],
        });
    }),

    http.get(`${BASE_URL}/affiliate/web_traffic`, () => {
        return HttpResponse.json({
            traffic: [
                { date: '2024-01-15', hits: 150, unique: 120, referrer: 'google.com' },
                { date: '2024-01-14', hits: 130, unique: 100, referrer: 'direct' },
            ],
        });
    }),

    // ==================== Order endpoints (return available packages) ====================
    http.get(`${BASE_URL}/vps/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'VPS Slice 1', cost: '6.00', ram: '1024', disk: '25', cpu: 1 },
                { id: 2, name: 'VPS Slice 2', cost: '12.00', ram: '2048', disk: '50', cpu: 2 },
                { id: 3, name: 'VPS Slice 4', cost: '24.00', ram: '4096', disk: '100', cpu: 4 },
            ],
            os_list: ['Ubuntu 22.04', 'CentOS 9', 'Debian 12', 'Windows Server 2022'],
        });
    }),

    http.get(`${BASE_URL}/domains/order`, () => {
        return HttpResponse.json({
            tlds: [
                { tld: '.com', register: '8.99', transfer: '8.99', renew: '8.99' },
                { tld: '.net', register: '10.99', transfer: '10.99', renew: '10.99' },
                { tld: '.org', register: '9.99', transfer: '9.99', renew: '9.99' },
            ],
        });
    }),

    http.get(`${BASE_URL}/servers/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Intel Xeon E3', cost: '49.00', ram: '16GB', disk: '500GB SSD', cpu: 'E3-1230' },
                { id: 2, name: 'Intel Xeon E5', cost: '99.00', ram: '32GB', disk: '1TB SSD', cpu: 'E5-2620' },
            ],
        });
    }),

    http.get(`${BASE_URL}/websites/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Web Hosting Basic', cost: '2.00', disk: '10GB', bandwidth: '100GB' },
                { id: 2, name: 'Web Hosting Pro', cost: '5.00', disk: '50GB', bandwidth: 'Unlimited' },
            ],
        });
    }),

    http.get(`${BASE_URL}/licenses/order`, () => {
        return HttpResponse.json({
            categories: [
                { tag: 'cpanel', name: 'cPanel', packages: [{ id: 1, name: 'cPanel Admin', cost: '15.00' }] },
                { tag: 'directadmin', name: 'DirectAdmin', packages: [{ id: 2, name: 'DirectAdmin', cost: '5.00' }] },
                { tag: 'litespeed', name: 'LiteSpeed', packages: [{ id: 3, name: 'LiteSpeed Web Server', cost: '12.00' }] },
            ],
        });
    }),

    http.get(`${BASE_URL}/ssl/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'PositiveSSL', cost: '7.99', type: 'DV', warranty: '$10,000' },
                { id: 2, name: 'EssentialSSL', cost: '19.99', type: 'DV', warranty: '$10,000' },
            ],
        });
    }),

    http.get(`${BASE_URL}/mail/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Mail Baby', cost: '1.00', mailboxes: 'Unlimited' },
                { id: 2, name: 'Mail Pro', cost: '5.00', mailboxes: 'Unlimited' },
            ],
        });
    }),

    http.get(`${BASE_URL}/backups/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Storage 250GB', cost: '6.00', disk: '250GB' },
                { id: 2, name: 'Storage 500GB', cost: '12.00', disk: '500GB' },
            ],
        });
    }),

    http.get(`${BASE_URL}/floating_ips/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Floating IP', cost: '3.00' },
            ],
        });
    }),

    http.get(`${BASE_URL}/qs/order`, () => {
        return HttpResponse.json({
            packages: [
                { id: 1, name: 'Rapid Deploy 1', cost: '30.00', ram: '8GB', disk: '100GB SSD' },
                { id: 2, name: 'Rapid Deploy 2', cost: '60.00', ram: '16GB', disk: '200GB SSD' },
            ],
        });
    }),
];

// Visual handlers = overrides first (checked first by MSW), then base handlers as fallback
export const visualHandlers = [...visualOverrides, ...baseHandlers];
