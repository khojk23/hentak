import QRCode from "qrcode";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Table QR Codes — Hentak Admin" };

const TABLE_COUNT = 20;

async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width:          400,
    margin:         2,
    color:          { dark: "#1a1612", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

export default async function QRCodesPage({
  searchParams,
}: {
  searchParams: { host?: string };
}) {
  const baseUrl = searchParams.host
    ? `https://${searchParams.host}`
    : "http://localhost:3002";

  const tables = await Promise.all(
    Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map(async (n) => ({
      number:   n,
      url:      `${baseUrl}/order/${n}`,
      qrData:   await generateQR(`${baseUrl}/order/${n}`),
    }))
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Header — screen only */}
      <div className="print:hidden bg-[#1a1612] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-xl tracking-widest uppercase">HENTAK. — Table QR Codes</h1>
          <p className="text-[#d97706] text-xs tracking-widest uppercase mt-0.5">Print and place on each table</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#78716c] text-xs">Base URL: <code className="text-white">{baseUrl}</code></span>
          <button
            onClick={undefined}
            className="px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold tracking-widest uppercase rounded transition-colors"
            // eslint-disable-next-line react/no-unknown-property
            {...{ onclick: "window.print()" } as React.HTMLAttributes<HTMLButtonElement>}
          >
            Print All
          </button>
          <a href="/admin/orders" className="px-5 py-2.5 border border-[#44403c] hover:border-[#d97706] text-[#a8a29e] hover:text-[#d97706] text-xs font-bold tracking-widest uppercase rounded transition-colors">
            Orders
          </a>
        </div>
      </div>

      {/* Print button (client-side via script tag) */}
      <script dangerouslySetInnerHTML={{ __html: `document.querySelector('[onclick="window.print()"]')?.addEventListener('click',()=>window.print())` }} />

      {/* QR grid */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-4 print:gap-6 print:p-8">
        {tables.map(({ number, url, qrData }) => (
          <div
            key={number}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#e7e5e4] flex flex-col items-center p-4 print:rounded-lg print:shadow-none print:border print:border-[#d6d3d1] print:break-inside-avoid"
          >
            {/* QR code */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrData} alt={`QR code for Table ${number}`} className="w-full max-w-[180px] rounded-lg" />

            {/* Label */}
            <div className="mt-3 text-center">
              <p className="font-black text-[#1a1612] text-xs tracking-[0.3em] uppercase">HENTAK.</p>
              <p className="text-[#d97706] font-black text-2xl tracking-wide mt-0.5">Table {number}</p>
              <p className="text-[#a8a29e] text-[9px] tracking-widest uppercase mt-1">Scan to Order</p>
            </div>

            {/* URL (small, for reference) */}
            <p className="mt-2 text-[8px] text-[#d6d3d1] text-center break-all print:hidden">{url}</p>
          </div>
        ))}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
