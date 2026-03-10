import { useState, useRef } from "react";

/* ─── CONSTANTES ─── */
const DOCUMENTOS   = ['Boleta BI01','Factura FI01','Nota de Venta 001'];
const MONEDAS      = ['Soles','Dolares'];
const CONIGV       = ['Inc.IGV','+ IGV'];
const TIPO_OPER    = ['Venta Interna','Exportación','No Gravada'];
const PRE_ANTICIPO = ['No','Si'];
const VENDEDORES   = ['fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
                      'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const TIPO_VTA     = ['Contado','Credito'];
const PAGO_TIPO    = ['Efectivo','C.Entrega','Yape','Deposito Interbank','Deposito BBVA','Deposito BCP','Mixto'];
const TAIGV_OPTS   = [
  'Gravado - Operación Onerosa','Gravado - Retiro por premio','Gravado - Retiro por donación',
  'Gravado - Retiro','Gravado - Retiro por publicidad','Gravado - Bonificaciones',
  'Gravado - Retiro por entrega a trabajadores','Gravado - IVAP',
  'Exonerado - Operación Onerosa','Exonerado - Transferencia Gratuita',
  'Inafecto - Operación Onerosa','Inafecto - Retiro por Bonificación',
  'Inafecto - Retiro','Inafecto - Retiro por Muestras Médicas',
  'Inafecto - Retiro por Convenio Colectivo','Inafecto - Retiro por premio',
  'Inafecto - Retiro por publicidad','Exportación',
];
const MED_OPTS     = ['Und.','Kg','Lt','Cj','Pq','Doc','Par'];
const SUJETO_OPTS  = [
  '','Detraccion > (001)Azúcar y melaza de caña - 10%','Detraccion > (003)Alcohol etílico - 10%',
  'Detraccion > (012)Intermediación laboral - 10%','Detraccion > (014)Carnes y despojos - 4%',
  'Detraccion > (022)Otros servicios empresariales - 10%',
  'Detraccion > (027)Servicio de transporte de carga - 4%',
  'Detraccion > (030)Contratos de construcción - 4%',
  'Detraccion > (037)Demás servicios gravados IGV - 10%',
  'Retencion > (01)Tasa 3% - 3%','Retencion > (02)Tasa 6% - 6%',
  'Percepcion > (01)Percepción Venta Interna - 2%',
];
const GUIAS = ['Sin Guia de remision','Guia de Remision Electronica TI01'];

/* ─── BASE DE DATOS DE ARTÍCULOS (datos reales del sistema) ─── */
const ARTICULOS_DB = [
  { id:1,  codigo:'ADPT-001', nombre:'Adaptador USB TP Link AC600 Wi-Fi Bluetooth 4.2',       stock:9,   pmc:45.00,  precio:50.00,  tipo:'Producto', grupo:'Redes' },
  { id:2,  codigo:'MB-001',   nombre:'ASUS PRIME A620M-K',                                     stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:3,  codigo:'MB-002',   nombre:'ASUS PRIME B760M-A',                                     stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:4,  codigo:'MB-003',   nombre:'ASUS PRIME B860-PLUS WIFI',                              stock:1,   pmc:1.00,   precio:11.00,  tipo:'Producto', grupo:'Placas Madre' },
  { id:5,  codigo:'MB-004',   nombre:'ASUS ROG STRIX Z590-E GAMING WIFI',                      stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:6,  codigo:'MB-005',   nombre:'B550 ASUS TUF GAMING B550-PLUS WIFI II',                 stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:7,  codigo:'MB-006',   nombre:'B560 M AORUS ELITE',                                     stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:8,  codigo:'MB-007',   nombre:'B660 GAMING X AX DDR4',                                  stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:9,  codigo:'MB-008',   nombre:'B760 AORUS ELITE AX',                                    stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:10, codigo:'MB-009',   nombre:'B760M AORUS ELITE AX',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:11, codigo:'MB-010',   nombre:'B760M-F MAXSUM',                                         stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:12, codigo:'CAB-001',  nombre:'Cable HDMI 15 metros',                                   stock:0,   pmc:45.00,  precio:50.00,  tipo:'Producto', grupo:'Cables' },
  { id:13, codigo:'CASE-001', nombre:'Case 1st Player DK-D4 Blanco 4 Cooler RGB Vidrio Templado', stock:9, pmc:175.50,precio:205.83, tipo:'Producto', grupo:'Cases' },
  { id:14, codigo:'CASE-002', nombre:'Case Micro ATX Teros TE-1028S Mini Tower 250W',          stock:0,   pmc:95.85,  precio:108.90, tipo:'Producto', grupo:'Cases' },
  { id:15, codigo:'COMB-001', nombre:'Combo Gamer 4 en 1 Mack HA-875C RGB Halion',             stock:30,  pmc:138.60, precio:151.20, tipo:'Producto', grupo:'Perifericos' },
  { id:16, codigo:'CPU-001',  nombre:'Core Ultra 5 245K',                                      stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:17, codigo:'CPU-002',  nombre:'Core Ultra 7 265K',                                      stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:18, codigo:'EST-001',  nombre:'Estabilizador 1000VA Forza FVR-1012 4 Tomas',            stock:8,   pmc:57.83,  precio:63.45,  tipo:'Producto', grupo:'Estabilizadores' },
  { id:19, codigo:'EST-002',  nombre:'Estabilizador 1200VA Forza FVR-1222USB 8 Tomas',         stock:24,  pmc:88.83,  precio:95.58,  tipo:'Producto', grupo:'Estabilizadores' },
  { id:20, codigo:'FP-001',   nombre:'Fuente de Poder Gigabyte 550W 80+ Bronce',               stock:19,  pmc:268.70, precio:293.13, tipo:'Producto', grupo:'Fuentes de Poder' },
  { id:21, codigo:'FP-002',   nombre:'Fuente de Poder Gigabyte 650W 80+ Bronce',               stock:6,   pmc:302.00, precio:329.45, tipo:'Producto', grupo:'Fuentes de Poder' },
  { id:22, codigo:'FP-003',   nombre:'Fuente de Poder Gigabyte UD 750W 80+ Gold',              stock:4,   pmc:549.00, precio:576.00, tipo:'Producto', grupo:'Fuentes de Poder' },
  { id:23, codigo:'FP-004',   nombre:'Fuente de Poder Halion 500W',                            stock:4,   pmc:60.00,  precio:60.00,  tipo:'Producto', grupo:'Fuentes de Poder' },
  { id:24, codigo:'FP-005',   nombre:'Fuente de Poder P650G Gigabyte 650W 80+ Gold',           stock:14,  pmc:327.15, precio:356.85, tipo:'Producto', grupo:'Fuentes de Poder' },
  { id:25, codigo:'MB-011',   nombre:'GIGABYTE B760 GAMING X AX',                              stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:26, codigo:'MB-012',   nombre:'GIGABYTE B760 M D3HP DDR4',                              stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:27, codigo:'MB-013',   nombre:'GIGABYTE B760M B3 HP',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:28, codigo:'MB-014',   nombre:'GIGABYTE B760M BS3 H',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:29, codigo:'MB-015',   nombre:'GIGABYTE B760M GAMING WIFI PLUS',                        stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:30, codigo:'MB-016',   nombre:'GIGABYTE B840M EAGLE WIFI 6',                            stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:31, codigo:'MB-017',   nombre:'GIGABYTE X870 EAGLE WIFI 7',                             stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:32, codigo:'KIT-001',  nombre:'Kit Teclado + Mouse Logitech MK120 USB',                 stock:17,  pmc:54.00,  precio:60.75,  tipo:'Producto', grupo:'Perifericos' },
  { id:33, codigo:'MEM-001',  nombre:'Memoria Flash Micro SDXC Kingston Canvas Go Plus 128GB', stock:4,   pmc:63.00,  precio:69.84,  tipo:'Producto', grupo:'Memorias' },
  { id:34, codigo:'MEM-002',  nombre:'Memoria RAM T-Create 16GB Kit (2x8GB) DDR4 3200MHz',    stock:12,  pmc:186.75, precio:208.40, tipo:'Producto', grupo:'Memorias' },
  { id:35, codigo:'MEM-003',  nombre:'Memoria RAM T-Create 32GB Kit (2x16GB) DDR4 3200MHz',   stock:18,  pmc:328.64, precio:358.52, tipo:'Producto', grupo:'Memorias' },
  { id:36, codigo:'USB-001',  nombre:'Memoria USB Kingston DataTraveler Exodia M 64GB USB 3.2',stock:41,  pmc:20.70,  precio:23.22,  tipo:'Producto', grupo:'Memorias' },
  { id:37, codigo:'USB-002',  nombre:'Memoria USB Kingston DataTraveler Exodia Onyx 64GB USB 3.2',stock:102,pmc:20.84,precio:23.63, tipo:'Producto', grupo:'Memorias' },
  { id:38, codigo:'MSD-001',  nombre:'Micro SD Kingston Canvas 128GB',                         stock:0,   pmc:45.00,  precio:50.18,  tipo:'Producto', grupo:'Memorias' },
  { id:39, codigo:'MSD-002',  nombre:'Micro SD Kingston Canvas 64GB',                          stock:50,  pmc:24.62,  precio:26.82,  tipo:'Producto', grupo:'Memorias' },
  { id:40, codigo:'MON-001',  nombre:'Monitor 24" ASUS Proart PA248QV IPS FHD sRGB 100%',     stock:1,   pmc:1197.00,precio:1237.50,tipo:'Producto', grupo:'Monitores' },
  { id:41, codigo:'MON-002',  nombre:'Monitor 27" ASUS Proart PA278QV 2K WQHD sRGB 100%',    stock:10,  pmc:1530.00,precio:1552.50,tipo:'Producto', grupo:'Monitores' },
  { id:42, codigo:'MON-003',  nombre:'Monitor Curvo Gaming TEROS TE-3412G',                    stock:2,   pmc:900.00, precio:999.00, tipo:'Producto', grupo:'Monitores' },
  { id:43, codigo:'MON-004',  nombre:'Monitor Curvo Teros TE-3412G 34" UltraWide WQHD 165Hz', stock:5,   pmc:920.00, precio:949.00, tipo:'Producto', grupo:'Monitores' },
  { id:44, codigo:'MON-005',  nombre:'Monitor Gigabyte 27" G27F2 165Hz 1ms',                  stock:2,   pmc:1027.35,precio:1075.50,tipo:'Producto', grupo:'Monitores' },
  { id:45, codigo:'MON-006',  nombre:'Monitor Gigabyte 27" G27FC A 165Hz Curvo',              stock:2,   pmc:1018.89,precio:1065.24,tipo:'Producto', grupo:'Monitores' },
  { id:46, codigo:'MON-007',  nombre:'Monitor LG 24GQ50F 24" VA 165Hz FHD',                  stock:4,   pmc:712.62, precio:744.98, tipo:'Producto', grupo:'Monitores' },
  { id:47, codigo:'MON-008',  nombre:'MONITOR MSI MAG 254F',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Monitores' },
  { id:48, codigo:'MON-009',  nombre:'Monitor Samsung LED 27" Odyssey G3 LS27AG320N 165Hz',   stock:2,   pmc:828.00, precio:898.65, tipo:'Producto', grupo:'Monitores' },
  { id:49, codigo:'MON-010',  nombre:'Monitor Teros TE-2765G 27" Curvo VA QHD 165Hz 1ms',    stock:50,  pmc:893.70, precio:936.00, tipo:'Producto', grupo:'Monitores' },
  { id:50, codigo:'MON-011',  nombre:'Monitor Teros TE-2123S 21.45" IPS FHD 100Hz Speakers', stock:57,  pmc:321.26, precio:350.46, tipo:'Producto', grupo:'Monitores' },
  { id:51, codigo:'MON-012',  nombre:'Monitor Teros TE-2731S 27" Curvo VA 100Hz FHD',        stock:55,  pmc:515.07, precio:557.19, tipo:'Producto', grupo:'Monitores' },
  { id:52, codigo:'MON-013',  nombre:'MONITOR XIAOMI G27I',                                    stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Monitores' },
  { id:53, codigo:'MON-014',  nombre:'MONITOR XIAOMI G27QI',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Monitores' },
  { id:54, codigo:'MOU-001',  nombre:'Mouse Gamer + Pad Halion Alaska HA920P',                 stock:21,  pmc:33.30,  precio:40.50,  tipo:'Producto', grupo:'Perifericos' },
  { id:55, codigo:'MOU-002',  nombre:'Mouse Logitech G PRO X Superlight 2 Wireless Black',    stock:1,   pmc:566.55, precio:576.00, tipo:'Producto', grupo:'Perifericos' },
  { id:56, codigo:'MOU-003',  nombre:'Mouse Logitech G203 Lightsync RGB 8000 DPI Black USB',  stock:19,  pmc:130.50, precio:135.00, tipo:'Producto', grupo:'Perifericos' },
  { id:57, codigo:'MOU-004',  nombre:'Mouse Logitech G305 Inalámbrico Lightspeed Blanco',     stock:1,   pmc:175.50, precio:182.25, tipo:'Producto', grupo:'Perifericos' },
  { id:58, codigo:'MOU-005',  nombre:'Mouse Logitech G305 Inalámbrico Lightspeed Negro',      stock:3,   pmc:175.50, precio:182.25, tipo:'Producto', grupo:'Perifericos' },
  { id:59, codigo:'MOU-006',  nombre:'Mouse Logitech G502 HERO 16000 DPI RGB Black',          stock:1,   pmc:232.65, precio:236.25, tipo:'Producto', grupo:'Perifericos' },
  { id:60, codigo:'MOU-007',  nombre:'Mouse Logitech G703 Lightspeed Wireless Black',         stock:2,   pmc:288.00, precio:292.05, tipo:'Producto', grupo:'Perifericos' },
  { id:61, codigo:'MB-018',   nombre:'MSI A520M-A PRO',                                        stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:62, codigo:'MB-019',   nombre:'MSI B650M GAMING PLUS WIFI',                             stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:63, codigo:'MB-020',   nombre:'MSI MAG B550 TOMAHAWK',                                  stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:64, codigo:'MB-021',   nombre:'MSI MAG B560M MORTAR WIFI',                              stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:65, codigo:'MB-022',   nombre:'MSI MAG Z690 TOMAHAWK WIFI DDR4',                        stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:66, codigo:'MB-023',   nombre:'MSI MAG Z890 TOMAHAWK WIFI',                             stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:67, codigo:'PAR-001',  nombre:'Parlante 2.0 Gamer USB Halion HA-S261 RGB',              stock:20,  pmc:54.00,  precio:58.50,  tipo:'Producto', grupo:'Audio' },
  { id:68, codigo:'MB-024',   nombre:'Placa Madre A320M-K ASUS',                               stock:7,   pmc:309.60, precio:337.50, tipo:'Producto', grupo:'Placas Madre' },
  { id:69, codigo:'MB-025',   nombre:'Placa Madre A520M A PRO MSI',                            stock:5,   pmc:270.00, precio:294.75, tipo:'Producto', grupo:'Placas Madre' },
  { id:70, codigo:'MB-026',   nombre:'Placa Madre A520M-AII/CSM ASUS PRIME',                   stock:0,   pmc:373.23, precio:407.16, tipo:'Producto', grupo:'Placas Madre' },
  { id:71, codigo:'MB-027',   nombre:'Placa Madre A620M E Socket AM5 DDR5 MSI',                stock:3,   pmc:411.80, precio:430.52, tipo:'Producto', grupo:'Placas Madre' },
  { id:72, codigo:'MB-028',   nombre:'Placa Madre ASUS PRIME B760-PLUS DDR5 LGA1700',         stock:3,   pmc:650.00, precio:680.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:73, codigo:'MB-029',   nombre:'Placa Madre B450M DS3H Gigabyte',                        stock:4,   pmc:367.97, precio:401.45, tipo:'Producto', grupo:'Placas Madre' },
  { id:74, codigo:'MB-030',   nombre:'Placa Madre B550M Pro-VDH WIFI MSI',                     stock:4,   pmc:471.60, precio:514.26, tipo:'Producto', grupo:'Placas Madre' },
  { id:75, codigo:'MB-031',   nombre:'Placa Madre B550M-K Gigabyte',                           stock:14,  pmc:404.78, precio:441.54, tipo:'Producto', grupo:'Placas Madre' },
  { id:76, codigo:'MB-032',   nombre:'Placa Madre B560M-A ASUS',                               stock:10,  pmc:479.25, precio:522.54, tipo:'Producto', grupo:'Placas Madre' },
  { id:77, codigo:'MB-033',   nombre:'Placa Madre B75 LGA 1155 Intel 2da/3ra Gen DDR3',       stock:0,   pmc:140.00, precio:160.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:78, codigo:'MB-034',   nombre:'Placa Madre B85 LGA 1150 Intel 4ta Gen DDR3',           stock:13,  pmc:160.00, precio:180.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:79, codigo:'MB-035',   nombre:'Placa Madre Gigabyte Z790 Gaming X AX LGA1700 DDR5 Wi-Fi',stock:3, pmc:1100.00,precio:1150.00,tipo:'Producto', grupo:'Placas Madre' },
  { id:80, codigo:'MB-036',   nombre:'Placa Madre Gigabyte Z790 UD AC DDR5 LGA1700 Wi-Fi',    stock:3,   pmc:920.00, precio:950.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:81, codigo:'MB-037',   nombre:'Placa Madre H310M Pro VDH MSI',                          stock:1,   pmc:250.00, precio:260.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:82, codigo:'MB-038',   nombre:'Placa Madre H311 LGA 1151 Intel 6/7/8/9 Gen DDR4',      stock:2,   pmc:200.00, precio:240.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:83, codigo:'MB-039',   nombre:'Placa Madre H410M S2H V2 Gigabyte',                      stock:9,   pmc:333.00, precio:363.20, tipo:'Producto', grupo:'Placas Madre' },
  { id:84, codigo:'MB-040',   nombre:'Placa Madre H510M-B MSI',                                stock:46,  pmc:306.00, precio:333.00, tipo:'Producto', grupo:'Placas Madre' },
  { id:85, codigo:'MB-041',   nombre:'Placa Madre H510M-E ASUS',                               stock:17,  pmc:347.04, precio:393.75, tipo:'Producto', grupo:'Placas Madre' },
  { id:86, codigo:'MB-042',   nombre:'Placa Madre H610M-G MSI DDR4 LGA1700',                  stock:9,   pmc:373.82, precio:407.79, tipo:'Producto', grupo:'Placas Madre' },
  { id:87, codigo:'MB-043',   nombre:'Placa Madre PRO B760M-P DDR4 MSI',                       stock:9,   pmc:537.44, precio:586.26, tipo:'Producto', grupo:'Placas Madre' },
  { id:88, codigo:'MB-044',   nombre:'Placa Madre Z790 Aorus Elite AX Gigabyte',               stock:0,   pmc:1100.00,precio:1190.00,tipo:'Producto', grupo:'Placas Madre' },
  { id:89, codigo:'MB-045',   nombre:'Placa Madre Z790-P WIFI DDR5 LGA1700 ASUS',              stock:1,   pmc:1050.00,precio:1100.00,tipo:'Producto', grupo:'Placas Madre' },
  { id:90, codigo:'MB-046',   nombre:'PRIME B560M-A',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Placas Madre' },
  { id:91, codigo:'CPU-003',  nombre:'Procesador AMD Ryzen 5 8500G AM5',                       stock:3,   pmc:1027.80,precio:1033.88,tipo:'Producto', grupo:'Procesadores' },
  { id:92, codigo:'CPU-004',  nombre:'Procesador Intel Core i3-12100 LGA1700',                 stock:7,   pmc:500.00, precio:520.00, tipo:'Producto', grupo:'Procesadores' },
  { id:93, codigo:'CPU-005',  nombre:'Procesador Intel Core i3-12100F LGA1700',                stock:3,   pmc:390.00, precio:400.00, tipo:'Producto', grupo:'Procesadores' },
  { id:94, codigo:'CPU-006',  nombre:'Procesador Intel Core i3-13100 LGA1700',                 stock:9,   pmc:620.00, precio:640.00, tipo:'Producto', grupo:'Procesadores' },
  { id:95, codigo:'CPU-007',  nombre:'Procesador Intel Core i5-10400F 2.9GHz',                 stock:13,  pmc:540.00, precio:563.94, tipo:'Producto', grupo:'Procesadores' },
  { id:96, codigo:'CPU-008',  nombre:'Procesador Intel Core i5-11400 LGA1200',                 stock:1,   pmc:600.00, precio:620.00, tipo:'Producto', grupo:'Procesadores' },
  { id:97, codigo:'CPU-009',  nombre:'Procesador Intel Core i5-12400F LGA1700',                stock:9,   pmc:620.00, precio:640.00, tipo:'Producto', grupo:'Procesadores' },
  { id:98, codigo:'CPU-010',  nombre:'Procesador Intel Core i5-12600K LGA1700',                stock:2,   pmc:1100.00,precio:1200.00,tipo:'Producto', grupo:'Procesadores' },
  { id:99, codigo:'CPU-011',  nombre:'Procesador Intel Core i5-13400 LGA1700',                 stock:5,   pmc:1000.00,precio:1070.00,tipo:'Producto', grupo:'Procesadores' },
  { id:100,codigo:'CPU-012',  nombre:'Procesador Intel Core i5-13400F LGA1700',                stock:2,   pmc:900.00, precio:950.00, tipo:'Producto', grupo:'Procesadores' },
  { id:101,codigo:'CPU-013',  nombre:'Procesador Intel Core i5-13600K LGA1700',                stock:4,   pmc:1350.00,precio:1450.00,tipo:'Producto', grupo:'Procesadores' },
  { id:102,codigo:'CPU-014',  nombre:'Procesador Intel Core i5-14600K LGA1700',                stock:7,   pmc:1400.00,precio:1480.00,tipo:'Producto', grupo:'Procesadores' },
  { id:103,codigo:'CPU-015',  nombre:'Procesador Intel Core i5-14600KF LGA1700',               stock:2,   pmc:1300.00,precio:1380.00,tipo:'Producto', grupo:'Procesadores' },
  { id:104,codigo:'CPU-016',  nombre:'Procesador Intel Core i7-11700F LGA1200',                stock:17,  pmc:1025.10,precio:1051.65,tipo:'Producto', grupo:'Procesadores' },
  { id:105,codigo:'CPU-017',  nombre:'Procesador Intel Core i7-12700 LGA1700',                 stock:4,   pmc:1350.00,precio:1450.00,tipo:'Producto', grupo:'Procesadores' },
  { id:106,codigo:'CPU-018',  nombre:'Procesador Intel Core i7-12700F LGA1700',                stock:0,   pmc:1300.00,precio:1350.00,tipo:'Producto', grupo:'Procesadores' },
  { id:107,codigo:'CPU-019',  nombre:'Procesador Intel Core i7-12700KF LGA1700',               stock:1,   pmc:1400.00,precio:1490.00,tipo:'Producto', grupo:'Procesadores' },
  { id:108,codigo:'CPU-020',  nombre:'Procesador Intel Core i7-13700 LGA1700',                 stock:0,   pmc:1750.00,precio:1850.00,tipo:'Producto', grupo:'Procesadores' },
  { id:109,codigo:'CPU-021',  nombre:'Procesador Intel Core i7-13700F LGA1700',                stock:1,   pmc:1600.00,precio:1690.00,tipo:'Producto', grupo:'Procesadores' },
  { id:110,codigo:'CPU-022',  nombre:'Procesador Intel Core i7-14700K LGA1700',                stock:0,   pmc:1850.00,precio:1980.00,tipo:'Producto', grupo:'Procesadores' },
  { id:111,codigo:'CPU-023',  nombre:'Procesador Intel Core i7-14700KF LGA1700',               stock:0,   pmc:1750.00,precio:1840.00,tipo:'Producto', grupo:'Procesadores' },
  { id:112,codigo:'CPU-024',  nombre:'Procesador Intel Core i7-10700 2.90GHz 16MB LGA1200',   stock:46,  pmc:840.00, precio:850.00, tipo:'Producto', grupo:'Procesadores' },
  { id:113,codigo:'CPU-025',  nombre:'Procesador Ryzen 5 4600G 3.70GHz',                       stock:28,  pmc:505.26, precio:528.21, tipo:'Producto', grupo:'Procesadores' },
  { id:114,codigo:'CPU-026',  nombre:'Procesador Ryzen 5 5500 3.60GHz',                        stock:18,  pmc:477.00, precio:495.00, tipo:'Producto', grupo:'Procesadores' },
  { id:115,codigo:'CPU-027',  nombre:'Procesador Ryzen 5 5600 3.70GHz',                        stock:6,   pmc:697.50, precio:711.00, tipo:'Producto', grupo:'Procesadores' },
  { id:116,codigo:'CPU-028',  nombre:'Procesador Ryzen 5 5600G 3.90GHz',                       stock:16,  pmc:666.00, precio:692.15, tipo:'Producto', grupo:'Procesadores' },
  { id:117,codigo:'CPU-029',  nombre:'Procesador Ryzen 7 5700G',                               stock:5,   pmc:922.28, precio:964.22, tipo:'Producto', grupo:'Procesadores' },
  { id:118,codigo:'CPU-030',  nombre:'Procesador Ryzen 7 5700X',                               stock:2,   pmc:1008.05,precio:1056.02,tipo:'Producto', grupo:'Procesadores' },
  { id:119,codigo:'PROY-001', nombre:'Proyector Epson PowerLite E20 3400 Lúmenes 1024x768 XGA',stock:0,  pmc:1790.00,precio:1860.00,tipo:'Producto', grupo:'Proyectores' },
  { id:120,codigo:'CPU-031',  nombre:'Ryzen 3 5300G',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:121,codigo:'CPU-032',  nombre:'Ryzen 5 4500',                                           stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:122,codigo:'CPU-033',  nombre:'Ryzen 5 5500 (serie)',                                   stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:123,codigo:'CPU-034',  nombre:'Ryzen 5 5600GT',                                         stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:124,codigo:'CPU-035',  nombre:'Ryzen 5 7600X',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:125,codigo:'CPU-036',  nombre:'Ryzen 5 8400F',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:126,codigo:'CPU-037',  nombre:'Ryzen 5 8500G',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:127,codigo:'CPU-038',  nombre:'Ryzen 5 8600G',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:128,codigo:'CPU-039',  nombre:'Ryzen 7 5700G (serie)',                                  stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:129,codigo:'CPU-040',  nombre:'Ryzen 7 5700X (serie)',                                  stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:130,codigo:'CPU-041',  nombre:'Ryzen 7 5800XT',                                         stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:131,codigo:'CPU-042',  nombre:'Ryzen 7 8700G',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:132,codigo:'CPU-043',  nombre:'Ryzen 9 9950X',                                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Procesadores' },
  { id:133,codigo:'GPU-001',  nombre:'RTX 3050 DUAL OC 6GB ASUS',                              stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:134,codigo:'GPU-002',  nombre:'RTX 3050 GAMING X 6GB MSI',                              stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:135,codigo:'GPU-003',  nombre:'RTX 3050 WINDFORCE OC 6GB GIGABYTE',                     stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:136,codigo:'GPU-004',  nombre:'RTX 3070 XC3 ULTRA 8GB EVGA',                            stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:137,codigo:'GPU-005',  nombre:'RTX 4070 TI SUPER EAGLE OC ICE 16GB GIGABYTE',           stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:138,codigo:'GPU-006',  nombre:'RTX 5060 EAGLE MAX OC 8GB GIGABYTE',                     stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:139,codigo:'GPU-007',  nombre:'RTX 5060 EAGLE OC 8GB GIGABYTE',                         stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:140,codigo:'GPU-008',  nombre:'RTX 5060 GAMING OC 8GB GIGABYTE',                        stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:141,codigo:'GPU-009',  nombre:'RTX 5060 SHADOW 2X OC 8GB MSI',                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:142,codigo:'GPU-010',  nombre:'RTX 5060 TI GAMING OC 8GB MSI',                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:143,codigo:'GPU-011',  nombre:'RTX 5060 TI TWIN EDGE 16GB ZOTAC',                       stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:144,codigo:'GPU-012',  nombre:'RTX 5060 TWIN EDGE 8GB ZOTAC',                           stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:145,codigo:'GPU-013',  nombre:'RTX 5070 PRIME OC 12GB ASUS',                            stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:146,codigo:'GPU-014',  nombre:'RTX 5070 SHADOW 2X OC 12GB MSI',                         stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:147,codigo:'GPU-015',  nombre:'RTX 5070 TI WINGFORCE OC SFF 16GB GIGABYTE',             stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:148,codigo:'GPU-016',  nombre:'RTX 5070 WINDFORCE OC SFF 12GB GIGABYTE',                stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:149,codigo:'GPU-017',  nombre:'RX 9070 XT PRIME OC 16GB ASUS',                          stock:1,   pmc:1.00,   precio:1.00,   tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:150,codigo:'SSD-001',  nombre:'SSD 2TB Kingston Fury Renegade M.2 NVMe PCIe',           stock:1,   pmc:700.00, precio:720.00, tipo:'Producto', grupo:'Almacenamiento' },
  { id:151,codigo:'SSD-002',  nombre:'SSD 512GB M.2 PCIe MP33 Team Group',                     stock:20,  pmc:195.66, precio:213.48, tipo:'Producto', grupo:'Almacenamiento' },
  { id:152,codigo:'SSD-003',  nombre:'SSD 512GB T-Force Vulcan Z 2.5" SATA 3',                 stock:66,  pmc:151.88, precio:165.69, tipo:'Producto', grupo:'Almacenamiento' },
  { id:153,codigo:'SSD-004',  nombre:'SSD Micro Fron 240GB SATAIII',                           stock:9,   pmc:75.00,  precio:80.00,  tipo:'Producto', grupo:'Almacenamiento' },
  { id:154,codigo:'SSD-005',  nombre:'SSD MSI Spatium M450 1TB PCIe 4.0 NVMe M.2',            stock:30,  pmc:321.26, precio:335.88, tipo:'Producto', grupo:'Almacenamiento' },
  { id:155,codigo:'SSD-006',  nombre:'SSD MSI Spatium M450 500GB M.2 NVMe',                    stock:60,  pmc:192.78, precio:210.29, tipo:'Producto', grupo:'Almacenamiento' },
  { id:156,codigo:'SSD-007',  nombre:'SSD WD 480GB Green SATA 2.5"',                           stock:0,   pmc:167.63, precio:182.88, tipo:'Producto', grupo:'Almacenamiento' },
  { id:157,codigo:'CAB-002',  nombre:'Switch HDMI 3 a 1 UH-301',                               stock:0,   pmc:50.00,  precio:55.00,  tipo:'Producto', grupo:'Cables' },
  { id:158,codigo:'GPU-018',  nombre:'Tarjeta de Video GT 1030 LP DDR4 2GB Gigabyte',          stock:1,   pmc:381.42, precio:416.07, tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:159,codigo:'GPU-019',  nombre:'Tarjeta de Video GTX 1650 D6 Ventus XS MSI',             stock:4,   pmc:660.00, precio:680.00, tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:160,codigo:'GPU-020',  nombre:'Tarjeta de Video Radeon RX580 8GB Jie Shou',             stock:19,  pmc:400.00, precio:480.00, tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:161,codigo:'GPU-021',  nombre:'Tarjeta de Video RTX 3050 Gaming X 6GB GDDR6 MSI',      stock:15,  pmc:1042.61,precio:1089.99,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:162,codigo:'GPU-022',  nombre:'Tarjeta de Video RTX 3050 Ventus 2X OC 6GB GDDR6 MSI', stock:3,   pmc:1016.10,precio:1062.50,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:163,codigo:'GPU-023',  nombre:'Tarjeta de Video RTX 3060 ASUS Dual 12GB GDDR6',        stock:6,   pmc:1656.00,precio:1734.75,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:164,codigo:'GPU-024',  nombre:'Tarjeta de Video RTX 3060 Gaming OC 12GB GDDR6 Gigabyte',stock:1,  pmc:1350.00,precio:1420.00,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:165,codigo:'GPU-025',  nombre:'Tarjeta de Video RTX 3060 Ventus 2X OC 12GB GDDR6 MSI',stock:16,  pmc:1485.00,precio:1552.50,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:166,codigo:'GPU-026',  nombre:'Tarjeta de Video RTX 3060 Ventus 3X OC 12GB GDDR6 MSI',stock:7,   pmc:1673.46,precio:1749.50,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:167,codigo:'GPU-027',  nombre:'Tarjeta de Video RTX 2060 6GB SZMZ',                    stock:2,   pmc:950.00, precio:1000.00,tipo:'Producto', grupo:'Tarjetas de Video' },
  { id:168,codigo:'TINTA-001',nombre:'Tinta HP',                                               stock:70,  pmc:70.00,  precio:80.00,  tipo:'Producto', grupo:'Suministros' },
];

/* Función de búsqueda inteligente: busca por nombre, código, iniciales o palabras clave */
const buscarArticulos = (query, tipo) => {
  if (!query && tipo === 'nomart') return [];
  const q = query.toLowerCase().trim();
  
  return ARTICULOS_DB.filter(art => {
    // Filtro por tipo primero
    if (tipo === 'Producto') return art.tipo === 'Producto';
    if (tipo === 'Servicio') return art.tipo === 'Servicio';
    
    // Filtros de búsqueda por texto
    const nombre = art.nombre.toLowerCase();
    const codigo = art.codigo.toLowerCase();
    const grupo  = art.grupo.toLowerCase();

    if (!q) {
      // Sin query: retorna según categoría
      if (tipo === 'Todos') return true;
      if (tipo === 'grupo') return true;
      return true;
    }

    // Buscar por código exacto o parcial
    if (codigo.includes(q)) return true;
    // Buscar por nombre (palabras completas o parciales)
    if (nombre.includes(q)) return true;
    // Buscar por grupo
    if (grupo.includes(q)) return true;

    // Buscar por iniciales: "rtx" → "Tarjeta de video RTX", "mb" → placas madre, etc.
    const palabras = nombre.split(/\s+/);
    const iniciales = palabras.map(p => p[0]?.toLowerCase()).join('');
    if (iniciales.includes(q)) return true;

    // Buscar abreviaciones comunes
    const abrevMap = {
      'mb': 'placas madre', 'cpu': 'procesadores', 'gpu': 'tarjetas de video',
      'ssd': 'almacenamiento', 'ram': 'memorias', 'fp': 'fuentes de poder',
      'mon': 'monitores', 'mou': 'mouse', 'usb': 'memoria usb',
      'est': 'estabilizadores', 'par': 'parlante', 'case': 'cases',
    };
    if (abrevMap[q] && grupo.includes(abrevMap[q])) return true;

    return false;
  });
};

/* Obtener grupos únicos */
const GRUPOS = [...new Set(ARTICULOS_DB.map(a => a.grupo))].sort();

/* ─── CLIENTES DEMO ─── */
const CLIENTES_DB = [
  { id:1,  nombre:'Aaron Smith Iturri Quispe',             ruc:'75845811',   dir:'Punkari 276 Mangomarca' },
  { id:2,  nombre:'Alex',                                   ruc:'',           dir:'' },
  { id:3,  nombre:'Alexander Paul, Moran Alburqueque',      ruc:'74296172',   dir:'Calle S/n' },
  { id:4,  nombre:'Angel Danilo, Wetzell Rodriguez',        ruc:'72929962',   dir:'' },
  { id:5,  nombre:'Carlos Enrique, Mifflin Revilla',        ruc:'07628166',   dir:'Calle Domingo Cueto 120' },
  { id:6,  nombre:'Cesar Adrian, Terrones Moreno',          ruc:'72906316',   dir:'' },
  { id:7,  nombre:'David Cristhian, Monzon Casas',          ruc:'74215555',   dir:'Calle Lima 100' },
  { id:8,  nombre:'Edilma, Cabrera Caruajulca',             ruc:'43773675',   dir:'Cal Quetzal 171 Sta Anita' },
  { id:9,  nombre:'Gabriela Ines Luna Flores',              ruc:'60869824',   dir:'R. Carrion 183 Condevilla Del Señor' },
  { id:10, nombre:'Hansel Franco, Chavez Garcia',           ruc:'70899399',   dir:'Sin Direc 01' },
  { id:11, nombre:'Hernan Rolando, Valdivia Cardenas',      ruc:'29335768',   dir:'Jr. Jangas Nº 268 Urb. Chacra Colorado' },
  { id:12, nombre:'Inteligente S.a.c.',                     ruc:'20523520025', dir:'Av. La Merced 1089 Int 302' },
  { id:13, nombre:'Jesus Cristian, Sifuentes Sanchez',      ruc:'80431757',   dir:'' },
  { id:14, nombre:'José Abel, Olaechea Luis',               ruc:'78425876',   dir:'' },
  { id:15, nombre:'Josiph Jhonny, Condor Picardo',          ruc:'74917914',   dir:'Av. Paseo De La Republica S/n' },
  { id:16, nombre:'Liliana, Quintana Morales',              ruc:'42498848',   dir:'' },
  { id:17, nombre:'Luis Alexander, Quispe Ayala',           ruc:'70769573',   dir:'' },
  { id:18, nombre:'piers Javier giraldo',                   ruc:'72151898',   dir:'' },
  { id:19, nombre:'Raysa Yupanqui Barboza',                 ruc:'75845911',   dir:'Cesar Vallejo 314 Mz. O Lt. 35' },
  { id:20, nombre:'Roger, Inga Salvador',                   ruc:'40414051',   dir:'Jr. Jr. Varayoc 328 Urb Zarate San Juan De Lurigancho' },
  { id:21, nombre:'Siancas Huaccaycachacc Raul',            ruc:'10441856739', dir:'--' },
  { id:22, nombre:'Stephany Johana, Avila Tovar',           ruc:'74994310',   dir:'' },
  { id:23, nombre:'venta falabella',                        ruc:'',           dir:'' },
  { id:24, nombre:'Viviendas Sostenibles Segunda Etapa S.a.c.', ruc:'20609317605', dir:'Av. Dionisio Derteano 184 Urb. Santa Ana 601' },
];

/* ─── VENTAS DEMO ─── */
const VENTAS_INI = [
  { id:1, doc:'Boleta BI01', serie:'BI01-000001', fecha:'2026-03-01', cliente:'García López, María',
    vendedor:'Iturri, Quispe, Smith', tvta:'Contado', sunat:'OK', estado:'Emitido' },
  { id:2, doc:'Factura FI01', serie:'FI01-000042', fecha:'2026-03-05', cliente:'Empresa SAC',
    vendedor:'Merino, Cahuna, Wilver Enmanuel', tvta:'Credito', sunat:'ERROR', estado:'Error' },
  { id:3, doc:'Nota de Venta 001', serie:'001-000015', fecha:'2026-03-07', cliente:'Luis Alexander, Quispe Ayala',
    vendedor:'Yupanqui, Barboza, Raysa', tvta:'Contado', sunat:'BETA', estado:'Borrador' },
];

const hoy = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}
  .vta-bar{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
  .vta-bar label{font-size:11px;font-weight:bold;color:#555;display:block;margin-bottom:3px;}
  .vta-bar select,.vta-bar input[type=text],.vta-bar input[type=date]{
    padding:6px 9px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;}
  .vta-bar input[type=text]{width:220px;}
  .btn-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-buscar:hover{background:#138496;}
  .btn-nuevo{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-nuevo:hover{background:#138496;}
  .btn-rapido{background:#fd7e14;border:1px solid #e96a00;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-rapido:hover{background:#e96a00;}
  .tbl-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;letter-spacing:.5px;}
  table.tlista{width:100%;border-collapse:collapse;font-size:13px;}
  table.tlista thead tr{background:#003d6b;}
  table.tlista thead th{padding:11px 10px;text-align:center;color:#fff;font-weight:bold;font-size:12px;letter-spacing:.4px;}
  table.tlista tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tlista tbody tr:hover{background:#e8f4f8;}
  table.tlista tbody td{padding:10px 10px;vertical-align:middle;color:#212529;}
  .badge-ok{background:#28a745;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
  .badge-err{background:#dc3545;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
  .badge-beta{background:#6f42c1;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
  .ops{display:flex;gap:3px;flex-wrap:nowrap;align-items:center;}
  .ic{cursor:pointer;border:none;background:transparent !important;padding:0;display:inline-flex;align-items:center;}
  .ic:hover{opacity:.8;transform:scale(1.1);}
  .leyenda-ops{font-size:12px;color:#444;margin:12px 0 8px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
  .leyenda-ops span{display:flex;align-items:center;gap:4px;}
  .ley-colores{display:flex;gap:20px;align-items:center;font-size:12px;margin-top:10px;}
  .ley-colores .lc{display:flex;align-items:center;gap:6px;}
  .form-titulo{font-size:16px;font-weight:bold;margin-bottom:14px;color:#212529;padding:6px 0;border-bottom:2px solid #dee2e6;}
  .nv-wrap{background:#fff;padding:14px 16px;border:1px solid #dee2e6;border-radius:4px;}
  .nv-row{display:flex;flex-wrap:wrap;gap:0;align-items:flex-end;border-bottom:1px solid #eee;padding:8px 0;}
  .nv-row:last-child{border-bottom:none;}
  .nv-cell{display:flex;flex-direction:column;gap:2px;padding:0 10px 0 0;}
  .nv-cell label{font-size:11px;font-weight:bold;color:#444;white-space:nowrap;}
  .nv-cell input,.nv-cell select,.nv-cell textarea{
    padding:5px 8px;border:1px solid #ced4da;border-radius:3px;font-size:12px;color:#212529;background:#fff;height:28px;}
  .nv-cell input:focus,.nv-cell select:focus{border-color:#80bdff;outline:none;box-shadow:0 0 0 2px rgba(0,123,255,.12);}
  .nv-div{width:1px;background:#dee2e6;margin:0 6px;align-self:stretch;}
  .inp-verde{background:#ccff99 !important;border:1px solid #8bc34a !important;font-weight:bold !important;}
  .cli-section{background:#f8f9fa;border:1px solid #dee2e6;border-radius:4px;padding:10px 12px;margin:10px 0;}
  .cli-section-title{font-size:11px;font-weight:bold;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;}
  .cli-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;}
  .cli-cell{display:flex;flex-direction:column;gap:2px;}
  .cli-cell label{font-size:11px;font-weight:bold;color:#444;}
  .cli-cell input{padding:5px 8px;border:1px solid #ced4da;border-radius:3px;font-size:12px;color:#212529;background:#fff;height:28px;}
  .cli-cell input:focus{border-color:#80bdff;outline:none;}
  .inp-with-icon{display:flex;align-items:center;gap:4px;}
  .btn-lupa{background:none;border:none;cursor:pointer;padding:2px;display:inline-flex;align-items:center;color:#17a2b8;}
  .btn-lupa:hover{color:#0d6efd;}
  .btn-bino{background:none;border:none;cursor:pointer;font-size:18px;color:#17a2b8;padding:2px 4px;line-height:1;}
  .btn-bino:hover{color:#0d7a8a;}

  /* BÚSQUEDA ARTÍCULOS */
  .art-bar{background:#d9d9d9;padding:8px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:0;}
  .art-bar label{font-size:12px;font-weight:bold;color:#333;}
  .art-bar select{padding:4px 7px;border:1px solid #ced4da;border-radius:3px;font-size:12px;background:#fff;color:#212529;height:28px;}
  .art-bar input{padding:4px 9px;border:1px solid #ced4da;border-radius:3px;font-size:12px;background:#ccff99;color:#212529;font-weight:bold;height:28px;}
  .btn-art-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:4px 12px;border-radius:3px;cursor:pointer;font-size:12px;font-weight:bold;height:28px;display:inline-flex;align-items:center;gap:5px;}
  .btn-art-reset{background:#fff;border:1px solid #ced4da;color:#555;padding:4px 9px;border-radius:3px;cursor:pointer;font-size:15px;height:28px;display:inline-flex;align-items:center;}

  /* tabla artículos principal */
  table.tart{width:100%;border-collapse:collapse;font-size:12px;}
  table.tart thead tr{background:#003d6b;}
  table.tart thead th{padding:9px 7px;text-align:center;color:#fff;font-weight:bold;font-size:11px;letter-spacing:.3px;}
  table.tart tbody tr{border-bottom:1px solid #dee2e6;}
  table.tart tbody td{padding:6px 5px;vertical-align:middle;}
  table.tart input[type=text],table.tart input[type=number],table.tart textarea{
    padding:4px 6px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;background:#fff !important;color:#212529 !important;}
  table.tart textarea{resize:none;height:50px;color:#212529 !important;}
  table.tart select{padding:4px 4px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;background:#fff !important;color:#212529 !important;}
  .chk-agregar{width:20px;height:20px;accent-color:#17a2b8;cursor:pointer;}

  /* Resultados de búsqueda inline */
  .art-resultados{border:1px solid #dee2e6;border-top:none;max-height:280px;overflow-y:auto;background:#fff;}
  table.tart-res{width:100%;border-collapse:collapse;font-size:12px;}
  table.tart-res thead tr{background:#17a2b8;position:sticky;top:0;}
  table.tart-res thead th{padding:7px 6px;text-align:center;color:#fff;font-weight:bold;font-size:11px;}
  table.tart-res tbody tr{border-bottom:1px solid #f0f0f0;cursor:pointer;}
  table.tart-res tbody tr:hover{background:#e8f4f8;}
  table.tart-res tbody td{padding:5px 6px;vertical-align:middle;color:#212529;font-size:12px;}
  .badge-stock-ok{background:#28a745;color:#fff;padding:1px 6px;border-radius:3px;font-size:10px;}
  .badge-stock-no{background:#dc3545;color:#fff;padding:1px 6px;border-radius:3px;font-size:10px;}
  .btn-add-art{background:#28a745;border:none;color:#fff;border-radius:3px;padding:3px 10px;cursor:pointer;font-size:12px;font-weight:bold;}
  .btn-add-art:hover{background:#218838;}

  .form-footer{display:flex;justify-content:center;gap:10px;margin-top:16px;padding-bottom:10px;}
  .btn-gd{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:9px 24px;cursor:pointer;font-size:14px;font-weight:bold;border-radius:5px;display:inline-flex;align-items:center;gap:6px;}
  .btn-gd:hover{background:#138496;}
  .btn-reg{background:#6c757d;border:1px solid #6c757d;color:#fff;padding:9px 24px;cursor:pointer;font-size:14px;font-weight:bold;border-radius:5px;display:inline-flex;align-items:center;gap:6px;}
  .btn-reg:hover{background:#5a6268;}
  hr.sep{border:none;border-top:1px solid #dee2e6;margin:12px 0;}
  .req{color:#dc3545;font-size:11px;}
  .lnk{color:#0099ff;font-size:11px;text-decoration:none;margin-left:4px;}
  .lnk:hover{text-decoration:underline;}

  /* MODALES */
  .m-bd{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding-top:80px;}
  .m-box-cli{background:#1a1a2e;border-radius:6px;width:680px;max-width:96vw;box-shadow:0 8px 32px rgba(0,0,0,0.4);overflow:hidden;}
  .m-cli-head{background:#1a1a2e;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;}
  .m-cli-url{font-size:11px;color:#6cb4e4;}
  .m-cli-body{background:#fff;padding:16px;}
  .m-cli-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;}
  .m-cli-close:hover{color:#ddd;}
  .cli-busq{display:flex;gap:8px;margin-bottom:14px;}
  .cli-busq input{flex:1;padding:8px 12px;border:1px solid #ced4da;border-radius:4px;font-size:13px;background:#b8f5b0;}
  .cli-busq button{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  table.tcli{width:100%;border-collapse:collapse;font-size:13px;}
  table.tcli thead tr{background:#003d6b;}
  table.tcli thead th{padding:9px 10px;color:#fff;font-weight:bold;font-size:12px;}
  table.tcli tbody tr{border-bottom:1px solid #eee;}
  table.tcli tbody tr:hover{background:#f0f9fb;}
  table.tcli tbody td{padding:9px 10px;vertical-align:middle;}
  .btn-plus-cli{background:none;border:none;cursor:pointer;font-size:22px;color:#6f42c1;font-weight:bold;line-height:1;}
  .btn-plus-cli:hover{color:#4a2d8a;}
  .titulo-cli{text-align:center;font-size:15px;font-weight:bold;margin-bottom:14px;}
  .mopc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;display:flex;align-items:center;justify-content:center;}
  .mopc-box{background:#fff;border-radius:8px;padding:0;min-width:480px;max-width:700px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mopc-head{padding:14px 20px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-weight:bold;font-size:15px;}
  .mopc-body{padding:20px;}
  .mopc-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mopc-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;color:#fff;}
  .mopc-row{display:flex;gap:10px;margin-bottom:10px;align-items:center;}
  .mopc-label{font-weight:bold;font-size:13px;min-width:110px;color:#555;}
  .mopc-val{font-size:13px;color:#212529;}
  .mopc-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;width:100%;}
  .mopc-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;}
  .mopc-table th{background:#003d6b;color:#fff;padding:8px 10px;text-align:left;}
  .mopc-table td{padding:7px 10px;border-bottom:1px solid #dee2e6;color:#212529;}
  .mopc-table tr:nth-child(even) td{background:#f5f5f5;}
  .xml-pre{background:#1e1e1e;color:#9cdcfe;font-family:monospace;font-size:12px;padding:14px;border-radius:6px;overflow-x:auto;line-height:1.6;margin-top:8px;}
  .vr-input{background:#fff !important;color:#212529 !important;border:1px solid #ced4da !important;}
  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .vr-table{width:100%;border-spacing:0;font-family:verdana;font-size:14px;}
  .vr-thead-dark{background:#005F8C;}
  .vr-thead-teal{background:#17a2b8;}

  /* Info artículo al pasar mouse */
  .art-tooltip{position:absolute;background:#003d6b;color:#fff;padding:6px 10px;border-radius:4px;font-size:11px;z-index:100;white-space:nowrap;pointer-events:none;}
`;

/* ─── Íconos ─── */
const IcoEdit  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#e67e22',color:'#fff',fontSize:11,fontWeight:'bold',cursor:'pointer'}} title="Actualizar/Eliminar">✏</span>;
const IcoND    = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#28a745',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Nota de Débito">ND</span>;
const IcoNC    = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#dc3545',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Nota de Crédito">NC</span>;
const IcoTicket= () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#17a2b8',color:'#fff',fontSize:13,cursor:'pointer'}} title="Imprimir Ticket">🖨</span>;
const IcoCoti  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c9bd1',color:'#fff',fontSize:13,cursor:'pointer'}} title="Cotizar">↺</span>;
const IcoCli   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#17a2b8',color:'#fff',fontSize:13,cursor:'pointer'}} title="Cliente">👤</span>;
const IcoVender= () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c757d',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Vender">VTA</span>;
const IcoPDF   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#dc3545',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="PDF">PDF</span>;
const IcoXML   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c757d',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="XML">XML</span>;
const IcoLeer  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#e67e22',color:'#fff',fontSize:13,cursor:'pointer'}} title="Leer Ticket">📖</span>;

const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ value, onChange }) => {
  const ref = useRef();
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,height:28,
      border:'1px solid #ced4da',borderRadius:3,padding:'0 8px',background:'#fff',cursor:'pointer'}}
      onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
      <span style={{fontSize:12,color: value?'#212529':'#aaa',minWidth:80}}>
        {value ? value.split('-').reverse().join('/') : ''}
      </span>
      <IcoCal/>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

const filaVacia = () => ({
  id: Date.now() + Math.random(),
  codigo:'', articulo:'', stock:'', med:'Und.', pmc:'0.00', pventa:'', cant:'',
  taigv:'Gravado - Operación Onerosa', sel:false
});

/* ══════════════════════════════════════════════ */
export default function Venta() {
  const [vista,  setVista]  = useState('lista');
  const [ventas, setVentas] = useState(VENTAS_INI);
  const [alert,  setAlert]  = useState('');

  /* filtros lista */
  const [bDocmto,   setBDocmto]   = useState('');
  const [bSucursal, setBSucursal] = useState('');
  const [bTipo,     setBTipo]     = useState('1');
  const [bq,        setBq]        = useState('');
  const [bfi,       setBfi]       = useState('');
  const [bff,       setBff]       = useState('');

  /* form nueva venta */
  const formIni = () => ({
    documento:'Boleta BI01', fecha:hoy, nroorden:'', moneda:'Soles', conigv:'Inc.IGV',
    tipooper:'Venta Interna', preanticipo:'No', guia:'Sin Guia de remision', nroguia:'',
    vendedor:'Iturri, Quispe, Smith', tipovta:'Contado', pagomod:'Efectivo', sujeto:'',
    pagocon:'', diasdias:'', letra:false,
    cliRuc:'', cliNombre:'Cliente', cliDir:'', cliEmail:'',
    artRows:[ filaVacia() ],
    artBusqTipo:'Nombre', artBusqQ:'',
  });
  const [form, setForm] = useState(formIni());
  const sf = (k,v) => setForm(p=>({...p,[k]:v}));

  /* Búsqueda de artículos en formulario */
  const [artResultados, setArtResultados] = useState([]);
  const [artBusqActiva, setArtBusqActiva] = useState(false);

  const ejecutarBusquedaArt = () => {
    const tipo = form.artBusqTipo;
    const q    = form.artBusqQ.trim();
    let resultados = [];
    if (!q && tipo === 'Nombre') { setArtResultados([]); setArtBusqActiva(false); return; }
    if (tipo === 'Nombre' || tipo === 'Codigo' || tipo === 'C.Barra' || tipo === 'Serie') {
      resultados = buscarArticulos(q, 'nomart');
    } else if (tipo === 'Marca') {
      resultados = ARTICULOS_DB.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()));
    } else if (tipo === 'Categoria' || tipo === 'Linea') {
      resultados = ARTICULOS_DB.filter(a => a.grupo.toLowerCase().includes(q.toLowerCase()));
    } else {
      resultados = buscarArticulos(q, 'nomart');
    }
    setArtResultados(resultados);
    setArtBusqActiva(true);
  };

  const agregarArtAFila = (art, rowId) => {
    sf('artRows', form.artRows.map(r => r.id === rowId ? {
      ...r,
      codigo: art.codigo,
      articulo: art.nombre,
      stock: String(art.stock),
      pmc: art.pmc.toFixed(2),
      pventa: art.precio.toFixed(2),
      taigv: 'Gravado - Operación Onerosa',
    } : r));
    setArtResultados([]);
    setArtBusqActiva(false);
  };

  const agregarArtComoNuevaFila = (art) => {
    const nueva = {
      id: Date.now() + Math.random(),
      codigo: art.codigo,
      articulo: art.nombre,
      stock: String(art.stock),
      med: 'Und.',
      pmc: art.pmc.toFixed(2),
      pventa: art.precio.toFixed(2),
      cant: '1',
      taigv: 'Gravado - Operación Onerosa',
      sel: true,
    };
    sf('artRows', [...form.artRows.filter(r => r.articulo !== ''), nueva]);
    setArtResultados([]);
    setArtBusqActiva(false);
    sf('artBusqQ', '');
  };

  /* ─── VENTAS RÁPIDAS ─── */
  const [rDoc,        setRDoc]        = useState('Boleta BI01');
  const [rTipoVta,    setRTipoVta]    = useState('Contado');
  const [rPago,       setRPago]       = useState('Efectivo');
  const [rCliente,    setRCliente]    = useState('Cliente');
  const [rBusqTipo,   setRBusqTipo]   = useState('nomart');
  const [rBusqQ,      setRBusqQ]      = useState('');
  const [rCategoria,  setRCategoria]  = useState('');
  const [rCarrito,    setRCarrito]    = useState([]);
  const [rResultados, setRResultados] = useState([]);
  const [busqActiva,  setBusqActiva]  = useState('');
  const [cantInput,   setCantInput]   = useState({});

  const buscarRapido = (tipo, val) => {
    setBusqActiva(val);
    let res = [];
    if (tipo === 'Todos')    res = ARTICULOS_DB;
    else if (tipo === 'Producto') res = ARTICULOS_DB.filter(a => a.tipo === 'Producto');
    else if (tipo === 'Servicio') res = ARTICULOS_DB.filter(a => a.tipo === 'Servicio');
    else if (tipo === 'grupo')    res = ARTICULOS_DB.filter(a => a.grupo === val);
    else res = buscarArticulos(val, 'nomart');
    setRResultados(res);
  };

  /* modales */
  const [mOpc, setMOpc] = useState(null);
  const cerrarMOpc = () => setMOpc(null);

  /* modal buscar cliente */
  const [mCli,    setMCli]    = useState(false);
  const [cliFilt, setCliFilt] = useState('Nombre');
  const [cliQ,    setCliQ]    = useState('');
  const [cliRes,  setCliRes]  = useState(CLIENTES_DB);

  const buscarCliente = () => {
    const q = cliQ.toLowerCase().trim();
    if (!q) { setCliRes(CLIENTES_DB); return; }
    setCliRes(CLIENTES_DB.filter(c => {
      if (cliFilt==='Nombre') return c.nombre.toLowerCase().includes(q);
      if (cliFilt==='Ruc')    return c.ruc.includes(q);
      return c.nombre.toLowerCase().includes(q) || c.ruc.includes(q);
    }));
  };
  const selCliente = (c) => { sf('cliNombre',c.nombre); sf('cliRuc',c.ruc); sf('cliDir',c.dir); setMCli(false); };

  /* modal nuevo cliente Ventas Rápidas */
  const cliIni = () => ({
    nombre:'', tipodoc:'RUC', nro:'', representante:'', dni:'', pais:'Peru',
    dpto:'', provincia:'', distrito:'', direccion:'', telfijo:'',
    movistar:'', claro:'', otros:'', email:'', descuento:'',
    aniversario:hoy, responsable:'Iturri, Quispe, Smith',
    modopago:'Contado', estado:'Pagador', partida:'', representa:'',
  });
  const [mRCli,      setMRCli]      = useState(null);
  const [rCliBusqX,  setRCliBusqX]  = useState('');
  const [rCliBusqQ,  setRCliBusqQ]  = useState('');
  const [rCliFiltro, setRCliFiltro] = useState('por Criterio');
  const [cliForm,    setCliForm]    = useState(cliIni());
  const cf = (k,v) => setCliForm(p=>({...p,[k]:v}));
  const [cliDB,      setCliDB]      = useState(CLIENTES_DB);

  const guardarNuevoCli = () => {
    if (!cliForm.nombre) { alert('Ingrese Empresa/Nombre'); return; }
    const nuevo = { id:Date.now(), nombre:cliForm.nombre, ruc:cliForm.nro, dir:cliForm.direccion };
    setCliDB(p=>[...p, nuevo]);
    setRCliente(nuevo.nombre);
    setMRCli(null);
  };

  const cliListaFilt = cliDB.filter(c => {
    if (!rCliBusqQ) return true;
    const q = rCliBusqQ.toLowerCase();
    if (rCliBusqX==='Nombre/empresa') return c.nombre.toLowerCase().includes(q);
    if (rCliBusqX==='Ruc-dni')        return c.ruc.includes(q);
    return c.nombre.toLowerCase().includes(q);
  });

  /* artículos form */
  const updRow = (id,k,v) => sf('artRows', form.artRows.map(r=>r.id===id?{...r,[k]:v}:r));
  const addRow = () => sf('artRows', [...form.artRows, filaVacia()]);
  const delRow = id => sf('artRows', form.artRows.filter(r=>r.id!==id));

  /* guardar venta */
  const guardar = () => {
    if (!form.cliNombre || form.cliNombre==='Cliente') {
      setAlert('err:Ingrese el nombre del cliente'); return;
    }
    const nva = {
      id:Date.now(), doc:form.documento,
      serie: form.documento.includes('Boleta')?`BI01-${String(ventas.length+1).padStart(6,'0')}`:
             form.documento.includes('Factura')?`FI01-${String(ventas.length+1).padStart(6,'0')}`:
             `001-${String(ventas.length+1).padStart(6,'0')}`,
      fecha:form.fecha, cliente:form.cliNombre,
      vendedor:form.vendedor, tvta:form.tipovta, sunat:'BETA', estado:'Borrador',
    };
    setVentas(p=>[nva,...p]);
    setAlert('ok:Venta guardada correctamente.');
    setTimeout(()=>setAlert(''),3000);
    setVista('lista');
    setForm(formIni());
  };

  /* lista filtrada */
  const listaFilt = ventas.filter(v => {
    if (bDocmto && !v.doc.toLowerCase().includes(bDocmto.toLowerCase())) return false;
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1'||bTipo==='9') { if (!v.serie.toLowerCase().includes(q)) return false; }
      else if (bTipo==='2'||bTipo==='10') { if (!v.cliente.toLowerCase().includes(q)) return false; }
      else if (bTipo==='3') { if (!v.vendedor.toLowerCase().includes(q)) return false; }
    }
    if (bfi && v.fecha < bfi) return false;
    if (bff && v.fecha > bff) return false;
    return true;
  });

  const SunatBadge = ({v}) => v==='OK' ? <span className="badge-ok">OK</span>
    : v==='ERROR' ? <span className="badge-err">ERROR</span>
    : <span className="badge-beta">BETA</span>;

  /* ══════ RENDER ══════ */
  return (
    <>
      <style>{css}</style>

      {alert && (
        <div style={{marginBottom:10,padding:'8px 14px',borderRadius:4,fontSize:13,
          background:alert.startsWith('ok:')?'#d4edda':'#f8d7da',
          border:`1px solid ${alert.startsWith('ok:')?'#c3e6cb':'#f5c6cb'}`,
          color:alert.startsWith('ok:')?'#155724':'#721c24'}}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ════════════ LISTA ════════════ */}
      {vista==='lista' && (
        <>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',
              width:22,height:22,display:'inline-flex',alignItems:'center',
              justifyContent:'center',fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Manual del usuario">?</span>
            <span style={{fontSize:16,fontWeight:'bold'}}>Venta</span>
          </div>

          <div className="vta-bar" style={{alignItems:'flex-end',flexWrap:'wrap',gap:8}}>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontWeight:'bold',fontSize:13}}>BUSCAR X</label>
              <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                <select value={bDocmto} onChange={e=>setBDocmto(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                  <option value="">Documento &gt; todos</option>
                  <option value="Boleta">Boleta</option>
                  <option value="Factura">Factura</option>
                  <option value="Nota de Venta">Nota de Venta</option>
                </select>
                <select value={bSucursal} onChange={e=>setBSucursal(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                  <option value="">Sucursal &gt; todos</option>
                  <option value="3">Almacen 1</option>
                  <option value="2">Tienda2</option>
                  <option value="1">Tienda1</option>
                </select>
                <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
                <select value={bTipo} onChange={e=>setBTipo(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:120}}>
                  <option value="1">Nro documento</option>
                  <option value="9">Serie del documento</option>
                  <option value="2">Nombre/empresa</option>
                  <option value="10">DNI/RUC</option>
                  <option value="3">Vendedor</option>
                </select>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
                  placeholder="Buscar..." style={{width:390,height:28,padding:'0 8px',
                  border:'1px solid #ced4da',borderRadius:3,fontSize:13}}/>
                <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              <label style={{fontSize:13}}>Fecha Inicio</label>
              <DP value={bfi} onChange={setBfi}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              <label style={{fontSize:13}}>Fecha Fin</label>
              <DP value={bff} onChange={setBff}/>
            </div>
            <button className="btn-buscar">✉ Buscar</button>
            <button className="btn-nuevo" onClick={()=>{ setForm(formIni()); setVista('form'); }}>+ Nuevo</button>
            <button className="btn-rapido" onClick={()=>setVista('rapido')}>⚡ Rapido</button>
          </div>

          <div className="tbl-titulo">LISTADO GENERAL</div>
          <table className="tlista">
            <thead>
              <tr>
                <th>DOCUMENTO</th><th>FECHA</th><th>CLIENTE</th><th>VENDEDOR</th>
                <th>T.VTA</th><th>SUNAT</th><th>ESTADO</th><th>OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              {listaFilt.length===0
                ? <tr><td colSpan={8} align="center" style={{padding:24,color:'#888'}}>Sin registros</td></tr>
                : listaFilt.map(v=>(
                  <tr key={v.id}>
                    <td align="center">{v.serie}</td>
                    <td align="center">{fmtFecha(v.fecha)}</td>
                    <td>{v.cliente}</td>
                    <td>{v.vendedor}</td>
                    <td align="center">{v.tvta}</td>
                    <td align="center"><SunatBadge v={v.sunat}/></td>
                    <td align="center">{v.estado}</td>
                    <td>
                      <div className="ops">
                        <button className="ic" onClick={()=>setMOpc({tipo:'editar', venta:v})}><IcoEdit/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'nd',     venta:v})}><IcoND/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'nc',     venta:v})}><IcoNC/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'ticket', venta:v})}><IcoTicket/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'cotizar',venta:v})}><IcoCoti/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'cliente',venta:v})}><IcoCli/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'vender', venta:v})}><IcoVender/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'pdf',    venta:v})}><IcoPDF/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'xml',    venta:v})}><IcoXML/></button>
                        <button className="ic" onClick={()=>setMOpc({tipo:'sunat',  venta:v})}><IcoLeer/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <div className="leyenda-ops">
            <b>Leyenda de OPCIONES :</b>
            <span><IcoEdit/> Actualizar, Eliminar</span>
            <span><IcoND/> Generar Nota de Debito</span>
            <span><IcoNC/> Generar Nota de Credito</span>
            <span><IcoTicket/> Imprimir Ticket</span>
            <span><IcoCoti/> Cotizar</span>
            <span><IcoCli/> cliente</span>
            <span><IcoVender/> Vender</span>
            <span><IcoPDF/> Imprimir PDF</span>
            <span><IcoXML/> Exportar XML</span>
            <span><IcoLeer/> Leer Ticket(sunat)</span>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>
          <div style={{textAlign:'center',marginBottom:6,fontSize:12,fontWeight:'bold',color:'#555'}}>
            Leyenda de COLORES :
          </div>
          <div className="ley-colores" style={{justifyContent:'center'}}>
            <div className="lc"><span className="badge-beta">BETA</span><span style={{fontSize:12}}>: COMPROBANTE DE PRUEBA NO SIRVE PARA DECLARAR ANTE SUNAT</span></div>
            <div className="lc"><span className="badge-err">ERROR</span><span style={{fontSize:12}}>: DOCUMENTO NO LLEGO A SUNAT TIENE 24 HORAS PARA SOLUCIONAR</span></div>
          </div>
        </>
      )}

      {/* ════════════ FORMULARIO NUEVA VENTA ════════════ */}
      {vista==='form' && (
        <>
          <div className="form-titulo">VENTA : NUEVA</div>

          <div className="nv-wrap">
            {/* FILA 1 */}
            <div className="nv-row">
              <div className="nv-cell" style={{minWidth:160}}>
                <label>Docmto-Serie : <span className="req">(*)</span><a href="#" className="lnk">..+</a></label>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <select value={form.documento} onChange={e=>sf('documento',e.target.value)}
                    style={{width:150,height:28,padding:'0 6px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                    {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell">
                <label>Fecha : <span className="req">(*)</span></label>
                <DP value={form.fecha} onChange={v=>sf('fecha',v)}/>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{minWidth:80}}>
                <label>Nº de Orden</label>
                <input type="text" value={form.nroorden} onChange={e=>sf('nroorden',e.target.value)} style={{width:80}}/>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{minWidth:90}}>
                <label>Moneda : <span className="req">(*)</span></label>
                <select value={form.moneda} onChange={e=>sf('moneda',e.target.value)}
                  style={{width:90,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {MONEDAS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="nv-cell" style={{minWidth:80,paddingTop:16}}>
                <label>&nbsp;</label>
                <select value={form.conigv} onChange={e=>sf('conigv',e.target.value)}
                  style={{width:82,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {CONIGV.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{minWidth:120}}>
                <label>Tipo Operacion: <span className="req">(*)</span></label>
                <select value={form.tipooper} onChange={e=>sf('tipooper',e.target.value)}
                  style={{width:130,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {TIPO_OPER.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{minWidth:80}}>
                <label>Pre Anticipo: <span className="req">(*)</span></label>
                <select value={form.preanticipo} onChange={e=>sf('preanticipo',e.target.value)}
                  style={{width:70,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {PRE_ANTICIPO.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* FILA 2 */}
            <div className="nv-row" style={{marginTop:4}}>
              <div className="nv-cell" style={{justifyContent:'flex-end',paddingBottom:4,minWidth:60}}>
                <label style={{display:'flex',alignItems:'center',gap:4,color:'#17a2b8',fontWeight:'bold',fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>
                  <input type="radio" defaultChecked style={{width:13,accentColor:'#17a2b8'}}/> Venta
                </label>
              </div>
              <div className="nv-cell" style={{minWidth:170}}>
                <label>&nbsp;</label>
                <select value={form.guia} onChange={e=>sf('guia',e.target.value)}
                  style={{width:175,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {GUIAS.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="nv-cell" style={{minWidth:55}}>
                <label>&nbsp;</label>
                <input type="text" value={form.nroguia} onChange={e=>sf('nroguia',e.target.value)} style={{width:55}}/>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{minWidth:140}}>
                <label>Vendedor</label>
                <select value={form.vendedor} onChange={e=>sf('vendedor',e.target.value)}
                  style={{width:155,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {VENDEDORES.map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell">
                <label>Tipo de venta <span className="req">(*)</span></label>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <select value={form.tipovta} onChange={e=>sf('tipovta',e.target.value)}
                    style={{width:88,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                    {TIPO_VTA.map(t=><option key={t}>{t}</option>)}
                  </select>
                  {form.tipovta==='Contado' && (
                    <select value={form.pagomod} onChange={e=>sf('pagomod',e.target.value)}
                      style={{width:200,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                      {PAGO_TIPO.map(p=><option key={p}>{p}</option>)}
                    </select>
                  )}
                  {form.tipovta==='Credito' && (
                    <span style={{display:'flex',alignItems:'center',gap:5}}>
                      <input type="text" value={form.diasdias} onChange={e=>sf('diasdias',e.target.value)} style={{width:42,height:28}} placeholder="Dias"/>
                      <span style={{fontSize:12}}>Dias</span>
                      <label style={{display:'flex',alignItems:'center',gap:3,fontSize:12,whiteSpace:'nowrap'}}>
                        <input type="checkbox" checked={form.letra} onChange={e=>sf('letra',e.target.checked)} style={{width:12}}/> C.Letra
                      </label>
                    </span>
                  )}
                </div>
              </div>
              <div className="nv-div"/>
              <div className="nv-cell" style={{flex:1,minWidth:160}}>
                <label>Sujeto a</label>
                <select value={form.sujeto} onChange={e=>sf('sujeto',e.target.value)}
                  style={{width:'100%',minWidth:170,height:28,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,color:'#212529',background:'#fff'}}>
                  {SUJETO_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {form.tipovta==='Contado' && (
                <>
                  <div className="nv-div"/>
                  <div className="nv-cell" style={{minWidth:100}}>
                    <label>Pago con</label>
                    <input type="text" value={form.pagocon} onChange={e=>sf('pagocon',e.target.value)} placeholder="moneda indicada" style={{width:115}}/>
                  </div>
                </>
              )}
            </div>
          </div>

          <hr className="sep"/>

          {/* SECCIÓN CLIENTE */}
          <div className="cli-section">
            <div className="cli-section-title">Datos del Cliente</div>
            <div className="cli-row">
              <div className="cli-cell">
                <label>CLIENTE (RUC/DNI)</label>
                <div className="inp-with-icon">
                  <input type="text" value={form.cliRuc} onChange={e=>sf('cliRuc',e.target.value)}
                    placeholder="Busca data/sunat/reniec" style={{width:160}}/>
                  <button className="btn-lupa" title="Consultar SUNAT">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="#17a2b8" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" stroke="#17a2b8" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="cli-cell" style={{flex:'0 0 auto'}}>
                <label>CLIENTE (Razon Social / Nombre): <span className="req">(*)</span></label>
                <div className="inp-with-icon">
                  <input type="text" className="inp-verde" value={form.cliNombre}
                    onChange={e=>sf('cliNombre',e.target.value)} style={{width:270,height:28}}/>
                  <button className="btn-bino" title="Buscar cliente"
                    onClick={()=>{ setCliQ(''); setCliRes(CLIENTES_DB); setMCli(true); }}>
                    📖
                  </button>
                </div>
              </div>
              <div className="cli-cell" style={{flex:1,minWidth:180}}>
                <label>CLIENTE (Direccion):</label>
                <input type="text" value={form.cliDir} onChange={e=>sf('cliDir',e.target.value)} style={{width:'100%',minWidth:180}}/>
              </div>
              <div className="cli-cell" style={{minWidth:170}}>
                <label>CLIENTE (E-mail):</label>
                <input type="text" value={form.cliEmail} onChange={e=>sf('cliEmail',e.target.value)} style={{width:185}}/>
              </div>
            </div>
          </div>

          <hr className="sep"/>

          {/* BÚSQUEDA ARTÍCULOS */}
          <div className="art-bar">
            <label>BUSQUEDA DE ARTICULOS ×</label>
            <select value={form.artBusqTipo} onChange={e=>sf('artBusqTipo',e.target.value)} style={{width:120}}>
              {['Nombre','Marca','Linea','Categoria','Codigo','C.Barra','Serie','Detalle'].map(o=><option key={o}>{o}</option>)}
            </select>
            <input type="text" value={form.artBusqQ}
              onChange={e=>{ sf('artBusqQ',e.target.value); if(!e.target.value){ setArtResultados([]); setArtBusqActiva(false); } }}
              onKeyDown={e=>e.key==='Enter'&&ejecutarBusquedaArt()}
              placeholder="Buscar artículo..." style={{minWidth:210}}/>
            <button className="btn-art-buscar" onClick={ejecutarBusquedaArt}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
              </svg>
              Buscar
            </button>
            <button className="btn-art-reset" title="Limpiar" onClick={()=>{ sf('artBusqQ',''); setArtResultados([]); setArtBusqActiva(false); }}>↺</button>
            {artResultados.length > 0 && (
              <span style={{fontSize:12,color:'#555',marginLeft:4}}>
                {artResultados.length} resultado{artResultados.length!==1?'s':''} encontrado{artResultados.length!==1?'s':''}
              </span>
            )}
          </div>

          {/* RESULTADOS DE BÚSQUEDA */}
          {artBusqActiva && (
            <div className="art-resultados">
              {artResultados.length === 0 ? (
                <div style={{padding:'14px',textAlign:'center',color:'#888',fontSize:13}}>
                  Sin resultados para "{form.artBusqQ}"
                </div>
              ) : (
                <table className="tart-res">
                  <thead>
                    <tr>
                      <th width="9%">CÓDIGO</th>
                      <th width="38%">ARTÍCULO</th>
                      <th width="8%">GRUPO</th>
                      <th width="7%">STOCK</th>
                      <th width="9%">P-M/C</th>
                      <th width="9%">P.VENTA</th>
                      <th width="10%">AGREGAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artResultados.map(art=>(
                      <tr key={art.id}>
                        <td style={{fontFamily:'monospace',fontSize:11}}>{art.codigo}</td>
                        <td style={{fontWeight: art.stock > 0 ? 'normal' : 'normal', color: art.stock > 0 ? '#212529' : '#888'}}>
                          {art.nombre}
                        </td>
                        <td style={{fontSize:11,color:'#666'}}>{art.grupo}</td>
                        <td align="center">
                          <span className={art.stock > 0 ? 'badge-stock-ok' : 'badge-stock-no'}>
                            {art.stock}
                          </span>
                        </td>
                        <td align="right" style={{color:'#1a6aad',fontWeight:'bold'}}>
                          S/ {art.pmc.toFixed(2)}
                        </td>
                        <td align="right" style={{fontWeight:'bold'}}>
                          S/ {art.precio.toFixed(2)}
                        </td>
                        <td align="center">
                          <button className="btn-add-art" onClick={()=>agregarArtComoNuevaFila(art)}>
                            + Agregar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TABLA ARTÍCULOS SELECCIONADOS */}
          <table className="tart">
            <thead>
              <tr>
                <th width="7%">CODIGO</th>
                <th width="26%">ARTICULOS/DETALLE</th>
                <th width="6%">STOCK</th>
                <th width="7%">MED.</th>
                <th width="8%">P-M/C</th>
                <th width="10%">P.VENTA</th>
                <th width="6%">CANT.</th>
                <th width="14%">T.A.IGV</th>
                <th width="5%">AGRE.</th>
                <th width="5%"></th>
              </tr>
            </thead>
            <tbody>
              {form.artRows.map(row=>(
                <tr key={row.id}>
                  <td><input type="text" value={row.codigo} onChange={e=>updRow(row.id,'codigo',e.target.value)}/></td>
                  <td><textarea value={row.articulo} onChange={e=>updRow(row.id,'articulo',e.target.value)} placeholder="Articulo/descripcion"/></td>
                  <td align="center"><input type="text" value={row.stock} onChange={e=>updRow(row.id,'stock',e.target.value)} style={{background:'#f8f9fa'}}/></td>
                  <td>
                    <select value={row.med} onChange={e=>updRow(row.id,'med',e.target.value)}>
                      {MED_OPTS.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td><input type="text" value={row.pmc} onChange={e=>updRow(row.id,'pmc',e.target.value)} style={{color:'#1a6aad',fontWeight:'bold'}}/></td>
                  <td><input type="text" value={row.pventa} onChange={e=>updRow(row.id,'pventa',e.target.value)}/></td>
                  <td><input type="number" value={row.cant} onChange={e=>updRow(row.id,'cant',e.target.value)} min="0"/></td>
                  <td>
                    <select value={row.taigv} onChange={e=>updRow(row.id,'taigv',e.target.value)}>
                      {TAIGV_OPTS.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td align="center">
                    <input type="checkbox" className="chk-agregar" checked={row.sel}
                      onChange={e=>updRow(row.id,'sel',e.target.checked)}/>
                  </td>
                  <td align="center">
                    {form.artRows.length>1 && (
                      <button onClick={()=>delRow(row.id)}
                        style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,padding:'2px 7px',cursor:'pointer',fontSize:12}}>✕</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:6,display:'flex',gap:8}}>
            <button className="btn-art-buscar" style={{fontSize:12,padding:'4px 12px'}} onClick={addRow}>
              + Agregar fila
            </button>
          </div>

          <div className="form-footer">
            <button className="btn-gd" onClick={guardar}>💾 Guardar</button>
            <button className="btn-reg" onClick={()=>setVista('lista')}>⬅ Regresar</button>
          </div>
        </>
      )}

      {/* ════════════ VENTAS RAPIDAS ════════════ */}
      {vista==='rapido' && (
        <div style={{padding:'10px 0'}}>
          <div style={{fontSize:16,fontWeight:'bold',marginBottom:14,color:'#212529'}}>VENTAS RAPIDAS</div>

          <div style={{display:'flex',gap:18,flexWrap:'wrap',alignItems:'flex-end',marginBottom:10}}>
            <div style={{minWidth:160}}>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>
                Doc-Serie :(<span style={{color:'red'}}>*</span>){' '}
                <span style={{color:'#0099ff',cursor:'pointer',fontWeight:'normal',fontSize:12}}>..+</span>
              </div>
              <select value={rDoc} onChange={e=>setRDoc(e.target.value)}
                style={{width:'100%',padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                <option>Boleta BI01</option>
                <option>Nota de Venta 001</option>
              </select>
            </div>

            <div>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>
                Tipo de venta(<span style={{color:'red'}}>*</span>)
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <select value={rTipoVta} onChange={e=>setRTipoVta(e.target.value)}
                  style={{width:100,padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                  <option>Contado</option>
                </select>
                {rTipoVta==='Contado' && (
                  <select value={rPago} onChange={e=>setRPago(e.target.value)}
                    style={{width:200,padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Contra Entrega">C.Entrega</option>
                    <option value="Yape">Yape [986638034] Billeteras móviles Soles</option>
                    <option value="Interbank">Deposito - Tranf. Interbank Soles</option>
                    <option value="BBVA">Deposito - Tranf. BBVA Soles</option>
                    <option value="BCP">Deposito - Tranf. BCP Soles</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                )}
              </div>
            </div>

            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>CLIENTE</div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <input type="text" value={rCliente} readOnly
                  style={{flex:1,maxWidth:280,padding:'5px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}/>
                <button onClick={()=>setMRCli('nuevo')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',whiteSpace:'nowrap'}}>
                  + Agregar Nuevo
                </button>
                <button onClick={()=>setMRCli('lista')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'12px 0 14px'}}/>

          {rCarrito.length > 0 && (
            <div style={{marginBottom:16}}>
              <table className="vr-table">
                <thead>
                  <tr className="vr-thead-dark">
                    {['CÓDIGO','ARTÍCULO','PRECIO','CANT.','TOTAL',''].map(h=>(
                      <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',letterSpacing:1,padding:'8px 6px',fontSize:13,textAlign:'center'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rCarrito.map((item,i)=>(
                    <tr key={item.id} style={{background:i%2===0?'#eee':'#fff'}}>
                      <td style={{padding:'4px 6px',fontSize:13,fontFamily:'monospace'}}>{item.codigo}</td>
                      <td style={{padding:'4px 6px',fontSize:13}}>{item.nombre}</td>
                      <td style={{padding:'4px 6px',fontSize:13,textAlign:'center'}}>
                        <input type="number" value={item.precio} min="0" step="0.01"
                          onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,precio:e.target.value}:r))}
                          className="vr-input"
                          style={{width:80,padding:'2px 5px',borderRadius:3,textAlign:'right'}}/>
                      </td>
                      <td style={{padding:'4px 6px',fontSize:13,textAlign:'center'}}>
                        <input type="number" value={item.cant} min="1"
                          onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,cant:e.target.value}:r))}
                          className="vr-input"
                          style={{width:55,padding:'2px 5px',borderRadius:3,textAlign:'center'}}/>
                      </td>
                      <td style={{padding:'4px 6px',fontSize:14,textAlign:'right',fontWeight:'bold'}}>
                        S/ {(parseFloat(item.precio||0)*parseFloat(item.cant||0)).toFixed(2)}
                      </td>
                      <td style={{padding:'4px 6px',textAlign:'center'}}>
                        <button onClick={()=>setRCarrito(p=>p.filter(r=>r.id!==item.id))}
                          style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,padding:'2px 8px',cursor:'pointer',fontSize:12}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{background:'skyblue'}}>
                    <td colSpan={4} style={{padding:'6px 8px',fontWeight:'bold',textAlign:'right',fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:1}}>TOTAL</td>
                    <td style={{padding:'6px 8px',fontWeight:'bold',fontSize:15,textAlign:'right',color:'#fff'}}>
                      S/ {rCarrito.reduce((s,r)=>s+parseFloat(r.precio||0)*parseFloat(r.cant||0),0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Búsqueda rápida */}
          <div style={{textAlign:'center',marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:'bold',marginRight:8}}>BUSCAR X</span>
            <select value={rBusqTipo} onChange={e=>setRBusqTipo(e.target.value)}
              style={{padding:'4px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff',marginRight:6}}>
              <option value="nomart">Nombre</option>
              <option value="codigo">Codigo</option>
              <option value="codigob">Codigo Barra</option>
              <option value="linea">Linea</option>
              <option value="categoria">Categoria</option>
            </select>
            <input type="text" value={rBusqQ} onChange={e=>setRBusqQ(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&buscarRapido(rBusqTipo,rBusqQ)}
              placeholder="Ingrese el texto a buscar"
              style={{width:240,padding:'4px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#ccff99',fontWeight:'bold',marginRight:4}}/>
            <button onClick={()=>buscarRapido(rBusqTipo,rBusqQ)}
              style={{background:'#17a2b8',border:'none',borderRadius:4,padding:'5px 12px',color:'#fff',cursor:'pointer',fontSize:13,marginRight:8,display:'inline-flex',alignItems:'center',gap:4}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{marginRight:6,color:'#888'}}>—</span>
            {/* Botones por grupo */}
            {[
              {label:'T',  tipo:'Todos',    val:'Todos'},
              {label:'P',  tipo:'Producto', val:'2'},
              {label:'S',  tipo:'Servicio', val:'2'},
              ...GRUPOS.map(g=>({label:g.substring(0,6), tipo:'grupo', val:g}))
            ].map((btn,i)=>(
              <button key={i}
                onClick={()=>{ setRCategoria(btn.label); buscarRapido(btn.tipo, btn.val); setRBusqTipo(btn.tipo); }}
                style={{background:rCategoria===btn.label?'#0d8ea4':'#17a2b8',
                  border:'none',borderRadius:4,padding:'5px 9px',color:'#fff',cursor:'pointer',
                  fontSize:11,fontWeight:'bold',marginRight:3,marginBottom:3}}
                title={btn.val}>
                {btn.label}
              </button>
            ))}
          </div>

          {rResultados.length > 0 && (
            <table className="vr-table" style={{marginBottom:16}}>
              <thead>
                <tr className="vr-thead-teal">
                  {['CÓDIGO','ARTÍCULO','GRUPO','STOCK','P.VENTA','CANT.','AGREGAR'].map(h=>(
                    <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',letterSpacing:1,padding:'8px 6px',fontSize:12,textAlign:'center'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rResultados.map((art,i)=>(
                  <tr key={art.id} style={{background:i%2===0?'#eee':'#fff'}}>
                    <td style={{padding:'4px 8px',fontSize:12,fontFamily:'monospace'}}>{art.codigo}</td>
                    <td style={{padding:'4px 8px',fontSize:13}}>{art.nombre}</td>
                    <td style={{padding:'4px 8px',fontSize:11,color:'#666'}}>{art.grupo}</td>
                    <td style={{padding:'4px 8px',fontSize:13,textAlign:'center'}}>
                      <span className={art.stock > 0 ? 'badge-stock-ok' : 'badge-stock-no'}>{art.stock}</span>
                    </td>
                    <td style={{padding:'4px 8px',fontSize:13,textAlign:'center',fontWeight:'bold'}}>S/ {art.precio.toFixed(2)}</td>
                    <td style={{padding:'4px 8px',textAlign:'center'}}>
                      <input
                        type="number"
                        defaultValue="1"
                        min="1"
                        value={cantInput[art.id] ?? 1}
                        onChange={e => setCantInput(p => ({...p, [art.id]: e.target.value}))}
                        className="vr-input"
                        style={{width:55,padding:'2px 5px',borderRadius:3,textAlign:'center',fontSize:13}}
                      />
                    </td>
                    <td style={{padding:'4px 8px',textAlign:'center'}}>
                      <button
                        onClick={()=>{
                          const cant = cantInput[art.id] ?? 1;
                          setRCarrito(p=>[...p,{...art, cant, precio: art.precio.toFixed(2), id:Date.now()+Math.random()}]);
                          setCantInput(p=>({...p,[art.id]:1}));
                        }}
                        style={{background:'#28a745',border:'none',color:'#fff',borderRadius:4,padding:'4px 12px',cursor:'pointer',fontSize:13,fontWeight:'bold'}}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {rResultados.length===0 && busqActiva && (
            <div style={{textAlign:'center',padding:20,color:'#aaa',fontSize:13}}>
              Sin resultados para "{busqActiva}"
            </div>
          )}

          <div style={{textAlign:'center',marginTop:16,display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            {rCarrito.length > 0 && (
              <button
                onClick={()=>{
                  const nva = {
                    id:Date.now(), doc:rDoc,
                    serie:rDoc.includes('Boleta')?`BI01-${String(ventas.length+1).padStart(6,'0')}`:`001-${String(ventas.length+1).padStart(6,'0')}`,
                    fecha:hoy, cliente:rCliente, vendedor:'fac-tura.com',
                    tvta:rTipoVta, sunat:'BETA', estado:'Borrador',
                  };
                  setVentas(p=>[nva,...p]);
                  setAlert('ok:Venta rápida guardada correctamente.');
                  setTimeout(()=>setAlert(''),3000);
                  setRCarrito([]); setRResultados([]); setBusqActiva('');
                  setVista('lista');
                }}
                style={{background:'#28a745',border:'none',color:'#fff',padding:'9px 28px',borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',display:'inline-flex',alignItems:'center',gap:6}}>
                💾 Guardar
              </button>
            )}
            <button onClick={()=>{ setRCarrito([]); setRResultados([]); setBusqActiva(''); setVista('lista'); }}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'9px 28px',borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',display:'inline-flex',alignItems:'center',gap:6}}>
              ↩ Regresar
            </button>
          </div>
        </div>
      )}

      {/* ══════ MODAL BUSCAR CLIENTE ══════ */}
      {mCli && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:40}}
          onClick={()=>setMCli(false)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:'#fff',borderRadius:6,width:'92vw',maxWidth:980,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',overflow:'hidden',maxHeight:'88vh',display:'flex',flexDirection:'column'}}>
            <div style={{background:'#1a1a2e',padding:'10px 16px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>🌐 Soft Inteligente - Google Chrome</div>
                <div style={{fontSize:11,color:'#6cb4e4'}}>gkmtechnology.com/eagle/inteligente/clientes_busar.php</div>
              </div>
              <button onClick={()=>setMCli(false)} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer',lineHeight:1}}>×</button>
            </div>
            <div style={{background:'#fff',padding:'14px 16px',overflowY:'auto',flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,flexWrap:'wrap'}}>
                <span style={{fontWeight:'bold',fontSize:13,color:'#212529',whiteSpace:'nowrap'}}>BUSCAR CLIENTES X</span>
                {['Nombre','Ruc','Vendedor'].map(f=>(
                  <label key={f} style={{fontWeight:'bold',color:'#212529',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:3,fontSize:13,whiteSpace:'nowrap'}}>
                    <input type="radio" name="clifilt2" checked={cliFilt===f} onChange={()=>setCliFilt(f)} style={{accentColor:'#17a2b8',width:13,height:13}}/> {f} /
                  </label>
                ))}
                <input type="text" value={cliQ} onChange={e=>setCliQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscarCliente()}
                  style={{padding:'5px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,background:'#b8f5b0',color:'#212529',fontWeight:'bold',width:160}}/>
                <button onClick={buscarCliente}
                  style={{background:'#17a2b8',border:'1px solid #17a2b8',color:'#fff',padding:'5px 14px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',display:'inline-flex',alignItems:'center',gap:5}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                  </svg> Buscar
                </button>
              </div>
              <div style={{textAlign:'center',fontWeight:'bold',fontSize:15,marginBottom:10,letterSpacing:.4,color:'#212529'}}>
                LISTADO GENERAL DE CLIENTES
              </div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:'#005f8c'}}>
                    {[['Nro','5%','left'],['Nombre','','left'],['RUC / DNI','14%','left'],['Direccion','28%','left'],['Agregar','7%','center']].map(([h,w,a])=>(
                      <th key={h} style={{padding:'9px 10px',color:'#fff',fontWeight:'bold',fontSize:13,textAlign:a,width:w||'auto'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cliRes.length===0
                    ? <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'#888',fontSize:13}}>Sin resultados</td></tr>
                    : cliRes.map((c,i)=>(
                      <tr key={c.id} style={{background:i%2===0?'#f2f2f2':'#fff',borderBottom:'1px solid #e0e0e0'}}>
                        <td style={{padding:'7px 10px',textAlign:'center',color:'#212529'}}>{i+1}</td>
                        <td style={{padding:'7px 10px',color:'#212529'}}>{c.nombre}</td>
                        <td style={{padding:'7px 10px',color:'#212529'}}>{c.ruc||''}</td>
                        <td style={{padding:'7px 10px',color:'#212529'}}>{c.dir||''}</td>
                        <td style={{padding:'7px 10px',textAlign:'center'}}>
                          <button onClick={()=>selCliente(c)}
                            style={{background:'none',border:'none',cursor:'pointer',color:'#6f42c1',fontSize:28,fontWeight:'bold',lineHeight:1,padding:'0 6px',display:'inline-flex',alignItems:'center',justifyContent:'center'}}
                            title="Agregar cliente">+</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div style={{textAlign:'center',marginTop:10,fontSize:13,color:'#555'}}>1</div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL LISTADO CLIENTES (Siguiente - Rapido) ════════ */}
      {mRCli==='lista' && (
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:750}}>
            <div className="mopc-head" style={{background:'#003d6b'}}>
              👤 CLIENTE
              <div style={{fontSize:12,fontWeight:'normal',display:'flex',gap:16,marginLeft:16}}>
                <label style={{cursor:'pointer'}}><input type="radio" checked={rCliFiltro==='por Criterio'} onChange={()=>setRCliFiltro('por Criterio')}/> por Criterio</label>
                <label style={{cursor:'pointer'}}><input type="radio" checked={rCliFiltro==='Total'} onChange={()=>setRCliFiltro('Total')}/> Total</label>
              </div>
            </div>
            <div className="mopc-body" style={{paddingBottom:10}}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:14,flexWrap:'wrap'}}>
                <span style={{fontWeight:'bold',fontSize:13}}>BUSCAR X</span>
                <select value={rCliBusqX} onChange={e=>setRCliBusqX(e.target.value)}
                  style={{padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff',width:160}}>
                  <option value="">SELECCIONE</option>
                  <option>Nombre/empresa</option><option>Ruc-dni</option>
                  <option>Dpto</option><option>Vendedor</option><option>Sucursal</option>
                </select>
                <input type="text" value={rCliBusqQ} onChange={e=>setRCliBusqQ(e.target.value)}
                  placeholder="Ingrese el texto a buscar"
                  style={{flex:1,minWidth:180,padding:'5px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}/>
                <button style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 16px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',display:'inline-flex',alignItems:'center',gap:5}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                  </svg> Buscar
                </button>
                <button onClick={()=>setMRCli('nuevo')} style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 16px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  + Agregar Nuevo
                </button>
              </div>
              <div style={{fontSize:12,color:'#666',marginBottom:6}}>
                Página 1 de {Math.max(1,Math.ceil(cliListaFilt.length/10))} &nbsp;
                <b>LISTADO GENERAL {cliListaFilt.length}</b>
              </div>
              <table className="mopc-table">
                <thead>
                  <tr>
                    <th width="5%">NRO</th><th>NOMBRE</th><th width="12%">DPTO</th>
                    <th width="14%">RUC</th><th width="12%">TELÉFONO</th>
                    <th width="10%">ANIVER.</th><th width="12%">VENDEDOR</th><th width="8%">SELEC.</th>
                  </tr>
                </thead>
                <tbody>
                  {cliListaFilt.length===0
                    ? <tr><td colSpan={8} style={{textAlign:'center',padding:20,color:'#888'}}>Sin resultados</td></tr>
                    : cliListaFilt.map((c,i)=>(
                      <tr key={c.id}>
                        <td align="center">{i+1}</td><td>{c.nombre}</td>
                        <td>—</td><td>{c.ruc||'—'}</td><td>—</td><td>—</td><td>—</td>
                        <td align="center">
                          <button onClick={()=>{ setRCliente(c.nombre); setMRCli(null); }}
                            style={{background:'#17a2b8',border:'none',color:'#fff',padding:'3px 12px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>✔</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="mopc-footer">
              <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>setMRCli(null)}>✕ Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL AGREGAR NUEVO CLIENTE ════════ */}
      {mRCli==='nuevo' && (
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:820,width:'95%'}}>
            <div className="mopc-head" style={{background:'#003d6b'}}>
              ➕ AGREGAR NUEVO CLIENTE
              <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:20}}>
                <input placeholder="Ingrese RUC/dni" style={{padding:'4px 10px',borderRadius:4,border:'1px solid #ced4da',fontSize:12,width:150,color:'#212529'}}/>
                <button style={{background:'#17a2b8',border:'none',borderRadius:4,padding:'4px 10px',color:'#fff',cursor:'pointer',fontSize:13}}>🔍</button>
              </div>
            </div>
            <div className="mopc-body" style={{maxHeight:'70vh',overflowY:'auto'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr',gap:10,marginBottom:12}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Empresa/nombre (*)</div>
                  <input className="mopc-inp" placeholder="Empresa/nombre" value={cliForm.nombre} onChange={e=>cf('nombre',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tipo Doc.(*)</div>
                  <select className="mopc-inp" value={cliForm.tipodoc} onChange={e=>cf('tipodoc',e.target.value)}>
                    <option>RUC</option><option>DNI</option><option>CE</option><option>Pasaporte</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Nro (*)</div>
                  <input className="mopc-inp" value={cliForm.nro} onChange={e=>cf('nro',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Representante</div>
                  <input className="mopc-inp" value={cliForm.representante} onChange={e=>cf('representante',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>DNI [########]</div>
                  <input className="mopc-inp" value={cliForm.dni} onChange={e=>cf('dni',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Pais/nacional.(*)</div>
                  <select className="mopc-inp" value={cliForm.pais} onChange={e=>cf('pais',e.target.value)}>
                    <option>Peru</option><option>Colombia</option><option>Chile</option><option>Ecuador</option><option>Bolivia</option><option>Otro</option>
                  </select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 2fr 1fr',gap:10,marginBottom:12}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Dpto</div>
                  <select className="mopc-inp" value={cliForm.dpto} onChange={e=>cf('dpto',e.target.value)}>
                    <option value=""></option>
                    {['Lima','Arequipa','Cusco','La Libertad','Piura','Lambayeque','Junín','Ica','Ancash','Loreto'].map(d=><option key={d}>{d}</option>)}
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Provincia(*)</div>
                  <select className="mopc-inp" value={cliForm.provincia} onChange={e=>cf('provincia',e.target.value)}>
                    <option value=""></option><option>Lima</option><option>Callao</option><option>Arequipa</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Distrito(*)</div>
                  <select className="mopc-inp" value={cliForm.distrito} onChange={e=>cf('distrito',e.target.value)}>
                    <option value=""></option>
                    <option>Miraflores</option><option>San Isidro</option><option>Surco</option>
                    <option>La Molina</option><option>Lince</option><option>San Borja</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Direccion (*)</div>
                  <input className="mopc-inp" value={cliForm.direccion} onChange={e=>cf('direccion',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tel. Fijo</div>
                  <input className="mopc-inp" value={cliForm.telfijo} onChange={e=>cf('telfijo',e.target.value)}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 2fr 1fr',gap:10,marginBottom:12}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Movistar</div>
                  <input className="mopc-inp" value={cliForm.movistar} onChange={e=>cf('movistar',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Claro</div>
                  <input className="mopc-inp" value={cliForm.claro} onChange={e=>cf('claro',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Otros</div>
                  <input className="mopc-inp" value={cliForm.otros} onChange={e=>cf('otros',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>E-mail</div>
                  <input className="mopc-inp" type="email" value={cliForm.email} onChange={e=>cf('email',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Descuento%</div>
                  <input className="mopc-inp" type="number" value={cliForm.descuento} onChange={e=>cf('descuento',e.target.value)}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr',gap:10}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Aniversario/Cump.</div>
                  <DP value={cliForm.aniversario} onChange={v=>cf('aniversario',v)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Responsable</div>
                  <select className="mopc-inp" value={cliForm.responsable} onChange={e=>cf('responsable',e.target.value)}>
                    {VENDEDORES.map(v=><option key={v}>{v}</option>)}
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Modo de pago</div>
                  <select className="mopc-inp" value={cliForm.modopago} onChange={e=>cf('modopago',e.target.value)}>
                    <option>Contado</option><option>Credito</option><option>Mixto</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Estado del cliente</div>
                  <select className="mopc-inp" value={cliForm.estado} onChange={e=>cf('estado',e.target.value)}>
                    <option>Pagador</option><option>Moroso</option><option>Suspendido</option><option>VIP</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Partida</div>
                  <input className="mopc-inp" value={cliForm.partida} onChange={e=>cf('partida',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Representa (Nombre)</div>
                  <input className="mopc-inp" value={cliForm.representa} onChange={e=>cf('representa',e.target.value)}/></div>
              </div>
            </div>
            <div className="mopc-footer">
              <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={guardarNuevoCli}>💾 Guardar</button>
              <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>{ setCliForm(cliIni()); setMRCli('lista'); }}>← Regresar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODALES OPCIONES TABLA ════════ */}
      {mOpc && (()=>{
        const v = mOpc.venta;
        const BtnCerrar = ({color='#6c757d'}) => (
          <button className="mopc-btn" style={{background:color}} onClick={cerrarMOpc}>✕ Cerrar</button>
        );

        if(mOpc.tipo==='editar') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#e67e22'}}>✏ Editar / Eliminar Venta — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.doc}</span></div>
                <div className="mopc-row"><span className="mopc-label">Serie:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span>
                  <input className="mopc-inp" defaultValue={v.cliente} onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,cliente:e.target.value}:x))}/></div>
                <div className="mopc-row"><span className="mopc-label">Vendedor:</span>
                  <select className="mopc-inp" defaultValue={v.vendedor} onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,vendedor:e.target.value}:x))}>
                    {VENDEDORES.map(vd=><option key={vd}>{vd}</option>)}
                  </select></div>
                <div className="mopc-row"><span className="mopc-label">Estado:</span>
                  <select className="mopc-inp" defaultValue={v.estado} onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,estado:e.target.value}:x))}>
                    {['Emitido','Borrador','Anulado','Error'].map(s=><option key={s}>{s}</option>)}
                  </select></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}}
                  onClick={()=>{ setAlert('ok:Registro actualizado.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>💾 Guardar</button>
                <button className="mopc-btn" style={{background:'#dc3545'}}
                  onClick={()=>{ if(window.confirm(`¿Eliminar ${v.serie}?`)){ setVentas(p=>p.filter(x=>x.id!==v.id)); cerrarMOpc(); } }}>🗑 Eliminar</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='nd') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#28a745'}}>ND Generar Nota de Débito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp">
                    <option>02 - Aumento en el valor</option>
                    <option>03 - Penalidades / otras deducciones al acreedor</option>
                    <option>11 - Ajustes de operaciones de exportación</option>
                  </select></div>
                <div className="mopc-row"><span className="mopc-label">Descripción:</span>
                  <input className="mopc-inp" placeholder="Descripción de la nota de débito..."/></div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span>
                  <input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}}
                  onClick={()=>{ setAlert('ok:Nota de Débito generada.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>✔ Generar ND</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='nc') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>NC Generar Nota de Crédito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp">
                    <option>01 - Anulación de la operación</option>
                    <option>02 - Anulación por error en el RUC</option>
                    <option>03 - Corrección por error en la descripción</option>
                    <option>04 - Descuento global</option>
                    <option>06 - Devolución total</option>
                  </select></div>
                <div className="mopc-row"><span className="mopc-label">Descripción:</span>
                  <input className="mopc-inp" placeholder="Descripción de la nota de crédito..."/></div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span>
                  <input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}}
                  onClick={()=>{ setAlert('ok:Nota de Crédito generada.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>✔ Generar NC</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='ticket') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:360}}>
              <div className="mopc-head" style={{background:'#17a2b8'}}>🖨 Ticket — {v.serie}</div>
              <div className="mopc-body" style={{fontFamily:'monospace',fontSize:13,lineHeight:1.8}}>
                <div style={{textAlign:'center',borderBottom:'1px dashed #aaa',paddingBottom:8,marginBottom:8}}>
                  <div style={{fontWeight:'bold',fontSize:15}}>EMPRESA S.A.C.</div>
                  <div style={{fontSize:11,color:'#666'}}>RUC: 20123456789</div>
                  <div style={{fontSize:11,color:'#666'}}>Av. Principal 123, Lima</div>
                </div>
                <div style={{borderBottom:'1px dashed #aaa',paddingBottom:8,marginBottom:8}}>
                  <div><b>{v.doc}</b>: {v.serie}</div>
                  <div>Fecha: {fmtFecha(v.fecha)}</div>
                  <div>Cliente: {v.cliente}</div>
                  <div>Vendedor: {v.vendedor}</div>
                </div>
                <table style={{width:'100%',fontSize:12}}>
                  <thead><tr><th style={{textAlign:'left'}}>Artículo</th><th>Cant</th><th>P.U.</th><th>Total</th></tr></thead>
                  <tbody><tr><td>Producto demo</td><td style={{textAlign:'center'}}>1</td><td style={{textAlign:'right'}}>100.00</td><td style={{textAlign:'right'}}>100.00</td></tr></tbody>
                </table>
                <div style={{borderTop:'1px dashed #aaa',marginTop:8,paddingTop:8,textAlign:'right'}}>
                  <div>SubTotal: S/ 84.75</div><div>IGV (18%): S/ 15.25</div>
                  <div style={{fontWeight:'bold',fontSize:15}}>TOTAL: S/ 100.00</div>
                </div>
                <div style={{textAlign:'center',marginTop:10,fontSize:11,color:'#888'}}>¡Gracias por su compra!</div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={()=>window.print()}>🖨 Imprimir</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='cotizar') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#6c9bd1'}}>↺ Cotización desde — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Vendedor:</span><span className="mopc-val">{v.vendedor}</span></div>
                <div className="mopc-row"><span className="mopc-label">Validez:</span>
                  <select className="mopc-inp" style={{width:160}}>
                    <option>7 días</option><option>15 días</option><option>30 días</option><option>60 días</option>
                  </select></div>
                <div className="mopc-row"><span className="mopc-label">Observación:</span>
                  <input className="mopc-inp" placeholder="Notas u observaciones para el cliente..."/></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#6c9bd1'}}
                  onClick={()=>{ setAlert('ok:Cotización generada correctamente.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>📄 Generar Cotización</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='cliente') {
          const cli = CLIENTES_DB.find(c=>c.nombre===v.cliente)||{nombre:v.cliente,ruc:'—',dir:'—'};
          return (
            <div className="mopc-overlay" onClick={cerrarMOpc}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()}>
                <div className="mopc-head" style={{background:'#17a2b8'}}>👤 Datos del Cliente</div>
                <div className="mopc-body">
                  <div className="mopc-row"><span className="mopc-label">Nombre:</span><span className="mopc-val">{cli.nombre}</span></div>
                  <div className="mopc-row"><span className="mopc-label">RUC / DNI:</span><span className="mopc-val">{cli.ruc||'—'}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Dirección:</span><span className="mopc-val">{cli.dir||'—'}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Vendedor:</span><span className="mopc-val">{v.vendedor}</span></div>
                  <div className="mopc-row"><span className="mopc-label">T. Venta:</span><span className="mopc-val">{v.tvta}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Última venta:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                </div>
                <div className="mopc-footer"><BtnCerrar color="#17a2b8"/></div>
              </div>
            </div>
          );
        }

        if(mOpc.tipo==='vender') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#6c757d'}}>🛒 Nueva Venta para — {v.cliente}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Documento:</span>
                  <select className="mopc-inp" style={{width:180}}>
                    {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
                  </select></div>
                <div className="mopc-row"><span className="mopc-label">Tipo venta:</span>
                  <select className="mopc-inp" style={{width:130}}>
                    {TIPO_VTA.map(t=><option key={t}>{t}</option>)}
                  </select></div>
                <div style={{marginTop:12,padding:12,background:'#fff3cd',borderRadius:6,fontSize:13,color:'#856404'}}>
                  💡 Se abrirá el formulario de Nueva Venta con los datos de este cliente prellenados.
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#6c757d'}}
                  onClick={()=>{ setForm({...formIni(),cliNombre:v.cliente}); cerrarMOpc(); setVista('form'); }}>➡ Ir a Nueva Venta</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='pdf') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>📄 Imprimir Factura / Boleta Electrónica</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">SUNAT:</span>
                  <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span></div>
                <div style={{marginTop:14,padding:12,background:'#f8d7da',borderRadius:6,fontSize:13,color:'#721c24'}}>
                  {v.sunat!=='OK'
                    ? '⚠ Este documento aún no fue aceptado por SUNAT. El PDF se generará como borrador.'
                    : '✅ Documento aceptado por SUNAT. El PDF es válido como comprobante electrónico.'}
                </div>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <div style={{textAlign:'center',padding:'14px 20px',border:'1px solid #dee2e6',borderRadius:6,cursor:'pointer',minWidth:120}} onClick={()=>window.print()}>
                    <div style={{fontSize:28}}>📄</div><div style={{fontSize:12,marginTop:4}}>A4 / Carta</div>
                  </div>
                  <div style={{textAlign:'center',padding:'14px 20px',border:'1px solid #dee2e6',borderRadius:6,cursor:'pointer',minWidth:120}} onClick={()=>window.print()}>
                    <div style={{fontSize:28}}>🧾</div><div style={{fontSize:12,marginTop:4}}>Ticket 80mm</div>
                  </div>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>window.print()}>🖨 Imprimir PDF</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='xml') {
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>${v.serie}</ID>
  <IssueDate>${v.fecha}</IssueDate>
  <InvoiceTypeCode>${v.doc.includes('Factura')?'01':'03'}</InvoiceTypeCode>
  <DocumentCurrencyCode>PEN</DocumentCurrencyCode>
  <AccountingCustomerParty>
    <Party><PartyName><Name>${v.cliente}</Name></PartyName></Party>
  </AccountingCustomerParty>
  <LegalMonetaryTotal>
    <TaxExclusiveAmount currencyID="PEN">84.75</TaxExclusiveAmount>
    <TaxInclusiveAmount currencyID="PEN">100.00</TaxInclusiveAmount>
    <PayableAmount currencyID="PEN">100.00</PayableAmount>
  </LegalMonetaryTotal>
</Invoice>`;
          return (
            <div className="mopc-overlay" onClick={cerrarMOpc}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:660}}>
                <div className="mopc-head" style={{background:'#6c757d'}}>📦 Exportar XML — {v.serie}</div>
                <div className="mopc-body">
                  <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Estado SUNAT:</span>
                    <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span></div>
                  <pre className="xml-pre">{xmlContent}</pre>
                </div>
                <div className="mopc-footer">
                  <button className="mopc-btn" style={{background:'#6c757d'}}
                    onClick={()=>{
                      const blob=new Blob([xmlContent],{type:'application/xml'});
                      const a=document.createElement('a');
                      a.href=URL.createObjectURL(blob);
                      a.download=`${v.serie}.xml`;
                      a.click();
                    }}>⬇ Descargar XML</button>
                  <BtnCerrar/>
                </div>
              </div>
            </div>
          );
        }

        if(mOpc.tipo==='sunat') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#e67e22'}}>📖 Consulta SUNAT — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Tipo:</span><span className="mopc-val">{v.doc}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha emisión:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">Estado SUNAT:</span>
                  <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span></div>
                <div style={{marginTop:14,padding:14,background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6}}>
                  <div style={{fontSize:13,fontWeight:'bold',marginBottom:8,color:'#555'}}>Respuesta SUNAT:</div>
                  {v.sunat==='OK' && <div style={{color:'#155724',fontSize:13}}>✅ <b>Aceptado</b> — Comprobante recibido y aceptado correctamente.</div>}
                  {v.sunat==='ERROR' && <div style={{color:'#721c24',fontSize:13}}>❌ <b>Rechazado</b> — El comprobante presentó errores. Tiene 24 horas para corregir y reenviar.</div>}
                  {v.sunat==='BETA' && <div style={{color:'#856404',fontSize:13}}>⚠ <b>BETA</b> — Comprobante de prueba. No válido para declarar ante SUNAT.</div>}
                </div>
                <div style={{marginTop:12,textAlign:'center'}}>
                  <a href="https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm" target="_blank" rel="noreferrer"
                    style={{color:'#17a2b8',fontSize:13,textDecoration:'underline'}}>
                    🔗 Verificar en portal SUNAT (s/clave SOL)
                  </a>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#e67e22'}}
                  onClick={()=>{
                    setVentas(p=>p.map(x=>x.id===v.id?{...x,sunat:'OK',estado:'Emitido'}:x));
                    setAlert('ok:Estado actualizado desde SUNAT.');
                    setTimeout(()=>setAlert(''),3000);
                    cerrarMOpc();
                  }}>🔄 Actualizar Estado</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        return null;
      })()}
    </>
  );
}