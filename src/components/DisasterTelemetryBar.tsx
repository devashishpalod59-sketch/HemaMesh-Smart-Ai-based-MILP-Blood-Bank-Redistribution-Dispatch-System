import React, { useState } from 'react';
import { DisasterTelemetryEvent } from '../types/bloodMesh.ts';
import {
  Radio,
  Flame,
  AlertCircle,
  Play,
  Volume2,
  VolumeX,
  RefreshCw,
  Bell,
  Activity,
  Zap,
} from 'lucide-react';

interface DisasterTelemetryBarProps {
  currentEvent: DisasterTelemetryEvent | null;
  isConnected: boolean;
  onToggleConnection: () => void;
  onTriggerScenario: (type: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS') => void;
}

export const DisasterTelemetryBar: React.FC<DisasterTelemetryBarProps> = ({
  currentEvent,
  isConnected,
  onToggleConnection,
  onTriggerScenario,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play subtle clinical telemetry chime using Web Audio API
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleTrigger = (type: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS') => {
    playAlertChime();
    onTriggerScenario(type);
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none shadow-md z-30">
      {/* WebSocket Status Indicator & Alert */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={onToggleConnection}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-500 transition shrink-0"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="font-mono text-[11px] font-bold text-slate-300">
            {isConnected ? 'LIVE TELEMETRY STREAM' : 'STREAM PAUSED'}
          </span>
        </button>

        {/* Live Event Ticker */}
        {currentEvent ? (
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                currentEvent.severity === 'LEVEL_1_CATASTROPHIC'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {currentEvent.incidentType.replace(/_/g, ' ')}
            </span>
            <span className="font-medium text-slate-200 truncate">
              {currentEvent.headline} ({currentEvent.locationName})
            </span>
            <span className="text-slate-400 font-mono text-[11px] shrink-0">
              [{currentEvent.timestamp}]
            </span>
          </div>
        ) : (
          <div className="text-slate-400 text-xs flex items-center gap-1.5 truncate">
            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Regional telemetry nominal: Monitoring trauma intake corridors.</span>
          </div>
        )}
      </div>

      {/* Emergency Surge Simulation Triggers */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-end">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Inject Surge:
        </span>

        <button
          onClick={() => handleTrigger('FREEWAY_MCI')}
          className="px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1"
        >
          <Flame className="w-3 h-3 text-rose-400" />
          <span>I-95 Multi-Collision (14 Casualties)</span>
        </button>

        <button
          onClick={() => handleTrigger('EXPLOSION_MCI')}
          className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-800/80 text-amber-200 text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>Refinery Blast (22 Casualties)</span>
        </button>

        <button
          onClick={() => handleTrigger('OB_HEMORRHAGE')}
          className="px-2 py-1 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-800/80 text-purple-200 text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1"
        >
          <Activity className="w-3 h-3 text-purple-400" />
          <span>OB Hemorrhage (PPH / DIC)</span>
        </button>

        <button
          onClick={() => handleTrigger('PLATELET_EXPIRY_CRISIS')}
          className="px-2 py-1 rounded bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-200 text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1"
        >
          <span>5-Day Platelet Expiry Alarm</span>
        </button>

        {/* Audio Mute toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? 'Mute audio alert chime' : 'Enable audio alert chime'}
          className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition shrink-0 ml-1"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
