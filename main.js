// Trocamos a CDN para esm.sh, que é uma alternativa mais robusta para carregar módulos ES.
import { scroll, animate } from "https://esm.sh/motion";

/**
 * Animações de Rolagem com Motion One
 *
 * Itera sobre cada seção de conteúdo (exceto a primeira, #home)
 * e aplica uma animação que é controlada pela rolagem da página.
 *
 * A animação faz a seção surgir (opacidade de 0 a 1) e deslizar
 * para cima (de 100px para 0px).
 *
 * O `offset` define quando a animação começa e termina:
 * - "start end": A animação começa quando o topo da seção atinge a parte inferior da tela.
 * - "center center": A animação termina quando o centro da seção atinge o centro da tela.
 */
document.querySelectorAll('.secao-conteudo:not(#home)').forEach((section) => {
    scroll(
        animate(section, {
            opacity: [0, 1],
            transform: ["translateY(50px)", "translateY(0px)"]
        }),
        {
            target: section,
            offset: ["start end", "center center"]
        }
    );
});


/**
 * Lógica para o Formulário de Contato
 *
 * Captura o envio do formulário, envia os dados para o Formspree
 * e exibe uma notificação (toast) de sucesso ou erro.
 */
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

if (form && toast) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const action = form.getAttribute('action');

        fetch(action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            showToast(response.ok ? 'Mensagem enviada com sucesso!' : 'Ocorreu um erro ao enviar.');
            if (response.ok) form.reset();
        }).catch(() => showToast('Ocorreu um erro ao enviar.'));
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}