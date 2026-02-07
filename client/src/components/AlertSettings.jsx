import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, ShieldAlert, Save } from 'lucide-react';

const AlertSettings = () => {
  const [prefs, setPrefs] = useState({ minRiskScore: 50, notifyImminent: true, emailFrequency: 'daily' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      const { data } = await api.get('/alerts/preferences');
      setPrefs(data);
    };
    fetchPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/alerts/preferences', prefs);
      alert('Preferences updated successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
        <Bell className="text-accent-purple" /> Alert Configuration
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-gray-400 text-sm block mb-2">Minimum Risk Score for Alerts ({prefs.minRiskScore})</label>
          <input type="range" min="0" max="100" className="w-full accent-accent-purple" 
            value={prefs.minRiskScore} onChange={(e) => setPrefs({...prefs, minRiskScore: e.target.value})} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Notify on Imminent Approaches</span>
          <input type="checkbox" checked={prefs.notifyImminent} 
            onChange={(e) => setPrefs({...prefs, notifyImminent: e.target.checked})} />
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
          <Save className="w-4 h-4" /> {saving ? 'Updating...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default AlertSettings;