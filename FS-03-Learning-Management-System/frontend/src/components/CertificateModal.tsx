import React from 'react';
import { X, Award, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Nexvia Technologies Official Credential</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="relative border-8 border-double border-indigo-950/20 p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-amber-50/30 via-white to-indigo-50/20 text-center space-y-6 shadow-inner">
          {/* Top Emblem */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 mx-auto flex items-center justify-center shadow-lg text-white ring-8 ring-amber-100">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-widest font-black text-indigo-900">
              Certificate of Academic Excellence
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">This certifies that</p>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif border-b-2 border-slate-200 pb-2 inline-block px-8">
              {certificate.user?.name || 'Hrithik Sarkar'}
            </h3>
            <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              has successfully fulfilled all curriculum requirements, continuous live evaluations, and passed the comprehensive technical examination for:
            </p>
          </div>

          <div className="bg-indigo-950 text-white py-2 px-6 rounded-xl inline-block shadow-md">
            <span className="text-sm font-bold">{certificate.course?.title}</span>
          </div>

          <div className="pt-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
            <div className="text-left">
              <span className="font-bold text-slate-700 block">Credential ID</span>
              <span className="font-mono text-indigo-600 font-bold">{certificate.certificateNumber}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Honors Awarded</span>
              <span className="text-emerald-700 font-bold">{certificate.grade}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-700 block">Issue Date</span>
              <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Verified in Public Registry
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
