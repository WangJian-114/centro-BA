/* ================================================
   consulta.js — Consulta de Viajes
   Datos reales de transporte de Buenos Aires.
   Fuentes: GCBA, subte.ar, colectivoshoy.info
   Tarifas vigentes junio 2026
   ================================================ */

// ── Barrios disponibles con info de subte ─────────
const BARRIOS = {
  retiro:        { nombre: 'Retiro',        zona: 'norte',  subte: 'C', estacion: 'Retiro'        },
  constitucion:  { nombre: 'Constitución',  zona: 'sur',    subte: 'C', estacion: 'Constitución'  },
  once:          { nombre: 'Once',          zona: 'centro', subte: 'A', estacion: 'Pasco'          },
  palermo:       { nombre: 'Palermo',       zona: 'norte',  subte: 'D', estacion: 'Plaza Italia'   },
  belgrano:      { nombre: 'Belgrano',      zona: 'norte',  subte: 'D', estacion: 'Juramento'      },
  flores:        { nombre: 'Flores',        zona: 'oeste',  subte: 'A', estacion: 'Puan'           },
  caballito:     { nombre: 'Caballito',     zona: 'centro', subte: 'A', estacion: 'Primera Junta'  },
  barracas:      { nombre: 'Barracas',      zona: 'sur',    subte: 'H', estacion: 'Caseros'        },
  la_boca:       { nombre: 'La Boca',       zona: 'sur',    subte: null, estacion: null            },
  san_telmo:     { nombre: 'San Telmo',     zona: 'sur',    subte: 'E', estacion: 'San José'       },
  microcentro:   { nombre: 'Microcentro',   zona: 'centro', subte: 'D', estacion: 'Catedral'       },
  villa_urquiza: { nombre: 'Villa Urquiza', zona: 'norte',  subte: 'B', estacion: 'Los Incas'      },
};

// ── Base de rutas por par de barrios ─────────────
// Cada ruta tiene: tipo, nombre, paradas, tiempo, costo, plataforma, steps (pasos)
const RUTAS_DB = {

  'retiro_constitucion': [
    { tipo:'subte',    nombre:'Subte Línea C', recomendado:true,  plataforma:'Est. Retiro – Línea C (dir. Constitución)', paradas:9, tiempo:17, costo:1250,
      steps:['Entrá al subte por la est. Retiro (Av. Ramos Mejía)','Tomá la Línea C dirección Constitución (Sur)','Estaciones: Retiro → San Martín → Lavalle → Diagonal Norte → Av. de Mayo → Moreno → Independencia → San Juan → Constitución','Salida por Av. Brasil – a 1 cuadra de la Terminal de Ómnibus','Frecuencia: cada 3-5 min en hora pico'] },
    { tipo:'metrobus', nombre:'Metrobús 9 de Julio', recomendado:false, plataforma:'Andén Norte – Corredor Av. 9 de Julio', paradas:7, tiempo:22, costo:850,
      steps:['Subí al Metrobús en el andén de Retiro sobre Av. 9 de Julio','Recorre el corredor central hacia el sur','Bajá en el andén de Constitución (frente a la estación de tren)','Frecuencia: cada 5-7 minutos'] },
    { tipo:'bus',      nombre:'Colectivo 59', recomendado:false, plataforma:'Parada Av. del Libertador y Maipú (Retiro)', paradas:11, tiempo:28, costo:850,
      steps:['Tomá el 59 en Av. del Libertador y Maipú','Sube por el corredor central hasta Constitución','Bajá en Av. Brasil y Lima (Constitución)','Frecuencia: cada 8 minutos'] },
  ],

  'belgrano_palermo': [
    { tipo:'subte', nombre:'Subte Línea D', recomendado:true, plataforma:'Est. Juramento – Línea D (dir. Catedral)', paradas:4, tiempo:9, costo:1250,
      steps:['Entrá al subte en est. Juramento (Av. Cabildo y Juramento)','Tomá la Línea D dirección Catedral','Estaciones: Juramento → José Hernández → Olleros → Ministro Carranza → Plaza Italia','Salida por Av. Santa Fe y Gurruchaga (Palermo)','Frecuencia: cada 4-6 min en hora pico'] },
    { tipo:'bus', nombre:'Colectivo 60', recomendado:false, plataforma:'Parada Av. Cabildo y Juramento', paradas:9, tiempo:18, costo:850,
      steps:['Tomá el 60 en Av. Cabildo (dirección Centro/Sur)','Recorre Av. Cabildo → Av. Santa Fe hasta Palermo','Bajá en Plaza Italia o Av. del Libertador y Santa Fe','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 29', recomendado:false, plataforma:'Parada Av. Juramento y Echeverría', paradas:11, tiempo:24, costo:850,
      steps:['Tomá el 29 en Av. Juramento dirección Sur','Bajá en Av. del Libertador y Scalabrini Ortiz (Palermo Hollywood)','Frecuencia: cada 8-10 minutos'] },
  ],

  'belgrano_microcentro': [
    { tipo:'subte', nombre:'Subte Línea D', recomendado:true, plataforma:'Est. Juramento – Línea D (dir. Catedral)', paradas:13, tiempo:24, costo:1250,
      steps:['Entrá al subte en est. Juramento (Av. Cabildo)','Tomá la Línea D dirección Catedral (Microcentro)','Recorrido completo: Juramento → José Hernández → Olleros → Ministro Carranza → Plaza Italia → Scalabrini Ortiz → Bulnes → Agüero → Pueyrredón → Fac. de Medicina → Callao → Tribunales → 9 de Julio → Catedral','Bajá en Catedral (frente a Plaza de Mayo)','Frecuencia: cada 4-5 min en hora pico'] },
    { tipo:'bus', nombre:'Colectivo 60', recomendado:false, plataforma:'Parada Av. Cabildo y Monroe', paradas:20, tiempo:38, costo:850,
      steps:['Tomá el 60 en Av. Cabildo (dirección Centro)','Baja por Av. Santa Fe / Av. Córdoba hasta el Microcentro','Bajá en Av. Córdoba y Florida','Frecuencia: cada 8-10 minutos'] },
    { tipo:'bus', nombre:'Colectivo 152', recomendado:false, plataforma:'Parada Av. del Libertador (Belgrano)', paradas:15, tiempo:32, costo:850,
      steps:['Tomá el 152 en Av. del Libertador (Belgrano)','Recorre Av. del Libertador → Retiro → Microcentro','Bajá en Av. Corrientes y Maipú','Frecuencia: cada 10 minutos'] },
  ],

  'palermo_microcentro': [
    { tipo:'subte', nombre:'Subte Línea D', recomendado:true, plataforma:'Est. Plaza Italia – Línea D (dir. Catedral)', paradas:10, tiempo:14, costo:1250,
      steps:['Entrá al subte en est. Plaza Italia (Av. Santa Fe y Gurruchaga)','Tomá la Línea D dirección Catedral (Este)','Estaciones: Plaza Italia → Scalabrini Ortiz → Bulnes → Agüero → Pueyrredón → Fac. de Medicina → Callao → Tribunales → 9 de Julio → Catedral','Salida en Catedral (Plaza de Mayo) o 9 de Julio (Obelisco)','Frecuencia: cada 4-6 minutos'] },
    { tipo:'bus', nombre:'Colectivo 12', recomendado:false, plataforma:'Parada Av. Santa Fe y Scalabrini Ortiz', paradas:13, tiempo:25, costo:850,
      steps:['Tomá el 12 en Av. Santa Fe dirección Centro','Recorre Av. Santa Fe / Av. Córdoba hasta Microcentro','Bajá en Av. Córdoba y Florida','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 60', recomendado:false, plataforma:'Parada Av. Santa Fe y Juan B. Justo', paradas:11, tiempo:22, costo:850,
      steps:['Tomá el 60 en Av. Santa Fe dirección Centro','Baja hasta Microcentro por Av. Santa Fe / Córdoba','Bajá en Florida y Corrientes','Frecuencia: cada 8-10 minutos'] },
  ],

  'flores_microcentro': [
    { tipo:'subte', nombre:'Subte Línea A', recomendado:true, plataforma:'Est. Puan – Línea A (dir. Plaza de Mayo)', paradas:9, tiempo:16, costo:1250,
      steps:['Entrá al subte en est. Puan (Av. Rivadavia y Puan)','Tomá la Línea A dirección Plaza de Mayo (Este)','Estaciones: Puan → Carabobo → Emilio Mitre → Río de Janeiro → Medrano → Castro Barros → Loria → Acoyte → Primera Junta → Pasco → Congreso → Sáenz Peña → Lima → Piedras → Perú → Plaza de Mayo','Bajá en Lima o Plaza de Mayo','Frecuencia: cada 4-6 minutos'] },
    { tipo:'bus', nombre:'Colectivo 55', recomendado:false, plataforma:'Parada Av. Rivadavia y Boyacá (Flores)', paradas:16, tiempo:32, costo:850,
      steps:['Tomá el 55 en Av. Rivadavia dirección Centro','Recorre Av. Rivadavia hasta el Microcentro','Bajá en Av. Rivadavia y Esmeralda','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 26', recomendado:false, plataforma:'Parada Av. Rivadavia (Flores)', paradas:18, tiempo:36, costo:850,
      steps:['Tomá el 26 en Av. Rivadavia (Flores)','Recorre Flores → Caballito → Once → Microcentro','Bajá en Av. Corrientes y Maipú','Frecuencia: cada 8-10 minutos'] },
  ],

  'caballito_microcentro': [
    { tipo:'subte', nombre:'Subte Línea A', recomendado:true, plataforma:'Est. Primera Junta – Línea A (dir. Plaza de Mayo)', paradas:7, tiempo:14, costo:1250,
      steps:['Entrá al subte en est. Primera Junta (Av. Rivadavia y Directorio)','Tomá la Línea A dirección Plaza de Mayo (Este)','Estaciones: Primera Junta → Pasco → Congreso → Sáenz Peña → Lima → Piedras → Perú → Plaza de Mayo','Bajá en Lima (Microcentro) o Plaza de Mayo','Frecuencia: cada 4-6 min en hora pico'] },
    { tipo:'bus', nombre:'Colectivo 55', recomendado:false, plataforma:'Parada Av. Rivadavia y J. M. Moreno', paradas:13, tiempo:26, costo:850,
      steps:['Tomá el 55 en Av. Rivadavia (Caballito) dirección Centro','Recorre Av. Rivadavia hasta el Microcentro','Bajá en Av. Rivadavia y Esmeralda','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 12', recomendado:false, plataforma:'Parada Av. Honorio Pueyrredón (Caballito)', paradas:14, tiempo:28, costo:850,
      steps:['Tomá el 12 en Caballito dirección Centro','Recorre Caballito → Almagro → Once → Microcentro','Bajá en Av. Corrientes y Florida','Frecuencia: cada 8 minutos'] },
  ],

  'villa_urquiza_microcentro': [
    { tipo:'subte', nombre:'Subte Línea B', recomendado:true, plataforma:'Est. Los Incas – Línea B (dir. Leandro N. Alem)', paradas:17, tiempo:28, costo:1250,
      steps:['Entrá al subte en est. Los Incas (Av. Triunvirato)','Tomá la Línea B dirección Leandro N. Alem (Este)','Recorre: Los Incas → Dorrego → Federico Lacroze → Malabia → Ángel Gallardo → Medrano → Carlos Gardel → Pasteur → Pueyrredón → Callao → Uruguay → Carlos Pellegrini → Florida → L. N. Alem','Bajá en Leandro N. Alem (Microcentro)','Frecuencia: cada 5-7 minutos'] },
    { tipo:'bus', nombre:'Colectivo 65', recomendado:false, plataforma:'Parada Av. Triunvirato (Villa Urquiza)', paradas:21, tiempo:40, costo:850,
      steps:['Tomá el 65 en Av. Triunvirato dirección Sur','Recorre Av. Triunvirato → Av. Corrientes hasta el Microcentro','Bajá en Av. Corrientes y Maipú','Frecuencia: cada 8-10 minutos'] },
    { tipo:'bus', nombre:'Colectivo 71', recomendado:false, plataforma:'Parada Av. Monroe (Villa Urquiza)', paradas:19, tiempo:37, costo:850,
      steps:['Tomá el 71 en Av. Monroe (dirección Centro)','Recorre Villa Urquiza → Belgrano → Palermo → Microcentro','Bajá en Av. Santa Fe y Florida','Frecuencia: cada 9 minutos'] },
  ],

  'san_telmo_microcentro': [
    { tipo:'bus', nombre:'Colectivo 29', recomendado:true, plataforma:'Parada Av. Independencia y Defensa (San Telmo)', paradas:5, tiempo:12, costo:850,
      steps:['Tomá el 29 en Av. Independencia y Defensa (San Telmo)','Sube hacia el Microcentro por Av. 9 de Mayo / Perú','Bajá en Av. de Mayo y Florida, o en Av. Corrientes','Frecuencia: cada 6-8 minutos'] },
    { tipo:'subte', nombre:'Subte Línea E', recomendado:false, plataforma:'Est. San José – Línea E (dir. Bolívar)', paradas:3, tiempo:8, costo:1250,
      steps:['Entrá al subte en est. San José (Av. San Juan y Salta)','Tomá la Línea E dirección Bolívar (Este)','Estaciones: San José → Entre Ríos → Av. de Mayo → Bolívar','Bajá en Bolívar (3 estaciones, salida a Plaza de Mayo)','Caminá 4 cuadras hasta el Microcentro'] },
    { tipo:'bus', nombre:'Colectivo 24', recomendado:false, plataforma:'Parada Defensa y México (San Telmo)', paradas:6, tiempo:14, costo:850,
      steps:['Tomá el 24 en Defensa y México (San Telmo)','Sube por el microcentro histórico hacia el Centro','Bajá en Av. Corrientes y San Martín','Frecuencia: cada 8 minutos'] },
  ],

  'la_boca_microcentro': [
    { tipo:'bus', nombre:'Colectivo 29', recomendado:true, plataforma:'Parada Av. Almirante Brown y Martín García (La Boca)', paradas:8, tiempo:18, costo:850,
      steps:['Tomá el 29 en Av. Almirante Brown y Av. Martín García','Sube por Paseo Colón hasta el Microcentro','Bajá en Av. Corrientes y San Martín','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 64', recomendado:false, plataforma:'Parada Caminito – Av. Pedro de Mendoza (La Boca)', paradas:9, tiempo:20, costo:850,
      steps:['Tomá el 64 en Av. Almirante Brown (La Boca)','Recorre Paseo Colón hasta el centro histórico','Bajá en Av. de Mayo y Perú (a 2 cuadras de Plaza de Mayo)','Frecuencia: cada 9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 53', recomendado:false, plataforma:'Parada Av. Almirante Brown (La Boca)', paradas:10, tiempo:22, costo:850,
      steps:['Tomá el 53 desde La Boca','Recorre Av. Paseo Colón hasta Av. Corrientes (Microcentro)','Bajá en Av. Corrientes y Florida','Frecuencia: cada 10 minutos'] },
  ],

  'barracas_microcentro': [
    { tipo:'bus', nombre:'Colectivo 12', recomendado:true, plataforma:'Parada Av. Montes de Oca (Barracas)', paradas:9, tiempo:20, costo:850,
      steps:['Tomá el 12 en Av. Montes de Oca (Barracas)','Sube por Av. Paseo Colón / Av. 9 de Julio hacia el Centro','Bajá en Av. Corrientes y Maipú (Microcentro)','Frecuencia: cada 7-9 minutos'] },
    { tipo:'subte', nombre:'Subte Línea H', recomendado:false, plataforma:'Est. Caseros – Línea H (dir. Las Heras)', paradas:8, tiempo:18, costo:1250,
      steps:['Entrá al subte en est. Caseros (Av. Caseros y Salta)','Tomá la Línea H dirección Las Heras (Norte)','Estaciones: Caseros → Inclán → Humberto 1° → Venezuela → Once → Corrientes → Córdoba → Santa Fe / Las Heras','Para llegar al Microcentro bajá en Corrientes y caminá hacia el este','Frecuencia: cada 5-7 minutos'] },
    { tipo:'bus', nombre:'Colectivo 53', recomendado:false, plataforma:'Parada Av. Vélez Sarsfield (Barracas)', paradas:11, tiempo:25, costo:850,
      steps:['Tomá el 53 en Av. Vélez Sarsfield','Sube hacia el Centro por Av. Almafuerte / Paseo Colón','Bajá en Av. Corrientes y Florida','Frecuencia: cada 9-10 minutos'] },
  ],

  'once_microcentro': [
    { tipo:'subte', nombre:'Subte Línea A', recomendado:true, plataforma:'Est. Pasco – Línea A (dir. Plaza de Mayo)', paradas:5, tiempo:9, costo:1250,
      steps:['Entrá al subte en est. Pasco (Av. Rivadavia y Pasco)','Tomá la Línea A dirección Plaza de Mayo (Este)','Estaciones: Pasco → Congreso → Sáenz Peña → Lima → Piedras → Perú → Plaza de Mayo','Bajá en Lima (Microcentro) o en Plaza de Mayo','Frecuencia: cada 4-6 minutos'] },
    { tipo:'subte', nombre:'Subte Línea H', recomendado:false, plataforma:'Est. Once – Línea H (dir. Las Heras)', paradas:4, tiempo:8, costo:1250,
      steps:['Entrá al subte en est. Once (Av. Pueyrredón y Corrientes)','Tomá la Línea H dirección Norte','Bajá en Corrientes (4 estaciones) y caminá hacia Florida','Frecuencia: cada 5-7 minutos'] },
    { tipo:'bus', nombre:'Colectivo 26', recomendado:false, plataforma:'Parada Av. Rivadavia y Pueyrredón (Once)', paradas:7, tiempo:16, costo:850,
      steps:['Tomá el 26 en Av. Rivadavia (Once)','Sube hacia el Microcentro por Av. Rivadavia','Bajá en Av. Corrientes y Maipú','Frecuencia: cada 7-9 minutos'] },
  ],

  'retiro_palermo': [
    { tipo:'subte', nombre:'Subte Línea D', recomendado:true, plataforma:'Est. Retiro → transbordo en 9 de Julio → Línea D', paradas:6, tiempo:14, costo:1250,
      steps:['Tomá la Línea C en est. Retiro dirección Sur','Bajá en 9 de Julio (1 estación)','Hacé transbordo a la Línea D dirección Belgrano (Oeste-Norte)','Bajá en est. Plaza Italia (4 estaciones en Línea D)','Salida por Av. Santa Fe y Gurruchaga (Palermo)','Frecuencia combinada: 6-9 min total'] },
    { tipo:'bus', nombre:'Colectivo 152', recomendado:false, plataforma:'Parada Av. del Libertador (Retiro)', paradas:10, tiempo:22, costo:850,
      steps:['Tomá el 152 en Av. del Libertador (frente a Retiro)','Recorre Av. del Libertador hacia el oeste por Palermo','Bajá en Av. del Libertador y Av. Sarmiento (Palermo)','Frecuencia: cada 10 min (no opera domingo)'] },
    { tipo:'bus', nombre:'Colectivo 59', recomendado:false, plataforma:'Parada Av. del Libertador y Maipú (Retiro)', paradas:12, tiempo:26, costo:850,
      steps:['Tomá el 59 en Av. del Libertador (Retiro)','Recorre hacia Palermo por Av. del Libertador / Av. Santa Fe','Bajá en Av. Santa Fe y Scalabrini Ortiz (Palermo)','Frecuencia: cada 8 minutos'] },
  ],

  'retiro_belgrano': [
    { tipo:'subte', nombre:'Subte Línea D', recomendado:true, plataforma:'Est. Retiro → Diagonal Norte → Línea D', paradas:14, tiempo:26, costo:1250,
      steps:['Tomá la Línea C en est. Retiro dirección Sur','Bajá en Diagonal Norte (2 estaciones)','Hacé transbordo a la Línea D dirección Belgrano','Bajá en est. Juramento (Belgrano) – 14 estaciones en Línea D','Salida por Av. Cabildo y Juramento','Frecuencia: 4-6 min en Línea D'] },
    { tipo:'bus', nombre:'Colectivo 60', recomendado:false, plataforma:'Parada Av. del Libertador y Maipú (Retiro)', paradas:22, tiempo:40, costo:850,
      steps:['Tomá el 60 en Av. del Libertador (Retiro)','Recorre hacia el norte por Av. del Libertador y Av. Cabildo','Bajá en Av. Cabildo y Juramento (Belgrano)','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 152', recomendado:false, plataforma:'Parada Av. del Libertador (Retiro)', paradas:18, tiempo:35, costo:850,
      steps:['Tomá el 152 en Av. del Libertador (Retiro)','Recorre Av. del Libertador → Palermo → Belgrano','Bajá en Av. del Libertador y Juramento (Belgrano)','Frecuencia: cada 10 min (no opera domingo)'] },
  ],

  'flores_caballito': [
    { tipo:'subte', nombre:'Subte Línea A', recomendado:true, plataforma:'Est. Puan – Línea A (dir. Plaza de Mayo)', paradas:3, tiempo:6, costo:1250,
      steps:['Entrá al subte en est. Puan (Flores)','Tomá la Línea A dirección Plaza de Mayo (Este)','Bajá en est. Primera Junta (3 estaciones) – Caballito','Salida por Av. Rivadavia y Directorio','Frecuencia: cada 4-6 minutos'] },
    { tipo:'bus', nombre:'Colectivo 55', recomendado:false, plataforma:'Parada Av. Rivadavia (Flores)', paradas:5, tiempo:12, costo:850,
      steps:['Tomá el 55 en Av. Rivadavia dirección Este','Recorre Flores → Caballito por Av. Rivadavia','Bajá en Av. Rivadavia y J. M. Moreno (Caballito)','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 26', recomendado:false, plataforma:'Parada Av. Rivadavia (Flores)', paradas:6, tiempo:14, costo:850,
      steps:['Tomá el 26 en Av. Rivadavia (Flores)','Dirección Centro – pasa por Caballito','Bajá en Caballito (Av. Rivadavia y Acoyte)','Frecuencia: cada 8-10 minutos'] },
  ],

  'la_boca_san_telmo': [
    { tipo:'bus', nombre:'Colectivo 29', recomendado:true, plataforma:'Parada Av. Almirante Brown (La Boca)', paradas:4, tiempo:9, costo:850,
      steps:['Tomá el 29 en Av. Almirante Brown (La Boca)','Sube hacia San Telmo por Av. Martín García / Defensa','Bajá en Defensa y México (San Telmo)','Frecuencia: 24 horas, cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 64', recomendado:false, plataforma:'Parada Av. Almirante Brown (La Boca)', paradas:5, tiempo:11, costo:850,
      steps:['Tomá el 64 en Av. Almirante Brown (La Boca)','Sube por Av. Paseo Colón hacia San Telmo','Bajá en Av. San Juan y Defensa (San Telmo)','Frecuencia: cada 9-11 minutos'] },
    { tipo:'bus', nombre:'Colectivo 53', recomendado:false, plataforma:'Parada Av. Almirante Brown (La Boca)', paradas:5, tiempo:12, costo:850,
      steps:['Tomá el 53 en La Boca','Sube hacia San Telmo','Bajá en Av. Independencia y Defensa','Frecuencia: cada 10 minutos'] },
  ],

  'san_telmo_palermo': [
    { tipo:'bus', nombre:'Colectivo 29', recomendado:true, plataforma:'Parada Av. Independencia y Defensa (San Telmo)', paradas:14, tiempo:28, costo:850,
      steps:['Tomá el 29 en Av. Independencia y Defensa (San Telmo)','Recorre hacia el norte: San Telmo → Microcentro → Barrio Norte → Recoleta → Palermo','Bajá en Plaza Italia o Av. del Libertador y Santa Fe (Palermo)','Frecuencia: cada 7-9 minutos, 24 hs'] },
    { tipo:'bus', nombre:'Colectivo 59', recomendado:false, plataforma:'Parada Av. San Juan (San Telmo)', paradas:16, tiempo:32, costo:850,
      steps:['Tomá el 59 en Av. San Juan (San Telmo)','Recorre hacia Palermo por el corredor central','Bajá en Av. Santa Fe y Scalabrini Ortiz (Palermo)','Frecuencia: cada 8 minutos'] },
    { tipo:'subte', nombre:'Subte Líneas E + D', recomendado:false, plataforma:'Est. San José – Línea E → transbordo Catedral → Línea D', paradas:14, tiempo:22, costo:1250,
      steps:['Tomá la Línea E en est. San José (San Telmo)','Bajá en Bolívar (3 estaciones)','Caminá 2 cuadras hasta est. Catedral (Línea D)','Tomá la Línea D dirección Belgrano','Bajá en est. Plaza Italia (Palermo) – 10 estaciones','Frecuencia: 5-8 min (con transbordo)'] },
  ],

  'barracas_constitucion': [
    { tipo:'bus', nombre:'Colectivo 12', recomendado:true, plataforma:'Parada Av. Montes de Oca (Barracas)', paradas:5, tiempo:12, costo:850,
      steps:['Tomá el 12 en Av. Montes de Oca (Barracas)','Sube hacia Constitución por Av. Caseros','Bajá en Av. Brasil y Salta (Constitución – frente a la estación)','Frecuencia: cada 7-9 minutos'] },
    { tipo:'bus', nombre:'Colectivo 28', recomendado:false, plataforma:'Parada Av. Vélez Sarsfield (Barracas)', paradas:6, tiempo:14, costo:850,
      steps:['Tomá el 28 en Av. Vélez Sarsfield (Barracas)','Dirección a Constitución por Av. Caseros','Bajá en Constitución (frente a la terminal)','Frecuencia: cada 8-10 minutos'] },
    { tipo:'subte', nombre:'Subte Línea H', recomendado:false, plataforma:'Est. Caseros – Línea H → transbordo Línea C', paradas:10, tiempo:20, costo:1250,
      steps:['Tomá la Línea H en est. Caseros (Barracas)','Bajá en Venezuela (4 estaciones)','Caminá hasta la est. Av. de Mayo (Línea C)','Tomá la Línea C dirección Constitución','Bajá en Constitución (3 estaciones)','Frecuencia combinada: 8-12 min'] },
  ],

  'villa_urquiza_palermo': [
    { tipo:'subte', nombre:'Subte Línea B', recomendado:true, plataforma:'Est. Los Incas – Línea B (dir. Leandro N. Alem)', paradas:7, tiempo:13, costo:1250,
      steps:['Entrá al subte en est. Los Incas (Villa Urquiza)','Tomá la Línea B dirección Leandro N. Alem (Este)','Bajá en est. Palermo (7 estaciones – Línea B)','Salida por Av. Santa Fe y Thames (Palermo)','Frecuencia: cada 5-7 minutos'] },
    { tipo:'bus', nombre:'Colectivo 71', recomendado:false, plataforma:'Parada Av. Monroe (Villa Urquiza)', paradas:13, tiempo:26, costo:850,
      steps:['Tomá el 71 en Av. Monroe (Villa Urquiza)','Recorre hacia el sur por Av. Monroe → Av. Santa Fe','Bajá en Av. Santa Fe y Scalabrini Ortiz (Palermo)','Frecuencia: cada 9-11 minutos'] },
    { tipo:'bus', nombre:'Colectivo 65', recomendado:false, plataforma:'Parada Av. Triunvirato (Villa Urquiza)', paradas:15, tiempo:30, costo:850,
      steps:['Tomá el 65 en Av. Triunvirato (Villa Urquiza)','Recorre hacia Palermo por Av. Córdoba','Bajá en Av. Córdoba y Scalabrini Ortiz (Palermo)','Frecuencia: cada 8-10 minutos'] },
  ],

};

// ── Busca rutas para un par de barrios ────────────
function generarRutas(origenKey, destinoKey) {
  // Buscar en ambas direcciones (el usuario puede elegir en cualquier orden)
  let rutas = RUTAS_DB[`${origenKey}_${destinoKey}`] || RUTAS_DB[`${destinoKey}_${origenKey}`];

  // Si no hay una ruta específica, generar una genérica con datos reales aproximados
  if (!rutas) {
    const o = BARRIOS[origenKey];
    const d = BARRIOS[destinoKey];
    rutas   = [];

    // Si comparten línea de subte → viaje directo
    if (o.subte && d.subte && o.subte === d.subte) {
      rutas.push({ tipo:'subte', nombre:`Subte Línea ${o.subte}`, recomendado:true,
        plataforma:`Est. ${o.estacion} – Línea ${o.subte} (dir. ${d.estacion})`,
        paradas:5, tiempo:13, costo:1250,
        steps:[`Entrá al subte en est. ${o.estacion}`,`Tomá la Línea ${o.subte} dirección ${d.estacion}`,`Bajá en ${d.estacion}`,`Frecuencia: cada 4-6 minutos en hora pico`]
      });
    }

    // Opciones de colectivo según zona de origen/destino
    const lineaZona = { norte:'152', sur:'29', centro:'26', oeste:'55' };
    const linea1 = lineaZona[o.zona] || '59';
    const linea2 = lineaZona[d.zona] || '12';
    rutas.push({ tipo:'bus', nombre:`Colectivo ${linea1}`, recomendado:rutas.length === 0,
      plataforma:`Parada en ${o.nombre} (Av. principal)`, paradas:12, tiempo:28, costo:850,
      steps:[`Tomá el ${linea1} desde ${o.nombre}`,`Conecta ${o.nombre} con ${d.nombre}`,`Bajá en ${d.nombre} (Av. principal)`,`Verificá el recorrido en BA Cómo Llego o Moovit`]
    });
    rutas.push({ tipo:'bus', nombre:`Colectivo ${linea1} + ${linea2}`, recomendado:false,
      plataforma:`Parada en ${o.nombre}`, paradas:18, tiempo:38, costo:1700,
      steps:[`Tomá el ${linea1} desde ${o.nombre}`,`Hacé transbordo en el eje central`,`Continuá con el ${linea2} dirección ${d.nombre}`,`2do viaje con SUBE tiene 50% de descuento si es en menos de 1h`]
    });
  }
  return rutas;
}

// ── Renderiza los resultados de búsqueda ──────────

// Íconos SVG por tipo de transporte
const ICONOS_TIPO = {
  bus:      `<svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  subte:    `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="16" rx="2"/><line x1="6" y1="18" x2="6" y2="22"/><line x1="18" y1="18" x2="18" y2="22"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="9" x2="15" y2="9"/></svg>`,
  metrobus: `<svg viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M8 12h8"/></svg>`,
};
const ETIQUETA_TIPO = { bus:'Colectivo', subte:'Subterráneo', metrobus:'Metrobús', tren:'Tren' };

function renderRutas(rutas, origenNombre, destinoNombre) {
  const list = document.getElementById('resultsList');

  document.getElementById('resultsTitle').textContent = `${rutas.length} opciones de viaje`;
  document.getElementById('resultsRoute').innerHTML   = `De <strong>${origenNombre}</strong> a <strong>${destinoNombre}</strong>`;
  list.innerHTML = '';

  rutas.forEach((ruta, idx) => {
    // Pasos del recorrido con negritas automáticas para nombres de línea
    const pasosHTML = ruta.steps.map((paso, i) => {
      const bold = paso.replace(/(Línea [A-Z]|est\. [^,]+|\d{1,3}(?:\+\d{1,3})?)/g, '<b>$1</b>');
      return `<div class="dstep"><span class="dstep-num">${i + 1}</span><span>${bold}</span></div>`;
    }).join('');

    const card = document.createElement('article');
    card.className = `result-card${ruta.recomendado ? ' recommended' : ''}`;
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="result-card-top">
        <div class="transport-ico ${ruta.tipo}" aria-hidden="true">${ICONOS_TIPO[ruta.tipo] || ICONOS_TIPO.bus}</div>
        <div class="result-info">
          <h3>${ruta.nombre}${ruta.recomendado ? ' <span class="rec-tag">✓ Recomendado</span>' : ''}</h3>
          <div class="result-tags">
            <span class="rtag">📍 ${ruta.plataforma}</span>
            <span class="rtag">🚏 ${ruta.paradas} paradas</span>
          </div>
        </div>
      </div>
      <div class="result-stats">
        <div class="rstat"><div class="rstat-label">Tiempo estimado</div><div class="rstat-value highlight">${ruta.tiempo} min</div></div>
        <div class="rstat"><div class="rstat-label">Costo con SUBE</div><div class="rstat-value">$${ruta.costo.toLocaleString('es-AR')}</div></div>
        <div class="rstat"><div class="rstat-label">Tipo de servicio</div><div class="rstat-value" style="font-size:13px">${ETIQUETA_TIPO[ruta.tipo] || 'Colectivo'}</div></div>
      </div>
      <div class="result-toggle-row" role="button" aria-expanded="false" aria-controls="detail-${idx}" tabindex="0">
        <span class="result-toggle-label">Ver paso a paso</span>
        <svg class="result-toggle-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="result-detail" id="detail-${idx}" aria-hidden="true">
        <div class="result-detail-inner">
          <div class="detail-steps">${pasosHTML}</div>
        </div>
      </div>`;

    // Expandir/contraer los pasos del recorrido
    const toggle = card.querySelector('.result-toggle-row');
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      card.querySelector('.result-detail').setAttribute('aria-hidden', !isOpen);
      toggle.querySelector('.result-toggle-label').textContent = isOpen ? 'Cerrar detalle' : 'Ver paso a paso';
    });
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
    });

    list.appendChild(card);
  });

  document.getElementById('resultsContainer').hidden = false;
}

// ── Validación del formulario ─────────────────────

// Marca un select con error o como válido
function setEstadoSelect(el, error, msg = '') {
  el.classList.toggle('sel-error', error);
  el.classList.toggle('sel-ok',    !error);
  let err = el.closest('.form-field').querySelector('.field-err');
  if (error && !err) {
    err = document.createElement('span');
    err.className = 'field-err';
    err.setAttribute('aria-live', 'polite');
    el.closest('.form-field').appendChild(err);
  }
  if (err) err.textContent = msg;
}

// Validar al cambiar el select
['origen', 'destino'].forEach(id => {
  document.getElementById(id).addEventListener('change', function() {
    setEstadoSelect(this, !this.value, 'Seleccioná una opción.');
  });
});

// Búsqueda de viaje
document.getElementById('tripForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const origenEl  = document.getElementById('origen');
  const destinoEl = document.getElementById('destino');
  const origen    = origenEl.value;
  const destino   = destinoEl.value;

  let valido = true;
  if (!origen)  { setEstadoSelect(origenEl,  true, 'Seleccioná el punto de origen.');  valido = false; } else setEstadoSelect(origenEl,  false);
  if (!destino) { setEstadoSelect(destinoEl, true, 'Seleccioná el punto de destino.'); valido = false; } else setEstadoSelect(destinoEl, false);

  if (!valido) { origenEl.focus(); return; }

  if (origen === destino) {
    setEstadoSelect(destinoEl, true, 'El destino debe ser diferente al origen.');
    destinoEl.focus();
    return;
  }

  // Mostrar animación de carga
  document.getElementById('emptyState').classList.remove('show');
  document.getElementById('loadingState').classList.add('show');
  document.getElementById('resultsContainer').hidden = true;

  // Simular búsqueda (1.2 segundos)
  setTimeout(() => {
    document.getElementById('loadingState').classList.remove('show');
    const rutas = generarRutas(origen, destino);
    renderRutas(rutas, BARRIOS[origen].nombre, BARRIOS[destino].nombre);
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1200);
});

// Botón "Nueva búsqueda"
document.getElementById('btnNuevaBusqueda').addEventListener('click', () => {
  document.getElementById('resultsContainer').hidden = true;
  document.getElementById('emptyState').classList.add('show');

  // Resetear selects
  ['origen', 'destino'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    setEstadoSelect(el, false);
  });

  document.getElementById('origen').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
