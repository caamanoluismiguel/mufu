export const facts = {
  revision: '2026-09-10', weeks: 10, modules: 8, students: 12,
  registered: 51, bonus: 2, total: 53, boxes: 2, appearances: 12,
  closureDate: '2026-09-04', opening: '2047-09-05T07:56:00-05:00',
  location: 'Edificio 106, Ciudad del Saber, Panamá; bajo la escalera de la fachada posterior',
  coordinates: { latitude: 8.999423, longitude: -79.582829 },
  originalCommit: '221d43b58498aab5fa1847a80411679d2e06d0b2',
  countSource: 'Confirmación de Luis Miguel Caamaño en la conversación de actualización del 9 de septiembre de 2026: 51 objetos declarados y dos añadidos sin registro como bonus.',
  physicalOpeningConfirmed: false,
};

export const sources = [
  { id: 'curso', title: 'Relato del trimestre MUFU', type: 'Archivo del proyecto', url: 'index.html#recorrido', note: 'Ocho módulos en diez semanas. El archivo no fija la duración de cada módulo.' },
  { id: 'conteo', title: 'Corrección del total: 51 + 2 = 53', type: 'Testimonio', url: 'archivo.html#conteo', note: facts.countSource },
  { id: 'fichas', title: '51 fichas y sus fotografías', type: 'Documentado', url: 'coleccion.html', note: 'Transcripción publicada del registro de la cohorte. Una ficha puede describir un conjunto, por ejemplo una torre de monedas; no contamos cada componente por separado.' },
  { id: 'futuros', title: 'A través de los LNS / Nodos de Memoria', type: 'Especulativo', url: 'index.html#futuros', note: 'Dos relatos estudiantiles ambientados en 2046. Sus leyes, tecnologías y gobiernos pertenecen a la ficción.' },
  { id: 'hilo', title: 'El hilo y las nueve preguntas', type: 'Interpretación curatorial', url: 'index.html#hilo', note: 'El archivo describe la convergencia entre los ejercicios. Las relaciones son lecturas curatoriales, no pruebas de causalidad histórica.' },
  { id: 'cierre', title: 'Última función y cierre de la cápsula', type: 'Relato del proyecto', url: 'index.html#obra', note: 'Se conservan el video de doce apariciones y el relato del montaje. Los detalles contradictorios de versiones anteriores se señalan en el historial.' },
  { id: 'nasa', title: 'NASA · Voyager 1', type: 'Fuente histórica', url: 'https://science.nasa.gov/mission/voyager/voyager-1/', note: 'Lanzamiento el 5 de septiembre de 1977 a las 12:56 UTC, 07:56 en Panamá. La ficha técnica da 12:56:01 UT; MUFU fija su cita con precisión de minuto.' },
  { id: 'disco', title: 'NASA · Golden Record Contents', type: 'Fuente histórica', url: 'https://science.nasa.gov/mission/voyager/golden-record-contents/', note: 'Imágenes, sonidos, música, saludos e instrucciones simbólicas seleccionados para un posible receptor sin contexto humano compartido.' },
  { id: 'leia', title: 'Lucasfilm · Holograms in Star Wars', type: 'Fuente histórica / ficción', url: 'https://www.starwars.com/news/6-ways-holograms-play-an-important-role-in-star-wars', note: 'El mensaje de Leia activa el viaje de Luke y reaparece décadas después. Su relación con MUFU es narrativa; no establece una genealogía técnica con Pepper.' },
  { id: 'pepper', title: 'Science Museum Group · John Henry Pepper', type: 'Fuente histórica', url: 'https://collection.sciencemuseumgroup.org.uk/people/cp87361/john-henry-pepper', note: 'Asocia a Pepper con la ilusión concebida por Henry Dircks. El relato de MUFU sitúa la demostración en 1862. Es reflexión óptica, no holografía.' },
  { id: 'pepper-patente', title: 'John Henry Pepper · The True History of the Ghost', type: 'Fuente primaria / relato del inventor', url: 'https://cuny.manifoldapp.org/read/the-true-history-of-the-ghost/section/c430b376-bfb6-48a0-9b78-0b2bc98a369f', note: 'Reproduce la patente británica n.º 326 de Dircks y Pepper, fechada el 5 de febrero de 1863, y relata la explotación del espectáculo. Documenta la patente y su comercialización, no la prioridad absoluta entre todos los efectos prácticos.' },
  { id: 'logan', title: 'American Cinematographer · Logan’s Run and How It Was Filmed', type: 'Fuente histórica / producción cinematográfica', url: 'https://theasc.com/article/logans-run-and-how-it-was-filmed/', note: 'El reportaje de 1976 documenta holografía real en Logan’s Run y presenta a Michael York como la primera estrella de cine que actuó en un holograma. Esta prioridad técnica tiene un alcance específico: no establece la primera representación ficticia de un holograma en cualquier película.' },
  { id: 'leia-futuro', title: 'MIT Media Lab · Holography and Sci-Fi-Inspired Devices', type: 'Referencia / imaginario tecnológico', url: 'https://www.media.mit.edu/articles/advancements-in-holography-usher-in-sci-fi-inspired-devices/', note: 'Vincula la escena de Leia en Star Wars (1977) con la asociación cultural entre hologramas y futuro. Apoya la distinción de MUFU entre el antecedente técnico y la imagen popularizada por el cine.' },
  { id: 'moma', title: 'MoMA · Full Disclosure', type: 'Referencia posterior', url: 'https://www.moma.org/calendar/exhibitions/5926', note: 'Referencia para esta ampliación del archivo: información, confianza y fuentes. No se presenta como parte del programa original.' },
  { id: 'comunidad', title: 'El trimestre como obra compartida', type: 'Testimonio / contexto pedagógico', url: 'archivo.html#autoria', note: 'Confirmación de Luis Miguel Caamaño del 10 de septiembre de 2026: MUFU integra las clases del trimestre alrededor del museo. Los nombres y aportes se contrastan con los ocho módulos del relato original.' },
];

export const statuses = [
  ['Documentado', 'Hay un registro o una fuente consultable. Su existencia no certifica por sí sola cada afirmación del registro.'],
  ['Testimonio', 'Una persona declara un hecho. Se identifica a quien lo comunica y la fecha.'],
  ['Calculado', 'Un resultado derivado de datos y una regla explícita.'],
  ['Reconstruido', 'Una representación hecha a partir de indicios; sus límites permanecen visibles.'],
  ['Especulativo', 'Una hipótesis, un relato o un objeto de un futuro posible.'],
  ['Desconocido', 'El archivo disponible no permite responder.'],
  ['Reservado', 'El contenido se mantiene privado o aplazado por decisión de su autor.'],
];

export const modules = [
  { id:'00', title:'Seleccionar imágenes', teacher:'Erika Schnitter y Alejandro Pachón', lesson:'Una colección revela a quien mira.', from:'Carrete personal', to:'Patrones compartidos', question:'¿El patrón estaba en mis fotos o en la mirada de quien las ordena?', icon:'images', image:'img/tamara-cos-03.jpg', text:'Elegir imágenes del teléfono y ponerlas juntas vuelve visible una manera de mirar. Selección, color, encuadre y proximidad producen un relato que no existía en cada foto aislada.', threads:['memoria','poder'] },
  { id:'01', title:'Curar objetos', teacher:'Román Flórez', lesson:'El orden cambia el significado.', from:'Objeto propio', to:'Pieza con historia', question:'¿Hasta dónde podemos inventar un pasado sin traicionar al objeto?', icon:'layout-grid', image:'img/adriana-solis-04.jpg', text:'Los mismos objetos se agruparon de varias maneras y recibieron historias distintas, incluso inventadas. La procedencia y la ficción se vuelven dos lecturas que hay que distinguir.', threads:['memoria','poder','imagen'] },
  { id:'02', title:'Construir un museo', teacher:'Viridiana Zavala', lesson:'Exhibir es decidir.', from:'Pieza', to:'Mundo museal', question:'¿Quién paga, organiza y sostiene ese mundo?', icon:'landmark', image:'medios/isthmus.jpg', text:'Recorridos, pilares, pedestales, roles, recursos digitales y una canción construyeron el ambiente del museo. La visita involucra el cuerpo y depende de decisiones de otras personas.', threads:['poder','imagen'] },
  { id:'03', title:'Objetos que narran', teacher:'Luis Miguel Caamaño', lesson:'Los objetos hacen avanzar una historia.', from:'Pieza', to:'Signo legible', question:'¿Cómo diseñamos un mensaje para alguien sin nuestro contexto?', icon:'clapperboard', image:'img/martha-pretto-02.jpg', text:'Matrix y el camino del héroe abrieron tres funciones: McGuffin, reliquia y talismán. El Disco de Oro llevó el problema al límite: comunicarse con alguien que no comparte idioma, cuerpo ni época.', threads:['memoria','imagen','tiempo'] },
  { id:'04', title:'Imaginar Panamá, 2046', teacher:'Karla Paniagua', lesson:'Todo objeto supone un mundo.', from:'Señales del presente', to:'Dos futuros posibles', question:'¿Quién tendrá la llave de la memoria?', icon:'git-branch', image:'img/roberto-torres-02.jpg', text:'Dos grupos rastrearon señales hasta sus fuentes y construyeron escenarios de transformación y colapso. En ambos, los originales dejan de verse y el público depende de reconstrucciones.', threads:['poder','imagen','tiempo'] },
  { id:'05', title:'Cápsula del tiempo', teacher:'Luis Miguel Caamaño', lesson:'Elegir qué entregar al futuro.', from:'Presente propio', to:'Mensaje aplazado', question:'¿Lo que elegimos seguirá significando algo en 2047?', icon:'package', image:'img/alberto-zebede-04.jpg', text:'Reconstruir 2005 permitió medir 21 años de cambio. Dar, recuperar, representar el presente y escribir una carta fueron las cuatro intenciones del ejercicio. El resultado final fue de 53 objetos, no una cuota uniforme.', threads:['memoria','tiempo','poder'] },
  { id:'06', title:'Fabricar la aparición', teacher:'Luis Miguel Caamaño', lesson:'Quien maneja la luz decide qué aparece.', from:'Materia', to:'Imagen sin peso', question:'¿Cuánto de lo que llamamos futuro es una técnica del pasado?', icon:'lightbulb', image:'medios/aparicion.jpg', text:'Construir el fantasma de Pepper convirtió la ausencia en una experiencia física: vidrio, luz y reflejo. La técnica victoriana conversa con los futuros donde solo se puede acceder a una representación.', threads:['imagen','poder','tiempo'] },
  { id:'07', title:'Objetos de 2046', teacher:'Trabajo autónomo · 12 estudiantes', lesson:'Una reliquia sin pasado.', from:'Hipótesis', to:'Prototipo especulativo', question:'¿Un prototipo sin uso es un objeto o la ilustración de una idea?', icon:'shapes', image:'img/martha-pretto-02.jpg', text:'Cada grupo llevó a materia un objeto de su mundo. Mientras la cápsula retira objetos que tuvieron uso, el prototipo futuro empieza a significar antes de poder funcionar. El archivo no confirma cuáles fueron los dos prototipos finales.', threads:['imagen','tiempo'] },
];

export const threads = [
  { id:'memoria', name:'Memoria', color:'#825b2b', question:'¿Qué merece sobrevivir?', detail:'Del carrete al museo: seleccionar es construir una memoria. El mensaje sobrevive al momento y cambia cuando alguien vuelve a leerlo.' },
  { id:'imagen', name:'Representación', color:'#30696d', question:'¿Qué vemos cuando falta el original?', detail:'Una fotografía, un reflejo y una reconstrucción tienen soportes y límites distintos. Hacen presente algo que no se puede tocar.' },
  { id:'poder', name:'Poder', color:'#844d45', question:'¿Quién tiene la llave?', detail:'La selección, la tecnología y las reglas de acceso determinan qué puede aparecer y quién puede interpretarlo.' },
  { id:'tiempo', name:'Tiempo', color:'#5e6330', question:'¿Para quién guardamos?', detail:'2005 ayuda a pensar 2047; 1977 fija una cita. El destinatario de un archivo puede ser alguien que todavía no existe o nosotros mismos, transformados.' },
];

export const nodes = [
  { id:'carrete', title:'El carrete', date:'00 · Inicio', icon:'images', threads:['memoria','poder'], text:'Una imagen privada entra en una selección; al cambiar de vecinas, cambia de significado.', sources:['curso'] },
  { id:'curar', title:'La curaduría', date:'01–02 · Museo', icon:'landmark', threads:['memoria','poder'], text:'Agrupar, inventar una historia y diseñar un recorrido convierten objetos cotidianos en piezas. El museo decide qué deja afuera.', sources:['curso','hilo'] },
  { id:'narrar', title:'El objeto narrativo', date:'03 · Puente', icon:'clapperboard', threads:['memoria','imagen','tiempo'], text:'En Matrix y el camino del héroe, los objetos activan acciones y transformaciones. McGuffin: mueve la trama. Reliquia: conserva un pasado. Talismán: concentra un poder atribuido.', sources:['curso'] },
  { id:'leia', title:'El mensaje de Leia', date:'1976 → 1977 · Técnica e imaginario', icon:'message-circle', threads:['memoria','imagen','tiempo'], text:'Logan’s Run (1976) llevó holografía real a la pantalla; American Cinematographer presenta a Michael York como la primera estrella de cine que actuó en un holograma. Star Wars (1977) popularizó el holograma como imagen de la comunicación del futuro: R2-D2 hace presente a Leia y su mensaje activa el viaje de Luke. MUFU enlaza ese imaginario con la técnica teatral de Pepper.', sources:['logan','leia','leia-futuro','hilo'] },
  { id:'voyager', title:'El Disco de Oro', date:'1977 · Voyager 1', icon:'disc-3', threads:['memoria','tiempo'], text:'Sonidos, imágenes e instrucciones viajan hacia un posible lector sin contexto. Igual que una cápsula, el disco necesita sobrevivir y poder interpretarse.', sources:['nasa','disco'] },
  { id:'pepper', title:'El fantasma de Pepper', date:'1862–1863 · Escena y patente', icon:'lightbulb', threads:['imagen','poder','tiempo'], text:'Vidrio, luz y reflejo convierten una ausencia en presencia escénica. Presentado en 1862 y patentado por Dircks y Pepper en 1863, el efecto se convirtió en espectáculo comercial. MUFU recupera esta técnica del pasado para construir una imagen que asociamos al futuro. La luz y los derechos de explotación conectan la aparición con el control de su acceso.', sources:['pepper','pepper-patente','curso','hilo'] },
  { id:'lns', title:'A través de los LNS', date:'2046 · Transformación', icon:'scan-eye', threads:['imagen','poder','tiempo'], text:'En esta ficción, comunidades poseen sus relatos, pero una empresa controla bóvedas submarinas, robots, lentes y membresías. Liliana rechaza que la reconstrucción sustituya al original.', sources:['futuros'] },
  { id:'nodos', title:'Nodos de Memoria', date:'2046 · Colapso', icon:'network', threads:['memoria','imagen','poder'], text:'En esta ficción, un régimen reescribe la historia. Museos clandestinos conservan lo excluido y los Falsos Nodos exhiben copias para proteger los originales.', sources:['futuros'] },
  { id:'carta', title:'La carta aplazada', date:'2026 → 2047', icon:'mail', threads:['memoria','tiempo'], text:'El receptor se llama igual, pero ya será otra persona. Karla cubrió el texto de su carta antes de registrarla: mostrar el soporte no obliga a revelar el mensaje.', sources:['curso','fichas'] },
  { id:'funcion', title:'Última función', date:'2026 · Aparición', icon:'projector', threads:['imagen','poder'], text:'El video muestra doce objetos, uno por estudiante. La presencia como luz conecta el aparato de Pepper con ambos futuros de originales inaccesibles.', sources:['cierre','hilo'] },
  { id:'pared', title:'La pared', date:'2026 · Cierre', icon:'brick-wall', threads:['poder','tiempo','imagen'], text:'El permiso para enterrar fue denegado, según el relato del proyecto. Se construyó un vacío bajo la escalera. Una restricción institucional terminó definiendo la forma del museo.', sources:['cierre','hilo','conteo'] },
  { id:'apertura', title:'La cita', date:'05.09.2047 · 07:56', icon:'calendar-clock', threads:['memoria','tiempo','poder'], text:'La fecha autoriza la apertura; no confirma que haya ocurrido. Será el 70 aniversario de Voyager 1, al minuto, y una ocasión para releer los escenarios de 2046 desde otro presente.', sources:['nasa','curso','cierre'] },
];

export const edges = [
  ['carrete','curar','memoria','Seleccionar y ordenar produce memoria.'],
  ['curar','narrar','memoria','Una pieza recibe funciones y relatos.'],
  ['narrar','leia','imagen','Un objeto-mensaje pone en marcha un viaje.'],
  ['leia','voyager','memoria','Dos mensajes de 1977: uno ficticio y otro enviado al espacio. Es una analogía, no una influencia demostrada.'],
  ['voyager','carta','memoria','El mensaje espera a un destinatario distante.'],
  ['carta','apertura','tiempo','La espera transforma a quien leerá.'],
  ['pepper','leia','imagen','Pepper: aparición teatral. Logan’s Run (1976): holografía real en el cine. Star Wars (1977): popularización del holograma como imagen del futuro. MUFU conecta técnica, cine e imaginario.'],
  ['pepper','funcion','imagen','El taller reconstruye el aparato óptico.'],
  ['lns','funcion','imagen','Los originales se sustituyen por representaciones.'],
  ['nodos','funcion','imagen','Las copias mantienen a salvo los originales.'],
  ['curar','lns','poder','La curaduría se convierte en una infraestructura de acceso.'],
  ['curar','nodos','poder','Decidir qué se muestra también permite censurar.'],
  ['lns','nodos','poder','Empresa y régimen son dos posibles titulares de la llave.'],
  ['pepper','funcion','poder','Quien controla la luz controla la aparición.'],
  ['funcion','pared','imagen','La aparición deja paso a la ausencia material.'],
  ['pared','apertura','poder','El pacto de esperar limita el acceso de la propia institución.'],
  ['voyager','apertura','tiempo','1977 + 70 años = 2047; mismo día y minuto local.'],
  ['lns','apertura','tiempo','Los escenarios se releen un año después de su fecha ficticia.'],
  ['nodos','carta','memoria','Documentos y testimonios preservan historias vulnerables.'],
  ['carrete','carta','memoria','La selección personal vuelve al final con el reloj cambiado.'],
  ['narrar','apertura','tiempo','Un futuro lector puede atribuir una historia nueva al mismo objeto.'],
];

export const comparisons = [
  ['Dónde están los originales','Bóvedas submarinas; acceso mediante robots SUBm.','Ocultos y trasladados por redes clandestinas.','Dos cajas tras una pared bajo la escalera.'],
  ['Qué recibe el visitante','Reconstrucciones a través de lentes LNS.','Copias en Falsos Nodos; acceso restringido a originales.','Fotografías, fichas y doce apariciones registradas en video.'],
  ['Quién controla el acceso','Empresa propietaria de lentes, bóvedas y membresías.','El régimen censura; los nodos seleccionan a su público.','Un pacto de cierre hasta el 5 de septiembre de 2047.'],
  ['Silencio y voz','La ficticia Ley 1374 prohíbe las explicaciones habladas.','Las historias excluidas sobreviven como testimonio clandestino.','El relato de la función describe silencio y un golpe por cambio.'],
  ['Qué falta comprobar','Las señales originales del ejercicio no están anexadas al repositorio.','Las señales originales del ejercicio no están anexadas al repositorio.','La placa sigue pendiente según el último registro; falta un parte actualizado.'],
];

export const custody = [
  { title:'Investigar', status:'Relato del curso', text:'Objetos domésticos, materiales e historias familiares; investigación sobre conservación y cápsulas del tiempo.', source:'curso' },
  { title:'Registrar', status:'Documentado', text:'51 registros con fotografía. La transcripción conserva títulos, medidas, materiales, procedencia y filiación declarados.', source:'fichas' },
  { title:'Añadir dos bonus', status:'Testimonio', text:'Dos objetos entraron sin ficha. No hay fotografía, título ni autor documentados públicamente para ellos.', source:'conteo' },
  { title:'Envasar y guardar', status:'Relato del proyecto', text:'El relato describe bolsas selladas por succión, etiquetas y dos cajas. El archivo público no identifica qué objeto va en cada caja.', source:'cierre' },
  { title:'Emparedar', status:'Relato del proyecto', text:'Cierre bajo la escalera del edificio 106. Se registra el día 4 de septiembre de 2026; no se conoce la hora exacta.', source:'cierre' },
  { title:'Cuidar la espera', status:'Pendiente de documentar', text:'La placa, el estado del muro y la continuidad del archivo requieren registros de mantenimiento. No hay inspecciones posteriores acreditadas aquí.', source:'cierre' },
  { title:'Abrir y contrastar', status:'Cita futura', text:'Desde el 5 de septiembre de 2047 a las 07:56 de Panamá. Registrar la apertura efectiva, el estado de cada objeto y la lectura de los futuros escritos.', source:'nasa' },
];

export const questions = [
  { q:'¿Cuántos objetos hay?', keywords:'cuantos cantidad total 53 51 48 bonus registro piezas', answer:'53 objetos: 51 declarados y registrados, más dos bonus sin ficha. El total proviene de la corrección del responsable del proyecto. Los 51 registros no equivalen a 51 componentes físicos: algunos describen conjuntos.', sources:['conteo','fichas'] },
  { q:'¿Cuándo se puede abrir?', keywords:'cuando abrir apertura fecha hora 2047 voyager 1977 septiembre', answer:'La cita es el 5 de septiembre de 2047 a las 07:56, hora de Panamá (UTC−5). Coincide con el 70 aniversario de Voyager 1 con precisión de minuto. Llegar a la fecha no demuestra que la apertura física haya sucedido.', sources:['nasa','cierre'] },
  { q:'¿Está enterrada?', keywords:'donde ubicacion enterrada emparedada escalera edificio cajas muro pared permiso', answer:'Está emparedada en un vacío bajo la escalera posterior del edificio 106, en Ciudad del Saber, Panamá. El relato atribuye esa decisión a la negativa del permiso para enterrarla en el campus. Son dos cajas; falta el inventario público por caja.', sources:['cierre','hilo'] },
  { q:'¿Qué une a Leia, Voyager y las cartas?', keywords:'leia star wars disco oro cartas mensaje conexion ausente receptor', answer:'Un emisor ausente confía un mensaje a un soporte. En Star Wars activa un viaje; en Voyager se dirige a un posible lector desconocido; en MUFU espera a una persona futura. Es una conexión curatorial, no una causalidad histórica demostrada.', sources:['leia','disco','curso'] },
  { q:'¿Pepper es un holograma?', keywords:'pepper holograma holografia vidrio luz reflejo optica', answer:'El fantasma de Pepper es una ilusión por reflexión en vidrio. El holograma de Leia pertenece a la ficción cinematográfica. MUFU relaciona ambas presencias sin materia, pero no las presenta como la misma técnica ni como el primer holograma.', sources:['pepper','leia','curso'] },
  { q:'¿Qué aportan Logan’s Run y Star Wars a esta conexión?', keywords:'logan star wars leia primer primero holograma cine popularizo popularización futuro', answer:'Son dos hitos distintos. Logan’s Run (1976) utilizó holografía real: el reportaje de American Cinematographer presenta a Michael York como la primera estrella cinematográfica que actuó en un holograma. Star Wars (1977) popularizó la imagen del holograma como comunicación del futuro mediante el mensaje de Leia. MUFU conecta el antecedente técnico, su popularización cultural y la recuperación de Pepper en el taller. La afirmación de prioridad se atribuye a la fuente y a ese uso concreto; no se extiende a toda representación ficticia anterior.', sources:['logan','leia','leia-futuro','curso'] },
  { q:'¿Por qué una técnica del siglo XIX parece una imagen del futuro?', keywords:'pepper star wars leia primer holograma cine patente comercializado futuro pasado logan', answer:'MUFU conecta tres momentos: Pepper convierte un reflejo en espectáculo, Star Wars ofrece una imagen emblemática de comunicación mediante una presencia luminosa y el taller recupera el efecto óptico para representar objetos inaccesibles. Esa es la lectura curatorial: el futuro también se imagina con técnicas del pasado. La patente de Dircks y Pepper está fechada en 1863; no acredita ser el primer efecto práctico patentado de toda la historia. Star Wars (1977) tampoco inaugura el uso cinematográfico de hologramas: hay un antecedente documentado en Logan’s Run (1976).', sources:['pepper-patente','leia','logan','curso','hilo'] },
  { q:'¿Por qué 2005, 2026 y 2047?', keywords:'2005 2026 2047 21 anos espejo tiempo simetria', answer:'El curso reconstruyó 2005 desde 2026: 21 años hacia atrás. La cápsula propone la misma distancia nominal hacia 2047. El cierre del 4 de septiembre de 2026 y la cita del 5 de septiembre de 2047 no están separados por exactamente 21 años al segundo.', sources:['curso','cierre'] },
  { q:'¿Los escenarios predicen lo que pasará?', keywords:'2046 futuros escenarios transformacion colapso prediccion lns nodos', answer:'Son ficciones especulativas de dos grupos. Ambas dejan los originales fuera del alcance del visitante. El año 2047 permite confrontarlas con otra realidad, sin convertirlas en pronósticos científicos ni evaluar a sus autores por acertar.', sources:['futuros','hilo'] },
  { q:'¿Puedo leer las cartas?', keywords:'leer cartas privado privacidad datos karla reservado', answer:'Las fichas describen las cartas; eso no autoriza a revelar su contenido privado. Karla cubrió el texto de la suya antes de registrarla. El archivo respeta esa decisión y no intenta reconstruir el texto oculto.', sources:['fichas','curso'] },
  { q:'¿Quién tiene la llave?', keywords:'poder llave gobierno empresa institucion propiedad acceso', answer:'En las ficciones, la empresa controla la infraestructura y el régimen controla los relatos. MUFU propone limitar su propio acceso hasta 2047. La sucesión de responsables, la autorización final y el protocolo ante un traslado aún requieren documentación.', sources:['futuros','hilo','cierre'] },
];

export const corrections = [
  ['2026-09-10','El museo como eje común','Luis Miguel Caamaño aclara que no hay un docente principal. El sitio se presenta como repositorio transversal del trimestre y reconoce su puente narrativo y la creación de la página por separado de los aportes compartidos. El propósito central es comprender el museo, lo aprendido y las conexiones entre las experiencias.'],
  ['2026-09-10','El trimestre compartido','Se hace explícita la autoría colectiva del trimestre alrededor del museo. Se añaden los cruces entre las clases y sus docentes, a partir del relato original y de la aclaración de Luis Miguel Caamaño. No se sustituyen los módulos ni se atribuyen nombres oficiales de asignaturas que el archivo no documenta.'],
  ['2026-09-09','Total de la colección','Se sustituye el total de 48 inferido de cuatro categorías por la declaración actualizada: 51 registros + 2 bonus = 53 objetos. Las cuatro categorías se conservan como consigna pedagógica.'],
  ['2026-09-09','Lugar y escala','Se corrigen referencias residuales a entierro, cota −2.40, urna y pedestal como ubicación permanente. El destino documentado es el vacío emparedado bajo la escalera.'],
  ['2026-09-09','Tiempo y estado','La hora del cierre no está documentada. El calendario indica cuándo puede abrirse, nunca confirma una apertura física automática. Los 21 años son una simetría nominal entre años.'],
  ['2026-09-09','Ficción y método','Se distingue Pepper de la holografía y se identifica Star Wars como ficción. Las relaciones del atlas son interpretaciones curatoriales. Los dos escenarios de 2046 no se presentan como pronósticos científicos.'],
  ['2026-09-09','Infografías','Las láminas generadas en la conversación se conservan como borradores históricos. La versión web corrige su asignación aparente de módulos a semanas y sus simplificaciones de tiempo y evidencia.'],
];
