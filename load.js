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
// @updateURL    https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/script.js
// @downloadURL  https://raw.githubusercontent.com/dionesrosa/Character-AI-Extras/master/script.js
// @match        *://character.ai/*
// @run-at       document-idle
// @grant        GM_addStyle
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      127.0.0.1
// ==/UserScript==

(function() {
    'use strict';

    const scriptVersion = '0.1';
    const scriptName = 'Character.AI Extras';
    const localScriptUrl = 'http://localhost:3000/script.js';
    const fetchUrl = `${localScriptUrl}?t=${Date.now()}`;

    if (window.top !== window.self) {
        console.log(`${scriptName} local loader skipped inside iframe.`);
        return;
    }

    function loadLocalScript() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: fetchUrl,
            onload(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        eval(response.responseText);
                        console.log(`${scriptName} carregado via load.js (${fetchUrl})`);
                    } catch (error) {
                        console.error(`Erro ao executar script ${scriptName}:`, error);
                    }
                } else {
                    console.error(`Falha ao buscar o script local ${scriptName}:`, response.status, response.statusText);
                }
            },
            onerror(error) {
                console.error(`Erro de requisição ao carregar ${scriptName} local:`, error);
            }
        });
    }

    loadLocalScript();
})();