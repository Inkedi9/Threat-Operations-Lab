import { useOutletContext } from 'react-router-dom';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { buildIntelReport } from '../lib/reportBuilder';
import TagChip from '../components/ui/TagChip';


export default function ReportsPage() {
  const { result } = useOutletContext();
  const reportRef = useRef();
  const [exporting, setExporting] = useState(false);

  const report = buildIntelReport(result);

  if (!report) {
    return (
      <div className="panel p-6 text-muted">
        No report available.
      </div>
    );
  }

  const exportPDF = async () => {
    if (!reportRef.current || exporting) return;

    setExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#050505',
        useCORS: true,
        logging: false,
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeTitle = String(report.title || 'indicator')
        .replace(/[^a-z0-9-_]/gi, '-')
        .toLowerCase();

      pdf.save(`intel-report-${safeTitle}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Check the console for details.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-[2rem] p-6">
        <div className="label-caps text-gold">Intel report generator</div>
        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-ivory">
              Exportable <span className="text-gradient-gold">analyst report</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
              Generate a clean PDF report from the current IoC, including threat score, tags, MITRE mapping,
              analyst notes and recommended actions.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={exportPDF}
              disabled={exporting}
              className="rounded-[1.1rem] bg-[linear-gradient(180deg,rgba(246,216,151,.95),rgba(201,148,66,.95))] px-5 py-3 text-sm font-black text-[#2f1c06] shadow-[0_10px_30px_rgba(221,183,106,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? 'Exporting report…' : 'Export PDF report'}
            </button>
          </div>
        </div>
      </section>

      <div
        ref={reportRef}
        style={{
          background: '#050505',
          color: '#f2ebdb',
          padding: '32px',
          borderRadius: '24px',
          minHeight: '1123px', // hauteur A4 en px (~297mm)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          Classification: TLP:AMBER · Confidence: HIGH · Generated: {new Date().toLocaleString()}
        </div>
        <h1 style={{ color: '#ddb76a', fontSize: '30px', margin: '0 0 24px' }}>
          Threat Intelligence Report
        </h1>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#f2ebdb', fontSize: '22px', margin: '0 0 8px' }}>
            {report.title}
          </h2>
          <p style={{ color: '#a89f8c', lineHeight: 1.7, margin: 0 }}>
            {report.summary}
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ border: '1px solid rgba(221,183,106,0.25)', padding: '16px', borderRadius: '16px', background: '#101010' }}>
            <div style={{ color: '#a89f8c', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Score</div>
            <div style={{ color: '#ddb76a', fontSize: '28px', fontWeight: 800 }}>{report.score}</div>
          </div>

          <div style={{ border: '1px solid rgba(255,110,87,0.25)', padding: '16px', borderRadius: '16px', background: '#101010' }}>
            <div style={{ color: '#a89f8c', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Severity</div>
            <div style={{ color: '#ff6e57', fontSize: '28px', fontWeight: 800 }}>{report.severity}</div>
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#ddb76a', fontSize: '18px', marginBottom: '12px' }}>Tags</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {report.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  border: '1px solid rgba(221,183,106,0.25)',
                  background: '#111',
                  color: '#f2ebdb',
                  borderRadius: '999px',
                  padding: '6px 10px',
                  fontSize: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#ddb76a', fontSize: '18px', marginBottom: '12px' }}>MITRE ATT&CK</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {report.mitre.length ? (
              report.mitre.map((tech) => (
                <div key={tech.id} style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#101010', padding: '12px', borderRadius: '14px' }}>
                  <div style={{ color: '#f2ebdb', fontWeight: 700 }}>
                    {tech.id} · {tech.name}
                  </div>
                  <div style={{ color: '#a89f8c', fontSize: '12px', marginTop: '4px' }}>
                    {tech.tactic}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#a89f8c' }}>No ATT&CK techniques inferred.</p>
            )}
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#ddb76a', fontSize: '18px', marginBottom: '12px' }}>Analyst Notes</h3>
          <ul style={{ color: '#a89f8c', lineHeight: 1.7, paddingLeft: '20px' }}>
            {report.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 style={{ color: '#ddb76a', fontSize: '18px', marginBottom: '12px' }}>
            Recommended Action
          </h3>
          <p style={{ color: '#a89f8c', lineHeight: 1.7 }}>{report.recommendation}</p>
        </section>
        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', fontSize: '12px', color: '#777' }}>
          <span>Generated by Threat Intelligence Platform · TLP:AMBER · Portfolio CTI Module</span>
        </div>
      </div>
    </div>
  );
}