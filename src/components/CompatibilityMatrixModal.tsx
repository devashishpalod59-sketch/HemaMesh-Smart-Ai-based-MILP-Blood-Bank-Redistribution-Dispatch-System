import React, { useState } from 'react';
import { BloodComponent, BloodType } from '../types/bloodMesh.ts';
import { isBloodCompatible, getComponentShelfLifeSpec } from '../services/compatibility.ts';
import { X, CheckCircle2, XCircle, Info, Thermometer, ShieldAlert, Clock } from 'lucide-react';

interface CompatibilityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityMatrixModal: React.FC<CompatibilityMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedComp, setSelectedComp] = useState<BloodComponent>('PRBC');

  if (!isOpen) return null;

  const spec = getComponentShelfLifeSpec(selectedComp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Multi-Tier Transfusion Compatibility & Shelf-Life Matrix
              </h2>
              <p className="text-xs text-slate-400">
                AABB / ISBT Clinical Transfusion Protocols & Storage Physics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close compatibility matrix modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Component Selector Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          {(['PRBC', 'PLT', 'FFP', 'CRYO', 'WB'] as const).map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedComp(comp)}
              className={`px-3 py-2 font-bold rounded-t-lg transition border-b-2 ${
                selectedComp === comp
                  ? 'bg-slate-900 text-rose-400 border-rose-500'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              {comp === 'PRBC'
                ? 'Packed Red Cells (PRBC)'
                : comp === 'PLT'
                ? 'Platelets (5-Day Perishable)'
                : comp === 'FFP'
                ? 'Plasma (FFP)'
                : comp === 'CRYO'
                ? 'Cryoprecipitate'
                : 'Whole Blood (WB)'}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200 text-xs">
          {/* Storage & Decay Protocol Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Storage Temp</div>
                <div className="font-mono font-bold text-cyan-300">{spec.storageTempCelsius}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Nominal Shelf Life</div>
                <div className="font-mono font-bold text-rose-300">
                  {spec.nominalShelfLifeDays} Days
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Critical Decay Horizon</div>
                <div className="font-mono font-bold text-amber-300">
                  &lt; {spec.criticalDecayThresholdDays} Days Remaining
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Grid Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-200">
                Compatibility Cross-Match Table (Rows: Recipient / Columns: Donor)
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compatible
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <XCircle className="w-3.5 h-3.5" /> Incompatible
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-[11px] font-mono font-bold text-slate-400">
                    <th className="p-2 text-left text-slate-300">Recipient \ Donor</th>
                    {ALL_BLOOD_TYPES.map((bt) => (
                      <th key={bt} className="p-2 border-l border-slate-800 text-rose-400">
                        {bt}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-mono">
                  {ALL_BLOOD_TYPES.map((recip) => (
                    <tr key={recip} className="hover:bg-slate-800/30">
                      <td className="p-2 text-left font-bold text-slate-200 bg-slate-900/40">
                        {recip}
                      </td>
                      {ALL_BLOOD_TYPES.map((donor) => {
                        const compatible = isBloodCompatible(donor, recip, selectedComp);
                        const isExact = donor === recip;

                        return (
                          <td
                            key={donor}
                            className={`p-2 border-l border-slate-800/80 ${
                              isExact
                                ? 'bg-cyan-950/30'
                                : compatible
                                ? 'bg-emerald-950/20'
                                : 'bg-slate-950/40'
                            }`}
                          >
                            {compatible ? (
                              <span className="inline-flex items-center justify-center text-emerald-400">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center text-slate-700">
                                –
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Insights */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1 text-slate-300">
            <div className="font-bold text-slate-200">Clinical Protocol Notes:</div>
            {selectedComp === 'PRBC' && (
              <p>
                • <strong>O Negative</strong> red blood cells contain neither A nor B surface antigens and lack Rh(D), making them universal for emergency trauma uncrossmatched release when patient typing is pending.
              </p>
            )}
            {selectedComp === 'PLT' && (
              <p>
                • <strong>Platelets have an ultra-perishable 5-day shelf life</strong> and must be stored at 20-24°C with continuous mechanical agitation to prevent aggregation. The MILP engine actively identifies units in low-turnover community clinics with ≤2 days remaining and redistributes them to metro trauma hubs before spoilage.
              </p>
            )}
            {selectedComp === 'FFP' && (
              <p>
                • <strong>AB Plasma is universal donor plasma</strong> because it contains neither anti-A nor anti-B isohemagglutinins. Note the inverse rule: AB is universal for plasma, while O is universal for red cells.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
