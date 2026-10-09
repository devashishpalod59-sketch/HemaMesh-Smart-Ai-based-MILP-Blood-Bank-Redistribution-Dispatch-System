import React from 'react';
import { ActiveDispatch, FacilityNode } from '../types/bloodMesh.ts';
import {
  X,
  Shield,
  Printer,
  Copy,
  CheckCircle2,
  QrCode,
  AlertTriangle,
  Building2,
  Clock,
  Truck,
  FileCheck,
} from 'lucide-react';

interface GreenCorridorPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch?: ActiveDispatch | null;
  fromHospital?: FacilityNode | null;
  toHospital?: FacilityNode | null;
}

export const GreenCorridorPassModal: React.FC<GreenCorridorPassModalProps> = ({
  isOpen,
  onClose,
  dispatch,
  fromHospital,
  toHospital,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const passNumber = dispatch
    ? `GC-DL-NBTC-${dispatch.manifestNumber.replace('#', '')}`
    : 'GC-DL-NBTC-99482';

  const sourceName = dispatch?.fromNode?.name || fromHospital?.name || 'AIIMS Apex Trauma Center';
  const destName = dispatch?.toNode?.name || toHospital?.name || 'Safdarjung Hospital Regional Center';
  const vehicle = dispatch?.vehicleId || 'DL-01-AMB-2094 (STAT Cold Van)';
  const cargo = dispatch
    ? `${dispatch.units} Units of ${dispatch.bloodType} (${dispatch.component})`
    : '8 Units of O- (Packed Red Blood Cells)';
  const temp = dispatch?.telemetry?.temperatureCelsius
    ? `${dispatch.telemetry.temperatureCelsius.toFixed(1)}°C (Cold-Chain Verified)`
    : '3.8°C (Cold-Chain Verified)';

  const passText = `OFFICIAL DIGITAL GREEN CORRIDOR TRANSIT PASS
PASS ID: ${passNumber}
AUTHORITY: National Blood Transfusion Council (MoHFW) / Delhi-NCR Traffic Police
PRIORITY: CODE-3 BLUE-LIGHT EMERGENCY
SOURCE: ${sourceName}
DESTINATION: ${destName}
VEHICLE REGISTRATION: ${vehicle}
CARGO: ${cargo}
INTERNAL BIOMEDICAL TEMPERATURE: ${temp}
STATUS: AUTHORIZED - IMMEDIATE SIGNAL CLEARANCE`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#080e1e] border-2 border-emerald-500 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0e1f38] to-[#0a1528] border-b border-emerald-600/60 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
                  GOVERNMENT OF INDIA · MoHFW
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.2 rounded-full">
                  VERIFIED CODE-3
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Inter-Hospital Green Corridor Transit Authorization Pass
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Printable Body */}
        <div className="p-5 sm:p-6 space-y-4 bg-[#0a1224]">
          {/* Official Seal Banner */}
          <div className="border-2 border-dashed border-emerald-500/50 rounded-xl p-4 bg-[#060c18] relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                  Official Verification Pass Number
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-400 tracking-wider">
                  {passNumber}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/60 px-3 py-1 rounded-lg">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-200 uppercase font-mono">
                  Traffic Clearance Active
                </span>
              </div>
            </div>

            {/* Grid of Transit Info */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Source Dispensing Bank
                </span>
                <span className="font-bold text-white block mt-0.5">{sourceName}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Destination Receiving Trauma Center
                </span>
                <span className="font-bold text-rose-300 block mt-0.5">{destName}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Vehicle / Pilot Identifier
                </span>
                <span className="font-bold text-cyan-300 font-mono block mt-0.5">{vehicle}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Biological Cargo & Units
                </span>
                <span className="font-bold text-emerald-300 font-mono block mt-0.5">{cargo}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Internal Cold-Chain Temp
                </span>
                <span className="font-bold text-emerald-400 font-mono block mt-0.5">{temp}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Authorized Enforcement Authority
                </span>
                <span className="font-bold text-slate-200 block mt-0.5">
                  Delhi & UP Highway Traffic Control
                </span>
              </div>
            </div>

            {/* Simulated QR Code & Official Warning */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-slate-950 font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Scan at Toll Plazas / Traffic Checkpoints</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    SHA-256 HMAC Verified by e-RaktKosh NBTC Gateway
                  </span>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-emerald-400 font-bold">
                VALID 120 MINS FROM DISPATCH
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#050b18] border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pass Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Pass Credentials</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
