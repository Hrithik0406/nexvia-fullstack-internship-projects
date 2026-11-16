import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Calendar, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';

interface MyCertificatesViewProps {
  token: string;
  onOpenCertificateModal: (cert: Certificate) => void;
}

export const MyCertificatesView: React.FC<MyCertificatesViewProps> = ({
  token,
  onOpenCertificateModal,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [token]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Credentials & Accreditations</h1>
        <p className="text-xs text-slate-500 mt-1">Official industry certificates earned through course mastery and quiz evaluation.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading certificate records...</div>
      ) : certificates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-500">Complete 100% of course lessons and pass the final certification exam to earn credentials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Credential
                </span>
                <span className="text-[11px] font-mono text-indigo-600 font-bold">
                  {cert.certificateNumber}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{cert.course?.title}</h3>
                <p className="text-xs text-amber-600 font-bold mt-1">{cert.grade}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(cert.issueDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onOpenCertificateModal(cert)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
