// ==UserScript==
// @name         Character.AI Extras
// @namespace    https://github.com/dionesrosa
// @version      0.1
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

    // Log de aviso personalizado
    function logAviso(...args) {
        console.warn('[C.AI-Extras]', ...args);
    }

     // CSS personalizado
    GM_addStyle(`
        .caiextras-acao {
            border-left: 3px solid #ff1493;
            padding-left: 12px !important;
            margin-left: 4px !important;
            opacity: 0.85;
            font-style: italic;
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

    // Destaca mensagens de ações (itálico único)
    function destacarAcoes() {
        document.querySelectorAll('[data-testid="completed-message"] p').forEach(p => {

            if (p.dataset.caiextrasAcao) return;

            const unicoFilho = p.children.length === 1;
            const ehItalico = p.firstElementChild?.tagName === 'EM';

            if (unicoFilho && ehItalico) {
                p.dataset.caiextrasAcao = '1';
                p.classList.add('caiextras-acao');
            }
        });
    }

    // Executa uma vez ao iniciar
    ocultarAnuncios();
    destacarAcoes();

    // Observa mudanças no DOM
    const observador = new MutationObserver(() => {
        ocultarAnuncios();
        destacarAcoes();
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

})();