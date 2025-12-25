import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { SelfieState, LocationPreset, MobilePhonePreset, AspectRatio, PhotoFilter } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<SelfieState>({
    image1: null,
    image2: null,
    location: LocationPreset.DISNEYLAND_PARIS,
    customLocation: "",
    mobilePhone: MobilePhonePreset.IPHONE_15_PRO,
    customMobilePhone: "",
    aspectRatio: "1:1",
    filter: "none",
    blurIntensity: 50,
    isGenerating: false,
    result: null,
    error: null,
  });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileChange = (num: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          [`image${num}`]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.image1) {
      setState(prev => ({ ...prev, error: "Please upload at least the first person reference." }));
      return;
    }

    const finalLocation = state.location === 'custom' ? state.customLocation : state.location;
    const finalPhone = state.mobilePhone === MobilePhonePreset.CUSTOM ? state.customMobilePhone : state.mobilePhone;

    if (!finalLocation || finalLocation.trim() === "") {
      setState(prev => ({ ...prev, error: "Please specify a location." }));
      return;
    }

    if (state.mobilePhone === MobilePhonePreset.CUSTOM && (!state.customMobilePhone || state.customMobilePhone.trim() === "")) {
      setState(prev => ({ ...prev, error: "Please enter a specific phone model." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, result: null }));

    try {
      const generatedUrl = await geminiService.generateMagicSelfie(
        state.image1,
        state.image2,
        finalLocation,
        finalPhone,
        state.aspectRatio,
        state.blurIntensity,
        state.filter
      );
      setState(prev => ({ ...prev, result: generatedUrl, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isGenerating: false }));
    }
  };

  const clearImages = () => {
    setState(prev => ({ 
      ...prev, 
      image1: null, 
      image2: null, 
      result: null, 
      error: null,
      location: LocationPreset.DISNEYLAND_PARIS,
      customLocation: "",
      mobilePhone: MobilePhonePreset.IPHONE_15_PRO,
      customMobilePhone: "",
      aspectRatio: "1:1",
      filter: "none",
      blurIntensity: 50
    }));
    if (fileInputRef1.current) fileInputRef1.current.value = "";
    if (fileInputRef2.current) fileInputRef2.current.value = "";
  };

  const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];
  const filters: { id: PhotoFilter; label: string; icon: string }[] = [
    { id: 'none', label: 'Natural', icon: '✨' },
    { id: 'bw', label: 'Noir', icon: '🦓' },
    { id: 'sepia', label: 'Sepia', icon: '📜' },
    { id: 'vintage', label: 'Film', icon: '🎞️' },
    { id: 'warm', label: 'Golden', icon: '☀️' },
    { id: 'cool', label: 'Frost', icon: '❄️' },
  ];

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <section className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 mb-2">
            AI Pro Studio
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
            The Magic Selfie Studio
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transport yourself anywhere in the world. Select your smartphone to ensure the AI renders every tech detail with precision.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                Reference Photos
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(n => (
                  <div 
                    key={n}
                    onClick={() => (n === 1 ? fileInputRef1 : fileInputRef2).current?.click()}
                    className={`relative group aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                      state[`image${n as 1|2}`] ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                    }`}
                  >
                    {state[`image${n as 1|2}`] ? (
                      <img src={state[`image${n as 1|2}`]!} alt={`Subject ${n}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">{n === 1 ? '👤' : '👥'}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{n === 1 ? 'Primary' : 'Partner'}</p>
                      </div>
                    )}
                    <input type="file" hidden ref={n === 1 ? fileInputRef1 : fileInputRef2} accept="image/*" onChange={handleFileChange(n as 1|2)} />
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-slate-800 flex items-center gap-2 pt-2 text-lg">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                Studio Gear
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Smartphone Model</label>
                  <select 
                    value={state.mobilePhone}
                    onChange={(e) => setState(prev => ({ ...prev, mobilePhone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                  >
                    <optgroup label="Apple iPhone">
                      <option value={MobilePhonePreset.IPHONE_15_PRO}>{MobilePhonePreset.IPHONE_15_PRO}</option>
                      <option value={MobilePhonePreset.IPHONE_15}>{MobilePhonePreset.IPHONE_15}</option>
                      <option value={MobilePhonePreset.IPHONE_14_PRO}>{MobilePhonePreset.IPHONE_14_PRO}</option>
                    </optgroup>
                    <optgroup label="Samsung Galaxy">
                      <option value={MobilePhonePreset.SAMSUNG_S24_ULTRA}>{MobilePhonePreset.SAMSUNG_S24_ULTRA}</option>
                      <option value={MobilePhonePreset.SAMSUNG_S23}>{MobilePhonePreset.SAMSUNG_S23}</option>
                      <option value={MobilePhonePreset.SAMSUNG_Z_FOLD}>{MobilePhonePreset.SAMSUNG_Z_FOLD}</option>
                    </optgroup>
                    <optgroup label="Google Pixel">
                      <option value={MobilePhonePreset.GOOGLE_PIXEL_8_PRO}>{MobilePhonePreset.GOOGLE_PIXEL_8_PRO}</option>
                      <option value={MobilePhonePreset.GOOGLE_PIXEL_7}>{MobilePhonePreset.GOOGLE_PIXEL_7}</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value={MobilePhonePreset.CUSTOM}>Custom Device...</option>
                    </optgroup>
                  </select>
                </div>

                {state.mobilePhone === MobilePhonePreset.CUSTOM && (
                  <input 
                    type="text" value={state.customMobilePhone} placeholder="e.g., iPhone 15 Pro Max Titanium"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm animate-in slide-in-from-top-2 duration-200 ring-2 ring-indigo-500/20"
                    onChange={(e) => setState(prev => ({ ...prev, customMobilePhone: e.target.value }))}
                    autoFocus
                  />
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Destination</label>
                  <select 
                    value={state.location}
                    onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                  >
                    {Object.values(LocationPreset).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    <option value="custom">Custom Location...</option>
                  </select>
                </div>
                
                {state.location === 'custom' && (
                  <input 
                    type="text" value={state.customLocation} placeholder="e.g., Swiss Alps, Zermatt"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm animate-in slide-in-from-top-2 duration-200"
                    onChange={(e) => setState(prev => ({ ...prev, customLocation: e.target.value }))}
                  />
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Background Blur Intensity</label>
                  <div className="px-1 py-2 space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={state.blurIntensity} 
                      onChange={(e) => setState(prev => ({ ...prev, blurIntensity: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-tighter">
                      <span>Sharp</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{state.blurIntensity}%</span>
                      <span>Cinematic</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Style & Filter</label>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.map(f => (
                      <button
                        key={f.id} onClick={() => setState(prev => ({ ...prev, filter: f.id }))}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          state.filter === f.id ? 'bg-indigo-50 border-indigo-600 text-indigo-600 ring-1 ring-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                        }`}
                      >
                        <span className="text-lg mb-0.5">{f.icon}</span>
                        <span className="text-[8px] font-black uppercase">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Aspect Ratio</label>
                  <div className="grid grid-cols-5 gap-1">
                    {aspectRatios.map(ratio => (
                      <button
                        key={ratio} onClick={() => setState(prev => ({ ...prev, aspectRatio: ratio }))}
                        className={`py-2 rounded-lg text-[9px] font-bold transition-all border ${
                          state.aspectRatio === ratio ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  disabled={state.isGenerating || !state.image1}
                  onClick={handleGenerate}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {state.isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    `Render Final Shot`
                  )}
                </button>
                <button 
                  onClick={clearImages}
                  className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Clear Studio
                </button>
              </div>

              {state.error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <span>⚠️</span>
                  {state.error}
                </div>
              )}
            </div>
          </div>

          {/* Studio Canvas Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Generated Output */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative group/output">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Final Studio Plate</span>
                </div>
                {state.result && (
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = state.result!;
                      link.download = `magic-selfie.png`;
                      link.click();
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Image
                  </button>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center p-8 bg-slate-100/50 relative overflow-hidden">
                {!state.result && !state.isGenerating && (
                  <div className="text-center max-w-sm space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-200 shadow-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-loose">The studio will combine your portraits with your chosen environment and phone tech here.</p>
                  </div>
                )}

                {state.isGenerating && (
                  <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="relative">
                      <div className="w-20 h-20 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-black text-slate-800 uppercase tracking-widest animate-pulse">Processing Frame</p>
                      <p className="text-xs text-indigo-500 font-bold uppercase tracking-tighter">Applying AI Magic to your portraits...</p>
                    </div>
                    {/* Scanning Beam */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                )}

                {state.result && (
                  <div className="w-full h-full flex items-center justify-center animate-[studioReveal_1.5s_ease-out_forwards]">
                    <div className="relative shadow-2xl rounded-2xl overflow-hidden border-[16px] border-white max-w-full bg-white">
                       <img 
                        src={state.result} 
                        alt="Final Studio Shot" 
                        className="max-w-full max-h-[75vh] object-contain transition-transform duration-1000 group-hover/output:scale-105" 
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Reference Quick Preview */}
            <div className="flex gap-4 justify-center">
              {state.image1 && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">P1 Reference</span>
                  <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden grayscale opacity-50">
                    <img src={state.image1} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              {state.image2 && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">P2 Reference</span>
                  <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden grayscale opacity-50">
                    <img src={state.image2} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes studioReveal {
          0% { 
            opacity: 0; 
            transform: scale(0.9) translateY(40px);
            filter: blur(20px) contrast(0.5);
          }
          40% {
            opacity: 0.7;
            filter: blur(10px) contrast(0.8);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
            filter: blur(0) contrast(1);
          }
        }
      `}</style>
    </Layout>
  );
};

export default App;