// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://my.interserver.net/apiv2';

export const handlers = [
    // Auth endpoints
    http.get(`${BASE_URL}/login`, () => {
        return HttpResponse.json({
            logo: '//my.interserver.net/templates/my/logo.png',
            captcha: 'test-captcha-data',
            language: 'en-US',
            counts: { vps: 3, websites: 2, servers: 1 },
        });
    }),

    http.post(`${BASE_URL}/login`, async ({ request }) => {
        const body = (await request.json()) as Record<string, string>;
        if (body.login === 'testuser' && body.passwd === 'secret') {
            return HttpResponse.json({
                sessionId: 'abc123',
                account_id: 1,
                account_lid: 'testuser',
                name: 'Test User',
                ima: 'client',
            });
        }
        return HttpResponse.json({ code: 401, message: 'Invalid credentials', field: 'login' }, { status: 401 });
    }),

    http.get(`${BASE_URL}/logout`, () => {
        return HttpResponse.json({ success: true });
    }),

    http.get(`${BASE_URL}/captcha`, () => {
        return HttpResponse.json({ captcha: 'new-captcha-data' });
    }),

    http.post(`${BASE_URL}/signup`, async ({ request }) => {
        const body = (await request.json()) as Record<string, string>;
        return HttpResponse.json({
            sessionId: 'new-session-123',
            account_id: 2,
            account_lid: body.login || 'newuser',
            name: 'New User',
            ima: 'client',
        });
    }),

    // Account endpoints
    http.get(`${BASE_URL}/account`, () => {
        return HttpResponse.json({
            custid: 1,
            data: {
                account_id: 1,
                account_lid: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                address: '123 Test St',
                city: 'Testville',
                state: 'NJ',
                zip: '07001',
                country: 'US',
                phone: '555-1234',
                company: 'Test Corp',
                currency: 'USD',
                ima: 'client',
                status: 'active',
                pin: 1234,
            },
            gravatar: 'https://gravatar.com/test',
            ima: 'client',
            ip: '127.0.0.1',
            language: 'en-US',
            limits: [],
            oauthadapters: [],
            oauthconfig: { callback: '', providers: {} },
            oauthproviders: {},
            countryCurrencies: { US: 'USD' },
            enableCurrencies: false,
            enableLocales: true,
        });
    }),

    // Site info
    http.get(`${BASE_URL}/info`, () => {
        return HttpResponse.json({
            modules: {},
            services: {},
            serviceTypes: {},
            serviceCategories: {},
        });
    }),

    // Search
    http.get(`${BASE_URL}/search`, () => {
        return HttpResponse.json({
            results: [[0, 'extra1', '101', 'test-hostname.com', '192.168.1.1']],
            tables: {
                0: {
                    id: 'vps_id',
                    table: 'vps',
                    label: 'VPS',
                    link: '/vps/',
                    search: ['vps_id', 'vps_hostname', 'vps_ip'],
                    prefix: 'vps',
                    extra: ['vps_vzid'],
                },
            },
        });
    }),

    // VPS endpoints
    http.get(`${BASE_URL}/vps`, () => {
        return HttpResponse.json([
            { vps_id: 101, vps_name: 'vps-node1', repeat_invoices_cost: '10.00', vps_hostname: 'test.example.com', vps_ip: '192.168.1.1', vps_status: 'active', services_name: 'VPS Slice', vps_comment: '' },
            { vps_id: 102, vps_name: 'vps-node2', repeat_invoices_cost: '20.00', vps_hostname: 'test2.example.com', vps_ip: '192.168.1.2', vps_status: 'pending', services_name: 'VPS Slice', vps_comment: 'test' },
        ]);
    }),

    http.get(`${BASE_URL}/vps/:id`, ({ params }) => {
        return HttpResponse.json({
            serviceInfo: { vps_id: Number(params.id), vps_hostname: 'test.example.com', vps_ip: '192.168.1.1', vps_status: 'active', vps_vzid: 'vm101', vps_platform: 'kvm', vps_os: 'ubuntu-22.04' },
            client_links: [],
            billingDetails: { service_last_invoice_date: '2024-01-01', service_payment_status: 'paid', service_frequency: 'Monthly', next_date: '2024-02-01', service_next_invoice_date: '2024-02-01', service_currency: 'USD', service_currency_symbol: '$', service_cost_info: '$10.00/month', service_extra: {} },
            custCurrency: 'USD',
            custCurrencySymbol: '$',
            serviceMaster: { vps_id: 1, vps_name: 'node1' },
            package: 'VPS Slice',
            os_template: 'ubuntu-22.04',
            serviceExtra: {},
            extraInfoTables: {},
            cpu_graph_data: null,
            module: 'vps',
            token: 'test-token',
            da_link: 0,
            sr_link: 0,
            cp_data: {},
            da_data: {},
            plesk12_data: {},
            serviceAddons: { has_cpanel: false, has_directadmin: false },
        });
    }),

    // Domains
    http.get(`${BASE_URL}/domains`, () => {
        return HttpResponse.json([{ domain_id: 201, domain_hostname: 'example.com', domain_status: 'active', domain_expire_date: '2025-01-01' }]);
    }),

    // Servers
    http.get(`${BASE_URL}/servers`, () => {
        return HttpResponse.json([{ server_id: 301, server_hostname: 'dedicated1.example.com', server_status: 'active' }]);
    }),

    // Licenses
    http.get(`${BASE_URL}/licenses`, () => {
        return HttpResponse.json([{ license_id: 401, license_ip: '10.0.0.1', license_status: 'active' }]);
    }),

    // SSL
    http.get(`${BASE_URL}/ssl`, () => {
        return HttpResponse.json([{ ssl_id: 501, ssl_order_id: 'SSL-001', ssl_status: 'active' }]);
    }),

    // Mail
    http.get(`${BASE_URL}/mail`, () => {
        return HttpResponse.json([{ mail_id: 601, mail_username: 'user@example.com', mail_status: 'active' }]);
    }),

    // Backups
    http.get(`${BASE_URL}/backups`, () => {
        return HttpResponse.json([{ backup_id: 701, backup_username: 'backup1', backup_status: 'active' }]);
    }),

    // Websites
    http.get(`${BASE_URL}/websites`, () => {
        return HttpResponse.json([{ website_id: 801, website_hostname: 'mysite.com', website_status: 'active' }]);
    }),

    // Quick Servers
    http.get(`${BASE_URL}/qs`, () => {
        return HttpResponse.json([{ qs_id: 901, qs_hostname: 'qs1.example.com', qs_status: 'active' }]);
    }),

    // Floating IPs
    http.get(`${BASE_URL}/floating_ips`, () => {
        return HttpResponse.json([{ floating_ip_id: 1001, floating_ip_ip: '10.0.0.100', floating_ip_status: 'active' }]);
    }),

    // Scrub IPs
    http.get(`${BASE_URL}/scrub_ips`, () => {
        return HttpResponse.json([{ scrub_ip_id: 1101, scrub_ip_ip: '10.0.0.200', scrub_ip_status: 'active' }]);
    }),

    // Invoices
    http.get(`${BASE_URL}/billing/invoices`, () => {
        return HttpResponse.json({
            custid: 1,
            years_arr: { 2024: 2024 },
            months_arr: ['January', 'February'],
            sortcol: 0,
            sortdir: 1,
            textextraction: '"complex"',
            table_header: ['ID', 'Date', 'Description', 'Amount', 'Paid'],
            size: 100,
            sizes: '10,25,50,100',
            table_rows: [{ id: 1, date: '2024-01-01', description: 'VPS', amount: '10.00', paid: 'Yes' }],
            rows: [{ id: 1, date: '2024-01-01', description: 'VPS', amount: '10.00', paid: 'Yes' }],
        });
    }),

    http.get(`${BASE_URL}/billing/invoices/:id`, ({ params }) => {
        return HttpResponse.json(`<html><body>Invoice #${params.id}</body></html>`);
    }),

    // Tickets
    http.get(`${BASE_URL}/tickets`, () => {
        return HttpResponse.json({
            ima: 'client',
            custid: 1,
            view: 'all',
            selected_period: '30',
            currentPage: 1,
            limit: 50,
            pages: 1,
            offset: 0,
            total: { tickets: 1 },
            st_count: [
                { ticketstatustitle: 'Open', st_count: 1 },
                { ticketstatustitle: 'Closed', st_count: 0 },
            ],
            tickets: [
                { ticketid: '1', ticketmaskid: 'TKT-001', subject: 'Test Ticket', ticketstatustitle: 'Open', prioritytitle: 'Normal', fullname: 'Test User', lastactivity: '2024-01-15', checked: false },
            ],
        });
    }),

    http.post(`${BASE_URL}/tickets`, async () => {
        return HttpResponse.json([]);
    }),

    // Register
    http.post(`${BASE_URL}/register`, async () => {
        return HttpResponse.json({ success: true });
    }),

    // Generic user endpoint (legacy)
    http.get('/api/user', () => {
        return HttpResponse.json({ firstName: 'John', lastName: 'Doe' });
    }),
];
