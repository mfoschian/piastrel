const { y } = require('pdfkit');
let BasePdf = require('./BasePdf.js');


function cm(x) {
	// Unita di misura in PDF dot : 72 dot per inch ovvero 612 P per 21 cm
	// Vale per A4
	return x * 612.0 / 21.0;
}

const _page = {
	// margins: { top: cm(1.25), right: cm(1.8), bottom: cm(2.3), left: cm(1.8) }
	margins: { top: cm(1.25), right: cm(1.8), bottom: 0, left: cm(1.8) }
};

class ConvocationConfirmPdf extends BasePdf {

	constructor(filename) {
		super(filename, { margins: _page.margins } );
		this.addFont( 'LiberationSerif-Bold', this.assets.font('LiberationSerif-Bold.ttf') );
		this.addFont( 'LiberationSerif-BoldItalic', this.assets.font('LiberationSerif-BoldItalic.ttf') );
		this.addFont( 'LiberationSerif-Italic', this.assets.font('LiberationSerif-Italic.ttf') );
		this.addFont( 'LiberationSerif', this.assets.font('LiberationSerif-Regular.ttf') );
		this.addFont( 'Bookman Old Style', this.assets.font('BOOKOS.TTF') );
		this.addFont( 'Bookman Old Style-Bold', this.assets.font('BOOKOSB.TTF') );
	}

	formatDate(dt) {
		return '02.09.2022';
	}

	render( conv ) {
		const doc = this.doc;

		// const m = doc.page.margins;
		// doc.rect(m.left, m.top, doc.page.width - m.left - m.right, doc.page.height - m.top - m.bottom)
		// 	.stroke();

		const _margins = doc.page.margins;
		const _page_w = doc.page.width;
		const _width = _page_w - _margins.left - _margins.right;

		//
		// Intestazione
		//
		// - Logo - immagine
		const logo = {
			path: __dirname+'/../assets/images/logoCom.jpg',
			w: cm(0.94),
			h: cm(1.38),
			label: 'Comune di Duino Aurisina\nObčina Devin Nabrežina'
		};
		const logo_rect = {
			x: _page_w/2 - logo.w/2,
			y: _margins.top - cm(0.7),
			w: logo.w,
			h: logo.h
		}
		doc.image( logo.path, logo_rect.x, logo_rect.y, { fit: [logo_rect.w, logo_rect.h] });
		// - Logo - didascalia immagine
		doc.font('LiberationSerif-Italic', 8);
		doc.text( logo.label, _margins.left, logo_rect.y + logo_rect.h, { align: 'center', width: _width } );
		
		// - N.Protocollo, numero documento, data e luogo
		doc.font('LiberationSerif', 11);
		const h_text_left = 'Prot. n. ' + (conv.protocol_number || 15601)
			+ '\nVerbale n./Zapisnik št. '+(conv.doc_number || 26)+' dd./z dne ' + this.formatDate(conv.dt)
		;
		const h_text_right = 'Aurisina/Nabrežina, ' + this.formatDate(conv.dt);

		// const h_top = doc.y; // cm(2)
		const h_top = _margins.top + cm(2);
		doc.text( h_text_left, _margins.left, h_top, { align: 'left', width: _width/2 } );
		doc.text( h_text_right, doc.page.width/2, h_top, { align: 'right', width: _width/2 } );
		// Lascia una riga
		doc.moveDown();

		//
		// Generalità persona convocata
		//
		const p_left = _margins.left + cm(8.1);
		const p_top = _margins.top + cm(3.5);
		const p_text = (conv.last_name + ' ' + conv.first_name).toUpperCase()
			+ '\n' + (conv.address || 'Aurisina stazione/Nabrežina postaja  n.5')
			+ '\n34011 Duino Aurisina/Devin Nabrežina'
			;
		doc.font('LiberationSerif-Bold', 11);
		doc.text( p_text, p_left, p_top, { align: 'left', width: _width/2 });

		//
		// OGGETTO
		//
		const obj_text = 'Elezioni del 25 settembre 2022 - Notifica nomina a scrutatore presso la sezione elettorale';
		const obj_text_slo = 'Volitve z dne 25. septembra 2022 - Sporočilo o imenovanju za skrutinatorja na volišču';
		doc.font('LiberationSerif-Bold', 11);
		const obj_start_y = _margins.top + cm(5.2);
		const obj_start_x = _margins.left + cm(3.1);
		doc.text( 'OGGETTO:', _margins.left, obj_start_y, { align: 'left', underline: true });
		doc.text( 'ZADEVA:', _margins.left, doc.y, { align: 'left', underline: true });
		doc.font('LiberationSerif', 11);
		doc.text( obj_text, obj_start_x, obj_start_y, { align: 'left' });
		doc.text( obj_text_slo, obj_start_x, doc.y, { align: 'left' });

		//
		// LUOGO
		//
		const site_rect = {
			x: _margins.left - cm(0.2),
			y: _margins.top + cm(6.5),
			w: _width + 2 * cm(0.2),
			h: cm(1.8)
		};
		doc.rect( site_rect.x, site_rect.y, site_rect.w, site_rect.h ).stroke();
		const site_label = 'Luogo della riunione/Kraj zbora:';
		doc.font('LiberationSerif', 10.5);
		const site_label_w = doc.widthOfString( site_label );
		const site_label_h = doc.heightOfString( site_label );
		doc.text( site_label, _margins.left, site_rect.y + (site_rect.h - site_label_h)/2);
		let site_text_offset = _margins.left + site_label_w + cm(1.5);
		let site_text_w = _margins.left + _width - site_text_offset;
		let site_text_number = 'N. – št. ' + '2';
		let site_text_name = 'Scuola secondaria di I grado – Srednja šola';
		let site_text_address = 'Aurisina /Nabrežina n. 16';
		let site_text = site_text_number + '\n' + site_text_name + '\n' + site_text_address;
		doc.font('LiberationSerif-Bold', 10.5);
		doc.text( site_text, site_text_offset, site_rect.y + cm(0.2), { align: 'center', width: site_text_w });

		//
		// Informazioni
		//
		const text_it = "Le comunico che la Commissione elettorale comunale, a norma dell'art. 9 della Legge 21.12.2005, n. 270, ha deliberato di nominarLa scrutatore presso il seggio elettorale sopraindicato.\n"
			+ "Pertanto la S.V. dovrà presentarsi alle ore 16.00 di sabato, 24 settembre 2022 presso la sezione elettorale sopraindicata per la costituzione dell’ufficio elettorale. Le operazioni di votazione si svolgeranno dalle ore 7.00 alle ore 23.00 di domenica 25 settembre.\n"
			+ "Le operazioni di scrutinio si svolgeranno subito dopo la chiusura dei seggi.\n"
			+ "L’incarico di scrutatore è obbligatorio per le persone designate, salvo eventuale grave impedimento all'assunzione dell'incarico che dovrà essere comunicato entro 48 ore dalla notifica della presente.\n"
			+ "Si rammenta inoltre che gli scrutatori, nell’espletamento delle loro attività, devono attenersi scrupolosamente alle disposizioni di legge ed alle istruzioni ministeriali, collaborare attivamente con il presidente di seggio, curando con precisione e speditezza ogni adempimento ad essi demandato. Si richiama inoltre la particolare attenzione sulle responsabilità di natura penale in cui possono incorrere ai sensi degli articoli 94, 100, 103, 104, 108 e 111 del T.U. 30.03.1957, n. 361, anche in ragione della qualità di pubblico ufficiale ad essi attribuita dall’art. 40, comma 3 del T.U. citato.\n"
			+ "Distinti saluti.";
		const text_line = "* * * * * *";
		const text_slo = "Sporočam Vam, da Vas je v smislu 9. člena zakona št. 270 z dne 21.12.2005 občinska volilna komisija imenovala za skrutinatorja na zgoraj navedenem sedežu.\n"
			+ "Ob upoštevanju navedenega se morate udeležiti konstituiranja volilnega odbora, ki bo v soboto, 24.septembra 2022, ob 16. uri v prostorih zgoraj omenjenega volišča. Glasovanje bo potekalo v nedeljo, 25. septembra 2022, od 7. do 23. ure.\n"
			+ "Izide glasovanja bo volilni odbor ugotavljal takoj po zaprtju volišča.\n"
			+ "Skrutinatorsko delo je obvezno za vsakogar, ki je za to določen, razen v primeru resnih razlogov, ki jih je treba sporočiti v roku 48 ur od prejema tega obvestila.\n"
			+ "Spominjamo Vas tudi, da se morajo skrutinatorji, pri opravljanju svoje dolžnosti, skrbno držati zakonskih določil ter ministrskih navodil, aktivno sodelovati s predsednikom volišča, tako da natančno in brez odlašanja izvršijo vsako nalogo, ki jim bo zaupana. Poleg tega Vas še posebej opozarjamo na kazensko odgovornost v smislu členov 94, 100, 103, 104, 108 in 111 E.B. št. 361 z dne 30.03.1957 ter v skladu s funkcijo javnega uradnika, ki jo skrutinatorjem dodeluje 3. odstavek 40. člena navedenega E.B.\n"
			+ "Lep pozdrav.\n";

		const text_style = { align: 'justify', indent: cm(1.75), lineGap: -1 };
		doc.font('LiberationSerif', 10.5);
		doc.text( text_it, _margins.left, _margins.top + cm(9), text_style );
		doc.text( text_line, _margins.left, doc.y, {align: 'center'} );
		doc.text( text_slo, _margins.left, doc.y, text_style );
		

		//
		// Firmatario
		//
		const signer = { first_name: 'Nataša', last_name: 'Canziani'}
		const signer_text = "La Responsabile dell’Ufficio Elettorale\n"
			+ "Odgovorna za volilni urad\n"
			+ signer.first_name + " " + signer.last_name.toUpperCase()
			;
		// 8.25 - 15.5
		const signer_y = doc.y; // _margins.top + cm(22.5)
		doc.font('LiberationSerif', 10);
		doc.text( signer_text, _margins.left+ cm(8.25), signer_y, { align: 'center', width: cm(15.5 - 8.25)});

		// Firma
		const sign_rect = {
			x: _margins.left + cm(11),
			// y: _margins.top + cm(23.5),
			y: doc.y - cm(0.2),
			w: cm(2.42), h: cm(1.03)
		}
		doc.image( this.assets.image('sign.png'), sign_rect.x, sign_rect.y, { fit: [ sign_rect.w, sign_rect.h ]})
		
		// Timbro
		const stamp_rect = {
			x: _margins.left + cm(15.20),
			// y: _margins.top + cm(23.5),
			y: doc.y - cm(0.5),
			w: cm(1.6), h: cm(1.58)
		}
		doc.image( this.assets.image('stamp.png'), stamp_rect.x, stamp_rect.y, { fit: [ stamp_rect.w, stamp_rect.h ]})

		//
		// Box a piedipagina
		//
		const fbox_h = cm(1.25);
		const fbox_y = cm(23.5);
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
		// Footer
		//
		const PO = signer.first_name + ' ' + signer.last_name;
		const footer_text = "Area Amministrativa, Demografici e Ufficio gare\n"
			+ "Oddelek za administrativne in demografske zadeve ter urad za javna naročila";
		const footer_text_2 = "Responsabile di P.O. – Odgovorni za O.P.: "+PO+"\n"
			+ "Aurisina Cave-Nabrežina kamnolomi, 25  - 34011 Duino Aurisina–Devin Nabrežina (TS)  \n"
			+ "Tel.: 040–2017400-430  Web: www.comune.duino-aurisina.ts.it e-mail: elettorale@comune.duino-aurisina.ts.it"
		;

		doc.font('Bookman Old Style-Bold', 7);
		doc.text(footer_text, _margins.left, fbox_y + fbox_h + 5, { align: 'center', width: _width });
		doc.font('Bookman Old Style', 7);
		doc.text(footer_text_2, _margins.left, doc.y, { align: 'center', width: _width });
	}

}

module.exports = ConvocationConfirmPdf;