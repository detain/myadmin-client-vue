<script setup>
import { ref, computed } from 'vue'

const currency = ref("USD");
const currencySymbol = ref("$");
const custid = ref("2773");
const ima = ref("client");
const step = ref("order_form");
const cpu = ref(34);
const cpuLi = ref({
    34: {
        id: "34",
        price: 500,
        img: "xeon-e3.png   ",
        short_desc: "Xeon E3-1230",
        long_desc: "",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "3.2",
        cache: "",
        active: "1",
        num_cores: "4",
        num_cpus: "1",
        benchmark: "18730",
        monthly_price: 24,
        max_ram: "32",
        min_ram: "32",
        max_lff: "2",
        max_sff: "4",
        max_nve: "0",
        visible: "yes",
        hd_ids: null,
        price_display: "$500.00",
        monthly_price_display: "$24.00"
    },
    184: {
        id: "184",
        price: 0,
        img: "ryzen.png",
        short_desc: "AMD RYZEN 5600X",
        long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5600X CPU has 6 cores and runs at 3.8Ghz per core.",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "3.8",
        cache: "",
        active: "1",
        num_cores: "6",
        num_cpus: "1",
        benchmark: "44919",
        monthly_price: 35,
        max_ram: "64",
        min_ram: "64",
        max_lff: "2",
        max_sff: "2",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$35.00"
    },
    72: {
        id: "72",
        price: 0,
        img: "ryzen.png",
        short_desc: "AMD RYZEN 3900X",
        long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 3900X CPU has 12 cores and runs at 3.8Ghz per core.",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "3.8",
        cache: "",
        active: "1",
        num_cores: "12",
        num_cpus: "1",
        benchmark: "82789",
        monthly_price: 65,
        max_ram: "128",
        min_ram: "64",
        max_lff: "4",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$65.00"
    },
    121: {
        id: "121",
        price: 0,
        img: "ryzen.png",
        short_desc: "AMD RYZEN 5900X",
        long_desc: "The AMD Ryzen with 12 cores and 24 processing threads. Clock speed of 3.7 GHz and 4.8 GHz Max Boost.",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "3.7",
        cache: "",
        active: "1",
        num_cores: "12",
        num_cpus: "1",
        benchmark: "117510",
        monthly_price: 75,
        max_ram: "128",
        min_ram: "64",
        max_lff: "4",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$75.00"
    },
    242: {
        id: "242",
        price: 0,
        img: "epyc.png",
        short_desc: "AMD EPYC 7401P",
        long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "2",
        cache: "",
        active: "1",
        num_cores: "24",
        num_cpus: "1",
        benchmark: "89352",
        monthly_price: 95,
        max_ram: "1024",
        min_ram: "128",
        max_lff: "0",
        max_sff: "8",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$95.00"
    },
    36: {
        id: "36",
        price: 500,
        img: "xeon-2x.png   ",
        short_desc: "2 x Six-Core E5-2620",
        long_desc: "",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2",
        cache: "",
        active: "1",
        num_cores: "12",
        num_cpus: "2",
        benchmark: "39606",
        monthly_price: 100,
        max_ram: "256",
        min_ram: "64",
        max_lff: "4",
        max_sff: "4",
        max_nve: "0",
        visible: "yes",
        hd_ids: null,
        price_display: "$500.00",
        monthly_price_display: "$100.00"
    },
    42: {
        id: "42",
        price: 0,
        img: "xeon-e3.png   ",
        short_desc: "Xeon E3-1230 v6",
        long_desc: "The Intel Xeon E3-1230 v6 is the 6th version of the very popular E3 series. It was launched during the 1st quarter of 2017. The CPU is very stable in the server environment.  There are 4 cores and 8 threads. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "3.5",
        cache: "",
        active: "1",
        num_cores: "4",
        num_cpus: "1",
        benchmark: "22195",
        monthly_price: 104,
        max_ram: "64",
        min_ram: "16",
        max_lff: "2",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$104.00"
    },
    93: {
        id: "93",
        price: 0,
        img: "ryzen.png",
        short_desc: "AMD RYZEN 5950X",
        long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5950X CPU has 16 cores and runs at 3.4Ghz per core.",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "3.4",
        cache: "",
        active: "1",
        num_cores: "16",
        num_cpus: "1",
        benchmark: "126374",
        monthly_price: 104,
        max_ram: "128",
        min_ram: "128",
        max_lff: "4",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$104.00"
    },
    48: {
        id: "48",
        price: 0,
        img: "epyc.png",
        short_desc: "AMD EPYC 7402P",
        long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "2.8",
        cache: "",
        active: "1",
        num_cores: "24",
        num_cpus: "1",
        benchmark: "111233",
        monthly_price: 105,
        max_ram: "1024",
        min_ram: "128",
        max_lff: "0",
        max_sff: "8",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$105.00"
    },
    79: {
        id: "79",
        price: 0,
        img: "xeon-2x.png   ",
        short_desc: "2 x Xeon E5-2680v4 8SFF",
        long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. These CPUs have 14 cores each for a total of 28 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2.7",
        cache: "",
        active: "1",
        num_cores: "28",
        num_cpus: "2",
        benchmark: "109118",
        monthly_price: 135,
        max_ram: "2048",
        min_ram: "128",
        max_lff: "0",
        max_sff: "8",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$135.00"
    },
    128: {
        id: "128",
        price: 0,
        img: "xeon-2x.png   ",
        short_desc: "2 x Xeon E5-2680v4 4LFF",
        long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. They come loaded with 128GB of Memory. Up to 4 full-size hard drives can be installed. If you need a custom configuration please contact us directly. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2.7",
        cache: "",
        active: "1",
        num_cores: "28",
        num_cpus: "2",
        benchmark: "109118",
        monthly_price: 135,
        max_ram: "1024",
        min_ram: "128",
        max_lff: "4",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$135.00"
    },
    254: {
        id: "254",
        price: 0,
        img: "ryzen.png",
        short_desc: "AMD RYZEN 7900X",
        long_desc: "High core and thread count: The AMD Ryzen 7900x can be advantageous for server workloads that benefit from parallel processing. Good value for money: AMD processors typically offer better value for money compared to Intel processors, particularly in terms of the price-to-performance ratio. Overall, the AMD Ryzen processor series can be a good choice for a dedicated server, particularly if your workload benefits from a high number of cores and threads, and if you are looking for good value for money.",
        location: "New York",
        fsb: "",
        manu: "",
        type: "AMD",
        speed: "4.7",
        cache: "",
        active: "1",
        num_cores: "12",
        num_cpus: "1",
        benchmark: "126374",
        monthly_price: 150,
        max_ram: "128",
        min_ram: "128",
        max_lff: "4",
        max_sff: "4",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$150.00"
    },
    51: {
        id: "51",
        price: 0,
        img: "xeon-2x.png   ",
        short_desc: "2 x Xeon E5-2678v3 (Storage)",
        long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2678v3 CPUs. They come loaded with 128GB of Memory. Up to 12 Full-Size hard drives can be installed. 14TB * 12 will give you 168TB of storage per server. If you need a custom configuration please contact us directly. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2.7",
        cache: "",
        active: "1",
        num_cores: "24",
        num_cpus: "2",
        benchmark: "82632",
        monthly_price: 175,
        max_ram: "1024",
        min_ram: "128",
        max_lff: "12",
        max_sff: "12",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$175.00"
    },
    163: {
        id: "163",
        price: 0,
        img: "xeongold.png",
        short_desc: "2 x Xeon Gold 6130 8SFF",
        long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6130R CPUs. These CPUs have 16 cores each for a total of 32 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2.7",
        cache: "",
        active: "1",
        num_cores: "32",
        num_cpus: "2",
        benchmark: "116318",
        monthly_price: 300,
        max_ram: "2048",
        min_ram: "128",
        max_lff: "0",
        max_sff: "8",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$300.00"
    },
    86: {
        id: "86",
        price: 0,
        img: "xeongold.png",
        short_desc: "2 x Xeon Gold 6230R 8SFF",
        long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6230R CPUs. These CPUs have 26 cores each for a total of 52 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
        location: "New York",
        fsb: "",
        manu: "",
        type: "XEON",
        speed: "2.1",
        cache: "",
        active: "1",
        num_cores: "52",
        num_cpus: "2",
        benchmark: "186318",
        monthly_price: 425,
        max_ram: "2048",
        min_ram: "128",
        max_lff: "0",
        max_sff: "8",
        max_nve: "2",
        visible: "yes",
        hd_ids: null,
        price_display: "$0.00",
        monthly_price_display: "$425.00"
    }
});
const configLi = ref({
    cpuLi: {
        34: {
            id: "34",
            price: 500,
            img: "xeon-e3.png   ",
            short_desc: "Xeon E3-1230",
            long_desc: "",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "3.2",
            cache: "",
            active: "1",
            num_cores: "4",
            num_cpus: "1",
            benchmark: "18730",
            monthly_price: 24,
            max_ram: "32",
            min_ram: "32",
            max_lff: "2",
            max_sff: "4",
            max_nve: "0",
            visible: "yes",
            hd_ids: null,
            price_display: "$500.00",
            monthly_price_display: "$24.00"
        },
        184: {
            id: "184",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5600X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5600X CPU has 6 cores and runs at 3.8Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.8",
            cache: "",
            active: "1",
            num_cores: "6",
            num_cpus: "1",
            benchmark: "44919",
            monthly_price: 35,
            max_ram: "64",
            min_ram: "64",
            max_lff: "2",
            max_sff: "2",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$35.00"
        },
        72: {
            id: "72",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 3900X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 3900X CPU has 12 cores and runs at 3.8Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.8",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "82789",
            monthly_price: 65,
            max_ram: "128",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$65.00"
        },
        121: {
            id: "121",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5900X",
            long_desc: "The AMD Ryzen with 12 cores and 24 processing threads. Clock speed of 3.7 GHz and 4.8 GHz Max Boost.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.7",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "117510",
            monthly_price: 75,
            max_ram: "128",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$75.00"
        },
        242: {
            id: "242",
            price: 0,
            img: "epyc.png",
            short_desc: "AMD EPYC 7401P",
            long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "2",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "1",
            benchmark: "89352",
            monthly_price: 95,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$95.00"
        },
        36: {
            id: "36",
            price: 500,
            img: "xeon-2x.png   ",
            short_desc: "2 x Six-Core E5-2620",
            long_desc: "",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "2",
            benchmark: "39606",
            monthly_price: 100,
            max_ram: "256",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "0",
            visible: "yes",
            hd_ids: null,
            price_display: "$500.00",
            monthly_price_display: "$100.00"
        },
        42: {
            id: "42",
            price: 0,
            img: "xeon-e3.png   ",
            short_desc: "Xeon E3-1230 v6",
            long_desc: "The Intel Xeon E3-1230 v6 is the 6th version of the very popular E3 series. It was launched during the 1st quarter of 2017. The CPU is very stable in the server environment.  There are 4 cores and 8 threads. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "3.5",
            cache: "",
            active: "1",
            num_cores: "4",
            num_cpus: "1",
            benchmark: "22195",
            monthly_price: 104,
            max_ram: "64",
            min_ram: "16",
            max_lff: "2",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$104.00"
        },
        93: {
            id: "93",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5950X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5950X CPU has 16 cores and runs at 3.4Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.4",
            cache: "",
            active: "1",
            num_cores: "16",
            num_cpus: "1",
            benchmark: "126374",
            monthly_price: 104,
            max_ram: "128",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$104.00"
        },
        48: {
            id: "48",
            price: 0,
            img: "epyc.png",
            short_desc: "AMD EPYC 7402P",
            long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "2.8",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "1",
            benchmark: "111233",
            monthly_price: 105,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$105.00"
        },
        79: {
            id: "79",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2680v4 8SFF",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. These CPUs have 14 cores each for a total of 28 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "28",
            num_cpus: "2",
            benchmark: "109118",
            monthly_price: 135,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$135.00"
        },
        128: {
            id: "128",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2680v4 4LFF",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. They come loaded with 128GB of Memory. Up to 4 full-size hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "28",
            num_cpus: "2",
            benchmark: "109118",
            monthly_price: 135,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$135.00"
        },
        254: {
            id: "254",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 7900X",
            long_desc: "High core and thread count: The AMD Ryzen 7900x can be advantageous for server workloads that benefit from parallel processing. Good value for money: AMD processors typically offer better value for money compared to Intel processors, particularly in terms of the price-to-performance ratio. Overall, the AMD Ryzen processor series can be a good choice for a dedicated server, particularly if your workload benefits from a high number of cores and threads, and if you are looking for good value for money.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "4.7",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "126374",
            monthly_price: 150,
            max_ram: "128",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$150.00"
        },
        51: {
            id: "51",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2678v3 (Storage)",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2678v3 CPUs. They come loaded with 128GB of Memory. Up to 12 Full-Size hard drives can be installed. 14TB * 12 will give you 168TB of storage per server. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "2",
            benchmark: "82632",
            monthly_price: 175,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "12",
            max_sff: "12",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$175.00"
        },
        163: {
            id: "163",
            price: 0,
            img: "xeongold.png",
            short_desc: "2 x Xeon Gold 6130 8SFF",
            long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6130R CPUs. These CPUs have 16 cores each for a total of 32 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "32",
            num_cpus: "2",
            benchmark: "116318",
            monthly_price: 300,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$300.00"
        },
        86: {
            id: "86",
            price: 0,
            img: "xeongold.png",
            short_desc: "2 x Xeon Gold 6230R 8SFF",
            long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6230R CPUs. These CPUs have 26 cores each for a total of 52 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.1",
            cache: "",
            active: "1",
            num_cores: "52",
            num_cpus: "2",
            benchmark: "186318",
            monthly_price: 425,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$425.00"
        }
    },
    memory_li: {
        34: {
            21: {
                id: "21",
                monthly_price: 15,
                short_desc: "32GB",
                monthly_price_display: "$15.00"
            }
        },
        184: {
            22: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            }
        },
        72: {
            22: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            }
        },
        121: {
            22: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            }
        },
        242: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            }
        },
        36: {
            22: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            }
        },
        42: {
            20: {
                id: "20",
                monthly_price: 5,
                short_desc: "16GB",
                monthly_price_display: "$5.00"
            },
            21: {
                id: "21",
                monthly_price: 15,
                short_desc: "32GB",
                monthly_price_display: "$15.00"
            },
            22: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            }
        },
        93: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            }
        },
        48: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            }
        },
        79: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            },
            30: {
                id: "30",
                monthly_price: 900,
                short_desc: "1536GB",
                monthly_price_display: "$900.00"
            },
            37: {
                id: "37",
                monthly_price: 1200,
                short_desc: "2048GB",
                monthly_price_display: "$1,200.00"
            }
        },
        128: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            }
        },
        254: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            }
        },
        51: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            }
        },
        163: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            },
            30: {
                id: "30",
                monthly_price: 900,
                short_desc: "1536GB",
                monthly_price_display: "$900.00"
            },
            37: {
                id: "37",
                monthly_price: 1200,
                short_desc: "2048GB",
                monthly_price_display: "$1,200.00"
            }
        },
        86: {
            23: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            24: {
                id: "24",
                monthly_price: 120,
                short_desc: "256GB",
                monthly_price_display: "$120.00"
            },
            25: {
                id: "25",
                monthly_price: 200,
                short_desc: "384GB",
                monthly_price_display: "$200.00"
            },
            26: {
                id: "26",
                monthly_price: 400,
                short_desc: "512GB",
                monthly_price_display: "$400.00"
            },
            27: {
                id: "27",
                monthly_price: 600,
                short_desc: "1024GB",
                monthly_price_display: "$600.00"
            },
            30: {
                id: "30",
                monthly_price: 900,
                short_desc: "1536GB",
                monthly_price_display: "$900.00"
            },
            37: {
                id: "37",
                monthly_price: 1200,
                short_desc: "2048GB",
                monthly_price_display: "$1,200.00"
            }
        }
    },
    hd_li: {
        34: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        184: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        72: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        121: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        242: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        36: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        42: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        93: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        48: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        79: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        128: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        254: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        51: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        163: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        },
        86: {
            16: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            18: {
                id: "18",
                price: "100",
                img: "hd.jpg",
                short_desc: "250GB SSD",
                long_desc: "Capacity: 250GB <br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "250",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "sff",
                monthly_price_display: "$5.00"
            },
            20: {
                id: "20",
                price: "100",
                img: "hd.jpg",
                short_desc: "500GB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 10,
                drive_type: "sff",
                monthly_price_display: "$10.00"
            },
            21: {
                id: "21",
                price: "100",
                img: "hd.jpg",
                short_desc: "1TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "160",
                type: "",
                hidden: "0",
                monthly_price: 20,
                drive_type: "sff",
                monthly_price_display: "$20.00"
            },
            23: {
                id: "23",
                price: "100",
                img: "hd.jpg",
                short_desc: "2TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 35,
                drive_type: "sff",
                monthly_price_display: "$35.00"
            },
            25: {
                id: "25",
                price: "100",
                img: "hd.jpg",
                short_desc: "4TB SSD",
                long_desc: "",
                manu: "IDE",
                size: "4000",
                type: "",
                hidden: "0",
                monthly_price: 40,
                drive_type: "sff",
                monthly_price_display: "$40.00"
            },
            65: {
                id: "65",
                price: "0",
                img: "hd.jpg",
                short_desc: "20TB SATA",
                long_desc: "",
                manu: "IDE",
                size: "3000",
                type: "",
                hidden: "0",
                monthly_price: 50,
                drive_type: "lff",
                monthly_price_display: "$50.00"
            }
        }
    },
    bandwidth_li: {
        3: {
            id: "3",
            price: 140,
            img: "bandwidth.jpg",
            short_desc: "150TB (1Gb Port)",
            long_desc: " - 2000GB Bandwidth <br> - Multihomed <br> - Redundant <br> - 99.5% uptime",
            type: "Standard",
            qty: "4000",
            active: "1",
            monthly_price: 0,
            price_display: "$140.00",
            monthly_price_display: "$0.00"
        },
        15: {
            id: "15",
            price: 0,
            img: "bandwidth.jpg",
            short_desc: "150TB (10Gb Port)",
            long_desc: " - 2000GB Bandwidth <br> - Multihomed <br> - Redundant <br> - 99.5% uptime",
            type: "Standard",
            qty: "4000",
            active: "1",
            monthly_price: 15,
            price_display: "$0.00",
            monthly_price_display: "$15.00"
        },
        10: {
            id: "10",
            price: 0,
            img: "bandwidth.jpg",
            short_desc: "1Gbps Unmetered",
            long_desc: "",
            type: "Standard",
            qty: "",
            active: "1",
            monthly_price: 200,
            price_display: "$0.00",
            monthly_price_display: "$200.00"
        },
        14: {
            id: "14",
            price: 0,
            img: "bandwidth.jpg",
            short_desc: "10Gbps Unmetered",
            long_desc: "",
            type: "Standard",
            qty: "",
            active: "1",
            monthly_price: 800,
            price_display: "$0.00",
            monthly_price_display: "$800.00"
        }
    },
    ips_li: {
        9: {
            id: "9",
            price: 0,
            img: "ips.jpg",
            short_desc: "1 Vlan Ip (/30)",
            long_desc: "1 IP In personal Vlan",
            qty: "1",
            monthly_price: 0,
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        5: {
            id: "5",
            price: 8,
            img: "ips.jpg",
            short_desc: "5 Vlan Ips (/29)",
            long_desc: "5 IPs In personal Vlan",
            qty: "5",
            monthly_price: 5,
            price_display: "$8.00",
            monthly_price_display: "$5.00"
        },
        1: {
            id: "1",
            price: 42,
            img: "ips.jpg",
            short_desc: "/30 + /28 IP Space",
            long_desc: "13 IPs In personal Vlan",
            qty: "14",
            monthly_price: 40,
            price_display: "$42.00",
            monthly_price_display: "$40.00"
        },
        2: {
            id: "2",
            price: 90,
            img: "ips.jpg",
            short_desc: "/30 + /27 IP Space",
            long_desc: "29 IPs In personal Vlan",
            qty: "30",
            monthly_price: 80,
            price_display: "$90.00",
            monthly_price_display: "$80.00"
        },
        3: {
            id: "3",
            price: 150,
            img: "ips.jpg",
            short_desc: "/30 + /26 IP Space",
            long_desc: "62 IPs In personal Vlan",
            qty: "62",
            monthly_price: 150,
            price_display: "$150.00",
            monthly_price_display: "$150.00"
        },
        4: {
            id: "4",
            price: 200,
            img: "ips.jpg",
            short_desc: "/30 + /25 IP Space",
            long_desc: "124 IPs In personal Vlan",
            qty: "123",
            monthly_price: 300,
            price_display: "$200.00",
            monthly_price_display: "$300.00"
        },
        6: {
            id: "6",
            price: 0,
            img: "ips.jpg",
            short_desc: "/30 + /24 IP Space",
            long_desc: "124 IPs In personal Vlan",
            qty: "123",
            monthly_price: 600,
            price_display: "$0.00",
            monthly_price_display: "$600.00"
        }
    },
    os_li: {
        5: {
            id: "5",
            price: 0,
            img: "freebsd-button.png",
            short_desc: "FreeBSD",
            long_desc: "Latest FreeBSD 6.x OS<br><pre>CP(s): cPanel/DirectAdmin</pre>",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        12: {
            id: "12",
            price: 0,
            img: "debian-logo-50.png",
            short_desc: "Debian Linux",
            long_desc: "Debian 4.0<pre>CP(s): None</pre>",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        24: {
            id: "24",
            price: 0,
            img: "centos.png",
            short_desc: "Proxmox VE",
            long_desc: "",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        25: {
            id: "25",
            price: 0,
            img: "",
            short_desc: "VMware ESXi",
            long_desc: "",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        26: {
            id: "26",
            price: 0,
            img: "",
            short_desc: "FreeNAS",
            long_desc: "",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        30: {
            id: "30",
            price: 0,
            img: "ubuntu.png",
            short_desc: "Ubuntu LTS",
            long_desc: "Ubuntu 20.04 Linux LTS",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        51: {
            id: "51",
            price: 0,
            img: "",
            short_desc: "AlmaLinux",
            long_desc: "",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        17: {
            id: "17",
            price: 100,
            img: "cloudlinux.png",
            short_desc: "Cloud Linux",
            long_desc: "",
            monthly_price: 12,
            active: "1",
            price_display: "$100.00",
            monthly_price_display: "$12.00"
        },
        28: {
            id: "28",
            price: 100,
            img: "win2008.jpg",
            short_desc: "Windows 2019 Standard",
            long_desc: "<pre>Windows 2019 Standard<br>CP(s): None</pre>",
            monthly_price: 20,
            active: "1",
            price_display: "$100.00",
            monthly_price_display: "$20.00"
        },
        29: {
            id: "29",
            price: 100,
            img: "win2008.jpg",
            short_desc: "Windows 10 Pro",
            long_desc: "<pre>Windows 10 Professional<br>CP(s): None</pre>",
            monthly_price: 20,
            active: "1",
            price_display: "$100.00",
            monthly_price_display: "$20.00"
        },
        37: {
            id: "37",
            price: 100,
            img: "win2008.jpg",
            short_desc: "Windows 2022 Standard",
            long_desc: "<pre>Windows 2022 Standard<br>CP(s): None</pre>",
            monthly_price: 20,
            active: "1",
            price_display: "$100.00",
            monthly_price_display: "$20.00"
        },
        27: {
            id: "27",
            price: 0,
            img: "",
            short_desc: "Windows 2019 Datacenter",
            long_desc: "",
            monthly_price: 200,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$200.00"
        },
        44: {
            id: "44",
            price: 0,
            img: "",
            short_desc: "Windows 2022 Datacenter",
            long_desc: "",
            monthly_price: 200,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$200.00"
        }
    },
    cp_li: {
        1: {
            id: "1",
            price: 0,
            img: "",
            short_desc: "None",
            long_desc: "",
            os_type: "",
            monthly_price: 0,
            types: [""],
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        3: {
            id: "3",
            price: 50,
            img: "directadmin.gif",
            short_desc: "Direct Admin ($15)",
            long_desc: "DirectAdmin.com",
            os_type: "1 2 4 5 8 23 30 51",
            monthly_price: 0,
            types: ["1", "2", "4", "5", "8", "23", "30", "51"],
            price_display: "$50.00",
            monthly_price_display: "$0.00"
        },
        5: {
            id: "5",
            price: 0,
            img: "keyboard.jpg",
            short_desc: "No Control Panel",
            long_desc: "No Control panel intalled",
            os_type: "1 2 3 4 5 6 7 8 9 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 37 44 51",
            monthly_price: 0,
            types: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "37", "44", "51"
            ],
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        6: {
            id: "6",
            price: 180,
            img: "cpanel.gif",
            short_desc: "Cpanel/WHM ($45+) & LiteSpeed ($65+)",
            long_desc: "Cpanel And Webhost Manager Plus the Litespeed Web server",
            os_type: "1 2 4 5 8 23 30 51",
            monthly_price: 0,
            types: ["1", "2", "4", "5", "8", "23", "30", "51"],
            price_display: "$180.00",
            monthly_price_display: "$0.00"
        },
        7: {
            id: "7",
            price: 0,
            img: "",
            short_desc: "Plesk Unlimited ($48)",
            long_desc: "",
            os_type: "1 2 4 5 8 17 23",
            monthly_price: 0,
            types: ["1", "2", "4", "5", "8", "17", "23"],
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        8: {
            id: "8",
            price: 0,
            img: "",
            short_desc: "Webuzo (Free)",
            long_desc: "",
            os_type: "1 2 4 5 8 17 23 30 51",
            monthly_price: 0,
            types: ["1", "2", "4", "5", "8", "17", "23", "30", "51"],
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        9: {
            id: "9",
            price: 80,
            img: "cpanel.gif",
            short_desc: "cPanel ($45+)",
            long_desc: "",
            os_type: "1 2 4 5 8 17 23 30 51",
            monthly_price: 0,
            types: ["1", "2", "4", "5", "8", "17", "23", "30", "51"],
            price_display: "$80.00",
            monthly_price_display: "$0.00"
        }
    },
    raid_li: [
        {
            id: "0",
            price: 0,
            img: "raid.png",
            short_desc: "No Raid",
            long_desc: "No Raid",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        {
            id: "1",
            price: 0,
            img: "raid.png",
            short_desc: "Software Raid 0",
            long_desc: "Software Raid 0",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        {
            id: "2",
            price: 0,
            img: "raid.png",
            short_desc: "Software Raid 1",
            long_desc: "Software Raid 1",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        {
            id: "3",
            price: 0,
            img: "raid.png",
            short_desc: "ZFS Raid z2",
            long_desc: "ZFS Raid z2",
            monthly_price: 0,
            active: "1",
            price_display: "$0.00",
            monthly_price_display: "$0.00"
        },
        {
            id: "4",
            price: 50,
            img: "raid.png",
            short_desc: "Hardware Raid 0",
            long_desc: "Hardware Raid 0",
            monthly_price: 50,
            active: "1",
            price_display: "$50.00",
            monthly_price_display: "$50.00"
        },
        {
            id: "5",
            price: 50,
            img: "raid.png",
            short_desc: "Hardware Raid 1",
            long_desc: "Hardware Raid 1",
            monthly_price: 50,
            active: "1",
            price_display: "$50.00",
            monthly_price_display: "$50.00"
        },
        {
            id: "6",
            price: 50,
            img: "raid.png",
            short_desc: "Software Raid 5",
            long_desc: "Software Raid 5",
            monthly_price: 50,
            active: "1",
            price_display: "$50.00",
            monthly_price_display: "$50.00"
        },
        {
            id: "7",
            price: 50,
            img: "raid.png",
            short_desc: "Hardware Raid 5",
            long_desc: "Hardware Raid 5",
            monthly_price: 50,
            active: "1",
            price_display: "$50.00",
            monthly_price_display: "$50.00"
        }
    ]
});
const fieldLabel = ref({
    bandwidth: {
        name: "Bandwidth",
        active: 1
    },
    ips: {
        name: "IPs",
        active: 0
    },
    os: {
        name: "Operating System",
        active: 1
    },
    cp: {
        name: "Control Panel",
        active: 0
    },
    raid: {
        name: "Raid"
    },
    memory: {
        name: "Memory"
    },
    hd: {
        name: "Hard Drives"
    }
});
const cpuCores = ref({
    4: {
        34: {
            id: "34",
            price: 500,
            img: "xeon-e3.png   ",
            short_desc: "Xeon E3-1230",
            long_desc: "",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "3.2",
            cache: "",
            active: "1",
            num_cores: "4",
            num_cpus: "1",
            benchmark: "18730",
            monthly_price: 24,
            max_ram: "32",
            min_ram: "32",
            max_lff: "2",
            max_sff: "4",
            max_nve: "0",
            visible: "yes",
            hd_ids: null,
            price_display: "$500.00",
            monthly_price_display: "$24.00",
            memory_det: {
                id: "21",
                monthly_price: 15,
                short_desc: "32GB",
                monthly_price_display: "$15.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$44.00"
        },
        42: {
            id: "42",
            price: 0,
            img: "xeon-e3.png   ",
            short_desc: "Xeon E3-1230 v6",
            long_desc: "The Intel Xeon E3-1230 v6 is the 6th version of the very popular E3 series. It was launched during the 1st quarter of 2017. The CPU is very stable in the server environment.  There are 4 cores and 8 threads. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "3.5",
            cache: "",
            active: "1",
            num_cores: "4",
            num_cpus: "1",
            benchmark: "22195",
            monthly_price: 104,
            max_ram: "64",
            min_ram: "16",
            max_lff: "2",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$104.00",
            memory_det: {
                id: "20",
                monthly_price: 5,
                short_desc: "16GB",
                monthly_price_display: "$5.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$114.00"
        }
    },
    6: {
        184: {
            id: "184",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5600X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5600X CPU has 6 cores and runs at 3.8Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.8",
            cache: "",
            active: "1",
            num_cores: "6",
            num_cpus: "1",
            benchmark: "44919",
            monthly_price: 35,
            max_ram: "64",
            min_ram: "64",
            max_lff: "2",
            max_sff: "2",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$35.00",
            memory_det: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$70.00"
        }
    },
    12: {
        72: {
            id: "72",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 3900X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 3900X CPU has 12 cores and runs at 3.8Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.8",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "82789",
            monthly_price: 65,
            max_ram: "128",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$65.00",
            memory_det: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$100.00"
        },
        121: {
            id: "121",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5900X",
            long_desc: "The AMD Ryzen with 12 cores and 24 processing threads. Clock speed of 3.7 GHz and 4.8 GHz Max Boost.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.7",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "117510",
            monthly_price: 75,
            max_ram: "128",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$75.00",
            memory_det: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$110.00"
        },
        36: {
            id: "36",
            price: 500,
            img: "xeon-2x.png   ",
            short_desc: "2 x Six-Core E5-2620",
            long_desc: "",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "2",
            benchmark: "39606",
            monthly_price: 100,
            max_ram: "256",
            min_ram: "64",
            max_lff: "4",
            max_sff: "4",
            max_nve: "0",
            visible: "yes",
            hd_ids: null,
            price_display: "$500.00",
            monthly_price_display: "$100.00",
            memory_det: {
                id: "22",
                monthly_price: 30,
                short_desc: "64GB",
                monthly_price_display: "$30.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$135.00"
        },
        254: {
            id: "254",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 7900X",
            long_desc: "High core and thread count: The AMD Ryzen 7900x can be advantageous for server workloads that benefit from parallel processing. Good value for money: AMD processors typically offer better value for money compared to Intel processors, particularly in terms of the price-to-performance ratio. Overall, the AMD Ryzen processor series can be a good choice for a dedicated server, particularly if your workload benefits from a high number of cores and threads, and if you are looking for good value for money.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "4.7",
            cache: "",
            active: "1",
            num_cores: "12",
            num_cpus: "1",
            benchmark: "126374",
            monthly_price: 150,
            max_ram: "128",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$150.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$225.00"
        }
    },
    24: {
        242: {
            id: "242",
            price: 0,
            img: "epyc.png",
            short_desc: "AMD EPYC 7401P",
            long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "2",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "1",
            benchmark: "89352",
            monthly_price: 95,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$95.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$170.00"
        },
        48: {
            id: "48",
            price: 0,
            img: "epyc.png",
            short_desc: "AMD EPYC 7402P",
            long_desc: "AMD crushes the competition with the new line of EPYC CPU. This 24 core single CPU server is made by HP. HP servers are known for reliability and being able to easily handle intensive workloads. Twenty four CPU cores are perfect for virtualization. \r\n\r\n&lt;br&gt;&lt;br&gt;\r\n\r\nOrder with 1GB Port and we will upgrade it to 10GB Port. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "2.8",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "1",
            benchmark: "111233",
            monthly_price: 105,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$105.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$180.00"
        },
        51: {
            id: "51",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2678v3 (Storage)",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2678v3 CPUs. They come loaded with 128GB of Memory. Up to 12 Full-Size hard drives can be installed. 14TB * 12 will give you 168TB of storage per server. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "24",
            num_cpus: "2",
            benchmark: "82632",
            monthly_price: 175,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "12",
            max_sff: "12",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$175.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$250.00"
        }
    },
    16: {
        93: {
            id: "93",
            price: 0,
            img: "ryzen.png",
            short_desc: "AMD RYZEN 5950X",
            long_desc: "The AMD Ryzen family is an x86-64 microprocessor family from AMD, based on the Zen microarchitecture. The RYZEN 5950X CPU has 16 cores and runs at 3.4Ghz per core.",
            location: "New York",
            fsb: "",
            manu: "",
            type: "AMD",
            speed: "3.4",
            cache: "",
            active: "1",
            num_cores: "16",
            num_cpus: "1",
            benchmark: "126374",
            monthly_price: 104,
            max_ram: "128",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$104.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$179.00"
        }
    },
    28: {
        79: {
            id: "79",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2680v4 8SFF",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. These CPUs have 14 cores each for a total of 28 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "28",
            num_cpus: "2",
            benchmark: "109118",
            monthly_price: 135,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$135.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$210.00"
        },
        128: {
            id: "128",
            price: 0,
            img: "xeon-2x.png   ",
            short_desc: "2 x Xeon E5-2680v4 4LFF",
            long_desc: "These are HP DL360 Gen9 dedicated servers with dual E5-2680v4 CPUs. They come loaded with 128GB of Memory. Up to 4 full-size hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "28",
            num_cpus: "2",
            benchmark: "109118",
            monthly_price: 135,
            max_ram: "1024",
            min_ram: "128",
            max_lff: "4",
            max_sff: "4",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$135.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$210.00"
        }
    },
    32: {
        163: {
            id: "163",
            price: 0,
            img: "xeongold.png",
            short_desc: "2 x Xeon Gold 6130 8SFF",
            long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6130R CPUs. These CPUs have 16 cores each for a total of 32 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.7",
            cache: "",
            active: "1",
            num_cores: "32",
            num_cpus: "2",
            benchmark: "116318",
            monthly_price: 300,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$300.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$375.00"
        }
    },
    52: {
        86: {
            id: "86",
            price: 0,
            img: "xeongold.png",
            short_desc: "2 x Xeon Gold 6230R 8SFF",
            long_desc: "These are HP DL360 Gen10 dedicated servers with dual Xeon Gold 6230R CPUs. These CPUs have 26 cores each for a total of 52 cores. They come loaded with 128GB of Memory. Up to 8 hard drives can be installed. If you need a custom configuration please contact us directly. ",
            location: "New York",
            fsb: "",
            manu: "",
            type: "XEON",
            speed: "2.1",
            cache: "",
            active: "1",
            num_cores: "52",
            num_cpus: "2",
            benchmark: "186318",
            monthly_price: 425,
            max_ram: "2048",
            min_ram: "128",
            max_lff: "0",
            max_sff: "8",
            max_nve: "2",
            visible: "yes",
            hd_ids: null,
            price_display: "$0.00",
            monthly_price_display: "$425.00",
            memory_det: {
                id: "23",
                monthly_price: 70,
                short_desc: "128GB",
                monthly_price_display: "$70.00"
            },
            hd_det: {
                id: "16",
                price: "150",
                img: "hd.jpg",
                short_desc: "2TB SATA",
                long_desc: "Capacity: 1.5TB<br>\r\nAverage seek time: &lt; 9ms <br>\r\nRotational speed: 7200 RPM <br>\r\n8MB cache buffer <br>\r\nSATA",
                manu: "IDE",
                size: "2000",
                type: "",
                hidden: "0",
                monthly_price: 5,
                drive_type: "lff",
                monthly_price_display: "$5.00"
            },
            monthly_fee: "$500.00"
        }
    }
});
</script>

<template>
    <template v-if="!step || step == 'order_form'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server
                            </h3>
                            <div class="card-tools float-right">
                                <a href="view_servers_list" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init" action="order_server">
                            {* <input type="hidden" name="csrf_token" value="{$csrfToken}"> *}
                            <div class="form-group row">
                                <label class="col-md-1 px-0">CPU<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-11">
                                    <div v-for="(cpu_details, id) in cpuLi" :key="id" class="icheck-success d-inline w-100">
                                        <input :id="'ds-' + id" type="radio" class="form-check-input" name="cpu" :value="id" :checked="cpu === id" @change="updatePrice">
                                        <label class="font-weight-normal w-100" :for="'ds-' + id">
                                            <div class="row mb-2">
                                                <div class="col-md-3">
                                                    <img class="pr-2" :src="'/images/v2-images/'+cpu_details.img" style="max-width: 100px;">
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="text-sm text-bold">{{ cpu_details.short_desc }}</div>
                                                    <div class="text-sm text-bold">{{ cpu_details.num_cores }} Cores</div>
                                                </div>
                                                <div class="col-md-4 text-right">
                                                    <span class="text-md text-bold pl-2 text-green">{{ cpu_details.monthly_price_display }}</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order btn-sm px-3 py-2">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Dedicated Server</div>
                            <div id="package_period" class="col text-right">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8 cpu_name">CPU</div>
                            <div class="col text-lg text-right cpu_cost"></div>
                        </div>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-lg text-right total_cost"></div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
                <!-- Server Recommendations -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2">
                                <i class="fa fa-hand-o-right">&nbsp;</i>Recommendations
                            </h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-for="(cpu_det, core) in cpuCores" :key="core">
                            <a href="javascript:void(0);" :id="'core-' + core" data-toggle="modal" :data-target="'#coreM-' + core" class="btn btn-sm btn-secondary m-2" style="min-width: 100px;">{{ core }}-Cores</a>
                            <div :id="'coreM-' + core" class="modal fade">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header border-0 p-4">
                                            <h4>{{ core }}-Cores Servers</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div v-for="cpu_details in cpu_det" :key="cpu_details.id">
                                                <div class="row">
                                                    <div class="col"><img :src="'/images/v2-images/' + cpu_details.img" style="max-width: 100px;"></div>
                                                    <div class="col">
                                                        <div class="text-lg font-weight-light">{{ cpu_details.short_desc }}</div>
                                                        <div class="text-sm text-green">{{ cpu_details.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-lg">{{ cpu_details.memory_det.short_desc }}</div>
                                                        <div class="text-sm">RAM</div>
                                                        <div class="text-sm text-sm text-green">{{ cpu_details.memory_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-lg" v-if="cpu_details.hd_det">{{ cpu_details.hd_det.short_desc }}</div>
                                                        <div class="text-sm">HDD</div>
                                                        <div class="text-sm text-sm text-green" v-if="cpu_details.hd_det">{{ cpu_details.hd_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-green text-lg">{{ cpu_details.monthly_fee }}</div>
                                                        <div class="text-sm">Total Cost per month</div>
                                                    </div>
                                                    <div class="col">
                                                        <a :href="'/order_server?cpu=' + cpu_details.id" class="btn px-4 mt-2 py-2 btn-green btn-sm">Order</a>
                                                    </div>
                                                </div>
                                                <hr class="w-100">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Server Recommendations -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'step2'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server
                            </h3>
                            <div class="card-tools float-right">
                                <a href="order_server" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back">
                                    <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init" action="order_server">
                            <input id="cpu" type="hidden" name="cpu" :value="form_values.cpu">
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order">
                            <template v-for="(inputDetails, inputName) in configLi" :key="inputName">
                                <template v-if="inputName !== 'cpuLi'">
                                    <template v-if="['memory_li', 'hd_li'].includes(inputName)">
                                        <div class="form-group row">
                                            <label class="col-md-3 col-form-label text-right">
                                                {{ fieldLabel[inputName.replace('_li', '')].name }}
                                                <span class="text-danger"> *</span>
                                            </label>
                                            <div class="input-group col-md-9">
                                                <div v-for="(details, id) in inputDetails[cpu]" :key="id">
                                                    <div v-if="inputName === 'memory_li'" class="icheck-success d-inline w-100">
                                                        <input :id="'ds-' + inputName.replace('_li', '') + '-' + id" class="form-check-input" type="radio" :name="inputName.replace('_li', '')" :value="id" :checked="formValues[inputName.replace('_li', '')] === id" @change="updatePrice()" />
                                                    </div>
                                                    <label v-if="details.index === 0 && inputName === 'hd_li'" class="font-weight-normal w-100">
                                                        <div class="row mb-2">
                                                            <div class="col-md-12">
                                                                <table class="table table-sm table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Drive Type</th>
                                                                            <th>LFF</th>
                                                                            <th>SFF</th>
                                                                            <th>NVE</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Max Drives</td>
                                                                            <td id="drives-lff">0/4</td>
                                                                            <td id="drives-sff">0/4</td>
                                                                            <td id="drives-nve">0/2</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                    </label>
                                                    <label v-if="details.index !== 0 || inputName !== 'hd_li'" :for="'ds-' + inputName.replace('_li', '') + '-' + id" :class="'font-weight-normal w-100' + (inputName === 'hd_li' ? ' drive-row-' + details.drive_type : '')">
                                                        <div class="row mb-2">
                                                            <div class="col-md-8">
                                                                <div class="text-md font-weight-light">
                                                                    <template v-if="inputName === 'hd_li'">
                                                                        <button type="button" :id="'drive-remove-' + id" class="remove-button btn btn-xs btn-secondary pb-0" @click="removeDrive(id, details.drive_type)">
                                                                            <i class="fa fa-minus"></i>
                                                                        </button>
                                                                        <b>/</b>
                                                                        <button type="button" :id="'drive-add-' + id" class="add-button btn btn-success btn-xs pb-0" @click="addDrive(id, details.drive_type, details.short_desc, details.monthly_price)">
                                                                            <i class="fa fa-plus"></i>
                                                                        </button>
                                                                    </template>
                                                                    <span class="ml-2 text-bold text-sm">{{ details.short_desc }}</span>
                                                                    <template v-if="inputName === 'hd_li'">
                                                                        <span class="ml-2 badge bg-info">{{ details.drive_type | upper }}</span>
                                                                    </template>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4 text-right">
                                                                <span class="text-md text-bold pl-2 text-green">{{ details.monthly_price_display }}</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <div v-else class="form-group row">
                                        <label class="col-md-3 col-form-label text-right">
                                            {{ fieldLabel }}
                                            <span class="text-danger"> *</span>
                                        </label>
                                        <div class="input-group col-md-9 {{ inputName }}-row">
                                            <div v-for="(details, id) in inputDetails" :key="id" class="icheck-success d-inline w-100">
                                                <input :id="'ds-' + inputName.replace('_li', '') + '-' + id" type="radio" class="form-check-input" :name="inputName.replace('_li', '')" :value="id" :checked="formValues[inputName.replace('_li', '')] == id" @change="updatePrice()" />
                                                <label :for="'ds-' + inputName.replace('_li', '') + '-' + id" class="font-weight-normal w-100">
                                                    <div class="row mb-2">
                                                        <div class="col-md-8">
                                                            <div class="text-sm text-bold">{{ details.short_desc }}</div>
                                                        </div>
                                                        <div class="col-md-4 text-right">
                                                            <span class="text-md text-bold pl-2 text-green">{{ details.monthly_price_display }}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center;">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order px-3 py-2 btn-sm">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Dedicated Server</div>
                            <div id="package_period" class="col text-right text-bold">1 Month(s)</div>
                        </div>
                        <div class="row mb-3 cpu-row">
                            <div class="col-md-8"><span class="cpu_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">CPU</span>
                            </div>
                            <div class="col text-md text-bold text-right cpu_cost"></div>
                        </div>
                        <div class="row mb-3 d-none memory-row">
                            <div class="col-md-8">
                                <span class="memory_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">RAM</span>
                            </div>
                            <div class="col text-md text-bold text-right memory_cost"></div>
                        </div>
                        <div id="hd-row" class="d-none">

                        </div>
                        <div class="row mb-3 d-none bandwidth-row">
                            <div class="col-md-8">
                                <span class="bandwidth_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                            </div>
                            <div class="col text-md text-bold text-right bandwidth_cost"></div>
                        </div>
                        <div class="row mb-3 d-none ips-row">
                            <div class="col-md-8">
                                <span class="ips_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">IP</span>
                            </div>
                            <div class="col text-md text-bold text-right ips_cost"></div>
                        </div>
                        <div class="row mb-3 d-none os-row">
                            <div class="col-md-8">
                                <span class="os_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">OS</span>
                            </div>
                            <div class="col text-md text-bold text-right os_cost"></div>
                        </div>
                        <div class="row mb-3 d-none cp-row">
                            <div class="col-md-8">
                                <span class="cp_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                            </div>
                            <div class="col text-md text-bold text-right cp_cost"></div>
                        </div>
                        <div class="row mb-3 d-none raid-row">
                            <div class="col-md-8">
                                <span class="raid_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">RAID</span>
                            </div>
                            <div class="col text-md text-bold text-right raid_cost"></div>
                        </div>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-lg text-bold text-right total_cost"></div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'confirm_order'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card shadow-none">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="edit_order_form" method="post" action="order_server">
                            <input v-for="(field_value, field) in form_values" :key="field" type="hidden" :id="field" :name="field" :value="field_value" v-if="field !== 'hd'" />
                            <input v-for="(hd_val, indexx) in hd_values" :key="indexx" class="input-hd" type="hidden" name="hd[]" :value="hd_val" />
                            <input type="hidden" name="Submit" />
                        </form>
                        <form method="post" class="dserver_form_confirm" action="order_server">
                            <input v-for="(field_value, field) in form_values" :key="field" type="hidden" :id="field" :name="field" :value="field_value" v-if="field !== 'hd'" />
                            <input v-for="(hd_val, indexx) in hd_values" :key="indexx" type="hidden" name="hd[]" :value="hd_val" />
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order" />
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Server Hostname<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-8">
                                    <input type="text" class="form-control form-control-sm" name="servername" :value="servername" placeholder="server.hostname.com" required />
                                    <small class="form-text text-muted">
                                        <b>Example: server.hostname.com</b><br />
                                        Use the hostname to identify the server. The domain does not need to be valid or registered. One period is required in the hostname. Other examples: database.local, web.server or your.name.
                                    </small>
                                </div>
                            </div>
                            <div id="rootpassrownew" class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group input-group col-md-8">
                                    <input placeholder="Enter Password" v-model="rootpass" class="form-control form-control-sm" required>
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters,one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-4 col-form-label text-right">Comments</label>
                                <div class="form-group input-group  col-md-8">
                                    <textarea placeholder="Enter Comment" rows="5" v-model="comment" class="form-control form-control-sm" id="comment"></textarea>
                                </div>
                            </div>
                            <hr>
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <div id="package_name" class="float-left" style="position: relative;top: 5px;">Dedicated Server</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" onclick="edit_form()" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div id="package_period" class="text-bold">1 Month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span class="cpu_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">CPU</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cpu_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="memory_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAM</span>
                                        </td>
                                        <td>
                                            <div class="text-bold memory_cost"></div>
                                        </td>
                                    </tr>
                                    <tr v-for="(hd_value, index) in hdValues" :key="index">
                                        <td>
                                            <span class="hd_name">{{ configLi['hd_li'][cpu][hdValue]['drive_type'].toUpperCase() }} - {{ configLi['hd_li'][cpu][hdValue]['short_desc'] }}</span>
                                            <span class="badge badge-pill badge-warning ml-2">HDD</span>
                                        </td>
                                        <td>
                                            <div class="text-bold hd_cost">{{ configLi['hd_li'][cpu][hdValue]['monthly_price_display'] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="bandwidth_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                                        </td>
                                        <td>
                                            <div class="text-bold bandwidth_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="ips_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">IP</span>
                                        </td>
                                        <td>
                                            <div class=" text-bold ips_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="os_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">OS</span>
                                        </td>
                                        <td>
                                            <div class="text-bold os_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="cp_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cp_cost"></div>
                                        </td>
                                    </tr>
                                    <tr class="d-none raid-row">
                                        <td>
                                            <span class="raid_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAID</span>
                                        </td>
                                        <td class="text-bold raid_cost"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="col-md-10 text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-lg text-bold total_cost"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="pb-1 pt-3">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">
                                    By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.
                                </p>
                                <p class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline;" value="yes">
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center;">
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
</style>