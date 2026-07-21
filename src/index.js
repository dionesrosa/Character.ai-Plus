// Consulta segura (retorna null em caso de erro)
const consultaSegura = (seletor, raiz = document) => {
    try {
        return raiz.querySelector(seletor);
    } catch (e) {
        return null;
    }
};

// Consulta segura para múltiplos elementos (retorna array vazio em caso de erro)
const consultaTodosSegura = (seletor, raiz = document) => {
    try {
        return Array.from(raiz.querySelectorAll(seletor));
    } catch (e) {
        return [];
    }
};

// Limpeza avançada de falas e ações, removendo excessos de formatação e caracteres comuns
function limparFala(texto) {
    // Remove excessos de espaços e caracteres comuns de formatação
    texto = texto.trim();

    // Limpeza avançada de aspas (remove aspas órfãs, desduplica aspas adjacentes, remove envelopes externos balanceados)
    texto = limparAspas(texto);

    // Remove travessões e marcadores comuns no início
    texto = texto.replace(/^[-–—]+\s*/, '');

    // Remove marcadores comuns no início e fim (ex: asteriscos, underscores, etc.)
    texto = texto.replace(/^[\s*_]+/, '');
    texto = texto.replace(/[\s*_]+$/, '');

    // Remove excessos de espaços novamente após as limpezas
    texto = texto.trim();

    return texto;
}

// Limpeza avançada de aspas (remove aspas órfãs, desduplica aspas adjacentes, remove envelopes externos balanceados)
function limparAspas(texto) {
    // Verifica se é string, caso contrário retorna o valor original
    if (typeof texto !== 'string') return texto;

    // Normaliza e remove excessos de aspas
    let res = texto.trim();

    // Se o resultado for vazio, retorna imediatamente
    if (!res) return res;

    // Normaliza aspas curvas e outros tipos comuns para aspas simples ou duplas
    res = res.replace(/[“”«»]/g, '"');
    res = res.replace(/[‘’]/g, "'");

    // Função auxiliar para verificar se um caractere é uma aspa
    const isQuote = c => c === '"' || c === "'";

    // Conta aspas não escapadas em uma string
    const countQuotes = (s, char) => {
        let count = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === char && (i === 0 || s[i-1] !== '\\')) count++;
        }
        return count;
    };

    // 1. Desduplicar aspas adjacentes (comum em erros de formatação)
    // Ex: ""Texto"" -> "Texto"
    res = res.replace(/"+/g, '"').replace(/'+/g, "'");

    // 2. Remover envelopes externos balanceados (ex: "Texto" -> Texto)
    let changed = true;
    while (changed) {
        changed = false;
        if (res.length >= 2 && isQuote(res[0]) && res[0] === res[res.length - 1]) {
            let char = res[0];
            let content = res.slice(1, -1);
            if (countQuotes(content, char) % 2 === 0) {
                res = content.trim();
                changed = true;
            }
        }
    }

    // 3. Limpar aspas órfãs (ímpares) nas extremidades
    changed = true;
    while (changed) {
        changed = false;
        ['"', "'"].forEach(char => {
            let count = countQuotes(res, char);
            if (count % 2 !== 0) {
                if (res.startsWith(char)) {
                    res = res.slice(1).trim();
                    changed = true;
                } else if (res.endsWith(char)) {
                    res = res.slice(0, -1).trim();
                    changed = true;
                }
            }
        });
    }

    // 4. Se ainda houver aspas órfãs (total ímpar), remove a primeira ocorrência
    ['"', "'"].forEach(char => {
        let count = countQuotes(res, char);
        if (count % 2 !== 0) {
            let idx = res.indexOf(char);
            if (idx !== -1) {
                res = res.slice(0, idx) + res.slice(idx + 1);
                res = res.trim();
            }
        }
    });

    return res;
}

// Log de aviso personalizado
function logAviso(...args) {
    console.warn('[C.AI-Extras]', ...args);
}

// CSS personalizado
GM_addStyle(`
    .caiextras-linha-fala {
        display: block;
        margin: 6px 0;
    }

    .caiextras-linha-narracao {
        display: block;
        margin: 6px 0;
    }

    .caiextras-fala {
        font-weight: 600;
    }

    .caiextras-narracao {
        color: #ff8ac7;
        font-style: italic;
        opacity: .9;
    }

    [data-testid="completed-message"] ul,
    [data-testid="streaming-message"] ul {
        list-style: none !important;
        padding-left: 0 !important;
        margin: 0 !important;
    }
`);

// Oculta blocos de anúncios
function ocultarAnuncios() {
    try {
        const banners = consultaTodosSegura('button').forEach(banner => {
            // Evita processar o mesmo botão várias vezes
            if (banner.dataset.caiextrasProcessado) return;

            banner.dataset.caiextrasProcessado = '1';

            // Verifica se o texto visível OU o aria-label contêm "Ocultar anúncios"
            const temTexto = banner.textContent.includes('Ocultar anúncios');
            const temAriaLabel = banner.getAttribute('aria-label')?.includes('Ocultar anúncios') || false;

            if (temTexto || temAriaLabel) {
                banner.closest('div.w-full')
                    ?.style.setProperty('display', 'none', 'important');
            }
        });

    } catch (erro) {
        console.error('[C.AI-Extras] Erro ao ocultar anúncios:', erro);
    }
}

let fechandoModal = false;

function fecharModal() {
    if (fechandoModal) return;

    fechandoModal = true;

    let tentativas = 0;

    const timer = setInterval(() => {
        const botao = document.querySelector('button[aria-label="Fechar"]');

        if (botao) {
            botao.click();
        }

        const dialog = document.querySelector('[role="dialog"]');

        if (++tentativas >= 20 || !dialog) {
            clearInterval(timer);
            fechandoModal = false;
        }
    }, 100);
}

function formatarMensagens() {
    document.querySelectorAll(`
        [data-testid="completed-message"] p,
        [data-testid="streaming-message"] p,
        [data-testid="completed-message"] li,
        [data-testid="streaming-message"] li
    `).forEach(p => {
        if (p.dataset.caiextrasFormatado) return;

        p.dataset.caiextrasFormatado = '1';

        const nos = Array.from(p.childNodes);

        // Caso especial: apenas um EM (narrativa) sem fala
        if (
            nos.length === 1 &&
            nos[0].nodeType === Node.ELEMENT_NODE &&
            nos[0].tagName === 'EM'
        ) {

            const texto = limparFala(nos[0].textContent);

            p.innerHTML = `<span class="caiextras-narracao">(${texto})</span>`;

            return;
        }

        let html = '';
        let falaAtual = '';

        nos.forEach(no => {

            // Texto puro = fala
            if (
                no.nodeType === Node.TEXT_NODE
            ) {

                const texto = limparFala(no.textContent);

                if (!texto) return;

                falaAtual = texto;
            }

            // EM = narrativa
            else if (
                no.nodeType === Node.ELEMENT_NODE &&
                no.tagName === 'EM'
            ) {

                const texto = limparFala(no.textContent);

                if (falaAtual) {
                    html += `<span class="caiextras-linha-fala"><strong class="caiextras-fala">— ${falaAtual}</strong><span class="caiextras-narracao"> (${texto})</span></span>`;
                    falaAtual = '';
                } else {
                    html += `<span class="caiextras-linha-narracao"><span class="caiextras-narracao">(${texto})</span></span>`;
                }
            }

            // LI = fala em lista (ex: ações de grupo)
            else if (
                no.nodeType === Node.ELEMENT_NODE &&
                no.tagName === 'LI'
            ) {
                const texto = limparFala(no.textContent);

                if (texto) {
                    html += `<span class="caiextras-linha-fala"><strong class="caiextras-fala">— ${texto}</strong></span>`;
                }

                return;
            }

            // STRONG = fala em negrito (ex: ações de grupo já formatadas)
            else if (
                no.nodeType === Node.ELEMENT_NODE &&
                no.tagName === 'STRONG'
            ) {
                const texto = limparFala(no.textContent);

                if (texto) {
                    html += `<span class="caiextras-linha-fala"><strong class="caiextras-fala">— ${texto}</strong></span>`;
                }

                return;
            }

        });

        // Sobrou fala sem ação
        if (falaAtual) {
            html += `<span class="caiextras-linha-fala"><strong class="caiextras-fala">— ${falaAtual}</strong></span>`;
        }

        p.innerHTML = html;
    });
}

// Executa uma vez ao iniciar
ocultarAnuncios();
formatarMensagens();

// Observa mudanças no DOM
const observador = new MutationObserver(() => {
    ocultarAnuncios();
    formatarMensagens();
    fecharModal();
});

observador.observe(document.body, {
    childList: true,
    subtree: true
});