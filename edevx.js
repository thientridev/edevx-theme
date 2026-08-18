/* ======================================================== */
/* EDUCATION DEVX - CORE JAVASCRIPT (V1.5 MASTER COMPLETE)  */
/* REPOSITORY: thientridev/edevx-theme                     */
/* UPGRADE: THEME OFFLOADING & KATEX EXECUTION ORDER GUARD  */
/* ======================================================== */

document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================================================
    // --- 1. CORE ENGINE & UI -------------------------------------------------
    // =========================================================================
    const yearEl = document.getElementById('current-year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    
    const html = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') html.classList.add('dark'); 
    else { html.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
    
    ['dark-mode-toggle', 'dark-mode-toggle-mobile'].forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => { 
            html.classList.toggle('dark'); 
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); 
        });
    });
    
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileBtn && mobileMenu) mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // PWA Service Worker Inline
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swCode = `const CACHE_NAME='edevx-offline-v1';self.addEventListener('install',e=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(clients.claim()));self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(res=>{const resClone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,resClone));return res;}).catch(()=>caches.match(e.request)));});`;
            try { navigator.serviceWorker.register(URL.createObjectURL(new Blob([swCode], {type: 'text/javascript'}))).catch(()=>{}); } catch(e){}
        });
    }

    // Font Size & Reading Time
    const articleBody = document.getElementById('article-body-content');
    if(articleBody) {
        const clone = articleBody.cloneNode(true);
        clone.querySelectorAll('svg, style, script, .code-wrapper').forEach(el => el.remove());
        const words = (clone.innerText || '').trim().split(/\s+/).filter(w => w.length > 0).length;
        
        const rt = document.querySelector('.rt-val'); 
        if(rt) rt.textContent = Math.ceil(words / 225) || 1;
        
        let currentFontSize = parseFloat(localStorage.getItem('edevx_font_size')) || 1.05;
        document.documentElement.style.setProperty('--article-font-size', currentFontSize + 'rem');
        
        const updateFont = (val) => { 
            currentFontSize = parseFloat((currentFontSize + val).toFixed(2)); 
            document.documentElement.style.setProperty('--article-font-size', currentFontSize + 'rem'); 
            localStorage.setItem('edevx_font_size', currentFontSize); 
        };
        const fInc = document.getElementById('font-increase'); 
        const fDec = document.getElementById('font-decrease');
        if(fInc) fInc.addEventListener('click', (e) => { e.preventDefault(); if(currentFontSize < 1.5) updateFont(0.1); });
        if(fDec) fDec.addEventListener('click', (e) => { e.preventDefault(); if(currentFontSize > 0.85) updateFont(-0.1); });
    }

    // =========================================================================
    // --- 2. FLOATING BUTTONS (NÚT NỔI & MỤC LỤC MOBILE) ----------------------
    // =========================================================================
    const bttBtn = document.getElementById('back-to-top');
    const tocBtn = document.getElementById('open-toc-mobile');
    if (bttBtn || tocBtn) {
        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'position:absolute; top:300px; width:100%; height:1px; z-index:-1; pointer-events:none;';
        document.body.appendChild(sentinel);

        const observer = new IntersectionObserver(([entry]) => {
            const isVisible = !entry.isIntersecting; 
            [bttBtn, tocBtn].forEach(btn => {
                if (btn) {
                    btn.classList.toggle('opacity-0', !isVisible);
                    btn.classList.toggle('translate-y-20', !isVisible);
                    btn.classList.toggle('pointer-events-none', !isVisible);
                }
            });
        });
        observer.observe(sentinel);
        if(bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // =========================================================================
    // --- 3. LIVE SEARCH ------------------------------------------------------
    // =========================================================================
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        let timeout;
        const loader = document.getElementById('search-loader');
        const dropdown = document.getElementById('search-dropdown');
        const resultsBox = document.getElementById('search-results');
        
        const escapeHTML = (str) => str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));

        searchInput.addEventListener('input', function() {
            clearTimeout(timeout); const query = this.value.trim();
            if(query.length === 0) { dropdown.classList.add('hidden'); return; }
            loader.style.display = 'block'; dropdown.classList.remove('hidden');
            timeout = setTimeout(() => {
                fetch(`/feeds/posts/summary?alt=json&q=${encodeURIComponent(query)}&max-results=5`).then(res => res.json()).then(data => {
                    loader.style.display = 'none'; resultsBox.innerHTML = '';
                    if(data.feed.entry) {
                        data.feed.entry.forEach(post => {
                            let link = post.link.find(l => l.rel === 'alternate')?.href || '#';
                            let thumb = post.media$thumbnail ? `<img src="${post.media$thumbnail.url}" class="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-zinc-200 dark:border-zinc-700">` : `<div class="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-200 dark:border-zinc-700"><i class="fas fa-file-alt text-zinc-400"></i></div>`;
                            resultsBox.innerHTML += `<a href="${link}" class="flex gap-3 items-center p-3 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">${thumb}<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2">${escapeHTML(post.title.$t)}</span></a>`;
                        });
                        resultsBox.innerHTML += `<a href="/search?q=${encodeURIComponent(query)}" class="block p-3 text-center text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition">Xem tất cả kết quả &rarr;</a>`;
                    } else { resultsBox.innerHTML = `<div class="p-4 text-center text-sm text-zinc-500">Không tìm thấy bài viết nào.</div>`; }
                });
            }, 500);
        });
        document.addEventListener('click', (e) => { if(!searchInput.parentElement.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden'); });
    }

    const mSearchBtn = document.getElementById('mobile-search-btn');
    if(mSearchBtn) mSearchBtn.addEventListener('click', () => {
        const c = document.getElementById('search-container'); c.classList.toggle('hidden'); c.classList.toggle('absolute'); c.classList.toggle('w-full'); c.classList.toggle('left-0'); c.classList.toggle('px-6');
        if(!c.classList.contains('hidden')) searchInput.focus();
    });

    // =========================================================================
    // --- 4. TOCBOT -----------------------------------------------------------
    // =========================================================================
    const tocContainer = document.querySelector('.js-toc');
    if (tocContainer && articleBody) {
        articleBody.querySelectorAll('h2, h3').forEach((h, i) => { 
            if(!h.id) h.id = h.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'toc-'+i; 
        });
        tocbot.init({ tocSelector: '.js-toc', contentSelector: '#article-body-content', headingSelector: 'h2, h3', hasInnerContainers: false, headingsOffset: 120, scrollSmoothOffset: -100 });
        
        const tocWrap = document.getElementById('toc-container'); 
        const oBtn = document.getElementById('open-toc-mobile'); 
        const cBtn = document.getElementById('close-toc-mobile');
        
        if(tocWrap) {
            const toggleToc = () => { 
                tocWrap.classList.toggle('translate-y-full'); 
                tocWrap.classList.toggle('opacity-0'); 
                tocWrap.classList.toggle('pointer-events-none'); 
            };
            if(oBtn) oBtn.addEventListener('click', toggleToc); 
            if(cBtn) cBtn.addEventListener('click', toggleToc);
            tocWrap.addEventListener('click', e => { if(e.target.tagName==='A' && window.innerWidth < 1024) toggleToc(); });
        }
    }

    // =========================================================================
    // --- 5. THEME OFFLOADING: DỰNG DOM TẤT CẢ AUTO-ENGINES TRƯỚC KATEX ------
    // =========================================================================
    runAllDomAutoEngines();

    // =========================================================================
    // --- 6. ĐỘNG CƠ KATEX TOÀN CỤC & MARKMAP SAFE ENGINE --------------------
    // =========================================================================
    function loadLazyCSS(href) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
    const loadScript = (src) => new Promise(resolve => { const s = document.createElement('script'); s.src = src; s.onload = resolve; document.body.appendChild(s); });

    if (document.querySelector('pre') && !document.querySelector('pre.markmap-raw-md')) {
        loadLazyCSS('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css');
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js');
    }

    const bodyText = document.body ? document.body.innerText : '';
    if (bodyText.includes('$$') || bodyText.includes('$')) {
        loadLazyCSS('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css');
        
        (async () => {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/contrib/auto-render.min.js');
            
            document.querySelectorAll('.prose p, .a4-page-demo, .slide-container').forEach(p => { 
                if (p.innerHTML.includes('$')) {
                    p.innerHTML = p.innerHTML
                        .replace(/\$\$([\s\S]*?)\$\$/g, (m,g)=>`$$${g.replace(/<br\s*\/?>/gi,'\n')}$$`)
                        .replace(/\$([\s\S]*?)\$/g, (m,g)=>`$${g.replace(/<br\s*\/?>/gi,' ')}$`);
                }
            });
            
            renderMathInElement(document.body, { 
                delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}], 
                ignoredClasses: ["markmap", "markmap-wrapper", "markmap-raw-md"],
                throwOnError: false 
            });
            
            if (typeof tocContainer !== 'undefined' && tocContainer) setTimeout(() => tocbot.refresh(), 500);

            initSafeMarkmapEngine();
        })();
    } else {
        initSafeMarkmapEngine();
    }

    function initSafeMarkmapEngine() {
        const wrappers = document.querySelectorAll('.markmap-wrapper');
        if (!wrappers.length) return;

        function decodeEntities(str) {
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            return txt.value;
        }

        function preRenderKaTeX(mdText) {
            if (typeof katex === 'undefined') return mdText;
            mdText = mdText.replace(/\$\$([\s\S]+?)\$\$/g, (m, math) => {
                try { return katex.renderToString(math.trim(), { displayMode: true, output: 'html' }); } catch(e) { return m; }
            });
            mdText = mdText.replace(/\$([^\$\n]+?)\$/g, (m, math) => {
                try { return katex.renderToString(math.trim(), { displayMode: false, output: 'html' }); } catch(e) { return m; }
            });
            return mdText;
        }

        async function startEngine() {
            if (typeof markmap === 'undefined' || !markmap.Transformer) {
                await loadScript('https://cdn.jsdelivr.net/npm/d3@7');
                await loadScript('https://cdn.jsdelivr.net/npm/markmap-view@0.15.3');
                await loadScript('https://cdn.jsdelivr.net/npm/markmap-lib@0.15.3');
            }

            wrappers.forEach(wrap => {
                const templateEl = wrap.querySelector('pre') || wrap.querySelector('textarea') || wrap.querySelector('template');
                const svgEl = wrap.querySelector('svg');

                if (!templateEl || !svgEl) return;

                const rawMd = decodeEntities((templateEl.value || templateEl.textContent || templateEl.innerHTML || '').trim());
                if (!rawMd) return;

                const htmlEnrichedMd = preRenderKaTeX(rawMd);

                if (typeof markmap !== 'undefined' && markmap.Transformer) {
                    try {
                        const transformer = new markmap.Transformer();
                        const result = transformer.transform(htmlEnrichedMd);
                        svgEl.innerHTML = '';
                        markmap.Markmap.create(svgEl, { duration: 500, maxWidth: 280 }, result.root);
                    } catch(err) { console.error("Markmap Render Error", err); }
                }
            });
        }
        
        startEngine();
    }
    
    // =========================================================================
    // --- 7. EDTECH COMPONENTS & EVENT DELEGATION -----------------------------
    // =========================================================================
    function decodeHTML(html) { var t = document.createElement("textarea"); t.innerHTML = html; return t.value; }
    
    if(articleBody) {
        function autoLinkify(node) {
            if(node.nodeType === 3) {
                const text = node.nodeValue; const urlRegex = /(https?:\/\/[^\s]+)/g;
                if(urlRegex.test(text)) {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(urlRegex, function(url) {
                        let cUrl = url.replace(/[.,;!?]$/, ''); let tail = url.substring(cUrl.length);
                        let isDrv = cUrl.includes('drive.google'); let isYt = cUrl.includes('youtu');
                        let cls = `inline-flex items-center gap-2 px-5 py-2.5 my-2 text-white font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-all ${isDrv?'bg-blue-600 hover:bg-blue-700':(isYt?'bg-red-600 hover:bg-red-700':'bg-blue-600 hover:bg-blue-700 break-all')}`;
                        let icn = isDrv?'fas fa-cloud-download-alt':(isYt?'fab fa-youtube':'fas fa-bookmark text-yellow-300');
                        return `<a href="${cUrl}" target="_blank" class="${cls}"><i class="${icn} text-lg"></i> ${isDrv?'Mở File Google Drive':(isYt?'Xem Video YouTube':cUrl)}</a>${tail}`;
                    }); node.parentNode.replaceChild(span, node);
                }
            } else if(node.nodeType === 1 && !['A','PRE','CODE','BUTTON'].includes(node.nodeName)) { Array.from(node.childNodes).forEach(autoLinkify); }
        } autoLinkify(articleBody);
        
        articleBody.querySelectorAll('a').forEach(a => {
            if(!a.querySelector('img') && !a.closest('.quiz-container') && !a.closest('.flashcard-wrapper') && !a.closest('.code-wrapper') && !a.closest('.js-toc') && a.textContent.trim()) {
                a.removeAttribute('style'); a.target = "_blank"; a.className = "inline-flex items-center gap-2.5 px-5 py-2.5 my-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all text-base no-underline";
                if(!a.querySelector('.fa-book-reader')) a.innerHTML = `<i class="fas fa-book-reader text-yellow-300 text-lg"></i> <span>${a.textContent.trim()}</span> <i class="fas fa-external-link-alt text-xs opacity-70 ml-1"></i>`;
            }
        });
    }

    // Code Gemini Builder
    document.querySelectorAll('.prose pre').forEach(pre => {
        const cBlock = pre.querySelector('code'); if(!cBlock) return;
        let lName = "CODE"; const lClass = Array.from(cBlock.classList).find(c=>c.startsWith('language-'));
        if(lClass) { lName = lClass.replace('language-','').toUpperCase(); if(lName==='JS'||lName==='JAVASCRIPT') lName='JAVASCRIPT'; if(lName==='CPP') lName='C++'; if(lName==='PY') lName='PYTHON'; if(lName==='CS') lName='C#'; }
        const sCont = cBlock.textContent.replace(/"/g, '&quot;');
        const wrap = document.createElement('div'); wrap.className = 'code-wrapper';
        wrap.innerHTML = `<div class="code-header"><div class="text-sm font-bold text-zinc-200 tracking-wider">${lName}</div><div class="flex items-center gap-4 text-zinc-400"><button class="download-btn hover:text-white transition" data-code="${sCont}" data-ext="${lName}" title="Tải xuống"><i class="fa-solid fa-circle-arrow-down text-lg"></i></button><button class="copy-btn hover:text-white transition" data-clipboard-text="${sCont}" title="Sao chép"><i class="fa-regular fa-copy text-lg"></i></button></div></div>`;
        pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
    });

    document.querySelectorAll('.prose img').forEach(img => { img.classList.add('zoomable-img'); const p = img.closest('a'); if(p) p.addEventListener('click', e=>e.preventDefault()); });
    mediumZoom('.zoomable-img', { background: 'rgba(9, 9, 11, 0.95)', margin: 24 });

    document.addEventListener('click', async (e) => {
        const cpBtn = e.target.closest('.copy-btn');
        if(cpBtn) { try { await navigator.clipboard.writeText(decodeHTML(cpBtn.getAttribute('data-clipboard-text'))); const icn = cpBtn.querySelector('i'); icn.className = 'fa-solid fa-check text-green-400 text-lg'; setTimeout(() => icn.className='fa-regular fa-copy text-lg', 2000); } catch(err){} return; }
        
        const dlBtn = e.target.closest('.download-btn');
        if(dlBtn) { let ext = dlBtn.getAttribute('data-ext').toLowerCase(); if(ext==='c++')ext='cpp'; if(ext==='javascript')ext='js'; if(ext==='python')ext='py'; if(ext==='code')ext='txt'; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([decodeHTML(dlBtn.getAttribute('data-code'))], {type:'text/plain;charset=utf-8'})); a.download = 'snippet.'+ext; a.click(); URL.revokeObjectURL(a.href); return; }
        
        const fc = e.target.closest('.flashcard-wrapper'); if(fc && !e.target.closest('.speak-btn')) { fc.classList.toggle('is-flipped'); return; }
        
        const qOpt = e.target.closest('.quiz-option');
        if(qOpt) {
            const qz = qOpt.closest('.quiz-container'); if(qz.classList.contains('answered')) return;
            qz.classList.add('answered');
            if(qOpt.getAttribute('data-correct') === 'true') { qOpt.classList.add('correct'); qOpt.innerHTML+=' <i class="fas fa-check-circle absolute right-4"></i>'; }
            else { qOpt.classList.add('incorrect'); qOpt.innerHTML+=' <i class="fas fa-times-circle absolute right-4"></i>'; const corr = qz.querySelector('[data-correct="true"]'); if(corr) corr.classList.add('correct'); }
            return;
        }
    });

    // =========================================================================
    // --- 8. DICTIONARY V37 ---------------------------------------------------
    // =========================================================================
    (function(){
        const style = document.createElement('style'); style.innerHTML = `#google-popover-content::-webkit-scrollbar { width: 5px; } #google-popover-content::-webkit-scrollbar-track { background: transparent; } #google-popover-content::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; } .dark #google-popover-content::-webkit-scrollbar-thumb { background-color: #52525b; } .trans-tab.active { background-color: #0000ff; color: white; border-color: #0000ff; } .dark .trans-tab.active { background-color: #3b82f6; border-color: #3b82f6; color: white; }`; document.head.appendChild(style);
        let globalVoices = []; function initVoices() { if('speechSynthesis' in window) globalVoices = window.speechSynthesis.getVoices(); }
        if('speechSynthesis' in window) { initVoices(); window.speechSynthesis.onvoiceschanged = initVoices; }

        const popover = document.createElement('div'); popover.id = 'google-popover'; popover.className = 'fixed hidden z-[9999] bg-[#f9fafb] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-5 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-zinc-300 dark:border-zinc-700 transition-all duration-200 pointer-events-auto flex flex-col max-h-[85vh]'; document.body.appendChild(popover);
        
        function isVietnamese(str) { return /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i.test(str); }
        window.currentOxfordAudio = null;
        window.playPremiumAudio = function(text, lang = 'us') {
            if(window.currentOxfordAudio) { window.currentOxfordAudio.pause(); window.currentOxfordAudio=null; }
            if('speechSynthesis' in window) window.speechSynthesis.cancel();
            const cleanWord = text.toLowerCase().trim().replace(/[^a-z-]/g, '');
            if(text.split(' ').length < 3) {
                window.currentOxfordAudio = new Audio(`https://ssl.gstatic.com/dictionary/static/sounds/oxford/${cleanWord}--_${lang}_1.mp3`);
                window.currentOxfordAudio.play().catch(() => playAI(text, lang));
            } else playAI(text, lang);
        };
        function playAI(text, lang) {
            if (!('speechSynthesis' in window)) return;
            const utt = new SpeechSynthesisUtterance(text.replace(/['"“”‘’]/g, '').trim()); utt.lang = lang==='us'?'en-US':'en-GB'; utt.rate = 0.88;
            if(globalVoices.length===0) initVoices();
            if(globalVoices.length > 0) {
                let enV = globalVoices.filter(v => v.lang.replace('_','-').includes(lang==='us'?'US':'GB') || v.lang.startsWith('en'));
                utt.voice = enV.find(v=>(v.name.includes('Guy')||v.name.includes('Ryan'))&&v.name.includes('Natural')) || enV.find(v=>v.name.includes('Natural')||v.name.includes('Online')) || enV.find(v=>v.name.includes('Google')) || enV[0];
            } window.speechSynthesis.speak(utt);
        }

        let cacheTrans = { google: '', bing: '' };
        let dictAbortController = null;

        async function fetchBing(text, isVi) { try { const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${isVi?'vi':'en'}|${isVi?'en':'vi'}`); const data = await res.json(); return data?.responseData?.translatedText || "Lỗi máy chủ Bing"; } catch(e){ return "Lỗi kết nối Bing"; } }

        function updatePos(rect, isLong) {
            popover.style.width = 'calc(100vw - 32px)'; popover.style.maxWidth = isLong ? '480px' : '520px';
            let left = Math.max(15, Math.min(window.innerWidth - popover.getBoundingClientRect().width - 15, rect.left + (rect.width/2) - (popover.getBoundingClientRect().width/2)));
            let top = rect.top - popover.getBoundingClientRect().height - 15; if(top < 15) top = rect.bottom + 15; if(top + popover.getBoundingClientRect().height > window.innerHeight - 15) top = window.innerHeight - popover.getBoundingClientRect().height - 15;
            popover.style.left = `${left}px`; popover.style.top = `${top}px`;
        }

        document.addEventListener('mouseup', async (e) => {
            const pageContent = (document.title + ' ' + window.location.href + ' ' + document.body.innerText.slice(0, 2000)).toLowerCase();
            const pageHTML = document.body.innerHTML.toLowerCase();
            const isEnglishArticle = pageContent.includes('english') || pageContent.includes('tiếng anh') || pageContent.includes('tieng anh') || pageHTML.includes('/search/label/english') || pageHTML.includes('/search/label/tieng-anh') || pageHTML.includes('/search/label/anh-van');

            if (!isEnglishArticle) return;
            const sel = window.getSelection(); const text = sel.toString().trim();
            if(!text || text.length < 2 || popover.contains(e.target)) { 
                if(!popover.contains(e.target)) { 
                    popover.classList.add('hidden'); 
                    if(window.currentOxfordAudio)window.currentOxfordAudio.pause(); 
                    window.speechSynthesis.cancel(); 
                    if(dictAbortController) dictAbortController.abort();
                } 
                return; 
            }
            const rect = sel.getRangeAt(0).getBoundingClientRect(); const isLong = text.split(/\s+/).length > 3; const isVi = isVietnamese(text);
            popover.innerHTML = `<div class="flex items-center justify-center gap-2.5 text-zinc-500 p-3 text-[14px] font-medium animate-pulse"><i class="fas fa-circle-notch fa-spin text-blue-600"></i> Đang dịch...</div>`;
            popover.classList.remove('hidden'); updatePos(rect, isLong);

            if (dictAbortController) dictAbortController.abort();
            dictAbortController = new AbortController();
            const signal = dictAbortController.signal;

            try {
                const [gtRes, jsonDictRes, enDictRes] = await Promise.all([
                    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${isVi?'vi':'en'}&tl=${isVi?'en':'vi'}&dt=t&dt=bd&q=${encodeURIComponent(text)}`, { signal }),
                    (!isLong && !isVi) ? fetch(`https://dict.minhqnd.com/api/v1/lookup?word=${encodeURIComponent(text.toLowerCase())}`, { signal }).then(r=>r.ok?r.json():null).catch(()=>null) : null,
                    (!isLong && !isVi) ? fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text.toLowerCase())}`, { signal }).then(r=>r.ok?r.json():null).catch(()=>null) : null
                ]);
                const gtData = await gtRes.json(); cacheTrans.google = gtData[0] ? gtData[0].map(i=>i[0]?i[0]:'').join('') : ''; cacheTrans.bing = '';
                let ipaText = ''; let htmlVi = ''; let htmlEn = '';

                const getBadge = (p) => { p=p.toLowerCase(); if(p.includes('danh')||p.includes('noun')) return 'bg-[#0033cc] dark:bg-blue-700'; if(p.includes('động')||p.includes('verb')) return 'bg-[#006600] dark:bg-emerald-700'; if(p.includes('tính')||p.includes('adj')) return 'bg-[#cc0000] dark:bg-red-700'; return 'bg-purple-700 dark:bg-purple-800'; };
                const tPOS = (p) => ({'noun':'Danh từ','verb':'Động từ','adjective':'Tính từ','adverb':'Trạng từ','pronoun':'Đại từ','preposition':'Giới từ','conjunction':'Liên từ'})[p.toLowerCase()] || p;

                if(!isLong) {
                    if(!isVi && jsonDictRes?.exists) {
                        if(jsonDictRes.results[0].pronunciations?.length > 0) ipaText = jsonDictRes.results[0].pronunciations[0].ipa;
                        let grp = {}; jsonDictRes.results[0].meanings.forEach(m => { let p = m.pos||'Khác'; if(!grp[p])grp[p]=[]; grp[p].push(m); });
                        for(const pos in grp) {
                            htmlVi += `<div class="mt-4 pt-1"><span class="${getBadge(pos)} text-white px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider shadow-sm">${pos}</span>`;
                            grp[pos].slice(0,4).forEach((m, i) => {
                                htmlVi += `<div class="mt-2.5"><div class="text-[14.5px] text-zinc-900 dark:text-zinc-100 leading-snug flex gap-1.5 pl-1"><span class="font-bold text-zinc-400 shrink-0">${i+1}</span><span>${m.definition}</span></div>`;
                                if(m.example) { let cleanEx = m.example.replace(/~/g, text.toLowerCase()); htmlVi += `<div class="mt-1.5 pl-[16px] flex items-start gap-1.5 group cursor-pointer" onclick="playPremiumAudio('${cleanEx.split(/[-:=]/)[0].replace(/'/g,"\\'").trim()}')" title="Nghe"><i class="fas fa-volume-up text-[#006600]/70 dark:text-emerald-500/70 text-[11px] mt-1 group-hover:text-[#006600]"></i><div class="text-[#006600] dark:text-emerald-400 italic text-[14px] leading-relaxed group-hover:underline">${cleanEx}</div></div>`; }
                                htmlVi += `</div>`;
                            }); htmlVi += `</div>`;
                        }
                    } else if(!isVi && gtData[1]) {
                        gtData[1].sort((a,b)=>({'noun':1,'verb':2,'adjective':3,'adverb':4}[a[0]]||99)-({'noun':1,'verb':2,'adjective':3,'adverb':4}[b[0]]||99)).forEach(g => {
                            htmlVi += `<div class="mt-4 pt-1"><span class="${getBadge(tPOS(g[0]))} text-white px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase">${tPOS(g[0])}</span>`;
                            g[1].slice(0,5).forEach((w,i) => { htmlVi += `<div class="mt-2.5"><div class="text-[14px] text-zinc-900 dark:text-zinc-100 flex gap-1.5 pl-1"><span class="font-bold text-zinc-400">${i+1}</span><span>${w}</span></div></div>`; });
                            htmlVi += `</div>`;
                        });
                    } else { htmlVi = `<div class="mt-2.5 text-[14.5px] text-zinc-900 dark:text-zinc-100 pl-1"><span class="font-bold text-zinc-400 mr-1.5">—</span>${cacheTrans.google.split(',')[0]}</div>`; }

                    if(enDictRes?.length > 0) {
                        if(!ipaText) { for(let e of enDictRes) { let ipa=e.phonetic||e.phonetics?.find(p=>p.text)?.text; if(ipa){ipaText=ipa; break;} } }
                        let allM = []; enDictRes.forEach(e => { if(e.meanings) allM=allM.concat(e.meanings); });
                        allM.sort((a,b)=>({'noun':1,'verb':2,'adjective':3,'adverb':4}[a.partOfSpeech]||99)-({'noun':1,'verb':2,'adjective':3,'adverb':4}[b.partOfSpeech]||99)).slice(0,4).forEach(m => {
                            htmlEn += `<div class="mt-4 pt-1"><span class="${getBadge(m.partOfSpeech)} text-white px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase shadow-sm">${m.partOfSpeech}</span>`;
                            m.definitions.slice(0,3).forEach((d, i) => {
                                htmlEn += `<div class="mt-2.5"><div class="text-[14.5px] text-zinc-900 dark:text-zinc-100 flex gap-1.5"><span class="font-bold text-zinc-400">${i+1}</span><span>${d.definition}</span></div>`;
                                if(d.example) htmlEn += `<div class="mt-1.5 pl-[16px] flex items-start gap-1.5 group cursor-pointer" onclick="playPremiumAudio('${d.example.replace(/'/g,"\\'").trim()}')"><i class="fas fa-volume-up text-[#0033cc]/60 dark:text-blue-400/60 text-[11px] mt-1 group-hover:text-[#0033cc]"></i><div class="text-[#0033cc] dark:text-blue-400 italic text-[14px] group-hover:underline">${d.example}</div></div>`;
                                htmlEn += `</div>`;
                            }); htmlEn += `</div>`;
                        });
                    }

                    popover.innerHTML = `<div class="mb-3 flex items-start justify-between gap-3 shrink-0 border-b border-zinc-200 dark:border-zinc-700 pb-3"><div class="flex flex-col"><div class="text-[26px] font-black text-[#cc0000] dark:text-red-500 uppercase leading-none mb-1.5">${text}</div>${ipaText?`<div class="text-[14px] font-mono font-bold text-zinc-600 dark:text-zinc-400">${ipaText}</div>`:''}</div><div class="flex items-center gap-1.5 shrink-0"><button class="pop-speak-btn p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 text-red-600 transition-colors" data-lang="us"><i class="fas fa-volume-up text-lg"></i><span class="text-[10px] font-bold ml-1 text-zinc-600">US</span></button><button class="pop-speak-btn p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 text-blue-700 transition-colors" data-lang="gb"><i class="fas fa-volume-up text-lg"></i><span class="text-[10px] font-bold ml-1 text-zinc-600">UK</span></button></div></div><div id="google-popover-content" class="overflow-y-auto pr-3 flex-grow pb-2"><div class="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm mb-4"><div class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-1">▼ En - Vi</div>${htmlVi}</div>${htmlEn ? `<div class="bg-[#f0f4f8]/80 dark:bg-zinc-800/50 p-4 rounded-xl border border-blue-100/80 dark:border-zinc-700 shadow-sm"><div class="text-[11px] font-bold text-[#0033cc] dark:text-blue-400 uppercase border-b border-blue-200 dark:border-zinc-700 pb-2 mb-1">▼ En - En</div>${htmlEn}</div>` : ''}</div><div class="mt-4 flex items-center gap-2.5 shrink-0 pt-1"><a href="https://www.ldoceonline.com/dictionary/${encodeURIComponent(text.toLowerCase().replace(/\s+/g,'-'))}" target="_blank" class="flex-1 flex justify-center items-center py-2.5 bg-red-50 dark:bg-red-900/20 text-[#cc0000] dark:text-red-400 rounded-xl text-[11px] font-black uppercase"><i class="fas fa-external-link-alt ml-0.5"></i> Longman</a><a href="https://dict.laban.vn/find?type=1&query=${encodeURIComponent(text.toLowerCase())}" target="_blank" class="flex-1 flex justify-center items-center py-2.5 bg-blue-50 dark:bg-blue-900/20 text-[#0033cc] dark:text-blue-400 rounded-xl text-[11px] font-black uppercase"><i class="fas fa-external-link-alt ml-0.5"></i> Laban</a></div>`;
                } else {
                    popover.innerHTML = `<div class="mb-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2.5"><div class="flex items-center bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-lg"><button id="tab-google" class="trans-tab active px-3 py-1.5 rounded-md text-[11px] font-black uppercase">Google</button><button id="tab-bing" class="trans-tab px-3 py-1.5 rounded-md text-[11px] font-black uppercase ml-1">Bing AI</button></div><button class="pop-speak-btn bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg flex items-center text-zinc-800 dark:text-zinc-200" data-lang="us"><i class="fas fa-volume-up mr-1.5 text-[#cc0000] dark:text-red-500"></i><span class="text-[11px] font-bold">Đọc câu</span></button></div><div id="google-popover-content" class="max-h-[250px] overflow-y-auto pr-2"><div class="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl italic text-zinc-700 dark:text-zinc-300 mb-3 text-[14.5px]">"${text}"</div><div id="trans-result" class="font-medium text-black dark:text-zinc-100 text-[15px] whitespace-pre-wrap">${cacheTrans.google}</div></div>`;
                    document.getElementById('tab-google').onclick=()=>{ document.getElementById('tab-bing').classList.remove('active','bg-[#0000ff]','text-white'); document.getElementById('tab-google').classList.add('active'); document.getElementById('trans-result').innerHTML=cacheTrans.google; };
                    document.getElementById('tab-bing').onclick=async()=>{ document.getElementById('tab-google').classList.remove('active'); document.getElementById('tab-bing').classList.add('active'); if(!cacheTrans.bing){ document.getElementById('trans-result').innerHTML=`<i class="fas fa-circle-notch fa-spin text-[#0000ff]"></i> Đang lấy dữ liệu...`; cacheTrans.bing = await fetchBing(text, isVi); } document.getElementById('trans-result').innerHTML=cacheTrans.bing; };
                }

                setTimeout(() => updatePos(rect, isLong), 10);
                popover.querySelectorAll('.pop-speak-btn').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); playPremiumAudio(isVi?cacheTrans.google:text, btn.getAttribute('data-lang')); });
            } catch(e) { 
                if (e.name === 'AbortError') return; 
                popover.classList.add('hidden'); console.error(e); 
            }
        });
        document.addEventListener('mousedown', (e) => { if(!popover.contains(e.target)) { popover.classList.add('hidden'); if(window.currentOxfordAudio)window.currentOxfordAudio.pause(); window.speechSynthesis.cancel(); } });
        
        document.addEventListener('click', e => {
            const btn = e.target.closest('.speak-btn'); if(!btn) return;
            e.stopPropagation(); const txt = btn.getAttribute('data-text'); let lg = btn.getAttribute('data-lang')||'us';
            if(lg.toLowerCase().includes('gb')||lg.toLowerCase().includes('uk')) lg='gb'; else lg='us';
            if(txt) { const icn = btn.querySelector('i'); const oldCls = icn?icn.className:''; if(icn) icn.className='fas fa-volume-up text-blue-500 animate-pulse'; playPremiumAudio(txt, lg); setTimeout(()=> { if(icn)icn.className=oldCls; }, 1500); }
        });
    })();

    // =========================================================================
    // --- 9. SLIDE MODE PRO ENGINE --------------------------------------------
    // =========================================================================
    const slideElem = document.querySelector('.slide-container');
    if (slideElem) {
        document.body.classList.add('has-slide');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');

        // ÉP TRÌNH DUYỆT TỰ ĐỘNG IN KHỔ NGANG (A4 LANDSCAPE) CHO MODE 2
        if (!document.getElementById('edevx-slide-print-engine')) {
            const slidePrintStyle = document.createElement('style');
            slidePrintStyle.id = 'edevx-slide-print-engine';
            slidePrintStyle.innerHTML = `
                @media print {
                    @page { size: A4 landscape !important; margin: 0 !important; }
                    html, body { width: 297mm !important; height: 210mm !important; background: #ffffff !important; }
                }
            `;
            document.head.appendChild(slidePrintStyle);
        }
        
        const articleBodyForSlide = document.getElementById('article-body-content');
        if (articleBodyForSlide) {
            articleBodyForSlide.classList.remove('prose', 'prose-zinc', 'dark:prose-invert');
            articleBodyForSlide.querySelectorAll('br').forEach(br => br.remove());
            articleBodyForSlide.innerHTML = articleBodyForSlide.innerHTML.replace(/&nbsp;/g, ' ');
        }
    }

    // =========================================================================
    // --- 10. FOCUS WORKSPACE DOCK (POMODORO 3 MODE) --------------------------
    // =========================================================================
    (function initPomodoro() {
        const panel = document.getElementById('pomo-panel');
        if(!panel) return;

        const toggleBtn = document.getElementById('pomo-toggle');
        const timeDisplay = document.getElementById('pomo-time');
        const startBtn = document.getElementById('pomo-start');
        const resetBtn = document.getElementById('pomo-reset');
        const playIcon = document.getElementById('pomo-play-icon');
        
        const modeBtns = [
            document.getElementById('mode-warmup'),
            document.getElementById('mode-focus'),
            document.getElementById('mode-break')
        ];

        let currentMinutes = 15;
        let currentColor = 'purple'; 
        let timeLeft = 15 * 60; 
        let timerId = null;
        let isRunning = false;

        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('hidden');
            if (!isRunning) {
                toggleBtn.classList.toggle('opacity-30');
                toggleBtn.classList.toggle('opacity-100');
                toggleBtn.classList.toggle(`text-${currentColor}-600`);
                toggleBtn.classList.toggle('text-zinc-400');
            }
        });

        const formatTime = (seconds) => {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        const updateDisplay = () => {
            timeDisplay.textContent = formatTime(timeLeft);
            document.title = isRunning ? `(${formatTime(timeLeft)}) EDEVX Focus` : document.title.split(') ')[1] || document.title;
        };

        const setMode = (btn) => {
            currentMinutes = parseInt(btn.getAttribute('data-time'));
            currentColor = btn.getAttribute('data-color');
            timeLeft = currentMinutes * 60;
            updateDisplay();
            pauseTimer();
            
            modeBtns.forEach(b => {
                b.className = `px-2.5 py-1 text-xs font-bold rounded-md text-zinc-500 hover:text-${b.getAttribute('data-color')}-500 transition-all`;
            });

            btn.className = `px-2.5 py-1 text-xs font-bold rounded-md bg-white dark:bg-zinc-700 text-${currentColor}-500 shadow-sm transition-all`;
            timeDisplay.className = `text-5xl font-black text-center text-${currentColor}-600 dark:text-${currentColor}-500 font-mono tracking-widest mb-6 transition-colors duration-300`;
            startBtn.className = `w-12 h-12 bg-${currentColor}-600 hover:bg-${currentColor}-700 text-white rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-all`;
        };

        modeBtns.forEach(btn => btn.addEventListener('click', () => setMode(btn)));

        const startTimer = () => {
            if (isRunning) return;
            isRunning = true;
            playIcon.className = 'fas fa-pause';
            
            toggleBtn.classList.remove('opacity-30', 'text-zinc-400');
            toggleBtn.classList.add('opacity-100', `text-${currentColor}-600`);
            timeDisplay.classList.add('animate-pulse');

            timerId = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    pauseTimer();
                    if (currentMinutes === 15) {
                        alert("Khởi động xuất sắc! Thưởng cho con 5 phút nghỉ ngơi nhé!");
                        setMode(modeBtns[2]);
                    } else if (currentMinutes === 25) {
                        alert("Tập trung đỉnh cao! Đến lúc xả hơi 5 phút rồi!");
                        setMode(modeBtns[2]);
                    } else {
                        alert("Hết giờ giải lao! Quay lại bàn học thôi con!");
                        setMode(modeBtns[0]); 
                    }
                }
            }, 1000);
        };

        const pauseTimer = () => {
            isRunning = false;
            playIcon.className = 'fas fa-play';
            clearInterval(timerId);
            timeDisplay.classList.remove('animate-pulse');
            
            if (panel.classList.contains('hidden')) {
                toggleBtn.classList.add('opacity-30', 'text-zinc-400');
                toggleBtn.classList.remove('opacity-100', 'text-blue-600', 'text-purple-600', 'text-emerald-600');
            }
        };

        startBtn.addEventListener('click', () => isRunning ? pauseTimer() : startTimer());
        resetBtn.addEventListener('click', () => setMode(modeBtns.find(b => parseInt(b.getAttribute('data-time')) === currentMinutes)));
    })();

    // =========================================================================
    // --- 11. GITHUB JSON DATABASE ENGINE (SESSION RAM CACHE) ------------------
    // =========================================================================
    (function initGitHubJsonQuizEngine() {
        const containers = document.querySelectorAll('.edevx-quiz-db');
        if (!containers.length) return;

        let baseUrl = 'https://cdn.jsdelivr.net/gh/thientri/edevx-theme@main/';
        const scripts = document.querySelectorAll('script');
        scripts.forEach(s => {
            if (s.src && s.src.includes('edevx.js')) {
                baseUrl = s.src.substring(0, s.src.lastIndexOf('/') + 1);
            }
        });

        async function loadDataset(src) {
            const cleanSrc = src.trim();
            const fullUrl = cleanSrc.startsWith('http') ? cleanSrc : `${baseUrl}${cleanSrc}`;

            const cachedData = sessionStorage.getItem(fullUrl);
            if (cachedData) {
                try { return JSON.parse(cachedData); } catch (e) { sessionStorage.removeItem(fullUrl); }
            }

            try {
                const res = await fetch(fullUrl);
                if (!res.ok) throw new Error(`Lỗi mạng: ${res.status}`);
                const data = await res.json();
                sessionStorage.setItem(fullUrl, JSON.stringify(data));
                return data;
            } catch (err) {
                console.error('[EDEVX JSON Error]:', err);
                return null;
            }
        }

        function shuffleArray(arr) { return arr.sort(() => Math.random() - 0.5); }

        containers.forEach(async (box) => {
            const src = box.getAttribute('data-source');
            const topic = box.getAttribute('data-topic');
            const chapter = box.getAttribute('data-chapter');
            const level = box.getAttribute('data-level');
            const limit = parseInt(box.getAttribute('data-limit')) || 0;
            const isRandom = box.getAttribute('data-random') === 'true';

            if (!src) return;

            box.innerHTML = `<div class="p-6 text-center text-zinc-500 animate-pulse font-medium text-sm flex items-center justify-center gap-2"><i class="fas fa-circle-notch fa-spin text-blue-600 text-lg"></i> <span>Đang nạp ngân hàng câu hỏi...</span></div>`;

            const rawData = await loadDataset(src);
            if (!rawData) {
                box.innerHTML = `<div class="p-5 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-3xl text-sm font-bold border border-red-200 flex items-center justify-between gap-3"><span>Lỗi tải dữ liệu. Cáp mạng bị nghẽn!</span><button class="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase" onclick="location.reload()">Tải lại</button></div>`;
                return;
            }

            let qList = Array.isArray(rawData) ? rawData : (rawData.questions || []);
            if (topic) qList = qList.filter(q => q.topic === topic);
            if (chapter) qList = qList.filter(q => q.chapter === chapter);
            if (level) qList = qList.filter(q => q.level === level);

            if (isRandom) qList = shuffleArray([...qList]);
            if (limit > 0 && qList.length > limit) qList = qList.slice(0, limit);

            if (qList.length === 0) {
                box.innerHTML = `<div class="p-5 bg-amber-50 text-amber-700 dark:bg-amber-900/20 rounded-3xl text-sm font-bold border border-amber-200">Không tìm thấy bài tập nào.</div>`;
                return;
            }

            const totalQ = qList.length;

            let htmlHTML = `
            <div class="space-y-6">
                <div class="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-400/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                            <i class="fas fa-trophy text-amber-300 text-xl"></i>
                        </div>
                        <div>
                            <div class="text-xs uppercase tracking-wider text-blue-200 font-bold">Bảng Điểm Tự Động</div>
                            <div class="quiz-score-text font-black text-base sm:text-lg">Hãy chọn đáp án bên dưới...</div>
                        </div>
                    </div>
                    <button class="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shrink-0" onclick="location.reload()">
                        <i class="fas fa-redo-alt mr-1.5"></i> Làm lại bài
                    </button>
                </div>
            `;

            qList.forEach((q, idx) => {
                const qId = q.id || `q_${idx}`;
                const cleanQuestion = q.question.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

                let optionsWithMeta = q.options.map((optText, originalIndex) => {
                    return { text: optText, isCorrect: originalIndex === q.correct_answer };
                });
                optionsWithMeta = shuffleArray(optionsWithMeta);

                htmlHTML += `
                <div class="quiz-container bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4" data-quiz-id="${qId}">
                    <div class="font-bold text-zinc-800 dark:text-zinc-100 text-base leading-relaxed flex items-start gap-3">
                        <span class="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-xl font-black shrink-0 mt-0.5">Câu ${idx + 1}</span>
                        <div class="flex-grow">${cleanQuestion}</div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        ${optionsWithMeta.map((opt, oIdx) => `
                            <div class="quiz-option p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50 font-semibold cursor-pointer hover:border-blue-500 text-sm flex items-center justify-between text-zinc-700 dark:text-zinc-300 transition-all" 
                                 data-correct="${opt.isCorrect}">
                                <span><b class="mr-2 text-zinc-400">${String.fromCharCode(65 + oIdx)}.</b> ${opt.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</span>
                            </div>
                        `).join('')}
                    </div>

                    ${q.explanation ? `
                    <details class="text-sm mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <summary class="font-bold text-blue-600 dark:text-blue-400 cursor-pointer text-xs flex items-center gap-1.5">
                            <i class="fas fa-search-plus"></i> Xem lời giải chi tiết
                        </summary>
                        <div class="pt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm space-y-1">
                            ${q.explanation.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}
                        </div>
                    </details>` : ''}
                </div>`;
            });

            htmlHTML += `</div>`;
            box.innerHTML = htmlHTML;

            const scoreText = box.querySelector('.quiz-score-text');
            box.addEventListener('click', (e) => {
                if (e.target.closest('.quiz-option')) {
                    setTimeout(() => {
                        const answeredCount = box.querySelectorAll('.quiz-container.answered').length;
                        const correctCount = box.querySelectorAll('.quiz-option.correct').length;
                        const score = ((correctCount / totalQ) * 10).toFixed(1);
                        if (scoreText) {
                            scoreText.innerHTML = `Đúng: <b class="text-amber-300 text-lg mx-1">${correctCount}/${totalQ}</b> câu (<b class="text-amber-300 text-lg">${score} điểm</b>) ${answeredCount === totalQ ? '🎉 Hoàn thành bài thi!' : ''}`;
                        }
                    }, 50);
                }
            });

            if (window.renderMathInElement) {
                renderMathInElement(box, {
                    delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
                    throwOnError: false
                });
            }
        });
    })();

    // =========================================================================
    // --- 12. EDEVX VECTOR ENGINE (MODE 2C MASTER COMPLETE) -------------------
    // =========================================================================
    window.EdevxVectorEngine = {
        fontBold: null,
        fontNormal: null,

        // 1. Khởi tạo không gian PDF Workspace
        setupWorkspace(workspaceId) {
            const ws = document.getElementById(workspaceId);
            if (!ws) return;

            document.body.appendChild(ws);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.add('pdf-mode-active');
            document.body.classList.add('pdf-mode-active');

            Array.from(document.body.children).forEach((child) => {
                if (child.id !== workspaceId && !['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) {
                    child.style.display = 'none';
                    child.style.height = '0';
                    child.style.margin = '0';
                    child.style.padding = '0';
                }
            });
        },

        // 2. Kẻ lưới ô ly A4 tiêu chuẩn (Gốc)
        drawGrid(svgId) {
            const svg = document.getElementById(svgId);
            if (!svg) return;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            for (let y = 0; y <= 1123; y += 10) {
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', '0'); l.setAttribute('y1', y);
                l.setAttribute('x2', '794'); l.setAttribute('y2', y);
                l.setAttribute('stroke', y % 40 === 0 ? '#3b82f6' : '#94a3b8');
                l.setAttribute('stroke-width', y % 40 === 0 ? '1.4' : '0.8');
                g.appendChild(l);
            }

            for (let x = 0; x <= 794; x += 10) {
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', x); l.setAttribute('y1', '0');
                l.setAttribute('x2', x); l.setAttribute('y2', '1123');
                l.setAttribute('stroke', x % 40 === 0 ? '#3b82f6' : '#94a3b8');
                l.setAttribute('stroke-width', x % 40 === 0 ? '1.4' : '0.8');
                g.appendChild(l);
            }

            const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r1.setAttribute('x1', '80'); r1.setAttribute('y1', '0');
            r1.setAttribute('x2', '80'); r1.setAttribute('y2', '1123');
            r1.setAttribute('stroke', '#ef4444'); r1.setAttribute('stroke-width', '1.8');
            g.appendChild(r1);

            const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r2.setAttribute('x1', '83'); r2.setAttribute('y1', '0');
            r2.setAttribute('x2', '83'); r2.setAttribute('y2', '1123');
            r2.setAttribute('stroke', '#ef4444'); r2.setAttribute('stroke-width', '1.8');
            g.appendChild(r2);

            svg.insertBefore(g, svg.firstChild);
        },

        // 3. Kẻ lưới Ô Ly Sương Mù A4 Nguyên Trang (Mẫu 1 & Mẫu 3)
        drawSoftGrid(svgId) {
            const svg = document.getElementById(svgId);
            if (!svg) return;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            for (let y = 20; y <= 1090; y += 10) {
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', '22'); l.setAttribute('y1', y);
                l.setAttribute('x2', '772'); l.setAttribute('y2', y);
                l.setAttribute('stroke', y % 40 === 0 ? '#6366f1' : '#64748b');
                l.setAttribute('stroke-width', y % 40 === 0 ? '1.2' : '0.55');
                g.appendChild(l);
            }

            for (let x = 0; x <= 794; x += 10) {
                if (x < 22 || x > 772) continue;
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', x); l.setAttribute('y1', '20');
                l.setAttribute('x2', x); l.setAttribute('y2', '1095');
                l.setAttribute('stroke', x % 40 === 0 ? '#6366f1' : '#64748b');
                l.setAttribute('stroke-width', x % 40 === 0 ? '1.2' : '0.55');
                g.appendChild(l);
            }

            const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r1.setAttribute('x1', '72'); r1.setAttribute('y1', '20');
            r1.setAttribute('x2', '72'); r1.setAttribute('y2', '1095');
            r1.setAttribute('stroke', '#ef4444'); r1.setAttribute('stroke-width', '1.4');
            g.appendChild(r1);

            const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r2.setAttribute('x1', '75'); r2.setAttribute('y1', '20');
            r2.setAttribute('x2', '75'); r2.setAttribute('y2', '1095');
            r2.setAttribute('stroke', '#ef4444'); r2.setAttribute('stroke-width', '1.4');
            g.appendChild(r2);

            svg.insertBefore(g, svg.firstChild);
        },

        // 4. Kẻ lưới Ô Ly Nửa Trên A4 Top-Half A5 (Mẫu 2 & Mẫu 4)
        drawTopHalfGrid(svgId) {
            const svg = document.getElementById(svgId);
            if (!svg) return;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            for (let y = 20; y <= 530; y += 10) {
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', '22'); l.setAttribute('y1', y);
                l.setAttribute('x2', '772'); l.setAttribute('y2', y);
                l.setAttribute('stroke', y % 40 === 0 ? '#6366f1' : '#64748b');
                l.setAttribute('stroke-width', y % 40 === 0 ? '1.2' : '0.55');
                g.appendChild(l);
            }

            for (let x = 0; x <= 794; x += 10) {
                if (x < 22 || x > 772) continue;
                const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l.setAttribute('x1', x); l.setAttribute('y1', '20');
                l.setAttribute('x2', x); l.setAttribute('y2', '535');
                l.setAttribute('stroke', x % 40 === 0 ? '#6366f1' : '#64748b');
                l.setAttribute('stroke-width', x % 40 === 0 ? '1.2' : '0.55');
                g.appendChild(l);
            }

            const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r1.setAttribute('x1', '72'); r1.setAttribute('y1', '20');
            r1.setAttribute('x2', '72'); r1.setAttribute('y2', '535');
            r1.setAttribute('stroke', '#ef4444'); r1.setAttribute('stroke-width', '1.4');
            g.appendChild(r1);

            const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r2.setAttribute('x1', '75'); r2.setAttribute('y1', '20');
            r2.setAttribute('x2', '75'); r2.setAttribute('y2', '535');
            r2.setAttribute('stroke', '#ef4444'); r2.setAttribute('stroke-width', '1.4');
            g.appendChild(r2);

            svg.insertBefore(g, svg.firstChild);
        },

        // 5. Nạp Font cơ bản (Gốc)
        async initFonts() {
            if (!window.opentype) {
                await new Promise((res, rej) => {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js';
                    s.onload = res; s.onerror = rej;
                    document.head.appendChild(s);
                });
            }
            const load = (u) => new Promise((res, rej) => window.opentype.load(u, (e, f) => (e ? rej(e) : res(f))));
            [this.fontBold, this.fontNormal] = await Promise.all([
                load('https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/fonts/HP001_4H_Bold.ttf'),
                load('https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/fonts/HP001_4H_Normal.ttf')
            ]);
        },

        // 6. Nạp Font ArrayBuffer tự động (HP001 & Andika)
        async initFontsArrayBuffer(fontFamily = 'hp001') {
            if (fontFamily === 'andika') {
                const res = await fetch('https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/fonts/Andika-Regular.ttf');
                const buf = await res.arrayBuffer();
                const parsed = window.opentype.parse(buf);
                this.fontBold = parsed;
                this.fontNormal = parsed;
            } else {
                const [resBold, resNormal] = await Promise.all([
                    fetch('https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/fonts/HP001_4H_Bold.ttf'),
                    fetch('https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/fonts/HP001_4H_Normal.ttf')
                ]);
                const [bufBold, bufNormal] = await Promise.all([resBold.arrayBuffer(), resNormal.arrayBuffer()]);
                this.fontBold = window.opentype.parse(bufBold);
                this.fontNormal = window.opentype.parse(bufNormal);
            }
        },

        // 7. Hàm vẽ Vector gốc (_draw)
        _draw(gId, text, x, y, fSize, fObj, fill, stroke, sWidth) {
            const group = document.getElementById(gId);
            if (!group || !fObj) return;

            const bbox = fObj.getPath('x', 0, 0, fSize).getBoundingBox();
            const p = fObj.getPath(text, x, y - bbox.y2, fSize).toDOMElement(4);

            p.setAttribute('fill', fill);
            if (stroke) {
                p.setAttribute('stroke', stroke);
                p.setAttribute('stroke-width', sWidth);
            }
            p.removeAttribute('fill-opacity');
            group.appendChild(p);
        },

        // 8. Vẽ chữ mẫu Đỏ Đô / Đen
        drawBold(gId, text, x, y, size = 25) {
            this._draw(gId, text, x, y, size, this.fontBold, '#800000', '#800000', '0.4');
        },

        // 9. Vẽ chữ nét mờ cơ bản
        drawTrace(gId, text, x, y, size = 25) {
            this._draw(gId, text, x, y, size, this.fontNormal, '#475569', '#475569', '0.25');
        },

        // 10. Vẽ chữ tập tô mỏng 0.3px sắc nét (Opacity 85%)
        drawClearTrace(gId, text, x, y, size = 25) {
            this._draw(gId, text, x, y, size, this.fontNormal, '#334155', '#334155', '0.3');
            const group = document.getElementById(gId);
            if (group && group.lastChild) {
                group.lastChild.setAttribute('fill-opacity', '0.85');
                group.lastChild.setAttribute('stroke-opacity', '0.85');
            }
        },

        // 11. Bắn ký tự lọt lòng từng ô ly (Andika Cấp 2)
        drawGridAlignedLetters(gId, charArray, startX, gridY, isBold = true, size = 20) {
            charArray.forEach((char, idx) => {
                const x = startX + idx * 40;
                if (isBold) {
                    this._draw(gId, char, x, gridY, size, this.fontBold, '#800000', '#800000', '0.4');
                } else {
                    this.drawClearTrace(gId, char, x, gridY, size);
                }
            });
        }
    };
   
    // =========================================================================
    // --- 13. DOM AUTO ENGINES BUNDLE (MODE 1, MODE 2, MODE 2B) ----------------
    // =========================================================================
    function runAllDomAutoEngines() {
        initAutoMindmapEngine();
        initAutoCornellEngine();
        initAutoTrapsEngine();
        initAutoAdvancedEngine();
        initAutoSummaryEngine();
        initSmartSlideEngine();
        initSmartPdfA4Engine();
    }

    // A. AUTO MINDMAP ENGINE (THEME OFFLOADING)
    function initAutoMindmapEngine() {
        const wrappers = document.querySelectorAll('.edevx-mindmap-auto');
        if (!wrappers.length) return;
        wrappers.forEach(box => {
            if (box.querySelector('.markmap-wrapper')) return;
            const rawMd = box.innerText || box.textContent || '';
            const wrap = document.createElement('div');
            wrap.className = 'markmap-wrapper';
            wrap.innerHTML = `<textarea class="markmap-raw-md hidden">${rawMd}</textarea><svg class="markmap"></svg>`;
            box.innerHTML = '';
            box.appendChild(wrap);
        });
    }

    // B. AUTO CORNELL ENGINE
    function initAutoCornellEngine() {
        const wrappers = document.querySelectorAll('.edevx-cornell-auto');
        if (!wrappers.length) return;
        wrappers.forEach((box, idx) => {
            if (box.querySelector('.cornell-game-wrapper')) return;
            const summaryText = box.getAttribute('data-summary') || '';
            const rawItems = box.getAttribute('data-items');
            if (!rawItems) return;
            let items = []; try { items = JSON.parse(rawItems); } catch (e) { return; }
            const toggleId = `blur-mask-toggle-${idx}`;
            let html = `
            <div class="cornell-game-wrapper space-y-6 my-8">
                <input type="checkbox" id="${toggleId}" class="peer hidden" />
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 text-white p-5 rounded-3xl shadow-xl border-2 border-amber-300">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">🎮</span>
                        <div>
                            <div class="font-black text-base md:text-lg text-amber-300">CHẾ ĐỘ TỰ ĐỘNG CHE VỞ (ACTIVE RECALL)</div>
                            <p class="text-xs text-purple-100 font-medium">Bật công tắc để làm mờ toàn bộ bài chép ➔ Rê chuột/Chạm tay vào ô bất kỳ để mở rõ!</p>
                        </div>
                    </div>
                    <label for="${toggleId}" class="cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs md:text-sm px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105 shrink-0 flex items-center gap-2 select-none">
                        <i class="fas fa-sliders-h text-base"></i>
                        <span>👉 BẤM ĐỂ BẬT CHE VỞ (LÀM MỜ)</span>
                    </label>
                </div>
                <div class="bg-amber-50/40 dark:bg-zinc-900 border-4 border-dashed border-purple-400 dark:border-purple-600/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden peer-checked:[&_.blur-target]:blur-md peer-checked:[&_.blur-target]:opacity-30 transition-all">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div class="md:col-span-4 space-y-3 border-b-2 md:border-b-0 md:border-r-2 border-purple-200 dark:border-zinc-700 pb-4 md:pb-0 md:pr-4">
                            <div class="font-black text-xs uppercase text-purple-700 dark:text-purple-400 tracking-wider flex items-center gap-2 mb-2"><i class="fas fa-key"></i> CUES / CÂU HỎI MICRO-TEST</div>
                            ${items.map(it => `<div class="p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-purple-100 dark:border-zinc-700 text-xs md:text-sm font-bold text-slate-700 dark:text-zinc-300 shadow-sm">${it.cue}</div>`).join('')}
                        </div>
                        <div class="md:col-span-8 space-y-3">
                            <div class="font-black text-xs uppercase text-indigo-700 dark:text-indigo-400 tracking-wider flex items-center gap-2 mb-2"><i class="fas fa-sticky-note"></i> NOTES / KIẾN THỨC GHI CHÉP</div>
                            ${items.map(it => `<div class="blur-target hover:!blur-none hover:!opacity-100 transition-all duration-300 p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-purple-200 dark:border-zinc-700 text-xs md:text-sm text-slate-800 dark:text-zinc-200 shadow-sm">${it.note}</div>`).join('')}
                        </div>
                    </div>
                    ${summaryText ? `
                    <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white p-5 rounded-3xl shadow-xl space-y-2 border-2 border-amber-300 relative overflow-hidden mt-6">
                        <div class="flex items-center gap-2 font-black text-amber-300 text-sm uppercase tracking-wider"><i class="fas fa-ribbon text-xl"></i> SKETCHNOTE SUMMARY (TÓM TẮT BÀI HỌC)</div>
                        <p class="text-sm md:text-base font-bold leading-relaxed text-purple-50">${summaryText}</p>
                    </div>` : ''}
                </div>
            </div>`;
            box.innerHTML = html;
        });
    }

    // C. AUTO TRAPS ENGINE
    function initAutoTrapsEngine() {
        const wrappers = document.querySelectorAll('.edevx-traps-auto');
        if (!wrappers.length) return;
        wrappers.forEach(box => {
            if (box.querySelector('.edevx-box-red')) return;
            const rawItems = box.getAttribute('data-items');
            if (!rawItems) return;
            let items = []; try { items = JSON.parse(rawItems); } catch (e) { return; }
            let html = `
            <div class="edevx-box-red">
                <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-base">
                    <i class="fas fa-exclamation-triangle text-xl shrink-0"></i>
                    <span>🔴 Góc Bóc Tách Bẫy Sư Phạm Kinh Điển</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                    ${items.map(it => `
                        <div class="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-rose-200 dark:border-zinc-700 space-y-1">
                            <b class="text-rose-600">❌ ${it.title}</b><br />
                            <b>Sai:</b> ${it.wrong}. <b class="text-emerald-600">Đúng:</b> ${it.correct}.
                        </div>
                    `).join('')}
                </div>
            </div>`;
            box.innerHTML = html;
        });
    }

    // D. AUTO ADVANCED EXERCISES ENGINE
    function initAutoAdvancedEngine() {
        const wrappers = document.querySelectorAll('.edevx-advanced-auto');
        if (!wrappers.length) return;
        wrappers.forEach(box => {
            if (box.querySelector('.edevx-box-amber')) return;
            const rawItems = box.getAttribute('data-items');
            if (!rawItems) return;
            let items = []; try { items = JSON.parse(rawItems); } catch (e) { return; }
            let html = `
            <div class="edevx-box-amber">
                <div class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Nội dung nâng cao tham khảo phân hóa học sinh giỏi</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    ${items.map(it => `
                        <div class="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
                            <b>${it.q}</b>
                            <details class="mt-1"><summary class="font-bold text-amber-600 cursor-pointer">Đáp số</summary><p class="mt-1 text-slate-600 dark:text-zinc-400">${it.a}</p></details>
                        </div>
                    `).join('')}
                </div>
            </div>`;
            box.innerHTML = html;
        });
    }

    // E. AUTO SUMMARY BANNER ENGINE
    function initAutoSummaryEngine() {
        const wrappers = document.querySelectorAll('.edevx-summary-auto');
        if (!wrappers.length) return;
        wrappers.forEach(box => {
            if (box.querySelector('section')) return;
            const rawPoints = box.getAttribute('data-points');
            const challengeText = box.getAttribute('data-challenge') || '';
            const badgeText = box.getAttribute('data-badge') || 'EDEVX • BÀI HỌC TƯƠNG TÁC';
            if (!rawPoints) return;
            let points = []; try { points = JSON.parse(rawPoints); } catch (e) { return; }
            let html = `
            <section class="space-y-6 my-10">
                <h2 class="flex items-center gap-4 text-2xl md:text-3xl font-black text-slate-800 dark:text-zinc-100 border-none">
                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0"><i class="fas fa-flag-checkered text-xl"></i></div>
                    <span>Phần 7: Chốt Kiến Thức — Em Đã Làm Chủ Bài Học?</span>
                </h2>
                <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6 border-2 border-emerald-400">
                    <div class="text-center space-y-2">
                        <div class="text-4xl animate-bounce">🏆</div>
                        <div class="text-2xl font-black uppercase tracking-wider text-amber-300">5 ĐIỀU PHẢI NHỚ CỦA BÀI HỌC</div>
                        <p class="text-emerald-100 text-sm font-medium">Nếu thuộc lòng các điểm chốt dưới đây, em đã hoàn toàn chinh phục bài học này!</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium">
                        ${points.map((pt, i) => `
                            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-3 ${i===4?'md:col-span-2':''}">
                                <span class="bg-amber-400 text-slate-950 font-black rounded-lg w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">${i+1}</span>
                                <div>${pt}</div>
                            </div>
                        `).join('')}
                    </div>
                    ${challengeText ? `
                    <div class="bg-white text-slate-800 rounded-2xl p-5 text-center space-y-2 shadow-lg">
                        <div class="font-black text-lg text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-2"><span>🎯 THỬ THÁCH NÓI THÀNH LỜI</span></div>
                        <p class="text-sm font-medium leading-relaxed">Không nhìn đáp án, hãy tự phát biểu thành lời trước gương: <br /><b class="text-indigo-600">"${challengeText}"</b></p>
                    </div>` : ''}
                </div>
                <div class="border-t-2 border-slate-200 dark:border-zinc-800 pt-6 mt-10 text-center space-y-2">
                    <div class="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 dark:bg-zinc-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-black border border-indigo-200 dark:border-zinc-700 shadow-sm">
                        <i class="fas fa-graduation-cap text-base text-indigo-500"></i>
                        <span>${badgeText}</span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium">Hoàn thành 100% chương trình GDPT 2018</p>
                </div>
            </section>`;
            box.innerHTML = html;
        });
    }

    // F. SMART SLIDE DECK ENGINE (MODE 2)
    function initSmartSlideEngine() {
        const slides = document.querySelectorAll('.slide-container');
        if (!slides.length) return;
        const total = slides.length;

        slides.forEach((slide, idx) => {
            if (slide.querySelector('.slide-header-bar') || slide.querySelector('.border-b-4')) return;

            const cat = slide.getAttribute('data-category') || 'BÀI GIẢNG';
            const slideTitle = slide.getAttribute('data-title') || '';
            const num = (idx + 1).toString().padStart(2, '0');
            const totNum = total.toString().padStart(2, '0');

            const headerDiv = document.createElement('div');
            headerDiv.className = 'slide-header-bar flex justify-between items-center border-b-4 border-slate-100 pb-4 mb-4';
            headerDiv.innerHTML = `
                <span class="text-sm font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                    <i class="fa-solid fa-bookmark mr-2"></i>${cat}
                </span>
                <span class="text-sm font-bold text-slate-400">Slide ${num} / ${totNum}</span>
            `;
            slide.insertBefore(headerDiv, slide.firstChild);

            if (!slide.querySelector('.slide-footer-bar') && !slide.querySelector('.border-t-4')) {
                const footerDiv = document.createElement('div');
                footerDiv.className = 'slide-footer-bar flex justify-between items-center text-sm text-slate-400 border-t-4 border-slate-100 pt-4 mt-auto';
                footerDiv.innerHTML = `
                    <span>${slideTitle || 'Education DevX Presentation'}</span>
                    <span class="font-bold text-slate-500">EDEVX SLIDE ENGINE</span>
                `;
                slide.appendChild(footerDiv);
            }
        });

        if (!document.querySelector('.no-print.fixed.bottom-6.right-6')) {
            const printBtnDiv = document.createElement('div');
            printBtnDiv.className = 'no-print fixed bottom-6 right-6 z-50 flex items-center gap-3';
            printBtnDiv.innerHTML = `
                <div class="bg-slate-900/95 text-white px-6 py-4 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 text-sm border border-slate-700">
                    <span class="font-extrabold text-slate-200 uppercase tracking-wider"><i class="fa-solid fa-fire text-amber-500 mr-2 text-lg"></i>EDEVX SLIDE MODE</span>
                    <div class="h-5 w-px bg-slate-700"></div>
                    <button onclick="window.print()" class="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg">
                        <i class="fa-solid fa-file-pdf mr-1 text-sm"></i> Xuất PDF Slide
                    </button>
                </div>
            `;
            document.body.appendChild(printBtnDiv);
        }
    }

    // G. SMART PDF A4 ENGINE (MODE 2B)
    function initSmartPdfA4Engine() {
        const pages = document.querySelectorAll('.a4-page-demo');
        if (!pages.length) return;
        const totalPages = pages.length;

        let ws = document.getElementById('edevx-pdf-workspace');
        if (!ws) {
            ws = document.createElement('div');
            ws.id = 'edevx-pdf-workspace';
            pages.forEach(p => ws.appendChild(p));
            document.body.appendChild(ws);

            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.add('pdf-mode-active');
            document.body.classList.add('pdf-mode-active');

            Array.from(document.body.children).forEach(child => {
                if (child.id !== 'edevx-pdf-workspace' && !['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) {
                    child.style.display = 'none'; child.style.height = '0'; child.style.margin = '0'; child.style.padding = '0';
                }
            });
        }

        if (!ws.querySelector('.pdf-toolbar')) {
            const tb = document.createElement('div');
            tb.className = 'pdf-toolbar no-print';
            tb.innerHTML = `
                <div class="flex items-center gap-3 text-white text-sm font-bold">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">EDEVX PDF A4 ENGINE</span>
                    <span>PHIẾU BÀI TẬP TỔNG HỢP (CHUẨN ${totalPages} TRANG)</span>
                </div>
                <button onclick="window.print()" class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                    <i class="fa-solid fa-print text-sm"></i> IN PHIẾU PDF A4
                </button>
            `;
            ws.insertBefore(tb, ws.firstChild);
        }

        pages.forEach((page, idx) => {
            if (!page.querySelector('.a4-footer')) {
                const footer = document.createElement('div');
                footer.className = 'a4-footer';
                footer.innerHTML = `<span>Trang ${idx + 1} / ${totalPages}</span>`;
                page.appendChild(footer);
            }
        });

        window.toggleAnswers = function() {
            const box = document.getElementById('answer-key-content');
            if (box) box.classList.toggle('hidden');
        };
    }

           
    // ĐÓNG SỰ KIỆN DOMContentLoaded TỔNG TOÀN BỘ FILE
});