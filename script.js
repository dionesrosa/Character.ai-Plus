// ==UserScript==
// @name         Character.AI Extras
// @namespace    https://github.com/dionesrosa
// @version      1.0.2
// @description  Ajustes especificos para o Character.ai
// @author       Diones Souza
// @license      MIT
// @icon         https://character.ai/favicon.ico
// @homepageURL  https://github.com/dionesrosa/Character-AI-Extras
// @supportURL   https://github.com/dionesrosa/Character-AI-Extras/issues
// @updateURL    https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/script.js
// @downloadURL  https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/script.js
// @match        *://character.ai/*
// @run-at       document-idle
// @grant        GM_addStyle
// @noframes
// ==/UserScript==

(function () {
    'use strict';

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
    `);

    // Oculta blocos de anúncios
    function ocultarAnuncios() {
        try {
            consultaTodosSegura('button').forEach(btn => {

                // Evita processar o mesmo botão várias vezes
                if (btn.dataset.caiextrasProcessado) return;
                btn.dataset.caiextrasProcessado = '1';

                if (btn.textContent.includes('Ocultar anúncios')) {
                    btn.closest('div.w-full')
                        ?.style.setProperty('display', 'none', 'important');
                }
            });

        } catch (erro) {
            console.error('[C.AI-Extras] Erro ao ocultar anúncios:', erro);
        }
    }

    function formatarMensagens() {
        document.querySelectorAll('[data-testid="completed-message"] p, [data-testid="streaming-message"] p').forEach(p => {
            if (p.dataset.caiextrasFormatado) return;

            p.dataset.caiextrasFormatado = '1';

            const nos = Array.from(p.childNodes);

            // Narrativa pura
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

                // Texto = fala
                if (no.nodeType === Node.TEXT_NODE) {

                    const texto = limparFala(no.textContent);

                    if (!texto) return;

                    falaAtual = texto;
                }

                // EM = ação
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
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

})();