import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, PieChart as PieChartIcon, 
  BarChart3, Layers, Sliders, Cpu, Database, Copy, Check, Filter, 
  ArrowUpRight, ArrowDownRight, AlertTriangle, Play, RefreshCw, Download, 
  Zap, ChevronRight, HelpCircle, UserCheck, ShieldCheck, Sparkles, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis, Cell, LineChart, Line, ComposedChart
} from 'recharts';

// --- INITIAL SYNTHETIC DATA & CONSTANTS ---
const INITIAL_CHANNELS = [
  { id: 'search', name: 'Paid Search (PPC)', currentSpend: 150000, roas: 3.2, cac: 45, ltv: 220, conversions: 3333, efficiencyScore: 88, status: 'Scale' },
  { id: 'social', name: 'Paid Social (Meta/LinkedIn)', currentSpend: 130000, roas: 2.1, cac: 78, ltv: 195, conversions: 1666, efficiencyScore: 65, status: 'Optimize' },
  { id: 'influencer', name: 'Influencer & Creators', currentSpend: 75000, roas: 2.8, cac: 52, ltv: 210, conversions: 1442, efficiencyScore: 81, status: 'Scale' },
  { id: 'email', name: 'Email & CRM Lifecycle', currentSpend: 45000, roas: 5.4, cac: 18, ltv: 240, conversions: 2500, efficiencyScore: 96, status: 'Max Capacity' },
  { id: 'display', name: 'Programmatic Display', currentSpend: 100000, roas: 0.9, cac: 142, ltv: 160, conversions: 704, efficiencyScore: 32, status: 'Cut Heavy' }
];

const ATTRIBUTION_COMPARISON = [
  { channel: 'Paid Search', firstTouch: 160000, lastTouch: 185000, dataDriven: 210000 },
  { channel: 'Paid Social', firstTouch: 140000, lastTouch: 110000, dataDriven: 135000 },
  { channel: 'Influencer', firstTouch: 95000, lastTouch: 60000, dataDriven: 88000 },
  { channel: 'Email/CRM', firstTouch: 30000, lastTouch: 95000, dataDriven: 72000 },
  { channel: 'Display Ads', firstTouch: 75000, lastTouch: 50000, dataDriven: 25000 }
];

const HISTORICAL_TRENDS = [
  { month: 'Jan', spend: 420000, revenue: 840000, roas: 2.0, cac: 68 },
  { month: 'Feb', spend: 440000, revenue: 890000, roas: 2.02, cac: 66 },
  { month: 'Mar', spend: 460000, revenue: 910000, roas: 1.97, cac: 70 },
  { month: 'Apr', spend: 480000, revenue: 940000, roas: 1.95, cac: 72 },
  { month: 'May', spend: 490000, revenue: 930000, roas: 1.89, cac: 75 },
  { month: 'Jun (Current)', spend: 500000, revenue: 945000, roas: 1.89, cac: 77 },
  { month: 'Jul (AI Proj)', spend: 500000, revenue: 1320000, roas: 2.64, cac: 54 },
  { month: 'Aug (AI Proj)', spend: 500000, revenue: 1450000, roas: 2.90, cac: 49 },
  { month: 'Sep (AI Proj)', spend: 500000, revenue: 1600000, roas: 3.20, cac: 44 },
];

const RAW_CAMPAIGNS = [
  { id: 'CMP-8091', channel: 'Paid Search', campaign: 'Google_NonBrand_HighIntent', spend: 65000, roas: 3.8, cac: 42, ltv: 240, status: 'Profitable', region: 'North America', tier: 'Enterprise' },
  { id: 'CMP-8092', channel: 'Paid Search', campaign: 'Google_Brand_Defense', spend: 35000, roas: 6.2, cac: 15, ltv: 260, status: 'Highly Profitable', region: 'Global', tier: 'All' },
  { id: 'CMP-8093', channel: 'Paid Social', campaign: 'Meta_Lookalike_1percent', spend: 50000, roas: 2.4, cac: 62, ltv: 190, status: 'Profitable', region: 'North America', tier: 'SMB' },
  { id: 'CMP-8094', channel: 'Paid Social', campaign: 'LinkedIn_Retargeting_V2', spend: 45000, roas: 1.5, cac: 110, ltv: 210, status: 'Unprofitable', region: 'Europe', tier: 'Enterprise' },
  { id: 'CMP-8095', channel: 'Display', campaign: 'Programmatic_Banner_Broad', spend: 60000, roas: 0.6, cac: 185, ltv: 140, status: 'Critical Drain', region: 'Global', tier: 'B2C' },
  { id: 'CMP-8096', channel: 'Display', campaign: 'Retargeting_Native_Content', spend: 40000, roas: 1.35, cac: 92, ltv: 170, status: 'Unprofitable', region: 'North America', tier: 'SMB' },
  { id: 'CMP-8097', channel: 'Influencer', campaign: 'YouTube_Tech_Reviewers', spend: 45000, roas: 3.4, cac: 44, ltv: 230, status: 'Highly Profitable', region: 'North America', tier: 'SMB' },
  { id: 'CMP-8098', channel: 'Influencer', campaign: 'Newsletter_Sponsorships', spend: 30000, roas: 2.1, cac: 64, ltv: 195, status: 'Profitable', region: 'Europe', tier: 'Enterprise' },
  { id: 'CMP-8099', channel: 'Email', campaign: 'Automated_Drip_Onboarding', spend: 20000, roas: 8.5, cac: 12, ltv: 280, status: 'Highly Profitable', region: 'Global', tier: 'All' },
  { id: 'CMP-8100', channel: 'Email', campaign: 'Winback_Inactive_30Days', spend: 25000, roas: 4.2, cac: 24, ltv: 210, status: 'Highly Profitable', region: 'Global', tier: 'All' }
];

const INITIAL_RECOMMENDATIONS = [
  {
    id: 'REC-101',
    severity: 'high',
    title: 'Slash Programmatic Display Budget by $65,000',
    description: 'Data-driven attribution reveals Display ads have an actual marginal ROAS of only 0.4x with a high CAC ($142). Reallocate capital to higher velocity channels.',
    impact: '+$115,000 Revenue / -$18 Blended CAC',
    action: 'reduce_display',
    applied: false
  },
  {
    id: 'REC-102',
    severity: 'medium',
    title: 'Scale Paid Search High-Intent Keywords by 40%',
    description: 'Paid Search is operating near peak marginal return (3.2x ROAS). Search volume queries indicate headroom for $45,000 additional spend in US/EU markets.',
    impact: '+$144,000 Revenue',
    action: 'scale_search',
    applied: false
  },
  {
    id: 'REC-103',
    severity: 'medium',
    title: 'Double Email Lifecycle & Retargeting Infrastructure',
    description: 'Email lifecycle exhibits an astounding 5.4x ROAS and $18 CAC. Allocate $20,000 extra budget towards dynamic personalized win-back workflows.',
    impact: '+$108,000 Revenue / +28% LTV Retention',
    action: 'scale_email',
    applied: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Interactive Simulation State
  const [channelBudgets, setChannelBudgets] = useState(() => {
    const init = {};
    INITIAL_CHANNELS.forEach(c => { init[c.id] = c.currentSpend; });
    return init;
  });

  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');

  // Calculations derived from current channel budget state
  const totalBudget = useMemo(() => {
    return Object.values(channelBudgets).reduce((a, b) => a + b, 0);
  }, [channelBudgets]);

  const simulationResults = useMemo(() => {
    let projectedRev = 0;
    let totalConversions = 0;

    INITIAL_CHANNELS.forEach(ch => {
      const spend = channelBudgets[ch.id];
      // Diminishing returns calculation (Logarithmic scaling curve)
      const ratio = spend / ch.currentSpend;
      const efficiencyMultiplier = Math.pow(ratio, -0.25); // Marginal return drops as spend balloons
      const effectiveRoas = ch.roas * Math.max(0.4, efficiencyMultiplier);
      
      const rev = spend * effectiveRoas;
      const convs = Math.round(rev / (ch.ltv * 0.8));
      
      projectedRev += rev;
      totalConversions += convs;
    });

    const baselineSpend = 500000;
    const baselineRev = 945000;
    const baselineRoas = 1.89;

    const projectedRoas = projectedRev / totalBudget;
    const projectedCac = Math.round(totalBudget / (totalConversions || 1));
    const profit = projectedRev - totalBudget;
    const netProfitChange = profit - (baselineRev - baselineSpend);

    return {
      projectedRev,
      projectedRoas,
      projectedCac,
      profit,
      netProfitChange,
      totalConversions
    };
  }, [channelBudgets, totalBudget]);

  const handleBudgetChange = (id, newVal) => {
    setChannelBudgets(prev => ({
      ...prev,
      [id]: Number(newVal)
    }));
  };

  const applyRecommendation = (recId, action) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, applied: true } : r));
    
    setChannelBudgets(prev => {
      const next = { ...prev };
      if (action === 'reduce_display') {
        next.display = Math.max(15000, next.display - 65000);
        next.search += 45000;
        next.email += 20000;
      } else if (action === 'scale_search') {
        next.search += 40000;
      } else if (action === 'scale_email') {
        next.email += 20000;
      }
      return next;
    });
  };

  const resetBudgets = () => {
    const init = {};
    INITIAL_CHANNELS.forEach(c => { init[c.id] = c.currentSpend; });
    setChannelBudgets(init);
    setRecommendations(INITIAL_RECOMMENDATIONS);
  };

  const copyAntiGravityPrompt = () => {
    const promptText = document.getElementById('antigravity-prompt-code')?.innerText || '';
    navigator.clipboard.writeText(promptText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const filteredCampaigns = useMemo(() => {
    return RAW_CAMPAIGNS.filter(item => {
      const matchesSearch = item.campaign.toLowerCase().includes(searchFilter.toLowerCase()) || 
                            item.channel.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesSegment = selectedSegment === 'All' || item.tier === selectedSegment || item.tier === 'All';
      return matchesSearch && matchesSegment;
    });
  }, [searchFilter, selectedSegment]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* --- TOP NAV HEADER --- */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight text-white flex items-center gap-2">
              OptiMarketing AI <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v2.4 Agentic Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Marketing Budget Optimization & Multi-Touch Attribution Suite</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Model: Attribution Multi-Touch Engine v4</span>
          </div>
          <button 
            onClick={resetBudgets}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800/80 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 hidden md:block">
            Analytics Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
              activeTab === 'overview' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Executive Overview
          </button>

          <button
            onClick={() => setActiveTab('attribution')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
              activeTab === 'attribution' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Attribution & Channels
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
              activeTab === 'simulator' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            AI Budget Reallocator
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
              activeTab === 'dataset' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Synthetic Campaign Data
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 mt-4 hidden md:block">
            AI & Automation
          </div>

          <button
            onClick={() => setActiveTab('antigravity')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left ${
              activeTab === 'antigravity' 
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            Anti-Gravity Prompt & Docs
          </button>

          {/* Quick AI Agent Status Card */}
          <div className="mt-auto hidden md:block bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">AI Optimization Status</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Identified <span className="text-amber-400 font-bold">$125,000</span> inefficient spend in Programmatic Display.
            </p>
          </div>
        </aside>

        {/* --- CONTENT CONTAINER --- */}
        <main className="flex-1 bg-slate-950 p-4 md:p-8 overflow-y-auto">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Context Explanation banner for Data Analyst */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <TrendingUp className="w-48 h-48 text-indigo-400" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
                    <Target className="w-4 h-4" /> Senior Data Analyst Intelligence Briefing
                  </div>
                  <h2 className="text-xl font-extrabold text-white">Marketing Capital Efficiency & ROAS Diagnostic</h2>
                  <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                    Management currently lacks granular visibility into multi-touch attribution, causing <strong>$125k+</strong> to be spent on low-converting channels like Programmatic Display. This dashboard leverages an ML-driven multi-touch attribution model to project net revenue boosts by reallocating budget toward non-linear conversion paths.
                  </p>
                </div>
              </div>

              {/* Top Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start text-slate-400 text-xs mb-1">
                    <span>Total Monthly Budget</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">${totalBudget.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Baseline: $500,000</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start text-slate-400 text-xs mb-1">
                    <span>Projected Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    ${Math.round(simulationResults.projectedRev).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +${Math.round(simulationResults.projectedRev - 945000).toLocaleString()} vs Baseline
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start text-slate-400 text-xs mb-1">
                    <span>Blended ROAS</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {simulationResults.projectedRoas.toFixed(2)}x
                  </div>
                  <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                    <span>Baseline: 1.89x ROAS</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start text-slate-400 text-xs mb-1">
                    <span>Inefficient Spend Flagged</span>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400">$125,000</div>
                  <div className="text-[11px] text-rose-300/80 mt-1">25% of total budget wasted</div>
                </div>
              </div>

              {/* Main Visual Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue & Spend Trajectory */}
                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Revenue & Spend Trajectory (Historical vs AI Optimization)</h3>
                      <p className="text-xs text-slate-400">Projected impact after deploying AI Budget Reallocation</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={HISTORICAL_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                          formatter={(val) => [`$${val.toLocaleString()}`, '']}
                        />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                        <Area type="monotone" dataKey="spend" name="Ad Spend" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Recommendation Stream Feed */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      AI Optimization Feed
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                      Live Suggestions
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1 max-h-[260px] pr-1">
                    {recommendations.map((rec) => (
                      <div 
                        key={rec.id}
                        className={`p-3 rounded-lg border text-xs transition ${
                          rec.applied 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400' 
                            : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-slate-200">{rec.title}</h4>
                          {rec.applied ? (
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3" /> Applied
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium shrink-0">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{rec.description}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                          <span className="text-[11px] text-emerald-400 font-semibold">{rec.impact}</span>
                          {!rec.applied && (
                            <button
                              onClick={() => applyRecommendation(rec.id, rec.action)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded font-bold text-[10px] transition"
                            >
                              Apply Shift
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Channel Efficiency Table Quick View */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-100 mb-3">Channel Efficiency & Profitability Diagnosis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Current Budget</th>
                        <th className="p-3">Blended ROAS</th>
                        <th className="p-3">CAC ($)</th>
                        <th className="p-3">LTV ($)</th>
                        <th className="p-3">LTV : CAC Ratio</th>
                        <th className="p-3">AI Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {INITIAL_CHANNELS.map((ch) => {
                        const ltvCacRatio = (ch.ltv / ch.cac).toFixed(1);
                        return (
                          <tr key={ch.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3 font-semibold text-white">{ch.name}</td>
                            <td className="p-3">${ch.currentSpend.toLocaleString()}</td>
                            <td className="p-3 font-semibold text-emerald-400">{ch.roas}x</td>
                            <td className="p-3">${ch.cac}</td>
                            <td className="p-3">${ch.ltv}</td>
                            <td className="p-3 font-bold">
                              <span className={ltvCacRatio >= 4 ? 'text-emerald-400' : ltvCacRatio < 2 ? 'text-rose-400' : 'text-slate-200'}>
                                {ltvCacRatio}x
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ch.status === 'Scale' || ch.status === 'Max Capacity' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : ch.status === 'Cut Heavy' 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {ch.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ATTRIBUTION & CHANNEL PERFORMANCE */}
          {activeTab === 'attribution' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <h2 className="text-base font-bold text-white mb-1">Attribution Model Discrepancy Breakdown</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Single-touch models (First/Last) mask channel interaction pathways. Data-Driven Attribution reveals Programmatic Display is severely over-credited in traditional models.
                </p>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ATTRIBUTION_COMPARISON} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="channel" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Attributed Revenue']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="firstTouch" name="First-Touch Model" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lastTouch" name="Last-Touch Model" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dataDriven" name="AI Data-Driven Model" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Channel ROAS vs CAC Scatter/Bar Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">ROAS vs. CAC Matrix</h3>
                  <p className="text-xs text-slate-400 mb-4">Optimal quadrant: High ROAS, Low CAC (Top-Left)</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" dataKey="cac" name="CAC" unit="$" stroke="#64748b" fontSize={11} domain={[0, 160]} />
                        <YAxis type="number" dataKey="roas" name="ROAS" unit="x" stroke="#64748b" fontSize={11} domain={[0, 6]} />
                        <ZAxis type="number" dataKey="currentSpend" range={[100, 500]} name="Spend" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                          formatter={(value, name) => [name === 'CAC' ? `$${value}` : `${value}x`, name]}
                        />
                        <Scatter name="Channels" data={INITIAL_CHANNELS} fill="#10b981">
                          {INITIAL_CHANNELS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.roas < 1.0 ? '#f43f5e' : entry.roas > 3.0 ? '#10b981' : '#f59e0b'} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Attribution Insights & Insights for Data Analyst</h3>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Programmatic Display Over-Valuation:</strong> First-touch attributes $75k revenue to display ads, but Data-Driven attribution shows it only influences <strong>$25k</strong> in actual pipeline revenue.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Email Lifecycle Efficiency:</strong> Email has a massive 5.4x ROAS with an ultra-low CAC ($18). Scaling budget here yields high margin incremental revenue.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                        <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Paid Search High Intent:</strong> Paid Search is the strongest bottom-funnel converter. Moving Display dollars here yields maximum incremental profit.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI BUDGET REALLOCATOR (INTERACTIVE SIMULATOR) */}
          {activeTab === 'simulator' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-400" />
                      Interactive Budget Reallocation Scenario Engine
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Drag sliders to adjust spend per channel. The simulation computes logarithmic diminishing returns in real time.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={resetBudgets}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-lg transition"
                    >
                      Reset to Baseline
                    </button>
                  </div>
                </div>

                {/* Live Simulation Metric Header Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 mb-8">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Budget</span>
                    <div className="text-xl font-black text-white">${totalBudget.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Projected Revenue</span>
                    <div className="text-xl font-black text-emerald-400">${Math.round(simulationResults.projectedRev).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Projected ROAS</span>
                    <div className="text-xl font-black text-amber-400">{simulationResults.projectedRoas.toFixed(2)}x</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Profit Change</span>
                    <div className={`text-xl font-black ${simulationResults.netProfitChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {simulationResults.netProfitChange >= 0 ? '+' : ''}${Math.round(simulationResults.netProfitChange).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Channel Sliders */}
                <div className="space-y-6">
                  {INITIAL_CHANNELS.map((ch) => {
                    const currentVal = channelBudgets[ch.id];
                    const diff = currentVal - ch.currentSpend;
                    return (
                      <div key={ch.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-sm text-white">{ch.name}</span>
                            <span className="text-xs text-slate-400 ml-2">(Baseline: ${ch.currentSpend.toLocaleString()})</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-semibold">
                            <span className="text-slate-400">Allocated:</span>
                            <span className="text-emerald-400 font-bold text-sm">${currentVal.toLocaleString()}</span>
                            {diff !== 0 && (
                              <span className={`text-[10px] px-2 py-0.5 rounded ${diff > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <input 
                          type="range"
                          min="0"
                          max="250000"
                          step="5000"
                          value={currentVal}
                          onChange={(e) => handleBudgetChange(ch.id, e.target.value)}
                          className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>$0</span>
                          <span>$125,000</span>
                          <span>$250,000</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SYNTHETIC CAMPAIGN DATASET */}
          {activeTab === 'dataset' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-400" />
                      Synthetic Campaign Data Explorer
                    </h2>
                    <p className="text-xs text-slate-400">Granular campaign-level log generated for machine learning training & validation.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search campaign or channel..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 w-56 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <select
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Customer Segments</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="SMB">SMB</option>
                      <option value="B2C">B2C</option>
                    </select>

                    <button 
                      onClick={() => {
                        const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(RAW_CAMPAIGNS, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute("href", jsonStr);
                        downloadAnchor.setAttribute("download", "synthetic_marketing_data.json");
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                      }}
                      className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 rounded-lg transition shadow-lg shadow-indigo-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export JSON
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Campaign ID</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Campaign Name</th>
                        <th className="p-3">Spend ($)</th>
                        <th className="p-3">ROAS</th>
                        <th className="p-3">CAC ($)</th>
                        <th className="p-3">LTV ($)</th>
                        <th className="p-3">Target Segment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                      {filteredCampaigns.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono text-indigo-300 text-[11px]">{row.id}</td>
                          <td className="p-3 font-medium text-slate-200">{row.channel}</td>
                          <td className="p-3 text-slate-300">{row.campaign}</td>
                          <td className="p-3 font-semibold text-white">${row.spend.toLocaleString()}</td>
                          <td className="p-3 font-semibold text-emerald-400">{row.roas}x</td>
                          <td className="p-3">${row.cac}</td>
                          <td className="p-3">${row.ltv}</td>
                          <td className="p-3"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">{row.tier}</span></td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status.includes('Highly') || row.status === 'Profitable'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : row.status === 'Unprofitable'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANTI-GRAVITY INTEGRATION & PROMPT HUB */}
          {activeTab === 'antigravity' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Informational Breakdown */}
              <div className="bg-slate-900/90 border border-violet-500/30 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-500/20 p-2 rounded-xl text-violet-400 border border-violet-500/30">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Google Anti-Gravity / Multi-Agent Engineering Prompt</h2>
                      <p className="text-xs text-slate-400">Copy-ready master prompt for feed into agentic orchestration environments.</p>
                    </div>
                  </div>

                  <button
                    onClick={copyAntiGravityPrompt}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-lg shadow-violet-600/30"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? 'Copied to Clipboard!' : 'Copy Master Prompt'}
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-violet-400 mb-1 uppercase text-[10px] tracking-wider">Instructions for Data Analysts</h4>
                    <p className="leading-relaxed text-slate-300">
                      Copy the prompt block below and paste it directly into <strong>Google Anti-Gravity</strong>, <strong>LangGraph</strong>, or your preferred agent framework. It instructs the LLM agent to generate synthetic datasets, construct multi-touch Markov attribution models, and run linear optimization algorithms for budget allocation.
                    </p>
                  </div>

                  {/* Formatted Prompt Output */}
                  <div className="relative">
                    <pre 
                      id="antigravity-prompt-code"
                      className="bg-slate-950 text-slate-200 font-mono text-[11px] p-5 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all"
                    >
{`SYSTEM INSTRUCTION: You are an expert AI Marketing Data Scientist and Agentic Optimization System built to solve Marketing Budget Inefficiencies using Multi-Touch Attribution (MTA) and Dynamic Reallocation Algorithms.

PROBLEM CONTEXT:
A company is spending heavily across multiple marketing channels (Paid Search, Paid Social, Influencer, Email, Programmatic Display). Management cannot determine which campaigns generate truly profitable customers due to relying on flawed last-touch attribution models.

YOUR CORE TASKS:
1. SYNTHETIC DATA GENERATION:
   - Generate a realistic tabular dataset of 1,000+ customer touchpoint journeys.
   - Schema: Campaign_ID, Channel, Ad_Spend, Touchpoint_Sequence, Impression_Count, Conversion_Flag, CAC, LTV, Margin_Contribution.
   - Include realistic inefficiencies: e.g., Programmatic Display high first-touch volume but extremely low actual conversion contribution.

2. MULTI-TOUCH ATTRIBUTION (MTA) ENGINE:
   - Calculate and compare First-Touch, Last-Touch, and Data-Driven (Markov Chain / Shapley Value) Attribution for each channel.
   - Identify specific inefficient spend ($) where CAC exceeds LTV or ROAS < 1.0.

3. CONSTRAINED BUDGET REALLOCATION MODEL:
   - Formulate a Linear/Convex Optimization problem:
     * Objective: Maximize Total Net Revenue / Margin.
     * Subject to: Budget Cap = $500,000; Channel Headroom constraints; Diminishing Marginal Returns logarithmic scaling.
   - Output exact $ shift recommendations per channel (e.g., "Reallocate $65,000 from Display to Paid Search and Email").

4. ACTIONABLE AGENT OUTPUT:
   - Generate an executive summary highlighting baseline vs. optimized ROAS, Blended CAC reduction, and Net Profit Delta.
   - Output structured JSON payload for downstream API execution.`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}