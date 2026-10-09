import React, { useState, useMemo } from 'react';
import { BloodType, VoluntaryDonor } from '../types/bloodMesh.ts';
import { getNearbyEligibleDonors } from '../services/donorRegistry.ts';
import {
  X,
  HeartHandshake,
  ShieldCheck,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Send,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DonorBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords: { lat: number; lng: number };
  bloodGroup: BloodType;
  requiredUnits: number;
  nearestHospitalName?: string;
}

export const DonorBeaconModal: React.FC<DonorBeaconModalProps> = ({
  isOpen,
  onClose,
  userCoords,
  bloodGroup,
  requiredUnits,
  nearestHospitalName = 'AIIMS Apex Trauma Center',
}) => {
  const [exactMatchOnly, setExactMatchOnly] = useState(false);
  const [pingedDonors, setPingedDonors] = useState<Record<string, boolean>>({});
  const [broadcastSent, setBroadcastSent] = useState(false);

  const donors = useMemo(() => {
    return getNearbyEligibleDonors(userCoords, bloodGroup, !exactMatchOnly, 40);
  }, [userCoords, bloodGroup, exactMatchOnly]);

  if (!isOpen) return null;

  const handlePingDonor = (donor: VoluntaryDonor) => {
    setPingedDonors((prev) => ({ ...prev, [donor.id]: true }));

    const text = encodeURIComponent(
      `🚨 *URGENT e-RaktKosh DONOR BEACON ALERT*\n` +
      `Hello ${donor.fullName}, your blood group ${donor.bloodType} is urgently needed for a Code-Red emergency at ${nearestHospitalName} (~${donor.distanceKm.toFixed(1)} km from your verified location).\n` +
      `Required: ${requiredUnits} Units.\n` +
      `If you are available to donate, please confirm immediately by replying YES or call our ER hotline: 104 / +91-11-26588500.\n` +
      `(e-RaktKosh NBTC Jeevan-Setu Voluntary Network)`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleBroadcastAll = () => {
    setBroadcastSent(true);
    const updated: Record<string, boolean> = {};
    donors.forEach((d) => {
      updated[d.id] = true;
    });
    setPingedDonors(updated);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#070e1e] border-2 border-rose-600/70 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-rose-950 via-[#131b31] to-[#0c1427] border-b border-rose-900/60 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
              <HeartHandshake className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Jeevan-Setu Voluntary Blood Donor Beacon
                </h2>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  LIVE NBTC
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pre-Screened Voluntary Donors Geofenced around your Trauma Bay for Blood Group{' '}
                <strong className="text-rose-400">{bloodGroup}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-[#0a1224] border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filter Scope:</span>
            <button
              onClick={() => setExactMatchOnly(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                !exactMatchOnly
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Exact & Compatible ({bloodGroup})
            </button>
            <button
              onClick={() => setExactMatchOnly(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                exactMatchOnly
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Strict {bloodGroup} Only
            </button>
          </div>

          <button
            onClick={handleBroadcastAll}
            disabled={broadcastSent || donors.length === 0}
            className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold px-4 py-2 rounded-xl transition shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {broadcastSent
                ? 'Emergency Beacon Fired to All!'
                : `Broadcast Distress to All (${donors.length}) Donors`}
            </span>
          </button>
        </div>

        {/* Donors List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {donors.length > 0 ? (
            donors.map((donor) => {
              const isPinged = pingedDonors[donor.id];

              return (
                <div
                  key={donor.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPinged
                      ? 'bg-emerald-950/20 border-emerald-500/60'
                      : 'bg-[#0a1428] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white">{donor.fullName}</span>
                        <span className="bg-rose-600 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                          {donor.bloodType} {donor.isExactMatch ? '• EXACT' : '• COMPATIBLE'}
                        </span>
                        <span className="bg-amber-950 text-amber-300 border border-amber-600/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{donor.donorBadge.replace('_', ' ')}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                          {donor.totalDonations} Past Donations
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {donor.distanceKm.toFixed(1)} km away • {donor.cityArea}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Last Donated: {donor.lastDonationDaysAgo} days ago (Eligible)</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ID: {donor.raktKoshId}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${donor.phoneRaw}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => handlePingDonor(donor)}
                        className={`text-xs font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow ${
                          isPinged
                            ? 'bg-emerald-700 text-white'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {isPinged ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Pinged!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Ping via WhatsApp</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-slate-400">
                No verified voluntary donors found within 40 km for group {bloodGroup}.
              </p>
              <p className="text-xs text-slate-500">
                Switch filter to 'Exact & Compatible' or trigger the MILP linear solver to rebalance hospital inventories.
              </p>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3.5 bg-[#050b18] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All donors are verified against NBTC National Transfusion Registry guidelines.</span>
          </div>
          <span className="font-mono text-slate-500">MoHFW Govt. of India e-RaktKosh</span>
        </div>
      </div>
    </div>
  );
};
