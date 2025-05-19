let BasePdf = require('./BasePdf.js');
const { formatDate } = require('../lib/formatters');
const { joinIfNotEmpty } = require('../lib/utils');

const PAGE_SIZE = 'A4';
const pt2cm = BasePdf.ptXcm(PAGE_SIZE);
function cm(x) {
	return x * pt2cm.x;
}
function cmY(x) {
	return x * pt2cm.y;
}

class ConvocationConfirmPdf extends BasePdf {

	constructor(filename, options) {
		super(filename, {
			size: PAGE_SIZE,
			margins: { top: cmY(1.25), right: cm(1.8), bottom: 0, left: cm(1.5) } // bottom 2.3
		});
		this.addFont( 'LiberationSerif-Bold', this.assets.font('LiberationSerif-Bold.ttf') );
		this.addFont( 'LiberationSerif-BoldItalic', this.assets.font('LiberationSerif-BoldItalic.ttf') );
		this.addFont( 'LiberationSerif-Italic', this.assets.font('LiberationSerif-Italic.ttf') );
		this.addFont( 'LiberationSerif', this.assets.font('LiberationSerif-Regular.ttf') );
		this.addFont( 'Bookman Old Style', this.assets.font('BOOKOS.TTF') );
		this.addFont( 'Bookman Old Style-Bold', this.assets.font('BOOKOSB.TTF') );

		if( options ) {
			this.add_bucket_page = options.bucket_page == true ? true : false;
		}
	}

	page_footer( PO ) {
		// const start_x = fbox_y + fbox_h + 5;
		const doc = this.doc;
		const start_y = doc.page.height - cmY(2.3);
		const _margins = doc.page.margins;
		const _width = doc.page.width - _margins.left - _margins.right;


		const footer_text = "Area Amministrativa, Demografici e Transizione digitale\n"
			+ "Oddelek za administrativne in demografske zadeve ter urad za digitalni prehod";
		const footer_text_2 = "Responsabile di P.O. – Odgovorni za O.P.: "+PO+"\n"
			+ "Aurisina Cave-Nabrežina kamnolomi, 25  - 34011 Duino Aurisina–Devin Nabrežina (TS)  \n"
			+ "Tel.: 040–2017400-430  Web: www.comune.duino-aurisina.ts.it e-mail: elettorale@comune.duino-aurisina.ts.it"
		;

		doc.font('Bookman Old Style-Bold', 7);
		doc.text(footer_text, _margins.left, start_y, { align: 'center', width: _width });
		doc.font('Bookman Old Style', 7);
		doc.text(footer_text_2, _margins.left, doc.y, { align: 'center', width: _width });

	}

	render( params ) {

		// Info variabili
		const conv = params.convocation || {};
		const person = params.person || {};
		const contacts = params.contacts || {};
		const bucket = params.bucket || {};
		const event = params.event || {};
		const event_info = event.info || {};
		const event_protocol = event_info.protocol || {};
		const event_document = event_info.document || {};
		const info_it = event_info.it || {};
		const info_slo = event_info.slo || {};

		const today = new Date();
		const protocol_number = conv.doc_number || event_protocol.number || '<mancante>';
		const protocol_dt = conv.doc_dt || event_protocol.dt || today;
		const document_number = event_document.number || '<mancante>';
		const document_dt = event_document.dt || today;
		const person_fullname = (person.last_name + ' ' + person.first_name).toUpperCase();
		const person_address = contacts.address || '';
		const person_address_mun = joinIfNotEmpty(contacts.cap||'', contacts.municipality||'', ' - '); // '34011 Duino Aurisina/Devin Nabrežina';
		const event_obj_it = event.title || '<mancante>'; //'Elezioni del 25 settembre 2022';
		const event_obj_slo = event.title_slo || '<mancante>'; //'Volitve z dne 25. septembra 2022';
		const sect_number = bucket.number || '<mancante>';
		const sect_name = joinIfNotEmpty(bucket.name || '<mancante>', bucket.name_slo, ' - '); //'Scuola secondaria di I grado – Srednja šola';
		const sect_address = joinIfNotEmpty(bucket.address || '<mancante>', bucket.address_slo, ' / '); // 'Aurisina /Nabrežina n. 16';
		const appointment_dt_it = info_it.appointment_dt || '<mancante>'; // '16.00 di sabato, 24 settembre 2022';
		const appointment_dt_slo = info_slo.appointment_dt || '<mancante>'; //'v soboto, 24.septembra 2022, ob 16. uri';
		const event_range_it = info_it.range || '<mancante>'; //'dalle ore 7.00 alle ore 23.00 di domenica 25 settembre';
		const event_range_slo = info_slo.range || '<mancante>'; //'v nedeljo, 25. septembra 2022, od 7. do 23. ure';
		const signer = {
			first_name: 'Nome (mancante)',
			last_name: 'Cognome (mancante)',
			title_it: "Titolo Responsabile (mancante)",
			title_slo: 'Titolo Responsabile slo (mancante)',

			...event_info.signer
		};
		// {
		// 	first_name: 'Nataša',
		// 	last_name: 'Canziani',
		// 	sign: 'sign.png',
		// 	title_it: "La Responsabile dell’Ufficio Elettorale",
		// 	title_slo: 'Odgovorna za volilni urad'
		// };
		const municipality_stamp = 'stamp.png';
		const PO = signer.first_name + ' ' + signer.last_name;


		const doc = this.doc;
		const _margins = doc.page.margins;
		const _width = doc.page.width - _margins.left - _margins.right;

		//
		// Intestazione
		//
		// - Logo - immagine
		const logo = {
			path: this.assets.image('logoCom.jpg'),
			w: cm(0.94),
			h: cmY(1.38),
			label: 'Comune di Duino Aurisina\nObčina Devin Nabrežina'
		};
		const logo_rect = {
			x: doc.page.width/2 - logo.w/2,
			y: _margins.top - cmY(0.7),
			w: logo.w,
			h: logo.h
		}
		doc.image( logo.path, logo_rect.x, logo_rect.y, { fit: [logo_rect.w, logo_rect.h] });
		// - Logo - didascalia immagine
		doc.font('LiberationSerif-Italic', 8);
		doc.text( logo.label, _margins.left, logo_rect.y + logo_rect.h, { align: 'center', width: _width } );
		
		// - N.Protocollo, numero documento, data e luogo
		doc.font('LiberationSerif', 11);
		const h_text_left = 'Prot. n. ' + protocol_number
			+ '\nVerbale n./Zapisnik št. '+(document_number)+' dd./z dne ' + formatDate('DD/MM/YYYY', document_dt)
		;
		const h_text_right = 'Aurisina/Nabrežina, ' + formatDate('DD.MM.YYYY', today);

		// const h_top = doc.y; // cm(2)
		const h_top = _margins.top + cmY(2);
		doc.text( h_text_left, _margins.left, h_top, { align: 'left', width: _width/2 } );
		doc.text( h_text_right, doc.page.width/2, h_top, { align: 'right', width: _width/2 } );
		// Lascia una riga
		doc.moveDown();

		//
		// Generalità persona convocata
		//
		const p_left = _margins.left + cm(8.1);
		const p_top = _margins.top + cmY(3.5);
		const p_text = person_fullname
			+ '\n' + person_address
			+ '\n' + person_address_mun
			;
		doc.font('LiberationSerif-Bold', 11);
		doc.text( p_text, p_left, p_top, { align: 'left', width: _width/2 });

		//
		// OGGETTO
		//
		const obj_text = event_obj_it + ' - Notifica nomina a scrutatore presso la sezione elettorale';
		const obj_text_slo = event_obj_slo + ' - Sporočilo o imenovanju za skrutinatorja na volišču';
		doc.font('LiberationSerif-Bold', 10);
		const obj_start_y = _margins.top + cmY(5.2);
		const obj_start_x = _margins.left + cm(3.1);
		doc.text( 'OGGETTO:', _margins.left, obj_start_y, { align: 'left', underline: true });
		doc.text( 'ZADEVA:', _margins.left, doc.y, { align: 'left', underline: true });
		doc.font('LiberationSerif', 10);
		doc.text( obj_text, obj_start_x, obj_start_y, { align: 'left' });
		doc.text( obj_text_slo, obj_start_x, doc.y, { align: 'left' });

		//
		// LUOGO
		//
		const site_rect = {
			x: _margins.left - cm(0.2),
			y: _margins.top + cmY(6.5),
			w: _width + 2 * cm(0.2),
			h: cmY(1.8)
		};
		doc.rect( site_rect.x, site_rect.y, site_rect.w, site_rect.h ).stroke();
		const site_label = 'Luogo della riunione/Kraj zbora:';
		doc.font('LiberationSerif', 10.5);
		const site_label_w = doc.widthOfString( site_label );
		const site_label_h = doc.heightOfString( site_label );
		doc.text( site_label, _margins.left, site_rect.y + (site_rect.h - site_label_h)/2);
		let site_text_offset = _margins.left + site_label_w + cm(1.5);
		let site_text_w = _margins.left + _width - site_text_offset;
		let site_text = 'N. – št. ' + sect_number
			+ '\n' + sect_name
			+ '\n' + sect_address;
		doc.font('LiberationSerif-Bold', 10.5);
		doc.text( site_text, site_text_offset, site_rect.y + cmY(0.2), { align: 'center', width: site_text_w });

		//
		// Informazioni
		//
		const text_it = "Le comunico che la Commissione elettorale comunale, a norma dell'art. 9 della Legge 21.12.2005, n. 270, ha deliberato di nominarLa scrutatore presso il seggio elettorale sopraindicato.\n"
			+ "Pertanto la S.V. dovrà presentarsi "+appointment_dt_it+" presso la sezione elettorale sopraindicata per la costituzione dell’ufficio elettorale. Le operazioni di votazione si svolgeranno "+event_range_it+".\n"
			+ "Le operazioni di scrutinio si svolgeranno subito dopo la chiusura dei seggi.\n"
			+ "L’incarico di scrutatore è obbligatorio per le persone designate, salvo eventuale grave impedimento all'assunzione dell'incarico che dovrà essere comunicato entro 48 ore dalla notifica della presente.\n"
			+ "Si rammenta inoltre che gli scrutatori, nell’espletamento delle loro attività, devono attenersi scrupolosamente alle disposizioni di legge ed alle istruzioni ministeriali, collaborare attivamente con il presidente di seggio, curando con precisione e speditezza ogni adempimento ad essi demandato. Si richiama inoltre la particolare attenzione sulle responsabilità di natura penale in cui possono incorrere ai sensi degli articoli 94, 100, 103, 104, 108 e 111 del T.U. 30.03.1957, n. 361, anche in ragione della qualità di pubblico ufficiale ad essi attribuita dall’art. 40, comma 3 del T.U. citato.\n"
			+ "Distinti saluti.";
		const text_line = "* * * * * *";
		const text_slo = "Sporočam Vam, da Vas je v smislu 9. člena zakona št. 270 z dne 21.12.2005 občinska volilna komisija imenovala za skrutinatorja na zgoraj navedenem sedežu.\n"
			+ "Ob upoštevanju navedenega se morate udeležiti konstituiranja volilnega odbora, ki bo "+appointment_dt_slo+" v prostorih zgoraj omenjenega volišča. Glasovanje bo potekalo "+event_range_slo+".\n"
			+ "Izide glasovanja bo volilni odbor ugotavljal takoj po zaprtju volišča.\n"
			+ "Skrutinatorsko delo je obvezno za vsakogar, ki je za to določen, razen v primeru resnih razlogov, ki jih je treba sporočiti v roku 48 ur od prejema tega obvestila.\n"
			+ "Spominjamo Vas tudi, da se morajo skrutinatorji, pri opravljanju svoje dolžnosti, skrbno držati zakonskih določil ter ministrskih navodil, aktivno sodelovati s predsednikom volišča, tako da natančno in brez odlašanja izvršijo vsako nalogo, ki jim bo zaupana. Poleg tega Vas še posebej opozarjamo na kazensko odgovornost v smislu členov 94, 100, 103, 104, 108 in 111 E.B. št. 361 z dne 30.03.1957 ter v skladu s funkcijo javnega uradnika, ki jo skrutinatorjem dodeluje 3. odstavek 40. člena navedenega E.B.\n"
			+ "Lep pozdrav.\n";

		const text_style = { align: 'justify', indent: cm(1.75), lineGap: 0 };
		doc.font('LiberationSerif', 10.5);
		doc.text( text_it, _margins.left, _margins.top + cmY(9), text_style );
		doc.text( text_line, _margins.left, doc.y, {align: 'center'} );
		doc.text( text_slo, _margins.left, doc.y, text_style );
		

		//
		// Firmatario
		//
		const signer_text = signer.title_it + "\n"
			+ signer.title_slo + "\n"
			+ signer.first_name + " " + (signer.last_name||"").toUpperCase()
			;
		// 8.25 - 15.5
		// const signer_y = doc.y;
		const signer_y = _margins.top + cmY(22.5)
		doc.font('LiberationSerif', 10);
		doc.text( signer_text, _margins.left+ cm(8.25), signer_y, { align: 'center', width: cm(15.5 - 8.25)});

		// Firma
		if( signer.sign ) {
			const sign_rect = {
				x: _margins.left + cm(11),
				// y: _margins.top + cmY(23.5),
				y: doc.y - cmY(0.2),
				w: cm(2.42), h: cmY(1.03)
			}
			doc.image( this.assets.image(signer.sign), sign_rect.x, sign_rect.y, { fit: [ sign_rect.w, sign_rect.h ]})
		}

		// Timbro
		const stamp_rect = {
			x: _margins.left + cm(15.20),
			// y: _margins.top + cmY(23.5),
			y: doc.y - cmY(0.5),
			w: cm(1.6), h: cmY(1.58)
		}
		doc.image( this.assets.image(municipality_stamp), stamp_rect.x, stamp_rect.y, { fit: [ stamp_rect.w, stamp_rect.h ]})

		//
		// Box a piedipagina
		//
		// const fbox_y = cmY(23.5);
		const fbox_y = signer_y + cmY(2);
		const fbox_h = cmY(1.25);
		const draw_box = ( start, w, text ) => {
			doc.rect( start, fbox_y, w, fbox_h ).lineWidth(0.75).stroke();
			// line
			const padding = cm(0.2);
			const line_y = fbox_y + fbox_h * 2/3;
			doc.rect( start + padding, line_y, w - 2*padding, 0.5).stroke();
			
			doc.font('LiberationSerif', 8);
			doc.text( text, start, line_y + 1, { align: 'center', width: w } );
		};

		const breaks = [ cm(4.5), (_width - cm(4.5)) / 2 ];
		let bx_x = _margins.left;
		let bx_w = breaks[0];
		draw_box( bx_x, bx_w, 'Ricevuto in data/Sprejeto dne');
		bx_x += bx_w; bx_w = breaks[1];
		draw_box( bx_x, bx_w, 'Firma/Podpis');
		bx_x += bx_w;
		draw_box( bx_x, bx_w, 'Tel.');

		//
		// FOOTER
		//
		this.page_footer( PO );

		//
		// Second page
		//
		if( this.add_bucket_page != true )
			return;

		const buckets = params.buckets || [];
		if( buckets.length == 0 )
			return;

		doc.addPage();
		doc.font('LiberationSerif-Bold', 12);
		doc.text( "Ubicazione delle sezioni elettorali");
		doc.font('LiberationSerif', 12);
		doc.moveDown();


		const columns = [
			{ label: 'Sezione', width: cm(3), align: 'left', font: { name: 'LiberationSerif-Bold'} },
			{ label: 'Luogo', width: cm(9), align: 'left' },
			{ label: 'Indirizzo', width: _width - cm(9+3), align: 'left' }
		];

		let table = this.addTable( columns, {
			style: {
				border: {
					width: 0.75
				},
				padding: { x: cm(0.3), y: cmY(0.3) },
				font: { name: 'LiberationSerif' }
			},
			headers_style: {
				font: { name: 'LiberationSerif-Bold' }
			}
		});


		// let rows = buckets.map( b => [
		// 		'Sez. ' + b.number,
		// 		joinIfNotEmpty(b.name, b.name_slo, '\n'),
		// 		joinIfNotEmpty(b.address, b.address_slo, '\n')
		// ]);
		// table.draw( _margins.left, doc.y, rows );
		table.draw( _margins.left, doc.y, (row_num) => {
			if( row_num >= buckets.length )
				return null;

			let b = buckets[row_num];
			return [
				'Sez. ' + b.number,
				joinIfNotEmpty(b.name, b.name_slo, '\n'),
				joinIfNotEmpty(b.address, b.address_slo, '\n')
			];
		});

		this.page_footer( PO );
	}

}

module.exports = ConvocationConfirmPdf;