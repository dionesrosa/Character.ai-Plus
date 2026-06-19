// ==UserScript==
// @name         Character.AI Extras
// @namespace    https://github.com/dionesrosa
// @version      1.0.0
// @description  Ajustes especificos para o Character.ai
// @author       Diones Souza
// @license      MIT
// @icon         https://character.ai/favicon.ico
// @homepageURL  https://github.com/dionesrosa/Character-AI-Extras
// @supportURL   https://github.com/dionesrosa/Character-AI-Extras/issues
// @updateURL    https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/Character-AI-Extras.user.js
// @downloadURL  https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/Character-AI-Extras.user.js
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

    // Limpeza de texto para falas (remove espaços extras, aspas, travessões e marcadores comuns)
    function limparFala(texto) {
        return texto
            .trim()

            // aspas só nas bordas
            .replace(/^["'“”]+/, '')
            .replace(/["'“”]+$/, '')

            // travessão/hífen no início
            .replace(/^[-–—]+\s*/, '')

            // remove QUALQUER sequência de * ou _ nas bordas
            .replace(/^[\s*_]+/, '')
            .replace(/[\s*_]+$/, '')

            // limpa espaços finais depois de remoções
            .trim();
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
        document.querySelectorAll(
            '[data-testid="completed-message"] p'
        ).forEach(p => {
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