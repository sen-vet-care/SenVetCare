import * as fs from 'fs';

let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const linkToDrLily = '                    <Link to="/dr-lily" className="py-4 text-emerald-400 border-b border-white/10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">\n                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>\n                      FREE Consultations\n                    </Link>';

const replacement = '                    {deferredPrompt && (\n                      <button onClick={handleInstall} className="py-4 text-emerald-400 border-b border-white/10 flex items-center gap-2">\n                        <span className="material-symbols-outlined">install_mobile</span>\n                        Install App\n                      </button>\n                    )}\n' + linkToDrLily;

code = code.replace(linkToDrLily, replacement);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
