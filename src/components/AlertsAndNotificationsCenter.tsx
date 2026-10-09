import React, { useState } from 'react';
import {
  SystemAlert,
  AlertCategory,
  FacilityNode,
  ActiveDispatch,
  RoadClosureIncident,
} from '../types/bloodMesh.ts';
import {
  Bell,
  AlertTriangle,
  Clock,
  Thermometer,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  ExternalLink,
  Radio,
  Flame,
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
} from 'lucide-react';
import { alertSoundService } from '../services/alertSoundService.ts';

interface AlertsAndNotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SystemAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
  onActionTrigger: (alert: SystemAlert) => void;
  onSimulateSurgeAlert: () => void;
  roadClosuresCount?: number;
  activeDelaysCount?: number;
}

export const AlertsAndNotificationsCenter: React.FC<AlertsAndNotificationsCenterProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onActionTrigger,
  onSimulateSurgeAlert,
  roadClosuresCount = 0,
  activeDelaysCount = 0,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'ALL'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(alertSoundService.isSoundEnabled());

  if (!isOpen) return null;

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    alertSoundService.setSoundEnabled(nextState);
    if (nextState) {
      alertSoundService.playWarningChime();
    }
  };

  const filteredAlerts = alerts.filter(
    (a) => selectedCategory === 'ALL' || a.category === selectedCategory
  );

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'SHORTAGE':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'EXPIRY':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'COLD_CHAIN':
        return <Thermometer className="w-4 h-4 text-cyan-400" />;
      case 'ROAD_CLOSURE':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'SHIPMENT_DELAY':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'TRANSFER':
        return <ArrowRight className="w-4 h-4 text-emerald-400" />;
      case 'DIGITAL_TWIN':
      default:
        return <Zap className="w-4 h-4 text-purple-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL_RED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
            CRITICAL STAT
          </span>
        );
      case 'WARNING_AMBER':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
            ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#080e1e] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-[#150a18] via-[#0b1224] to-[#091a2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Central Alerts &amp; Notifications Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-600 text-white">
                  {unreadCount} UNREAD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Sentinel: Shortages · Perishable Expiry · Cold Chain · Road Closures · Delays
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                soundEnabled
                  ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Emergency Chime Sound Enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline font-mono">{soundEnabled ? 'CHIME ON' : 'MUTED'}</span>
            </button>

            {/* Test Simulation */}
            <button
              onClick={onSimulateSurgeAlert}
              className="hidden md:flex items-center gap-1.5 text-xs bg-purple-950/70 hover:bg-purple-900 border border-purple-700/60 text-purple-300 px-3 py-1.5 rounded-xl font-bold transition shadow"
              title="Inject test telemetry surge alert"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulate Surge</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Close Alerts Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Strip */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(
              [
                { key: 'ALL', label: 'All Alerts', count: alerts.length },
                { key: 'SHORTAGE', label: 'Shortages', count: alerts.filter((a) => a.category === 'SHORTAGE').length },
                { key: 'EXPIRY', label: 'Perishable Expiry', count: alerts.filter((a) => a.category === 'EXPIRY').length },
                { key: 'COLD_CHAIN', label: 'Cold Chain', count: alerts.filter((a) => a.category === 'COLD_CHAIN').length },
                { key: 'ROAD_CLOSURE', label: 'Road Closures', count: roadClosuresCount },
                { key: 'SHIPMENT_DELAY', label: 'Delays', count: activeDelaysCount },
                { key: 'DIGITAL_TWIN', label: 'Digital Twin', count: alerts.filter((a) => a.category === 'DIGITAL_TWIN').length },
              ] as const
            ).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as any)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.key
                    ? 'bg-[#ff0055] text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAcknowledgeAll}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge All</span>
            </button>
          </div>
        </div>

        {/* Alerts Content Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/50" />
              <p className="font-bold text-sm text-slate-400">All Systems Nominal in Selected Filter</p>
              <p className="text-xs text-slate-500">
                No active critical excursions or unhandled shortage triggers.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.acknowledged
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : alert.severity === 'CRITICAL_RED'
                    ? 'bg-rose-950/30 border-rose-800/80 shadow-lg shadow-rose-950/30'
                    : alert.severity === 'WARNING_AMBER'
                    ? 'bg-amber-950/30 border-amber-800/80'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(alert.category)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{alert.title}</span>
                        {getSeverityBadge(alert.severity)}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    {alert.actionLabel && (
                      <button
                        onClick={() => onActionTrigger(alert)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#ff0055] to-rose-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md active:scale-95 transition"
                      >
                        <span>{alert.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
                        title="Mark as acknowledged"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <strong className="text-white">Active Grid Sentinel:</strong> e-RaktKosh 24/7 Automated Transfusion Bridge
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition"
          >
            Dismiss View
          </button>
        </div>
      </div>
    </div>
  );
};
