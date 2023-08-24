import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useQsStore = defineStore({
    id: 'qs',
    state: () => ({
        qsList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        serviceInfo: {
            qs_id: '19504',
            qs_custid: '2773',
            qs_server: '199',
            qs_ip: '66.45.235.195',
            qs_ipv6: null,
            qs_vzid: 'qs19504',
            qs_currency: 'USD',
            qs_type: '700',
            qs_order_date: '2019-01-22 14:57:17',
            qs_status: 'canceled',
            qs_invoice: '18618070',
            qs_coupon: '0',
            qs_extra: '{"platform":"kvm","spice":5903}',
            qs_hostname: 'qs19504',
            qs_server_status: 'deleted',
            qs_comment: '',
            qs_slices: '0',
            qs_vnc: '',
            qs_vnc_port: null,
            qs_rootpass: 'guest',
            qs_mac: '00:0c:29:00:4c:30',
            qs_os: 'ubuntu-18.04',
            qs_version: '64',
            qs_location: '1',
            qs_platform: null,
        },
        clientLinks: [
            {
                label: 'Invoices',
                link: 'view_qs?id=19504&link=invoices',
                icon: 'fas fa-file-invoice-dollar fa-w-12',
                icon_text: '',
                help_text: 'Invoice History',
            },
            {
                label: 'Cancel Rapid Deploy Servers',
                link: 'view_qs?id=19504&link=cancel',
                icon: 'fas fa-times',
                icon_text: '',
                help_text: 'Cancel Rapid Deploy Servers',
            },
            {
                label: 'Reinstall OS',
                link: 'view_qs?id=19504&link=reinstall_os',
                icon: 'fa fa-linux',
                icon_text: '',
                help_text: 'Reinstall Operating System',
            },
            {
                label: 'Reverse DNS',
                link: 'view_qs?id=19504&link=reverse_dns',
                icon: 'fa fa-atlas',
                icon_text: '',
                help_text: 'Reverse DNS',
            },
            {
                label: 'Bandwidth/Traffic Usage',
                link: 'view_qs?id=19504&link=traffic_usage',
                icon: 'material-icons',
                icon_text: 'speed',
                help_text: 'Bandwith/Traffic Usage',
            },
            {
                label: 'Setup VNC',
                link: 'view_qs?id=19504&link=queue&action=setup_vnc',
                icon: 'fa fa-linux',
                icon_text: '',
                help_text: 'Setup VNC',
            },
            {
                label: 'Send Welcome Email',
                link: 'view_qs?id=19504&link=welcome_email',
                icon: 'material-icons',
                icon_text: 'send',
                help_text: 'Send welcome email',
            },
            {
                label: 'Buy DirectAdmin',
                link: 'buy_license3?ltab=directadmin&llocation=internal&lip=66.45.235.195',
                icon: 'fa fa-certificate',
                icon_text: '',
                help_text: 'Purchase DirectAdmin License',
                other_attr: '',
            },
            {
                label: 'Reset Password',
                link: 'view_qs?link=queue&id=19504&action=reset_password',
                icon: 'material-icons',
                icon_text: 'password',
                help_text: 'Reset Password',
                other_attr: '',
            },
            {
                label: 'Remote Desktop Connection',
                link: 'view_qs?id=19504&link=vnc&amp;type=remote_desktop',
                icon: 'fa fa-tv',
                icon_text: '',
                help_text: 'Remote Desktop Connection',
                other_attr: '',
            },
            {
                label: 'Browser VNC Connection',
                link: 'view_qs?id=19504&link=vnc&type=browser_vnc',
                icon: 'fa fa-tv',
                icon_text: '',
                help_text: 'Browser VNC Connection',
                other_attr: '',
            },
            {
                label: 'Desktop VNC Connection',
                link: 'view_qs?id=19504&link=vnc&type=desktop_vnc',
                icon: 'fa fa-tv',
                icon_text: '',
                help_text: 'Desktop VNC Connection',
                other_attr: '',
            },
            {
                label: 'Browser Spice Connection',
                link: 'view_qs?id=19504&link=vnc&type=browser_spice',
                icon: 'fa fa-tv',
                icon_text: '',
                help_text: 'Browser Spice Connection',
                other_attr: '',
            },
            {
                label: 'Change Timezone',
                link: 'view_qs?id=19504&link=change_timezone',
                icon: 'material-icons',
                icon_text: 'alarm',
                help_text: 'Change Timezone',
                other_attr: '',
            },
            {
                label: 'Insert CD/DVD',
                link: 'view_qs?link=queue&id=19504&action=insert_cd',
                icon: 'fa fa-compact-disc',
                icon_text: '',
                help_text: 'Insert CD/DVD',
                other_attr: '',
            },
            {
                label: 'Eject CD/DVD',
                link: 'view_qs?link=queue&id=19504&action=eject_cd',
                icon: 'fa fa-compact-disc',
                icon_text: '',
                help_text: 'Eject CD/DVD',
                other_attr: '',
            },
            {
                label: 'Backup Rapid Deploy Servers',
                link: 'view_qs?link=queue&id=19504&action=backup',
                icon: 'material-icons',
                icon_text: 'backup',
                help_text: 'Backup Rapid Deploy Servers',
                other_attr: '',
            },
            {
                label: 'Restore Rapid Deploy Servers',
                link: 'view_qs?link=queue&id=19504&action=restore',
                icon: 'material-icons',
                icon_text: 'cloud_download',
                help_text: 'Restore Rapid Deploy Servers',
                other_attr: '',
            },
            {
                label: 'Download/Manage Backups',
                link: 'view_qs?link=backups&id=19504&module=quickservers',
                icon: 'material-icons',
                icon_text: 'cloud_download',
                help_text: 'Download/Manage Backups',
                other_attr: '',
            },
        ],
        billingDetails: {
            service_last_invoice_date: 'January 22, 2019',
            service_payment_status: 'Paid',
            service_frequency: 'Monthly',
            next_date: '2019-02-22 14:57:17',
            service_next_invoice_date: 'February 22, 2019',
            service_currency: 'USD',
            service_currency_symbol: '$',
            service_cost_info: '65.00',
            service_extra: {
                platform: 'kvm',
                spice: 5903,
            },
            service_extra_json: '{"platform":"kvm","spice":5903}',
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceMaster: {
            qs_id: '199',
            qs_name: 'Qs199',
            qs_ip: '66.45.235.194',
            qs_type: '14',
            qs_hdsize: '1760',
            qs_hdfree: '1602',
            qs_bits: '64',
            qs_load: '0.08',
            qs_ram: '29620443',
            qs_cpu_model: 'Intel(R) Xeon(R) CPU E3-1230 V2 @ 3.30GHz',
            qs_cpu_mhz: '2243.65',
            qs_location: '1',
            qs_available: '0',
            qs_cost: '65',
            qs_last_update: '2023-04-30 09:46:03',
            qs_cores: '8',
            qs_iowait: '0',
            qs_raid_status: 'OK: mdstat:[md0(1.86 GiB raid1):UU, md1(93.07 GiB raid1):UU]; zfs:all pools are healthy',
            qs_mounts: 'udev:15:0:15:/dev,/dev/md1:91:14:77:/,securityfs:0:0:0:/sys/kernel/security,pstore:0:0:0:/sys/fs/pstore,systemd-1:0:0:0:/proc/sys/fs/binfmt_misc,debugfs:0:0:0:/sys/kernel/debug,tracefs:0:0:0:',
            qs_drive_type: 'SATA',
            qs_order: '14682',
            qs_raid_building: '0',
            qs_kernel: '4.15.0-208-generic',
            qs_ioping: '751587536',
            qs_speed: '1000',
            qs_distro: 'Ubuntu',
            qs_distro_version: '18.04',
            qs_bytes_sec_in: '0',
            qs_bytes_sec_out: '0',
            qs_packets_sec_in: '0',
            qs_packets_sec_out: '0',
            qs_last_install_time: null,
            qs_partitions: null,
            qs_cpu_flags: 'acpi aes aperfmperf apic arat arch_perfmon avx bts clflush cmov constant_tsc cpuid cpuid_fault cx16 cx8 de ds_cpl dtes64 dtherm dts epb ept erms est f16c flexpriority flush_l1d fpu fsgsbase fxsr ht ibpb ibrs ida lahf_lm lm mca mce md_clear mmx monitor msr mtrr nonstop_tsc nopl nx pae pat pbe pcid pclmulqdq pdcm pebs pge pln pni popcnt pse pse36 pti pts rdrand rdtscp rep_good sep smep smx ss ssbd sse sse2 sse4_1 sse4_2 ssse3 stibp syscall tm tm2 tpr_shadow tsc tsc_deadline_timer vme vmx vnmi vpid x2apic xsave xsaveopt xtopology xtpr',
        },
        osTemplate: 'Ubuntu 18.04',
        serviceExtra: {
            platform: 'kvm',
            spice: 5903,
        },
        extraInfoTables: {
            ip_info: {
                title: 'IP Information',
                rows: [
                    {
                        desc: 'Netmask',
                        value: '255.255.255.248',
                    },
                    {
                        desc: 'Gateway',
                        value: '66.45.235.193',
                    },
                    {
                        desc: 'Broadcast',
                        value: '66.45.235.199',
                    },
                ],
            },
            addons: {
                title: 'Addons',
                rows: [
                    {
                        desc: 'Additional IP Address',
                        value: '66.45.235.196',
                    },
                    {
                        desc: 'Additional IP Address',
                        value: '66.45.235.197',
                    },
                    {
                        desc: 'Additional IP Address',
                        value: '66.45.235.198',
                    },
                ],
            },
        },
        cpu_graph_data: '{"labels":[],"value":[]}',
        bandwidth_xaxis: '[]',
        bandwidth_yaxis: '[]',
        token: '%3Ftoken%',
        service_disk_used: '0.00 GB',
        service_disk_total: '0.00 GB',
        disk_percentage: 8.98,
        memory: '0GB',
        hdd: '0GB',
        serviceOverviewExtra: {
            spice_information: '<a href="spice://66.45.235.194:5903/">66.45.235.194:5903</a>  (<a href="view_qs?link=queue&amp;id=19504&amp;action=setup_vnc"  target="SERVICEFrame1">Authorize New IP</a>)',
        },
    }),
    actions: {
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/qs');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
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
                const response = await fetchWrapper.get(baseUrl + '/qs/' + id);
                this.$reset();
                let key, value;
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
                        console.log("no key '" + key + "' with value '" + value + "'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id: number, params: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
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
        async delete(id: number): Promise<void> {
            // add isDeleting prop to user being deleted
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.qsList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.qsList = this.qsList.filter((x) => x.id !== id);
        },
    },
});
