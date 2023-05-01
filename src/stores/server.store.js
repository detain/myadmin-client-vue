import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/servers`;

export const useServerStore = defineStore({
    id: 'server',
    state: () => ({
        serverList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        ipmiAuth: false,
        ipmiLease: false,
        settings: {
            SERVICE_ID_OFFSET: 4000,
            USE_REPEAT_INVOICE: true,
            USE_PACKAGES: false,
            BILLING_DAYS_OFFSET: 0,
            IMGNAME: "stack.png",
            REPEAT_BILLING_METHOD: 2,
            DELETE_PENDING_DAYS: 45,
            SUSPEND_DAYS: 14,
            SUSPEND_WARNING_DAYS: 7,
            TITLE: "Dedicated Servers",
            MENUNAME: "Servers",
            EMAIL_FROM: "support@interserver.net",
            TBLNAME: "Servers",
            TABLE: "servers",
            TITLE_FIELD: "server_hostname",
            PREFIX: "server"
        },
        serviceInfo: {
            server_id: "16058",
            server_hostname: "mysqlcluster1.is.cc",
            server_custid: "2773",
            server_type: "600",
            server_currency: "USD",
            server_order_date: "2020-05-08 17:22:36",
            server_invoice: "18738142",
            server_coupon: "0",
            server_status: "active",
            server_root: "guest",
            server_dedicated_tag: "0",
            server_custom_tag: "",
            server_comment:
                "1 x Six-Core E5-2620<br>64GB<br>10Tb (1Gb Port)<br>5 Vlan Ips (/29)<br>Ubuntu 20.04 Linux<br>No RAID<br>Customers IP 70.44.33.193<br>plug it into the same rack that my-mysql1 is on.  if it has room for a 2nd network card could you add a 2nd 1gb port (one for a single live ip and one to plugin to the same private switch my-mysql1 uses)",
            server_initial_bill: "0",
            server_hardware: "0",
            server_ips: "0",
            server_monthly_bill: "0",
            server_setup: "0",
            server_discount: null,
            server_rep: "0",
            server_date: "1588972956",
            server_total_cost: "230",
            server_location: null,
            server_hardware_ordered: "0",
            server_billed: "0",
            server_welcome_email: "1",
            server_dedicated_cpu: "38",
            server_dedicated_memory: "22",
            server_dedicated_hd1: "20",
            server_dedicated_hd2: null,
            server_dedicated_bandwidth: "3",
            server_dedicated_ips: "5",
            server_dedicated_os: "30",
            server_dedicated_cp: null,
            server_dedicated_raid: "0",
            server_extra: "[]"
        },
        clientLinks: [
            {
                label: "Invoices",
                link: "view_server?id=16058&link=invoices",
                icon: "fas fa-file-invoice-dollar fa-w-12",
                icon_text: "",
                help_text: "Invoice History"
            },
            {
                label: "Reverse DNS",
                link: "view_server?id=16058&link=reverse_dns",
                icon: "fa fa-atlas",
                icon_text: "",
                help_text: "Reverse DNS",
                other_attr: ""
            },
            {
                label: "IPMI IP",
                link: "view_server?id=16058&a_id=3497&link=ipmi_live",
                icon: "fa fa-connectdevelop",
                icon_text: "",
                help_text: "IPMI IP Address Live",
                other_attr: ""
            }
        ],
        billingDetails: {
            service_last_invoice_date: "April 08, 2023",
            service_payment_status: "Paid",
            service_frequency: "Monthly",
            next_date: "2023-05-08 09:27:51",
            service_next_invoice_date: "May 8, 2023",
            service_currency: "USD",
            service_currency_symbol: "$",
            service_cost_info: "0.00",
            service_extra: [],
            service_extra_json: "[]"
        },
        custCurrency: "USD",
        custCurrencySymbol: "$",
        serviceExtra: [],
        extraInfoTables: {
            assets: {
                title: "Assets",
                size: 2,
                type: "table",
                header: [
                    "Id",
                    "Hostname",
                    "Description",
                    "Location Name",
                    "Rack Name",
                    "Status",
                    "Primary Ipv4",
                    "Comments"
                ],
                rows: [
                    [
                        "1634",
                        "mysqlcluster3.is.cc",
                        "CPU:..............2x Intel Xeon E5-2620v2 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nHard Drive 3:.....Samsung 500 GB SSD s/n:S59UNJ0N524281J\r\nRAID:.............None\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                        "TEB2",
                        "112.16",
                        "active",
                        "174.138.179.252",
                        ""
                    ],
                    [
                        "1955",
                        "mysqlcluster2.is.cc",
                        "CPU:..............2x Intel Xeon E5-2620v2 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nRAID:.............None\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                        "TEB2",
                        "112.16",
                        "active",
                        "174.138.179.251",
                        ""
                    ],
                    [
                        "3497",
                        "mysqlcluster1.is.cc",
                        "CPU:..............2x Intel Xeon E5-2620v4 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nRAID:.............none\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                        "TEB2",
                        "112.16",
                        "active",
                        "174.138.179.250",
                        ""
                    ]
                ]
            }
        },
        networkInfo: {
            vlans: {
                8062: {
                    network: "174.138.179.248/29",
                    network_ip: "174.138.179.248",
                    bitmask: "29",
                    netmask: "255.255.255.248",
                    broadcast: "174.138.179.255",
                    hostmin: "174.138.179.249",
                    hostmax: "174.138.179.254",
                    first_usable: "174.138.179.250",
                    gateway: "174.138.179.249",
                    hosts: 6,
                    vlans_id: "8062",
                    vlans_block: "23",
                    vlans_networks: ":174.138.179.248/29:",
                    vlans_ports: ":118/Ethernet1/33:",
                    vlans_comment: "mysqlcluster1.is.cc",
                    vlans_primary: "1",
                    primary: true,
                    comment: "mysqlcluster1.is.cc"
                }
            },
            vlans6: [],
            assets: {
                1634: {
                    id: "1634",
                    order_id: "16058",
                    hostname: "mysqlcluster3.is.cc",
                    status: "active",
                    primary_ipv4: "174.138.179.252",
                    primary_ipv6: "",
                    mac: null,
                    datacenter: "2",
                    type_id: "1",
                    asset_tag: "",
                    rack: "68",
                    row: "017",
                    col: "02",
                    unit_start: "13",
                    unit_end: "13",
                    unit_sub: "0",
                    ipmi_mac: "0c:c4:7a:1b:36:06",
                    ipmi_ip: null,
                    ipmi_admin_username: null,
                    ipmi_admin_password: null,
                    ipmi_client_username: null,
                    ipmi_client_password: null,
                    ipmi_updated: null,
                    ipmi_working: "0",
                    company: "int",
                    comments: "",
                    make: "",
                    model: "",
                    description:
                        "CPU:..............2x Intel Xeon E5-2620v2 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nHard Drive 3:.....Samsung 500 GB SSD s/n:S59UNJ0N524281J\r\nRAID:.............None\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                    customer_id: "",
                    external_id: "",
                    billing_status: "active",
                    overdue: "0",
                    create_timestamp: "2007-05-21 22:42:51",
                    update_timestamp: "2007-05-21 22:42:51",
                    asset_id: "1",
                    asset_name: "server",
                    rack_id: "68",
                    rack_name: "112.16",
                    rack_location: "2",
                    rack_size: "44",
                    rack_x: "25",
                    rack_y: "5",
                    comment: null,
                    switchports: ["10417"],
                    vlans: ["8062"],
                    vlans6: []
                },
                1955: {
                    id: "1955",
                    order_id: "16058",
                    hostname: "mysqlcluster2.is.cc",
                    status: "active",
                    primary_ipv4: "174.138.179.251",
                    primary_ipv6: "",
                    mac: null,
                    datacenter: "2",
                    type_id: "1",
                    asset_tag: "",
                    rack: "68",
                    row: "017",
                    col: "16",
                    unit_start: "3",
                    unit_end: "3",
                    unit_sub: "0",
                    ipmi_mac: "00:25:90:89:11:64",
                    ipmi_ip: null,
                    ipmi_admin_username: null,
                    ipmi_admin_password: null,
                    ipmi_client_username: null,
                    ipmi_client_password: null,
                    ipmi_updated: null,
                    ipmi_working: "0",
                    company: "int",
                    comments: "",
                    make: "Supermicro",
                    model: "SYS-6018R-TDW",
                    description:
                        "CPU:..............2x Intel Xeon E5-2620v2 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nRAID:.............None\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                    customer_id: "int9",
                    external_id: "",
                    billing_status: "canceled",
                    overdue: "0",
                    create_timestamp: "2007-05-21 22:42:51",
                    update_timestamp: "2007-05-21 22:42:51",
                    asset_id: "1",
                    asset_name: "server",
                    rack_id: "68",
                    rack_name: "112.16",
                    rack_location: "2",
                    rack_size: "44",
                    rack_x: "25",
                    rack_y: "5",
                    comment: null,
                    switchports: ["10416"],
                    vlans: ["8062"],
                    vlans6: []
                },
                3497: {
                    id: "3497",
                    order_id: "16058",
                    hostname: "mysqlcluster1.is.cc",
                    status: "active",
                    primary_ipv4: "174.138.179.250",
                    primary_ipv6: "",
                    mac: null,
                    datacenter: "2",
                    type_id: "1",
                    asset_tag: "",
                    rack: "68",
                    row: "017",
                    col: "06",
                    unit_start: "37",
                    unit_end: "37",
                    unit_sub: "0",
                    ipmi_mac: "0c:c4:7a:af:35:00",
                    ipmi_ip: "10.8.69.7",
                    ipmi_admin_username: null,
                    ipmi_admin_password: null,
                    ipmi_client_username: null,
                    ipmi_client_password: null,
                    ipmi_updated: null,
                    ipmi_working: "0",
                    company: "int",
                    comments: "",
                    make: "Supermicro",
                    model: "SYS-6018R-TDW",
                    description:
                        "CPU:..............2x Intel Xeon E5-2620v4 @2.10GHz\r\nMemory:...........128GB DDR3 1600MHz\r\nHard Drive 1:.....Crucial 500 GB SSD\r\nHard Drive 2:.....Crucial 500 GB SSD\r\nRAID:.............none\r\nOS:...............Ubuntu 20\r\nControl Panel:....none\r\nNetwork...........10G Card\r\nIP(s):............Vlan 3497\r\nBandwidth:........10Tb @ 10gb port",
                    customer_id: "int5377",
                    external_id: "",
                    billing_status: "active",
                    overdue: "0",
                    create_timestamp: null,
                    update_timestamp: null,
                    asset_id: "1",
                    asset_name: "server",
                    rack_id: "68",
                    rack_name: "112.16",
                    rack_location: "2",
                    rack_size: "44",
                    rack_x: "25",
                    rack_y: "5",
                    comment: null,
                    switchports: ["10414"],
                    vlans: ["8062"],
                    vlans6: [],
                    lease: {
                        mac: "0c:c4:7a:af:35:00",
                        authenticated: false
                    }
                }
            },
            switchports: {
                10414: {
                    switchport_id: "10414",
                    switch_id: "118",
                    switch: "edge1",
                    port: "Ethernet1/33",
                    blade: "Ethernet1",
                    justport: "33",
                    graph_id: "12622",
                    vlans: ["8062"],
                    vlans6: [],
                    asset_id: "3497"
                },
                10416: {
                    switchport_id: "10416",
                    switch_id: "118",
                    switch: "edge1",
                    port: "Ethernet1/35",
                    blade: "Ethernet1",
                    justport: "35",
                    graph_id: "12624",
                    vlans: ["8062"],
                    vlans6: [],
                    asset_id: "1955"
                },
                10417: {
                    switchport_id: "10417",
                    switch_id: "118",
                    switch: "edge1",
                    port: "Ethernet1/36",
                    blade: "Ethernet1",
                    justport: "36",
                    graph_id: "12625",
                    vlans: ["8062"],
                    vlans6: [],
                    asset_id: "1634"
                }
            }
        },
        locations: {
            1: {
                0: "1",
                1: "TEB1",
                2: null,
                3: "40.78614169999999",
                4: "-74.07427259999997",
                location_id: "1",
                location_name: "TEB1",
                location_description: null,
                location_lat: "40.78614169999999",
                location_long: "-74.07427259999997"
            }
        }
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/servers');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log("got error response"+error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id) {
            const keyMap = {
                'package': 'pkg',
            };
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/servers/' + id);
                this.$reset();
                let key, value;
                console.log('api success');
                console.log(response);
                for (key in response) {
                    value = response[key];
                    if (typeof this[key] != 'undefined') {
                        this[key] = value;
                    } else if (typeof this[snakeToCamel(key)] != 'undefined') {
                        this[snakeToCamel(key)] = value;
                    } else if (typeof keyMap[key] != 'undefined') {
                        this[keyMap[key]] = value;
                    } else {
                        console.log("no key '"+key+"' with value '"+value+"'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }


        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.serverList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.serverList = this.serverList.filter(x => x.id !== id);
Z        }
    }
});
