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

    // ==================== Order endpoints MUST come before /:id detail handlers ====================
    // (MSW matches /:id patterns against /order if order handlers are listed after)

    http.get(`${BASE_URL}/vps/order`, () => {
        return HttpResponse.json({
            maxSlices: 16, hdStorageSlice: 1000, cpanelCost: 20, daCost: 8, bwType: 2, bwTotal: 2, bwSlice: 2000, hdSlice: 30, ramSlice: 2048,
            platformPackages: { kvm: 32, kvmstorage: 57, hyperv: 54 },
            platformNames: { kvm: 'KVM', kvmstorage: 'KVM Storage', hyperv: 'HyperV' },
            packageCosts: { 32: 10, 54: 10, 57: 6 },
            locationStock: { 1: { kvm: true, kvmstorage: true, hyperv: true }, 2: { kvm: true, kvmstorage: false, hyperv: true } },
            locationNames: { 1: 'New Jersey', 2: 'Los Angeles' },
            osNames: { ubuntu: 'Ubuntu', centos: 'CentOS', windows: 'Windows' },
            templates: {
                kvm: { ubuntu: { 'ubuntu-22.04': 'Ubuntu 22.04', 'ubuntu-20.04': 'Ubuntu 20.04' }, centos: { 'centos-9': 'CentOS 9' } },
                kvmstorage: { ubuntu: { 'ubuntu-22.04': 'Ubuntu 22.04' } },
                hyperv: { windows: { Windows2019Standard: '2019 Standard', Windows2022: '2022' } },
            },
            serviceTypes: {}, vpsSliceSsdOvzCost: 6, vpsSliceOvzCost: 6, vpsSliceSsdVirtuozzoCost: 6, vpsSliceVirtuozzoCost: 6,
            vpsSliceHypervCost: 10, vpsSliceVmwareCost: 6, vpsSliceLxcCost: 6, vpsSliceXenCost: 6, vpsSliceKvmLCost: 6,
            vpsSliceKvmStorageCost: 6, vpsNyCost: 3, vpsSliceKvmWCost: 10, currency: 'USD', currencySymbol: '$',
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
            cpu: '34',
            cpu_li: { 34: { cpu_id: 34, cpu_description: 'Intel Xeon E3-1230', cpu_cores: 4, max_lff: 2, max_sff: 4, max_nve: 1 } },
            cpu_cores: { 34: { 1: { id: 1, core_id: 1, core_count: 4, num_cpus: 1, num_cores: 4, short_desc: 'Intel Xeon E3-1230', img: 'intel.png', memory_det: { short_desc: '16GB DDR4' } } } },
            config_ids: { cpu: 34, memory: 1, hd: 1, bandwidth: 1, ips: 1, os: 1, cp: 0, raid: 0 },
            config_li: {
                cpu_li: { 34: { cpu_id: 34, cpu_description: 'Intel Xeon E3-1230', cpu_cores: 4, max_lff: 2, max_sff: 4, max_nve: 1 } },
                memory_li: { 34: { 1: { memory_id: 1, memory_description: '16GB DDR4', memory_amount: 16, memory_cost: 0 } } },
                hd_li: { 34: { 1: { hd_id: 1, hd_description: '500GB SSD', hd_cost: 0, hd_type: 'sff' } } },
                bandwidth_li: { 1: { bandwidth_id: 1, bandwidth_description: '100Mbps Unmetered', bandwidth_cost: 0 } },
                ips_li: { 1: { ips_id: 1, ips_description: '1 IP', ips_cost: 0 } },
                os_li: { 1: { os_id: 1, os_description: 'Ubuntu 22.04', os_image: 'ubuntu.png', os_cost: 0, types: [1] }, 2: { os_id: 2, os_description: 'CentOS 9', os_image: 'centos.png', os_cost: 0, types: [1] } },
                cp_li: { 0: { cp_id: 0, cp_description: 'No Control Panel', cp_cost: 0, types: [1, 2] } },
                raid_li: { 0: { raid_id: 0, raid_description: 'No RAID', raid_cost: 0 } },
            },
            field_label: { bandwidth: { name: 'Bandwidth', active: 1 }, ips: { name: 'IPs', active: 0 }, os: { name: 'Operating System', active: 1 }, cp: { name: 'Control Panel', active: 0 }, raid: { name: 'Raid' }, memory: { name: 'Memory' }, hd: { name: 'Hard Drives' } },
            form_values: { cpu: '34', memory: '1', hd: '1', bandwidth: '1', ips: '1', os: '1', cp: '0', raid: '0', region: '1' },
            asset_servers: [], buy_it_servers: [], country: 'US', currency: 'USD', currencySymbol: '$', cust_discount: 0, custid: 1,
            display_showmore: 'no', frequency: 1, ima: 'client',
            regions: [{ region_id: 1, region_name: 'New Jersey' }, { region_id: 2, region_name: 'Los Angeles' }],
            step: 'order_form',
        });
    }),

    http.get(`${BASE_URL}/websites/order`, () => {
        return HttpResponse.json({
            currencySymbol: '$', step: 'order_form', website: '', period: 1, serviceOfferId: 0,
            serviceTypes: {
                11363: { services_id: 11363, services_name: 'Web Hosting Standard', services_cost: '2.50', services_category: 300, services_buyable: '1', services_type: 1, services_html: '', services_description: 'Standard hosting plan', services_moreinfo_url: '' },
                11364: { services_id: 11364, services_name: 'Web Hosting Premium', services_cost: '5.00', services_category: 300, services_buyable: '1', services_type: 1, services_html: '', services_description: 'Premium hosting plan', services_moreinfo_url: '' },
            },
            serviceOffers: {
                11363: [{ service_offer_id: 1, service_offer_name: '1 Month', service_offer_period: 1, service_offer_price: '2.50' }],
                11364: [{ service_offer_id: 2, service_offer_name: '1 Month', service_offer_period: 1, service_offer_price: '5.00' }],
            },
            packges: {
                11363: { services_id: 11363, services_name: 'Web Hosting Standard', services_cost: '2.50', services_category: 300, services_buyable: '1', services_type: 1, services_html: '<b>Standard</b>', services_description: 'Standard hosting plan', services_moreinfo_url: '' },
                11364: { services_id: 11364, services_name: 'Web Hosting Premium', services_cost: '5.00', services_category: 300, services_buyable: '1', services_type: 1, services_html: '<b>Premium</b>', services_description: 'Premium hosting plan', services_moreinfo_url: '' },
            },
            enableDomainRegistering: {}, jsonServices: {}, jsonServiceOffers: {},
        });
    }),

    http.get(`${BASE_URL}/licenses/order`, () => {
        return HttpResponse.json({ categories: [
            { tag: 'cpanel', name: 'cPanel', packages: [{ id: 1, name: 'cPanel Admin', cost: '15.00' }] },
            { tag: 'directadmin', name: 'DirectAdmin', packages: [{ id: 2, name: 'DirectAdmin', cost: '5.00' }] },
        ] });
    }),

    http.get(`${BASE_URL}/ssl/order`, () => {
        return HttpResponse.json({ packages: [
            { id: 1, name: 'PositiveSSL', cost: '7.99', type: 'DV', warranty: '$10,000' },
            { id: 2, name: 'EssentialSSL', cost: '19.99', type: 'DV', warranty: '$10,000' },
        ] });
    }),

    http.get(`${BASE_URL}/mail/order`, () => {
        return HttpResponse.json({
            packageCosts: { 10880: 1.0, 10881: 5.0 },
            serviceTypes: {
                10880: { services_id: 10880, services_name: 'Mail Baby', services_cost: '1.00', services_category: 400, services_buyable: '1', services_type: 600 },
                10881: { services_id: 10881, services_name: 'Mail Pro', services_cost: '5.00', services_category: 400, services_buyable: '1', services_type: 600 },
            },
        });
    }),

    http.get(`${BASE_URL}/backups/order`, () => {
        return HttpResponse.json({ packages: [
            { id: 1, name: 'Storage 250GB', cost: '6.00', disk: '250GB' },
            { id: 2, name: 'Storage 500GB', cost: '12.00', disk: '500GB' },
        ] });
    }),

    http.get(`${BASE_URL}/floating_ips/order`, () => {
        return HttpResponse.json({
            packageCosts: { 10920: 3.0, 10921: 5.0 },
            serviceTypes: {
                10920: { services_id: 10920, services_name: 'Floating IP', services_cost: '3.00', services_category: 200, services_buyable: '1', services_type: 500 },
                10921: { services_id: 10921, services_name: 'Floating IP - Premium', services_cost: '5.00', services_category: 200, services_buyable: '1', services_type: 500 },
            },
        });
    }),

    http.get(`${BASE_URL}/qs/order`, () => {
        return HttpResponse.json({
            qs_id: 1,
            server_details: { 1: { cpu: 'Intel Xeon E3-1230', ram: '16GB', hd: '500GB SSD', cores: 4, cost: '30.00' }, 2: { cpu: 'Intel Xeon E5-2620', ram: '32GB', hd: '1TB SSD', cores: 6, cost: '60.00' } },
            templates: {
                Ubuntu: { 1: [['Ubuntu 22.04', 'ubuntu-22.04'], ['Ubuntu 20.04', 'ubuntu-20.04']] },
                CentOS: { 2: [['CentOS 9', 'centos-9']] },
                Debian: { 3: [['Debian 12', 'debian-12']] },
            },
            version: {}, distro_sel: { Ubuntu: 'Ubuntu', CentOS: 'CentOS', Debian: 'Debian' },
        });
    }),

    // ==================== Detail handlers (must come AFTER /order handlers) ====================

    // ==================== Domain Detail ====================
    http.get(`${BASE_URL}/domains/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                domain_id: Number(params.id), domain_hostname: 'example.com', domain_status: 'active',
                domain_expire_date: '2025-12-31', domain_registrar: 'InterServer',
                domain_address: '123 Test St', domain_city: 'Testville', domain_state: 'NJ',
                domain_zip: '07001', domain_country: 'US', domain_phone: '555-1234',
                domain_fax: '', domain_email: 'admin@example.com',
                domain_firstname: 'Test', domain_lastname: 'User', domain_company: 'Test Corp',
                domain_type: 1, domain_order_date: '2024-01-01', domain_custid: 1,
                domain_invoice: 1001, domain_coupon: 0, domain_username: '', domain_password: '',
                domain_address2: '', domain_address3: '',
            },
            billingDetails,
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { domain_id: 1, domain_hostname: 'node1' },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            serviceType: {
                services_id: 20001, services_name: 'Domain Registration', services_cost: 8.99,
                services_category: 100, services_buyable: 1, services_type: 1,
                services_field1: '', services_field2: '', services_module: 'domains',
            },
            serviceTypes: {},
            contact_details: {
                first_name: 'Test', last_name: 'User', org_name: 'Test Corp', status: 'active',
                email: 'admin@example.com', address1: '123 Test St', address2: '', address3: '',
                city: 'Testville', state: 'NJ', postal_code: '07001', country: 'US',
                phone: '555-1234', fax: '',
            },
            pwarning: '',
            transfer_info: '',
            errors: false,
            domain_logs: [],
            allInfo: {},
            registrarStatus: 'active',
            locked: 'locked',
            whoisPrivacy: 'enabled',
            autoRenew: 'enabled',
            package: 'Domain Registration',
            linkDisplay: false,
            module: 'domains',
        });
    }),

    // ==================== Server Detail ====================
    http.get(`${BASE_URL}/servers/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: {
                server_id: Number(params.id), server_hostname: 'dedicated1.example.com', server_status: 'active',
                server_ip: '10.0.0.1', server_root: 'root', server_os: 'Ubuntu 22.04',
                server_custid: 1, server_type: 1, server_currency: 'USD', server_order_date: '2024-01-01',
                server_invoice: 1001, server_coupon: 0, server_dedicated_tag: '0', server_custom_tag: '',
                server_comment: '', server_initial_bill: 0, server_hardware: 0, server_ips: 0,
                server_monthly_bill: 99, server_setup: 0, server_discount: null, server_rep: 0,
                server_date: 1704067200, server_total_cost: 99.0, server_location: null,
                server_hardware_ordered: 0, server_billed: 0, server_welcome_email: 0,
                server_dedicated_cpu: 0, server_dedicated_memory: 0, server_dedicated_hd1: 0,
                server_dedicated_hd2: null, server_dedicated_bandwidth: 0, server_dedicated_ips: 0,
                server_dedicated_os: 0, server_dedicated_cp: null, server_dedicated_raid: 0,
                server_extra: '[]',
            },
            billingDetails: { ...billingDetails, service_cost_info: '$99.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { server_id: 1, server_name: 'node1' },
            client_links: [],
            serviceExtra: {
                assets: {
                    title: 'Assets', size: 2, type: 'table',
                    header: ['Id', 'Hostname', 'Description', 'Location Name', 'Rack Name', 'Status', 'Primary Ipv4', 'Comments'],
                    rows: [],
                },
            },
            extraInfoTables: {},
            ipmiAuth: false,
            ipmiLease: false,
            networkInfo: {
                vlans: {},
                vlans6: {},
                assets: {},
                switchports: {},
            },
            locations: {},
            package: 'Dedicated Server',
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
                license_hostname: 'lic1.example.com', license_type: 1,
                license_extra: '', license_key: 'LIC-12345-ABCDE',
                license_currency: 'USD', license_order_date: '2024-01-01',
                license_custid: 1, license_invoice: 1001, license_coupon: 0,
            },
            billingDetails: { ...billingDetails, service_cost_info: '$15.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { license_id: 1 },
            client_links: [],
            serviceExtra: [''],
            extraInfoTables: {
                ip_info: { title: 'IP Information', rows: [] },
            },
            serviceType: {
                services_id: 40001, services_name: 'cPanel Admin', services_cost: 15.0,
                services_category: 507, services_buyable: 1, services_type: 1,
                services_field1: '', services_field2: '', services_module: 'licenses',
            },
            service_overview_extra: '',
            package: 'cPanel Admin',
            linkDisplay: false,
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
                scrub_ip_target_ip: '192.168.1.100', scrub_ip_type: 1, scrub_ip_currency: 'USD',
                scrub_ip_order_date: '2024-01-01', scrub_ip_custid: 1, scrub_ip_invoice: 1001,
                scrub_ip_coupon: 0, scrub_ip_extra: '', scrub_ip_comment: '',
                scrub_ip_service_module: '', scrub_ip_service_id: 0,
            },
            billingDetails: { ...billingDetails, service_cost_info: '$5.00/month' },
            custCurrency: 'USD', custCurrencySymbol: '$',
            serviceMaster: { scrub_ip_id: 1 },
            client_links: [],
            serviceExtra: {},
            extraInfoTables: {},
            serviceType: {
                services_id: 110001, services_name: 'Scrub IP', services_cost: 5.0,
                services_category: 500, services_buyable: 1, services_type: 1,
            },
            filter_firewall: {
                rules: [],
                geo_rules: [],
                filters: [],
            },
            package: 'Scrub IP',
            linkDisplay: false,
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
            ima: 'client',
            error: false,
            modules: { vps: 'VPS', servers: 'Dedicated Servers', webhosting: 'Web Hosting' },
            prepays: {
                1: {
                    prepay: {
                        prepay_id: 1,
                        prepay_amount: 100.0,
                        prepay_automatic_use: '1',
                        prepay_created: '2024-01-01',
                        prepay_currency: 'USD',
                        prepay_custid: 1,
                        prepay_date: '2024-01-01',
                        prepay_deleted: 0,
                        prepay_module: 'vps',
                        prepay_remaining: 50.0,
                        prepay_remaining_disp: '$50.00',
                        prepay_service: 0,
                        prepay_status: 'active',
                        prepay_type: 0,
                    },
                    history: [
                        {
                            history_id: 1,
                            history_timestamp_disp: '2024-01-15',
                            desc: 'Payment applied',
                            amt_used: '50.00',
                            history_creator: 0,
                            history_new_value: 50,
                            history_old_value: 100,
                            history_owner: 1,
                            history_section: 0,
                            history_sid: '',
                            history_timestamp: '2024-01-15',
                            history_type: 0,
                        },
                    ],
                },
            },
            total_pages: 1,
            total_records: 1,
            limit: 10,
            page: 1,
            curr_page_records: 1,
            allInfo: {
                vps: { module_name: 'VPS', services: { 1: 'VPS Slice 1' } },
            },
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
            posts: [
                { ticketpostid: '1', creator: '1', fullname: 'Test User', email: 'test@example.com', contents: 'I need help migrating my server.', dateline: 1704877200 },
                { ticketpostid: '2', creator: '2', fullname: 'Support Agent', email: 'support@interserver.net', contents: 'We can help with that. Let me check your account.', dateline: 1704882600 },
            ],
            st_count: [
                { ticketstatustitle: 'Open', st_count: 3 },
                { ticketstatustitle: 'Closed', st_count: 5 },
            ],
            files: {},
            suppressed_email: null,
            custom_values: {
                5: { fieldvalue: '10.0.0.1' },
                6: { fieldvalue: '' },
                7: { fieldvalue: '' },
                8: { fieldvalue: '' },
                9: { fieldvalue: '' },
                10: { fieldvalue: '22' },
                11: { fieldvalue: 'n' },
            },
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

];

// Visual handlers = overrides first (checked first by MSW), then base handlers as fallback
export const visualHandlers = [...visualOverrides, ...baseHandlers];
