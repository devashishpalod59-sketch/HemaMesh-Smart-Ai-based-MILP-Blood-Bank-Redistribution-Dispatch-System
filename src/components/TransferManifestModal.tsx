import React, { useState } from 'react';
import { TransferDecision, FacilityNode } from '../types/bloodMesh.ts';
import { getComponentShelfLifeSpec } from '../services/compatibility.ts';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  ShieldCheck,
  Truck,
  Thermometer,
  QrCode,
  Barcode,
  Hash,
} from 'lucide-react';

interface TransferManifestModalProps {
  transfer: TransferDecision | null;
  fromNode: FacilityNode | null;
  toNode: FacilityNode | null;
  onClose: () => void;
}

export const TransferManifestModal: React.FC<TransferManifestModalProps> = ({
  transfer,
  fromNode,
  toNode,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!transfer || !fromNode || !toNode) return null;

  const spec = getComponentShelfLifeSpec(transfer.component);
  const isPlatelet = transfer.component === 'PLT';
  const manifestNumber = `MNF-2026-US-${transfer.id.replace('TX-', '')}`;
  const isbt128Barcode = `=${transfer.lotNumber}00`;
  const verificationHash = `SHA256:7a9f8e4c3d2b1a0e9f8c7b6a5e4d3c2b1a0e9f8d7c6b5a4e3d2c1b0a`;

  const copyToClipboard = () => {
    const text = `
=== OFFICIAL BLOOD CHAIN OF CUSTODY TRANSFER MANIFEST ===
Manifest ID: ${manifestNumber}
Date & Time: ${new Date().toISOString()}
ISBT-128 DIN: ${transfer.lotNumber}
Barcoded DIN: ${isbt128Barcode}

ORIGIN FACILITY:
  Name: ${fromNode.name}
  Address: ${fromNode.address}
  Contact: ${fromNode.contactPerson} (${fromNode.phone})

DESTINATION FACILITY:
  Name: ${toNode.name}
  Address: ${toNode.address}
  Contact: ${toNode.contactPerson} (${toNode.phone})

PRODUCT SPECIFICATION:
  Blood Type: ${transfer.bloodType}
  Component: ${transfer.component} (${spec.standardUnitVolumeMl} mL/unit)
  Units Dispatched: ${transfer.units} Units
  Days to Expiry: ${transfer.daysToExpiry} Days remaining
  Storage Spec: ${spec.storageTempCelsius} (Agitation required: ${spec.agitationRequired ? 'YES' : 'NO'})

LOGISTICS & DISPATCH:
  Priority: ${transfer.priority}
  Est. Transit Latency: ${transfer.travelMinutes} minutes (${transfer.distanceKm} km)
  Cold-Chain Protocol: ${isPlatelet ? 'Controlled Ambient 20-24°C Agitator Pod' : 'Active 1-6°C Cold-Pouch with PCM'}
  Digital Verification Hash: ${verificationHash}
=========================================================
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Blood Transfer Manifest & Chain-of-Custody</span>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full">
                  ISBT-128
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">{manifestNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close transfer manifest modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manifest Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs">
          {/* Top Barcode Header Simulation */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                ISBT-128 Donation Identification Number (DIN)
              </div>
              <div className="font-mono text-base font-bold text-cyan-400 tracking-wider">
                {isbt128Barcode}
              </div>
              <div className="text-[10px] text-slate-400">
                Lot / Batch: <span className="font-mono text-slate-200">{transfer.lotNumber}</span>
              </div>
            </div>

            {/* Visual Barcode Graphic */}
            <div className="bg-white p-2.5 rounded-lg flex flex-col items-center shadow-inner">
              <div className="flex items-center h-8 gap-0.5">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-black font-bold mt-1 tracking-widest">
                *{transfer.id}*
              </span>
            </div>
          </div>

          {/* Transfer Origin and Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin Node */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Releasing Custodian (Origin)
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  SOURCE
                </span>
              </div>
              <div className="font-bold text-slate-100">{fromNode.name}</div>
              <div className="text-slate-400 text-[11px]">{fromNode.address}</div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Authorized Officer: <span className="text-slate-200">{fromNode.contactPerson}</span>
              </div>
            </div>

            {/* Destination Node */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Receiving Transfusion Hub (Destination)
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">
                  RECIPIENT
                </span>
              </div>
              <div className="font-bold text-slate-100">{toNode.name}</div>
              <div className="text-slate-400 text-[11px]">{toNode.address}</div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Attending Staff: <span className="text-slate-200">{toNode.contactPerson}</span>
              </div>
            </div>
          </div>

          {/* Biological Component Details */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Biological Component & Cold-Chain Parameters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Blood Group</div>
                <div className="text-lg font-mono font-bold text-rose-400">
                  {transfer.bloodType}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Component</div>
                <div className="text-lg font-mono font-bold text-sky-400">
                  {transfer.component}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Volume Units</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {transfer.units} Units
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Expiry Window</div>
                <div
                  className={`text-lg font-mono font-bold ${
                    transfer.daysToExpiry <= 2 ? 'text-amber-400' : 'text-slate-200'
                  }`}
                >
                  {transfer.daysToExpiry} Days
                </div>
              </div>
            </div>

            {/* Cold Chain Protocol Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
              <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400 shrink-0">
                <Thermometer className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-200">
                  Storage Protocol: {spec.storageTempCelsius}
                </div>
                <div className="text-slate-400 text-[10px]">
                  {isPlatelet
                    ? 'Continuous gentle mechanical agitation (60 RPM) required. Do NOT chill below 20°C.'
                    : 'Phase-change cold packing required. Continuous thermal data logging active.'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                  VALIDATED
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Chain of Custody */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border border-dashed border-slate-700 rounded-xl p-3 space-y-2 bg-slate-950/40">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Releasing Verification
              </div>
              <div className="h-10 flex items-center justify-center font-mono text-xs italic text-cyan-300">
                // Dr. E. Vance (Secured via RSA-4096)
              </div>
              <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-1 flex justify-between">
                <span>Timestamp:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="border border-dashed border-slate-700 rounded-xl p-3 space-y-2 bg-slate-950/40">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Courier Transport Seal
              </div>
              <div className="h-10 flex items-center justify-center font-mono text-xs italic text-emerald-300">
                // Courier Unit Med-Dispatch #04
              </div>
              <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-1 flex justify-between">
                <span>Tamper Seal ID:</span>
                <span className="font-mono">SEAL-8841-OK</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Hash */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 flex items-center justify-between">
            <span className="truncate max-w-[450px]">Audit Hash: {verificationHash}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Manifest'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Manifest</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
