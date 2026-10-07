import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ReportPdfService {
  private pdfMakePromise?: Promise<any>;

  async downloadActivityReport(data: any): Promise<void> {
    const summary = data?.projectReportSummary ?? {};
    const reports = Array.isArray(data?.reports) ? data.reports : [];
    const period = data?.startDate && data?.endDate
      ? `${data.startDate} – ${data.endDate}`
      : 'Alla rapporterade aktiviteter';
    const rows = reports.map((report: any) => [
      this.dateOnly(report.reportDate), this.text(report.title), this.text(report.locality),
      this.text(report.location), this.number(report.femaleParticipants),
      this.number(report.maleParticipants), this.number(report.leaders), this.duration(report.duration),
    ]);

    const definition: any = {
      pageSize: 'A4', pageOrientation: 'landscape', pageMargins: [32, 48, 32, 42],
      info: {title: `Aktivitetsrapport – ${this.text(data?.projectName, 'Projekt')}`, subject: period, creator: 'Goodsport QRI'},
      header: this.header('AKTIVITETSRAPPORT'), footer: this.footer(),
      content: [
        {text: this.text(data?.projectName, 'Projekt'), style: 'title'},
        {text: period, style: 'period'},
        {margin: [0, 10, 0, 18], table: {widths: ['*', '*', '*', '*'], body: [
          [this.metric('Totalt deltagande', data?.totalParticipants), this.metric('Kvinnor', summary.femaleParticipants), this.metric('Män', summary.maleParticipants), this.metric('Ledare', summary.leaders)],
          [this.metric('Barn 4–12', summary.children), this.metric('Ungdomar 13–25', summary.youth), this.metric('Vuxna 26+', summary.adults), this.metric('Aktiviteter', reports.length)],
        ]}, layout: this.cardLayout()},
        {text: 'Rapporterade aktiviteter', style: 'sectionTitle'},
        reports.length ? {table: {headerRows: 1, widths: [58, '*', 78, 78, 43, 43, 40, 47], body: [
          this.tableHeader(['Datum', 'Aktivitet', 'Ort', 'Plats', 'Kvinnor', 'Män', 'Ledare', 'Timmar']), ...rows,
        ]}, layout: this.reportTableLayout()} : {text: 'Det finns inga aktiviteter för den valda perioden.', style: 'empty'},
      ],
      styles: this.styles(), defaultStyle: {font: 'Roboto', fontSize: 8, color: '#24313d'},
    };
    const pdfMake = await this.pdfMake();
    pdfMake.createPdf(definition).download(this.fileName('aktivitetsrapport', data?.projectName));
  }

  async downloadFinalReport(data: any): Promise<void> {
    const groups = Array.isArray(data?.groups) ? data.groups : [];
    const content: any[] = [
      {text: this.text(data?.projectTitle, 'Projekt'), style: 'title'},
      {text: this.text(data?.questionnaireName, 'Slutrapport'), style: 'period'},
    ];
    groups.forEach((group: any) => {
      const entries = Array.isArray(group?.entries) ? group.entries : [];
      content.push({text: this.text(group?.name, 'Område'), style: 'groupTitle'});
      content.push(entries.length ? {table: {headerRows: 1, widths: ['35%', '50%', '15%'], body: [
        this.tableHeader(['Fråga', 'Svar', 'Beslut']),
        ...entries.map((entry: any) => [this.text(entry?.question), this.text(entry?.answer, 'Ej besvarad'), this.decision(entry?.decision)]),
      ]}, layout: this.reportTableLayout()} : {text: 'Inga frågor i det här området.', style: 'empty'});
    });
    const definition: any = {
      pageSize: 'A4', pageMargins: [40, 52, 40, 44],
      info: {title: `Slutrapport – ${this.text(data?.projectTitle, 'Projekt')}`, creator: 'Goodsport QRI'},
      header: this.header('SLUTRAPPORT'), footer: this.footer(), content,
      styles: this.styles(), defaultStyle: {font: 'Roboto', fontSize: 9, color: '#24313d'},
    };
    const pdfMake = await this.pdfMake();
    pdfMake.createPdf(definition).download(this.fileName('slutrapport', data?.projectTitle));
  }

  private pdfMake(): Promise<any> {
    if (!this.pdfMakePromise) {
      this.pdfMakePromise = Promise.all([import('pdfmake/build/pdfmake'), import('pdfmake/build/vfs_fonts')])
        .then(([pdfMakeModule, fontModule]: any[]) => {
          const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
          const fonts = fontModule.default ?? fontModule;
          pdfMake.vfs = fonts.pdfMake?.vfs ?? fonts.vfs;
          return pdfMake;
        });
    }
    return this.pdfMakePromise;
  }

  private header(label: string): any {
    return {columns: [
      {text: 'GOODSPORT', bold: true, color: '#0b6b57', fontSize: 11},
      {text: label, alignment: 'right', color: '#64717d', fontSize: 8},
    ], margin: [40, 20, 40, 0]};
  }

  private footer(): any {
    return (currentPage: number, pageCount: number) => ({columns: [
      {text: `Skapad ${new Intl.DateTimeFormat('sv-SE').format(new Date())}`},
      {text: `Sida ${currentPage} av ${pageCount}`, alignment: 'right'},
    ], color: '#77838e', fontSize: 7, margin: [40, 12, 40, 0]});
  }

  private metric(label: string, value: unknown): any {
    return {stack: [
      {text: label, color: '#64717d', fontSize: 7},
      {text: this.number(value), color: '#173f38', bold: true, fontSize: 15, margin: [0, 3, 0, 0]},
    ], margin: [8, 7, 8, 7]};
  }

  private styles(): any {
    return {
      title: {fontSize: 20, bold: true, color: '#173f38', margin: [0, 0, 0, 4]},
      period: {fontSize: 10, color: '#64717d', margin: [0, 0, 0, 8]},
      sectionTitle: {fontSize: 12, bold: true, color: '#173f38', margin: [0, 0, 0, 8]},
      groupTitle: {fontSize: 12, bold: true, color: '#173f38', margin: [0, 18, 0, 7]},
      empty: {italics: true, color: '#64717d', margin: [0, 6, 0, 10]},
    };
  }

  private cardLayout(): any {
    return {hLineColor: () => '#dfe8e5', vLineColor: () => '#dfe8e5', fillColor: () => '#f5f9f8'};
  }

  private reportTableLayout(): any {
    return {
      fillColor: (rowIndex: number) => rowIndex === 0 ? '#0b6b57' : rowIndex % 2 === 0 ? '#f5f9f8' : null,
      hLineColor: () => '#dfe8e5', vLineColor: () => '#dfe8e5',
      paddingLeft: () => 6, paddingRight: () => 6, paddingTop: () => 5, paddingBottom: () => 5,
    };
  }

  private tableHeader(labels: string[]): any[] {
    return labels.map(text => ({text, color: '#ffffff', bold: true}));
  }

  private decision(value: unknown): string {
    const labels: Record<string, string> = {APPROVE: 'Godkänd', UNAPPROVED: 'Ej godkänd', UNDER_PROCESS: 'Behandlas', NA: 'Ej relevant'};
    return labels[String(value ?? '')] ?? this.text(value);
  }

  private dateOnly(value: unknown): string { return this.text(value).split(' ')[0]; }
  private duration(value: unknown): string {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? new Intl.NumberFormat('sv-SE', {maximumFractionDigits: 2}).format(numeric) : '0';
  }
  private number(value: unknown): string {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? new Intl.NumberFormat('sv-SE').format(numeric) : '0';
  }
  private text(value: unknown, fallback = '—'): string {
    const result = value === null || value === undefined ? '' : String(value).trim();
    return result || fallback;
  }
  private fileName(prefix: string, projectName: unknown): string {
    const project = this.text(projectName, 'projekt').toLocaleLowerCase('sv-SE').normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${prefix}-${project}-${new Date().toISOString().slice(0, 10)}.pdf`;
  }
}
