import * as fs from 'fs';

let code = fs.readFileSync('src/pages/DrLilyPage.tsx', 'utf8');

// This is complex, finding the exact JSX for the report is hard.
// I'll replace the entire rendering block for step="result".
const startIndex = code.indexOf('{step === "result" && reportData && (');
if (startIndex === -1) throw new Error("Could not find start index");

// Find proper end bracket
let bracketLevels = 0;
let endIndex = -1;
let started = false;

for (let i = startIndex; i < code.length; i++) {
  if (code[i] === '{' || code[i] === '(') {
    bracketLevels++;
    started = true;
  } else if (code[i] === '}' || code[i] === ')') {
    bracketLevels--;
  }
  
  if (started && bracketLevels === 0) {
    endIndex = i;
    break;
  }
}

if (endIndex === -1) throw new Error("Could not find end index");

const replacement = `{step === "result" && reportData && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full min-h-screen text-white pb-24 flex flex-col items-center"
              >
                {/* AI Disclaimer Banner */}
                <div className="bg-[#1C1C22]/80 backdrop-blur-md border-b border-[#2A2A35] py-3 px-6 sticky top-0 z-50 text-center w-full shadow-md">
                  <p className="text-[10px] md:text-xs font-bold leading-relaxed max-w-4xl mx-auto text-[#A0A0B0]">
                    ⚠️ Clinical Triage Assessment - For Professional Use Only.
                  </p>
                </div>

                <div className="w-full flex justify-center py-12 px-2 sm:px-6 overflow-x-auto">
                  <div
                    id="lily-report-content"
                    className="w-full max-w-[794px] bg-white text-zinc-900 shadow-2xl p-8 sm:p-12 mb-8 relative"
                    style={{ minHeight: '1123px' }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-4 border-emerald-800 pb-6 mb-6">
                      <div>
                        <h1 className="font-serif font-black text-3xl mb-1 text-emerald-800">SenVetCare</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Tamal B. Sen Memorial Veterinary Clinic</p>
                      </div>
                      <div className="text-right text-xs">
                        <p>Ref ID: {reportData.consultationId}</p>
                        <p className="font-bold">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Clinical Alert */}
                    <div className="bg-zinc-900 text-white p-4 mb-8">
                       <h2 className="text-xs font-black uppercase tracking-widest text-[#6EE7B7] mb-2">Clinical Alert: {reportData.urgencyLevel} Priority</h2>
                       <p className="text-xs italic leading-relaxed">{reportData.clinicalAlertRationale}</p>
                    </div>

                    {/* SOAP Structure */}
                    <div className="space-y-6">
                        <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Subjective</h3><p className="text-sm text-zinc-700">{reportData.soap?.subjective}</p></section>
                        <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Objective</h3><p className="text-sm text-zinc-700">{reportData.soap?.objective}</p></section>
                        <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Assessment</h3><p className="text-sm text-zinc-700">{reportData.soap?.assessment}</p></section>
                        <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Plan</h3><p className="text-sm text-zinc-700">{reportData.soap?.plan}</p></section>
                    </div>

                    {/* Recommended Diagnostics */}
                    {reportData.recommendedTests?.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-2 mb-4">Diagnostic Recommendations</h3>
                        <div className="space-y-3">
                          {reportData.recommendedTests.map((t: any, i: number) => (
                            <div key={i} className="text-sm">
                               <p className="font-bold text-emerald-800 mt-1">{t.testName}</p>
                               <p className="text-xs text-zinc-600 font-sans italic">{t.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}`;
code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 1);
fs.writeFileSync('src/pages/DrLilyPage.tsx', code);
