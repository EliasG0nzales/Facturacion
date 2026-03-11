import React, { useState } from 'react';

const styles = `
  .stock-page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .stock-page-container * { color:#212529; box-sizing:border-box; }
  .stock-title { font-size:18px; font-weight:bold; margin-bottom:10px; }
  .stock-subtitle { font-size:12px; }
  .stock-buscar { margin:12px 0; display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .stock-buscar b { font-size:13px; }
  .stock-select, .stock-input {
    padding:5px 8px;
    border:1px solid #ced4da;
    border-radius:4px;
    font-size:13px;
    background:#fff;
    color:#212529;
  }
  .stock-input { min-width:200px; }
  .botonNuevo {
    background-color:#17a2b8;
    border:1px solid #17a2b8;
    color:#fff !important;
    padding:6px 14px;
    cursor:pointer;
    font-size:13px;
    font-weight:bold;
    border-radius:4px;
    display:inline-flex;
    align-items:center;
    gap:5px;
  }
  .botonNuevo:hover { background-color:#138496; }
  #myProgress {
    position:relative;
    width:100%;
    height:26px;
    background-color:#ddd;
    border-radius:4px;
    overflow:hidden;
  }
  #myBar {
    position:absolute;
    width:1%;
    height:100%;
    background-color:#4CAF50;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:12px;
    white-space:nowrap;
  }
  .stock-table-wrapper { margin-top:12px; overflow-x:auto; }
  .stock-table {
    width:100%;
    border-collapse:collapse;
    font-size:12px;
  }
  .stock-table thead tr { background-color:#17a2b8; }
  .stock-table thead th {
    padding:8px 6px;
    text-align:left;
    font-weight:bold;
    color:#fff;
    border-bottom:1px solid #138496;
    white-space:nowrap;
  }
  .stock-table thead th b {
    color:#fff !important;
  }
  .stock-table tbody tr:nth-child(even) { background:#f9f9f9; }
  .stock-table tbody tr:hover { background:#f2f2ec; }
  .stock-table tbody td {
    padding:6px 6px;
    border-bottom:1px solid #e1e5ea;
  }
  .stock-table tbody td.stock-num {
    color:#555;
    font-weight:normal;
  }
  .stock-empty {
    text-align:center;
    color:#888;
    padding:16px 8px;
  }
  .stock-export {
    text-align:right;
    margin-top:16px;
    font-size:13px;
  }
  .stock-export a {
    color:green;
    font-weight:bold;
    text-decoration:none;
  }
  .stock-export a:hover { text-decoration:underline; }
`;

// Categoras que se usan como primera columna en los datos
const CATEGORIAS = ['Procesador', 'Placa Madre', 'Tarjeta de Video', 'Mouse', 'Case', 'Memoria Ram', 'Disco SSD', 'Kit', 'Fuente de Poder', 'Parlante', 'Estabilizador'];

function parseNum(s) {
  const n = parseFloat(String(s).replace(',', '.').replace(' und', '').trim());
  return Number.isNaN(n) ? 0 : n;
}

const RAW_STOCK = `Monitor Samsung led 27" Odyssey G3 ls27ag320nlxpe 165hz 1ms	2.00 und	2.00 und	0.00 und
Monitor gigabyte 27" G27F2 165hz 1ms	0.00 und	2.00 und	0.00 und
Monitor gigabyte 27" G27FC A 165hz curvo	0.00 und	2.00 und	0.00 und
Procesador	Procesador Intel Core i3 12100F lga 1700	0.00 und	3.00 und	0.00 und
Procesador	Procesador Intel Core i3 12100 lga 1700	0.00 und	7.00 und	0.00 und
Procesador	Procesador Intel Core i3 13100 lga 1700	0.00 und	9.00 und	0.00 und
Procesador	Procesador Intel Core i5 12400F lga 1700	0.00 und	9.00 und	0.00 und
Procesador	Procesador Intel Core i5 13400F lga 1700	0.00 und	2.00 und	0.00 und
Procesador	Procesador Intel Core i5 13400 lga 1700	0.00 und	5.00 und	0.00 und
Procesador	Procesador Intel Core i5 12600K lga 1700	0.00 und	2.00 und	0.00 und
Mouse	Mouse Logitech G PRO X Superlight 2 wireless lightspeed black	0.00 und	1.00 und	0.00 und
Tinta Hp Hp	0.00 und	70.00 und	0.00 und
Monitor Curvo Teros TE-3412G 34" UltraWide WQHD 165Hz 1ms FreeSync	0.00 und	5.00 und	0.00 und
Monitor Curvo Gaming TEROS TE-3412G	0.00 und	2.00 und	0.00 und
MONITOR TEROS TE-2130CS	0.00 und	1.00 und	0.00 und
MONITOR TEROS TE-2128S	0.00 und	1.00 und	0.00 und
MONITOR TEROS TE-2415S	0.00 und	1.00 und	0.00 und
MONITOR TEROS TE-2417S	0.00 und	1.00 und	0.00 und
MONITOR TEROS TE-2714S	0.00 und	1.00 und	0.00 und
MONITOR TEROS TE-2732S	0.00 und	1.00 und	0.00 und
Case	Case micro atx Teros Te-1028s, mini tower 250w	70.00 und	0.00 und	0.00 und
Placa Madre	Placa madre B550m-k gigabyte	0.00 und	14.00 und	0.00 und
Placa Madre	Placa madre B550m pro-vdh wifi msi	0.00 und	4.00 und	0.00 und
Placa Madre	Placa madre H311 LGA 1151 Intel Core 6/7/8/9 Gen, ddr4	0.00 und	2.00 und	0.00 und
Placa Madre	Placa madre B75 LGA 1155 Intel Core 2da/3ra Gen, ddr3	0.00 und	0.00 und	0.00 und
Procesador	Procesador Intel Core i5 10400F 2,9ghz	0.00 und	13.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3060 asus dual, 12GB GDDR6	0.00 und	6.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3060 gaming oc, 12GB GDDR6	0.00 und	1.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3060 ventus 3x oc, 12GB GDDR6	0.00 und	7.00 und	0.00 und
Procesador	Procesador Ryzen 5 4600g 3,70ghz	0.00 und	28.00 und	0.00 und
MONITOR TEROS TE-3215G	0.00 und	1.00 und	0.00 und
MONITOR XIAOMI G27I	0.00 und	1.00 und	0.00 und
MONITOR XIAOMI G27I	0.00 und	1.00 und	0.00 und
MONITOR XIAOMI G27QI	0.00 und	1.00 und	0.00 und
MONITOR MSI MAG 254F	0.00 und	1.00 und	0.00 und
MONITOR MSI G275L E14	0.00 und	1.00 und	0.00 und
RTX 3050 WINDOFORCE OC 6GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 3050 GAMING X 6GB MSI	0.00 und	1.00 und	0.00 und
RTX 3050 DUAL OC 6GB ASUS	0.00 und	1.00 und	0.00 und
RTX 3060 VENTUS 3X 12GB MSI	0.00 und	1.00 und	0.00 und
Placa Madre	Placa madre A520m a pro MSi	0.00 und	5.00 und	0.00 und
Placa Madre	Placa madre H310m pro vdh MSi	0.00 und	1.00 und	0.00 und
Placa Madre	Placa madre H410m s2h v2 gigabyte	0.00 und	9.00 und	0.00 und
Placa Madre	Placa madre H510m-e asus	0.00 und	17.00 und	0.00 und
Placa Madre	Placa madre H510m-b msi	0.00 und	46.00 und	0.00 und
Placa Madre	Placa madre B560m-a Asus	0.00 und	10.00 und	0.00 und
Placa Madre	Placa madre pro B760m-p ddr4 msi	0.00 und	9.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3060 ventus 2x oc, 12GB GDDR6	0.00 und	16.00 und	0.00 und
Memoria Ram	Memoria ram T-Create 16gb kit (2x8gb) ddr4 3200mhz	0.00 und	12.00 und	0.00 und
Disco SSD	SSD 512gb T-Force Vulcan Z 2.5" sata 3	0.00 und	66.00 und	0.00 und
Procesador	Procesador Ryzen 5 5600g 3,90ghz	0.00 und	16.00 und	0.00 und
Procesador	Procesador Ryzen 5 5500 3,60ghz	0.00 und	18.00 und	0.00 und
Placa Madre	Placa madre B450m ds3h gigabyte	0.00 und	4.00 und	0.00 und
Memoria Ram	Memoria ram T-Create 32gb kit (2x16gb) ddr4 3200mhz	0.00 und	18.00 und	0.00 und
Mouse	Mouse Logitech G203 lightsync rgb 8000 dpi black usb	0.00 und	19.00 und	0.00 und
Kit	Kit teclado + mouse Logitech MK120 usb	28.00 und	17.00 und	0.00 und
Fuente de Poder	Fuente de poder gigabyte 550w 80+ bronce	0.00 und	19.00 und	0.00 und
Fuente de Poder	Fuente de poder gigabyte 650w 80+ bronce	0.00 und	6.00 und	0.00 und
Mouse	Mouse Logitech G305 inalambrico lightspeed negro	0.00 und	3.00 und	0.00 und
Mouse	Mouse Logitech G305 inalambrico lightspeed blanco	0.00 und	1.00 und	0.00 und
Procesador	Procesador Intel Core i5 13600K lga 1700	0.00 und	4.00 und	0.00 und
Procesador	Procesador Intel Core i5 14600KF lga 1700	0.00 und	2.00 und	0.00 und
Procesador	Procesador Intel Core i5 14600K lga 1700	0.00 und	7.00 und	0.00 und
Procesador	Procesador Intel Core i7 11700F lga 1200	1.00 und	17.00 und	0.00 und
Procesador	Procesador Intel Core i7 12700F lga 1700	2.00 und	0.00 und	0.00 und
Procesador	Procesador Intel Core i7 12700 lga 1700	1.00 und	4.00 und	0.00 und
Procesador	Procesador Intel Core i7 12700KF lga 1700	0.00 und	1.00 und	0.00 und
Procesador	Procesador Intel Core i7 13700F lga 1700	9.00 und	1.00 und	0.00 und
Procesador	Procesador Intel Core i7 13700 lga 1700	2.00 und	0.00 und	0.00 und
Procesador	Procesador Intel Core i7 14700KF lga 1700	0.00 und	0.00 und	0.00 und
Placa Madre	Placa madre Asus prime B760-plus ddr5, lga 1700	0.00 und	3.00 und	0.00 und
Monitor Teros TE- 2765g 27" curvo va, 2560x1440 qhd, 165hz, 1ms	0.00 und	50.00 und	0.00 und
Monitor Teros TE- 2766g 27" curvo fhd 180hz	0.00 und	50.00 und	0.00 und
Disco SSD	ssd 2tb Kingston Fury Renegade m.2 NVMe PcIe	0.00 und	1.00 und	0.00 und
Monitor LG 22mn430 21.5"	0.00 und	8.00 und	0.00 und
Monitor Teros te-2731s 27" curvo VA, 100hz, fhd	0.00 und	55.00 und	0.00 und
Monitor Teros te-2123s 21.45" ips, fhd, 100hz, speakers	0.00 und	57.00 und	0.00 und
Procesador	Procesador AMD Ryzen 5 8500g am5	0.00 und	3.00 und	0.00 und
Monitor Lg 24mq400-b 23.8" ips fhd	0.00 und	21.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3050 ventus 2x oc, 6GB GDDR6	0.00 und	3.00 und	0.00 und
Procesador	Procesador Ryzen 7 5700g	0.00 und	5.00 und	0.00 und
Fuente de Poder	Fuente de poder P650G Gigabyte 650w 80+ gold	0.00 und	14.00 und	0.00 und
Parlante	Parlante 2.0 gamer usb Halion HA-S261 RGB	0.00 und	20.00 und	0.00 und
Mouse	Mouse gamer + pad Halion Alaska HA-920p	0.00 und	21.00 und	0.00 und
Monitor 27" ASUS Proart PA278QV 2K WQHD sRGB 100%	0.00 und	10.00 und	0.00 und
Monitor 24" ASUS Proart PA248QV IPS FHD sRGB 100%	0.00 und	1.00 und	0.00 und
Estabilizador 1200VA Forza FVR-1222USB 8 tomas	0.00 und	24.00 und	0.00 und
Disco SSD	SSD 512GB M.2 PCIE MP33 TEAM GROUP	0.00 und	20.00 und	0.00 und
Mouse	Mouse Logitech G703 ligthspeed wireless black	0.00 und	2.00 und	0.00 und
Mouse	Mouse Logitech G502 HERO 16000 DPI RGB black	0.00 und	1.00 und	0.00 und
Monitor Teros TE- 3130 2 24" ips, 1920*1080, 75hz	0.00 und	0.00 und	0.00 und
Tarjeta de Video	tarjeta de video radeon rx580 8gb Jie Shou	0.00 und	19.00 und	0.00 und
Tarjeta de Video	Tarjeta de video rtx 2060 6gb SZMZ	0.00 und	2.00 und	0.00 und
Fuente de Poder	Fuente de poder 650w IT Vision	0.00 und	9.00 und	0.00 und
Disco SSD	ssd micron from 240gb sataiii	0.00 und	9.00 und	0.00 und
Placa Madre	Placa madre B85 LGA 1150 Intel Core 4ta Gen, ddr3	0.00 und	13.00 und	0.00 und
Placa Madre	Placa madre gigabyte Z790 gaming x ax, lga 1700 ddr5 wi-fi	0.00 und	3.00 und	0.00 und
Placa Madre	Placa madre gigabyte Z790 UD AC, ddr5, lga 1700 wi-fi	0.00 und	3.00 und	0.00 und
Placa Madre	Placa madre Z790 Aorus elite ax	0.00 und	0.00 und	0.00 und
Placa Madre	Placa madre Z790-p wifi ddr5, lga 1700	0.00 und	1.00 und	0.00 und
Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200	0.00 und	46.00 und	0.00 und
Placa Madre	Placa madre A320M-K Asus	0.00 und	7.00 und	0.00 und
Monitor Teros TE- 3194N 27	0.00 und	2.00 und	0.00 und
Monitor Teros TE- 2711s 27" ips, 1920*1080, 100hz, 1ms	0.00 und	0.00 und	0.00 und
Monitor Teros TE- 3131 24" ips, 1920*1080, 75hz, curvo	34.00 und	6.00 und	4.00 und
Monitor Teros TE- 2121S 21.5" ips, 1920*1080, 100hz, 1ms	46.00 und	5.00 und	0.00 und
Mouse	SSD MSI Spatium M450 500gb m.2 nvme	0.00 und	60.00 und	0.00 und
Monitor Teros TE- 3199 27	0.00 und	0.00 und	0.00 und
Monitor Teros TE- 2411S 24" ips, 1920*1080, 100hz, 1ms	17.00 und	6.00 und	0.00 und
Monitor Teros TE- 2470G 24" ips, 1920*1080, 165hz, curvo	13.00 und	5.00 und	1.00 und
Core I5 12600kf	0.00 und	1.00 und	0.00 und
Core I7 12700kf	0.00 und	1.00 und	0.00 und
Core I7 12700k	0.00 und	1.00 und	0.00 und
Core I3 13100	0.00 und	1.00 und	0.00 und
Core I5 13600k	0.00 und	1.00 und	0.00 und
Core I7 13700	0.00 und	1.00 und	0.00 und
Core I7 13700f	0.00 und	1.00 und	0.00 und
Core I3 14100f	0.00 und	1.00 und	0.00 und
Core I5 14400f	0.00 und	1.00 und	0.00 und
Core I7 14700	0.00 und	1.00 und	0.00 und
Memoria flash Micro SDXC Kingston Canvas Go Plus 128gb	0.00 und	4.00 und	0.00 und
Micro SD kingston canvas 128gb	0.00 und	0.00 und	0.00 und
Disco SSD	SSD MSI Spatium M450 1tb PCIe 4.0 nvme m.2	0.00 und	30.00 und	0.00 und
Disco SSD	SSD WD 480gb green sata 2.5	0.00 und	0.00 und	0.00 und
Monitor LG 24gq50f 24" va 165hz FHD	0.00 und	4.00 und	0.00 und
Tarjeta de Video	Tarjeta de video RTX 3050 gaming x 6gb gddr6	0.00 und	15.00 und	0.00 und
Procesador	Procesador Ryzen 7 5700x	0.00 und	2.00 und	0.00 und
Monitor teros TE- 2440s	0.00 und	26.00 und	0.00 und
Monitor Teros TE-2401s	0.00 und	28.00 und	0.00 und
Placa Madre	Placa madre A520M-AII / CSM Asus Prime	0.00 und	0.00 und	0.00 und
RTX 3070 XC3 ULTRA 8GB EVGA	0.00 und	1.00 und	0.00 und
RTX 5060 EAGLE OC 8GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 5060 SHADOW 2X OC 8GB MSI	0.00 und	1.00 und	0.00 und
RTX 5060 TWIN EDGE 8GB ZOTAC	0.00 und	1.00 und	0.00 und
RTX 5060 EAGLE MAX OC 8GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 5060 GAMING OC 8GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 5060 TI VENTUS 2X 8GB MSI	0.00 und	1.00 und	0.00 und
RTX 5060 TI GAMING OC 8GB MSI	0.00 und	1.00 und	0.00 und
RTX 5060 TI TWIN EDGE 16GB ZOTAC	0.00 und	1.00 und	0.00 und
RTX 5060 TI VENTUS 2X 16GB MSI	0.00 und	1.00 und	0.00 und
RTX 5070 SHADOW 2X OC 12GB MSI	0.00 und	1.00 und	0.00 und
RTX 5070 WINDFORCE OC SFF 12GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 5070 PRIME OC 12GB ASUS	0.00 und	1.00 und	0.00 und
RTX 4070 TI SUPER EAGLE OC ICE 16GB GIGABYTE	0.00 und	1.00 und	0.00 und
RTX 5070 TI WINDFORCE OC SFF 16GB GIGABYTE	0.00 und	1.00 und	0.00 und
RX 580S 16GB BOETEC	0.00 und	1.00 und	0.00 und
RX 9060 XT SWIFT OC WHITE 16GB XFX	0.00 und	1.00 und	0.00 und
RX 9070 XT PRIME OC 16GB ASUS	0.00 und	1.00 und	0.00 und
core I3 12100f	0.00 und	1.00 und	0.00 und
Core I5 12400f	0.00 und	1.00 und	0.00 und
Ryzen 5 7600x	0.00 und	1.00 und	0.00 und
Ryzen 5 8400f	0.00 und	1.00 und	0.00 und
Ryzen 5 8500g	0.00 und	1.00 und	0.00 und
Ryzen 5 8600g	0.00 und	1.00 und	0.00 und
Ryzen 7 8700g	0.00 und	1.00 und	0.00 und
Ryzen 9 9950x	0.00 und	1.00 und	0.00 und
PRIME-H510M-R R2.0	0.00 und	1.00 und	0.00 und
MSI H510M-BII	0.00 und	1.00 und	0.00 und
MSI H510M-plus	0.00 und	1.00 und	0.00 und
PRIME B560m-A	0.00 und	1.00 und	0.00 und
GIGABYTE B760M GAMING WIFI PLUS	0.00 und	1.00 und	0.00 und
GIGABYTE B760M DS3H	0.00 und	1.00 und	0.00 und
GIGABYTE B760M B3H	0.00 und	1.00 und	0.00 und
GIGABYTE B760 GAMING X AX	0.00 und	1.00 und	0.00 und
B760 AORUS ELITE AX	0.00 und	1.00 und	0.00 und
MSI PRO Z790-P DDR4	0.00 und	1.00 und	0.00 und
PRO Z790-P WIFI DDR4	0.00 und	1.00 und	0.00 und
MSI MAG Z690 TOMAHAWK WIFI DDR4	0.00 und	1.00 und	0.00 und
NZXT N7 Z790	0.00 und	1.00 und	0.00 und
NZXT N7 Z790	0.00 und	1.00 und	0.00 und
MSI A520M-A PRO	0.00 und	1.00 und	0.00 und
MSI B550M PRO VDH WIFI	0.00 und	1.00 und	0.00 und
MSI MAG B550 TOMAHAWK	0.00 und	1.00 und	0.00 und
B550 ASUS TUF GAMING B550-PLUS WIFI II	0.00 und	1.00 und	0.00 und
ASUS PRIME A620M-K	0.00 und	1.00 und	0.00 und
MSI PRO B650M-P	0.00 und	1.00 und	0.00 und
MSI B650M GAMING PLUS WIFI	0.00 und	1.00 und	0.00 und
GIGABYTE B850M EAGLE WIFI 6	0.00 und	1.00 und	0.00 und
GIGABYTE X870 EAGLE WIFI 7	0.00 und	1.00 und	0.00 und
MSI MAG Z890 TOMAHAWK WIFI	0.00 und	1.00 und	0.00 und
Procesador	Procesador Intel Core i7 14700K lga 1700	0.00 und	0.00 und	0.00 und
Memoria USB Kingston DataTraveler Exodia Onyx, 64GB, USB 3.2	0.00 und	102.00 und	0.00 und
Disco SSD	SSD Kingston 1tb nv2 m.2	0.00 und	26.00 und	0.00 und
Case	Case 1st player dk-d4 blanco 4 cooler rgb vidrio templado	0.00 und	9.00 und	0.00 und
Tarjeta de Video	Tarjeta de video gtx 1650 - d6 ventus xs msi	0.00 und	4.00 und	0.00 und
adaptador usb tp link ac600 wi-fi, bluetooth 4.2	0.00 und	9.00 und	0.00 und
Fuente de poder halion 500w	0.00 und	4.00 und	0.00 und
Estabilizador 1000VA Forza FVR-1012 4 tomas	0.00 und	8.00 und	0.00 und
Procesador	Procesador Intel Core i5 11400 lga 1200	0.00 und	1.00 und	0.00 und
Fuente de Poder	Fuente de poder gigabyte ud 750w 80+ gold	0.00 und	4.00 und	0.00 und
Core I7 14700f	0.00 und	1.00 und	0.00 und
Core Ultra 5 245k	0.00 und	1.00 und	0.00 und
Core Ultra 7 265k	0.00 und	1.00 und	0.00 und
Ryzen 5 4500	0.00 und	1.00 und	0.00 und
Ryzen 3 5300g	0.00 und	1.00 und	0.00 und
Ryzen 5 5500	0.00 und	1.00 und	0.00 und
Ryzen 5 5600gt	0.00 und	1.00 und	0.00 und
Ryzen 7 5700g	0.00 und	1.00 und	0.00 und
Ryzen 7 5700x	0.00 und	1.00 und	0.00 und
Ryzen 7 5800xt	0.00 und	1.00 und	0.00 und`;

function buildDataFromRaw() {
  const lineas = RAW_STOCK.trim().split('\n');
  const out = [];
  lineas.forEach((line, i) => {
    const parts = line.split('\t');
    if (parts.length < 4) return;
    const almacen = parseNum(parts[parts.length - 3]);
    const tienda1 = parseNum(parts[parts.length - 2]);
    const tienda2 = parseNum(parts[parts.length - 1]);
    const textParts = parts.slice(0, -3);
    let categoria = '-';
    let nombre;
    if (textParts.length >= 2 && CATEGORIAS.includes(textParts[0].trim())) {
      categoria = textParts[0].trim();
      nombre = textParts.slice(1).join(' ').trim();
    } else {
      nombre = textParts.join(' ').trim();
    }
    out.push({
      codigo: 'ART-' + String(i + 1).padStart(3, '0'),
      categoria,
      nombre,
      linea: categoria !== '-' ? categoria : '',
      marca: '',
      cbarra: '',
      almacen,
      tienda1,
      tienda2,
    });
  });
  return out;
}

export const STOCK_DATA = buildDataFromRaw();
const DATA_INICIAL = STOCK_DATA;

const StockGeneral = () => {
  const [tipoBusqueda, setTipoBusqueda] = useState('');
  const [texto, setTexto] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [filtrados, setFiltrados] = useState(DATA_INICIAL);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const ejecutarBusqueda = () => {
    // Simula la barra de progreso
    setProgreso(0);
    const pasos = [25, 60, 100];
    pasos.forEach((p, i) => {
      setTimeout(() => setProgreso(p), (i + 1) * 150);
    });

    // Filtro simple en memoria. Con API real, aqu haras el fetch.
    const term = texto.trim().toLowerCase();
    let nuevo = [...DATA_INICIAL];

    if (term) {
      switch (tipoBusqueda) {
        case '1': // Nombre
          nuevo = nuevo.filter(r => r.nombre.toLowerCase().includes(term));
          break;
        case '2': // Linea
          nuevo = nuevo.filter(r => (r.linea || '').toLowerCase().includes(term));
          break;
        case '3': // Categoria
          nuevo = nuevo.filter(r => (r.categoria || '').toLowerCase().includes(term));
          break;
        case '4': // Marca
          nuevo = nuevo.filter(r => (r.marca || '').toLowerCase().includes(term));
          break;
        case '5': // Codigo
          nuevo = nuevo.filter(r => (r.codigo || '').toLowerCase().includes(term));
          break;
        case '6': // C.Barra
          nuevo = nuevo.filter(r => (r.cbarra || '').toLowerCase().includes(term));
          break;
        case '7': { // Menor a (stock total)
          const limite = parseFloat(term.replace(',', '.'));
          if (!Number.isNaN(limite)) {
            nuevo = nuevo.filter(r => {
              const total = (r.almacen || 0) + (r.tienda1 || 0) + (r.tienda2 || 0);
              return total < limite;
            });
          }
          break;
        }
        default:
          // Todos
          nuevo = nuevo.filter(r =>
            r.nombre.toLowerCase().includes(term) ||
            (r.codigo || '').toLowerCase().includes(term)
          );
      }
    }

    setFiltrados(nuevo);
    setMostrarTodos(true);
  };

  const filasMostrar = mostrarTodos ? filtrados : filtrados.slice(0, 10);
  const sinResultados = filtrados.length === 0;

  const exportarExcel = () => {
    if (!filtrados.length) return;

    const encabezado = ['CODIGO', 'CAT.', 'NOMBRE', 'ALMACEN', 'TIENDA1', 'TIENDA2'];
    const filas = filtrados.map(r => [
      r.codigo,
      r.categoria,
      `"${r.nombre}"`,
      r.almacen,
      r.tienda1,
      r.tienda2,
    ].join(','));

    const csv = [encabezado.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'stock_general.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="stock-page-container">
        <div className="stock-title">
          STOCK ACTUAL POR ALMACEN/LOCAL/SUCURSAL{' '}
          <span className="stock-subtitle">
            (<span style={{ color: '#007bff' }}>V.A.</span>)
          </span>
        </div>

        <input type="hidden" name="ver" value="" />

        <div className="stock-buscar">
          <b>BUSCAR X</b>
          <select
            className="stock-select"
            value={tipoBusqueda}
            onChange={e => setTipoBusqueda(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Nombre</option>
            <option value="2">Linea</option>
            <option value="3">Categoria</option>
            <option value="4">Marca</option>
            <option value="5">Codigo</option>
            <option value="6">C.Barra</option>
            <option value="7">Menor a</option>
          </select>
          <input
            type="text"
            className="stock-input"
            value={texto}
            onChange={e => setTexto(e.target.value)}
          />
          <button type="button" className="botonNuevo" onClick={ejecutarBusqueda}>
            ?? Buscar
          </button>
        </div>

        <div id="myProgress">
          <div
            id="myBar"
            style={{ width: `${Math.max(1, progreso)}%` }}
          >
            {progreso}%
          </div>
        </div>

        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>CAT.</th>
                <th>NOMBRE</th>
                <th title="Almacen 2B 167">Almacen</th>
                <th title="Tienda 1b 133">Tienda1</th>
                <th title="Tienda 1A 119">Tienda2</th>
              </tr>
            </thead>
            <tbody>
              {sinResultados ? (
                <tr>
                  <td colSpan={6} className="stock-empty">
                    No hay resultados para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filasMostrar.map((row, idx) => (
                  <tr key={row.codigo + '-' + idx}>
                    <td>{row.codigo}</td>
                    <td>{row.categoria}</td>
                    <td>{row.nombre}</td>
                    <td className="stock-num" style={{ textAlign: 'right' }}>{row.almacen.toFixed(2)}</td>
                    <td className="stock-num" style={{ textAlign: 'right' }}>{row.tienda1.toFixed(2)}</td>
                    <td className="stock-num" style={{ textAlign: 'right' }}>{row.tienda2.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="stock-export">
          <hr />
          <button
            type="button"
            onClick={exportarExcel}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span style={{ color: 'green', fontWeight: 'bold' }}>[Exportar a Excel]</span>
          </button>
          <hr />
        </div>
      </div>
    </>
  );
};

export default StockGeneral;
-0