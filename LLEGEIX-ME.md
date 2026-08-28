# Finances — aplicació web

Substitueix `Financesv2.xlsx`. Tot local: no puja res enlloc i no cal internet.

## Com obrir-la

Doble clic a **`servir.cmd`**. Obre el navegador i deixa una finestra negra oberta: és el
servidor, tanca-la quan acabis. Hi surten dues adreces:

```
En aquest PC:  http://localhost:8530/
Al mobil:      http://192.168.x.x:8530/
```

Les dades es carreguen soles i **Desar escriu directament al `finances.json`** a través
del servidor, sense diàlegs ni permisos. Cada desada en guarda una còpia datada a
`copies/` (les 20 últimes).

## Al mòbil

1. El PC ha de tenir el `servir.cmd` obert i el mòbil ha de ser a **la mateixa wifi**.
2. Al mòbil, obre l'adreça `http://192.168.x.x:8530/` que surt a la finestra
   negra. Afegeix-la a la pantalla d'inici i te la trobaràs com una app.
3. Ja està: llegir i **desar** funcionen igual que al PC.

El primer cop, Windows et demanarà de deixar passar Python pel tallafocs: digues que sí
per a **xarxes privades**. Si t'ho vas saltar, ho pots arreglar amb aquesta ordre a un
PowerShell d'administrador:

```powershell
New-NetFirewallRule -DisplayName "Finances" -Direction Inbound -Protocol TCP -LocalPort 8530 -Profile Private -Action Allow
```

Fora de casa no hi arribaràs, i és a posta: el servidor només accepta escriptures de la
xarxa local i el port **no s'ha d'obrir mai al router**. Si algun dia el vols des de fora,
la manera segura és una VPN entre els teus dispositius (Tailscale o similar), no obrir ports.

> Si en comptes del `servir.cmd` obres el `index.html` amb doble clic (`file://`),
> Chrome no deixa escriure al fitxer i els canvis et cauran a la carpeta de baixades.

> Si obres `index.html` amb doble clic (`file://`), Chrome no deixa escriure al fitxer
> i els canvis es descarreguen a la carpeta de baixades en comptes de desar-se. Per això
> hi ha el `servir.cmd`.

## Amagar els imports

El botó **•••** de dalt a la dreta amaga tots els imports de la pantalla: KPIs, taules,
eixos dels gràfics, tot. Serveix per obrir l'app en un lloc on et poden llegir per sobre
l'espatlla, sobretot al mòbil.

Queda desat en aquell aparell, o sigui que el mòbil pot anar sempre amb els imports
amagats i el PC no. El botó es queda encès mentre ho està.

**El que exportes no s'amaga mai**: el CSV i l'`.xlsx` porten sempre les xifres de veritat,
que si no els fitxers no servirien de res. I mentre està actiu, les caselles de previsió de
la pestanya Mesos no es poden editar — no té sentit teclejar xifres que no veus.

## D'on surten les dades

A dalt, al costat del nombre de moviments, hi diu sempre d'on s'han carregat: **Drive**,
**fitxer del PC** o el nom del fitxer que hagis obert. Si no és el que esperaves, ja ho
saps abans de posar-t'hi a treballar.

L'ordre és: **el Drive mana**. Si hi tens les dades i la sessió ha caducat, l'app **no
carrega res d'enlloc més**: t'ho diu i et deixa triar entre reconnectar-t'hi o obrir un
fitxer local. Abans carregava el fitxer del PC en silenci i acabaves editant una còpia
antiga sense saber-ho.

## Recuperar una versió anterior

**Drive → Versions anteriors.** El Drive en guarda l'historial i l'app el llegeix: tries
una versió per la data, et diu quants moviments i valoracions té, i si et convenç la
carregues. No es toca el Drive fins que premis Desar.

I si treballes amb el `servir.cmd`, cada desada deixa una còpia datada a `copies/`.

## Veure vs desar

Són dues coses diferents:

- **Per veure el canvi**: res. Tot el que toques —una valoració, una categoria, una
  previsió, un paràmetre— refà els gràfics, les taules i els indicadors a l'instant.
- **Perquè hi sigui demà**: **Desar** (o Ctrl+S). Fins llavors el `finances.json` del
  disc no s'ha mogut.

Mentre tinguis canvis sense desar, a dalt hi surt **● canvis sense desar** i el navegador
et pregunta si vols marxar de debò.

I hi ha una xarxa de seguretat: mentre treballes, l'app va desant una còpia al navegador.
Si es tanca sense desar, la propera vegada que l'obris t'ho dirà i et deixarà recuperar-la,
comparant quantes coses té la còpia i quantes el fitxer. Recuperar-la **no** escriu al
disc: torna a deixar els canvis pendents perquè els repassis i premis Desar tu.

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | L'aplicació sencera, un sol fitxer |
| `finances.json` | Les dades. És l'únic que cal guardar |
| `servir.cmd` · `servir.py` | Llançador i servidor (serveix la carpeta i accepta desar) |
| `copies/` | Còpies datades del `finances.json`, una per desada |
| `migrate.py` | Migració d'un sol ús des de `Financesv2.xlsx`. Tornar-lo a executar **esborra** els canvis fets a l'app |

Com que `finances.json` viu a OneDrive, tens còpia i historial de versions automàtics.
L'app també en desa una còpia al `localStorage` del navegador cada cop que carrega o desa.

## Pestanyes

- **Resum** — saldo, ingressos, pagaments, estalvi i taxa d'estalvi; mitjanes, gràfics i
  taula per any.
- **Moviments** — el llibre unificat de compte i targeta. Filtres, cerca, canvi de categoria
  a la mateixa fila, exportació a CSV. El filtre de categories admet **triar-ne unes
  quantes**: obre'l, cerca si en tens moltes, i marca les que vulguis. Amb el cercador
  actiu, el botó *Totes* selecciona només les que hi surten. El que exportes a CSV és
  sempre el que tens filtrat.
- **Mesos** — el real de cada mes i, per als mesos que encara no han passat, la previsió
  editable. Té el mateix selector de període que la resta, i al peu de la taula hi ha el
  **total i la mitjana de cada columna**.
- **Real** — ingressos i despeses imputats al mes que els toca, no al del cobrament o
  del càrrec. Mira'n l'apartat de sota.
- **Cartera** — valor, aportat i balanç; evolució en el temps, repartiment per classe i
  per entitat, la matriu de valoracions mes a mes i la taula d'actius. El botó
  **Valoració del mes** obre la pantalla on tecleges els valors dels 13 actius d'una
  tirada. Té el mateix selector de període que la resta.
- **Rendiment** — retorn, CAGR, pes i contribució per actiu, agrupació per cartera i
  nota global.
- **FIRE** — independència financera: les tres fases, l'objectiu Coast FIRE, la projecció
  del capital i de la renda, i els matalassos de liquiditat. Mira'n l'apartat de sota.
- **Categories** — tractament de cada categoria, reanomenar i fusionar, i les regles
  d'autocategorització.

## Període

A **Resum**, **Moviments**, **Mesos** i **Cartera** hi ha el mateix selector de període, i els dos comparteixen
el que hi triïs: aquest mes, últims 3 / 6 / 12 mesos, aquest any, l'any passat, tot
l'històric, o **dates concretes** amb dos calendaris.

Governa els KPIs, les mitjanes, els gràfics, la despesa per categoria i la llista de
moviments. La taula *Per any* i la pestanya *Mesos* ensenyen sempre tot l'històric.

## Mitjanes

La targeta **Mitjanes del període** dona ingressos, pagaments, estalvi i inversió en
total i repartits per any, per mes i per dia.

El repartiment es fa sobre els dies que **realment tenen moviments** dins del període,
no sobre l'interval que has demanat. Si demanes 12 mesos i només en tens 3 amb dades,
dividir per 12 mentiria. Sota la taula hi surt quin tram s'ha fet servir i quants dies són.

## Afegir un moviment a mà

A **Moviments**, el botó **Afegir moviment**. La data ve posada a avui i la categoria és
la que més fas servir, o la que tinguis filtrada. Posa l'import **en negatiu si és una
despesa**: el tipus (pagament o ingrés) se't posa sol segons el signe.

Es tracten igual que els importats, o sigui que si després importes l'extracte del banc,
el detector de duplicats el reconeixerà per data, import i concepte i no te'l repetirà.

Per **editar o esborrar** qualsevol moviment, el botó ⋯ de la seva fila.

## Importar un extracte

**Importar extracte** → arrossega el fitxer tal com te'l descarregues del banc.
No cal convertir-lo ni tocar-lo.

Formats que llegeix, tots sense cap llibreria externa:

- **`.xls`** — el format antic que dona el Banc Sabadell (BIFF8 dins d'un OLE compound file).
- **`.xlsx`** — el format modern.
- **`.csv`** i **`.tsv`** — detecta sol el separador.

Dels dos extractes del Sabadell ho endevina tot: la fila de capçalera, quin compte és,
totes les columnes i que a la targeta els imports positius són càrrecs. Només has de
prémer Continuar. Igualment hi ha els perfils **Sabadell · compte** i **Sabadell · targeta**
desats, i pots desar-ne de nous.

Abans d'importar veus quantes files són noves i quantes ja hi són: compara data, import
i concepte, així que pots baixar-te un rang que se solapi amb el que ja tens sense por.

## Traspassos

`VISA` (liquidació de la targeta) i `INVERSIO` (transferència al bròker) estan marcades
com a **traspàs**: no compten ni com a ingrés ni com a despesa, perquè si no, els
pagaments de la targeta es comptarien dos cops. A la pestanya Categories pots marcar-ne
d'altres igual.

## La pestanya Real

Les altres pestanyes compten els diners el dia que es mouen. **Real** els compta al mes
que els pertoca.

### El cicle de la targeta

**El cicle va del 20 al 20.** El que aquí es diu «agost» són les compres del **20 de
juliol al 19 d'agost**, i te les carreguen l'**1 de setembre**.

Per defecte les despeses de targeta es compten per la **liquidació VISA**, que és
l'import que realment surt del compte. L'altra opció és sumar les compres de l'extracte
de la targeta: té més detall, però depèn que l'extracte estigui complet. Quan un cicle
encara no té liquidació, es fan servir sempre les compres, i la fila surt marcada com a
*en curs* o *sense liquidar*.

Sota la taula hi ha la comparació de les dues maneres, cicle a cicle. Amb el tall al dia
20 la majoria quadren **al cèntim**; els tres que no (abr 24, nov 24, jul 25) són mesos
on a l'extracte de la targeta li falten compres, i allà la xifra de fiar és la liquidació.

### El cicle obert

A dalt de tot hi ha el cicle que **s'està acumulant ara mateix**: quant hi portes gastat,
quantes compres, en quin dia del cicle vas, quant sortiria al ritme actual, com queda
contra la mitjana dels últims cicles ja liquidats, i el dia que te'l cobraran.

### Els ingressos

Van al mes que el concepte declari (`Salario Mayo 2024` compta al maig
encara que el cobressis el 12 de juny). Quan el concepte no ho diu — les transferències
de l'empresa no ho diuen — es compten al mes del cobrament i surten a l'avís per revisar.

Al diàleg de revisió tries el mes de cada una. El botó **Aplicar la regla del dia 20**
les omple totes de cop: el que cobres a finals de mes compta en aquell mes, i el que
arriba a principis compta al mes anterior. Encerta aproximadament 3 de cada 4 —
comprovat contra les nòmines que sí que porten el mes escrit — així que repassa-les
abans de desar. El que desis queda guardat al moviment i no es torna a preguntar.

## La pestanya FIRE

És el model de `independencia_v33.html`, amb les mateixes fórmules, però connectat a les
dades reals en comptes d'inputs:

| A l'app FIRE ho teclejaves | Aquí surt de |
|---|---|
| Capital de la cartera | La pestanya **Cartera** |
| Cost d'adquisició (per als impostos) | L'aportat de cada actiu |
| Saldo de cada matalàs de liquiditat | El valor de l'actiu que hi assignes |
| Aportació mensual | Hi ha el botó *usar* amb el que **de debò** inverteixes de mitjana |

**Les tres fases.** Fase 1: acumules fins a l'any de Coast FIRE aportant cada mes. Fase 2:
ja no cal aportar, el capital sol es capitalitza fins a l'edat de renda. Fase 3: vius del
capital fins a l'esperança de vida.

**L'objectiu Coast FIRE** no està escrit enlloc: es calcula com el capital que et caldrà a
la fase 3 (renda anual dividida per la taxa de retirada) descomptat enrere fins a l'any de
Coast, amb compost mensual, restant-hi abans el valor futur de les aportacions de la fase 2.

**Tres models de retirada**, els mateixos de sempre: capital invertit (retires el
rendiment), regla del 4 %, i híbrid (renda fixa i la resta invertida).

Els impostos es calculen amb els trams de l'estalvi (19/21/23/27/28 %) sobre la part del
capital que és guany. Aquesta part es projecta: el cost creix nominal amb cada aportació
i el valor creix compost, així que la fracció que tributa puja amb els anys.

> El cost d'adquisició inclou els actius il·líquids, valorats a 0. Això baixa la fracció
> que tributa i, per tant, els impostos projectats — dona per fet que podràs compensar
> aquelles pèrdues amb guanys futurs. Si no ho tens clar, posa'ls l'aportat a 0 des de
> **Cartera → ⋯**.

### Quan canvies un paràmetre

La projecció **sempre es recalcula des d'avui i del capital real d'ara**. Canviar un
paràmetre no reescriu el passat ni mou el que ja ha passat.

El gràfic del capital ensenya les dues coses: el **tram continu** és el teu historial
real de valoracions (des del gener del 2025), i el **discontinu**, a partir de la ratlla
vertical d'avui, és la projecció. Així veus si has anat per sobre o per sota del pla.

Cada canvi de paràmetre queda anotat amb la data a **Canvis de pla**, al final de la
pestanya. És un registre perquè sàpigues quan vas moure el pla; no fa que el gràfic
dibuixi trams antics amb els paràmetres vells.

## Què no he portat de l'app FIRE

Els documents amb resums, l'historial d'assessorament i l'estratègia d'assignació
(objectius de % per actiu). El primer i el segon no tenen res a veure amb un llibre de
comptes; el tercer sí que hi encaixaria, si el vols.

## L'evolució de la cartera

A **Cartera** hi ha tres maneres de mirar-t'ho enrere:

- **Evolució del valor total** — la línia del total, període a període.
- **Com s'ha repartit la cartera** — àrees apilades, commutable entre *per classe
  d'actiu*, *per entitat* i *per actiu*. Es veu com ha anat canviant la composició, no
  només que el total puja.
- **Valoracions mes a mes** — la matriu que tenies al full: una fila per data, una
  columna per actiu, amb el total i la variació. Un punt vol dir que aquell mes no en
  vas registrar el valor.

Els dos gràfics arrenquen de xifres diferents als primers mesos i està bé que sigui així:
el del total fa servir els totals que tenies apuntats, i el de composició només suma el
que tenies valorat actiu per actiu. Als primers mesos la diferència és la cartera que
aleshores no desglossaves. La nota sota el gràfic en diu la xifra exacta.

## L'aportat també fa historial

Cada cop que deses una valoració, **cada punt es guarda amb l'aportat d'aquell moment**,
no només amb el valor. Així el gràfic *El que hi has posat contra el que val* i les
columnes *Aportat* i *Balanç* de la matriu es van omplint sols.

Dues coses que se'n deriven:

- **Desa sempre tots els actius, encara que valguin 0.** Un actiu il·líquid val 0 i és
  una valoració vàlida: si el deixes en blanc, el seu aportat queda fora del total i el
  balanç d'aquell mes surt fals. El formulari ja te'ls posa a 0 per defecte.
- **El passat no es pot reconstruir.** L'aportat que ve del full és una xifra d'avui
  sense dates, i el registre d'aportacions no hi quadra amb el total. Es va provar de
  deduir-lo restant les aportacions posteriors i en sortien xifres impossibles — un
  aportat que puja com més enrere vas. Per això el gràfic arrenca a la primera valoració
  que desis tu, i abans no ensenya res.

## Importar taules de cartera

**Cartera → Importar .xlsx** admet les taules `carteraDDMmmAAAA.xlsx` que ja tens
guardades, i **en pots deixar anar unes quantes de cop**. La data surt del nom del
fitxer; si no s'endevina, la poses tu abans d'importar.

De cada fitxer s'agafa, per a cada actiu, el **valor** i l'**aportat** d'aquell dia, i el
total del dia passa a ser la suma. Els actius es lliguen pel seu ISIN i, si no en tenen,
per entitat i nom; el que no coincideixi surt avisat abans de fer res.

Això és la manera de **recuperar l'historial de l'aportat** que del full de càlcul no es
podia treure: aquelles taules sí que porten l'aportat datat.

## Exportar la cartera a .xlsx

A **Cartera** hi ha el botó **Exportar .xlsx**. Genera la mateixa taula que fas servir a
l'app d'independència financera, amb les columnes que espera:

```
# · Actiu · Entitat · Comentari · Data Inici · ISIN / Ticker · Import · Últim · Balanç
```

El fitxer surt anomenat com els teus, `carteraDDMmmAAAA.xlsx`, i el pots carregar
directament a l'altra app per a l'anàlisi a fons. `Import` és l'aportat, `Últim` és
l'última valoració de cada actiu i `Balanç` la diferència.

Es genera sense cap llibreria externa, igual que els lectors d'extractes.

## La feina de cada mes

1. Baixa't els dos extractes del banc i importa'ls.
2. **Cartera → Valoració del mes**: la data ja ve posada al final del mes i cada actiu
   surt amb el valor anterior. Canvia només el que s'hagi mogut. Si aquell mes hi has
   posat diners, escriu-los a *Aportació del mes*.

   Aquella columna **va amb signe**: positiva si hi poses diners, negativa si en treus o
   si en deprecies el valor aportat. Se suma amb el seu signe, o sigui que una de negativa
   **baixa** l'aportat de l'actiu. Al teu historial ja n'hi ha quatre, com la depreciació
   de Wind.

   Per tocar **un sol actiu**, ves a **Cartera → ⋯**: allà hi ha tant l'*Aportat* com el
   *Valor actual*, amb la data a la qual es desa. Si en canvies el valor o l'aportat, la
   data **es posa a avui sola**: el que escrius és d'ara, i queda com una valoració nova
   sense tocar la del mes passat. Si el que vols és corregir una valoració antiga, canvia
   la data tu i es quedarà on la deixis.
3. Ctrl+S.

## Dues coses que el full es menjava

**El balanç de la cartera.** El full comparava l'aportat *excloent-ne* el monetari amb el
valor actual *incloent-l'hi*: peres i pomes, i en sortia un balanç massa optimista.
L'app compara el mateix a banda i banda, i a més ensenya a part el balanç sense els
actius il·líquids —els que estan valorats a 0 perquè no en tens cotització—, que és la
xifra que de debò diu si la cartera va bé.

**El retorn per cartera.** El full sumava percentatges en comptes de ponderar-los pels
diners de cada actiu. L'app els pondera.

## Què no hi ha

Les aportacions històriques anteriors al 2025 no estan desglossades — al full tampoc hi
eren. L'aportat de cada actiu és una xifra que es manté a mà (**Cartera → ⋯ → Aportat**),
com feies al full; a partir d'ara, el que posis a *Aportació del mes* s'hi va sumant sol.
