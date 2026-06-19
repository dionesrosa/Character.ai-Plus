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

    // --- FUNÇÕES DE UTILIDADE (HELPERS) ---
    const consultaSegura = (seletor, raiz = document) => {
        try {
            return raiz.querySelector(seletor);
        } catch (e) {
            return null;
        }
    };

    const consultaTodosSegura = (seletor, raiz = document) => {
        try {
            return Array.from(raiz.querySelectorAll(seletor));
        } catch (e) {
            return [];
        }
    };

    function logAviso(...args) {
        console.warn('[C.AI-Extras]', ...args);
    }

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

    // Executa uma vez ao iniciar
    ocultarAnuncios();

    // Observa mudanças no DOM
    const observador = new MutationObserver(() => {
        ocultarAnuncios();
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

})();