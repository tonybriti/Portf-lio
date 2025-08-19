// Importa as funções de animação da biblioteca Motion One.
import { scroll, animate } from "https://esm.sh/motion";

/**
 * Animação de entrada para as seções ao rolar a página.
 *
 * Utiliza a biblioteca Motion One para animar a opacidade e a posição
 * de cada seção conforme ela entra na área visível da tela.
 */
document.querySelectorAll('.secao-conteudo:not(#home)').forEach((section) => {
    scroll(
        animate(section, {
            opacity: [0, 1],
            transform: ["translateY(50px)", "translateY(0px)"]
        }), {
            target: section,
            offset: ["start end", "center center"]
        }
    );
});

/**
 * Lógica para destacar o link de navegação da seção ativa.
 *
 * Utiliza a API IntersectionObserver para detectar eficientemente qual
 * seção está visível na tela e adiciona uma classe 'active' ao link
 * correspondente na barra de navegação lateral.
 */
function setupActiveSectionObserver() {
    const sections = document.querySelectorAll('.secao-conteudo');
    const navLinks = document.querySelectorAll('.botoes-laterais__link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.botoes-laterais__link[href="#${id}"]`);

                // Remove a classe ativa de todos os links
                navLinks.forEach(link => link.classList.remove('botoes-laterais__link--active'));

                // Adiciona a classe ativa ao link da seção visível
                if (activeLink) {
                    activeLink.classList.add('botoes-laterais__link--active');
                }
            }
        });
    }, { threshold: 0.5 }); // A seção é considerada ativa quando 50% dela está visível

    sections.forEach(section => observer.observe(section));
}

setupActiveSectionObserver();

/**
 * Lógica para o Carrossel de Certificados
 *
 * Controla a navegação por cliques, movendo o contêiner de certificados
 * para a esquerda ou direita e atualizando o estado dos botões.
 */
function setupCertificateCarousel() {
    const carousel = document.querySelector('.certificados-carousel');
    if (!carousel) return; // Se o carrossel não existir na página, não faz nada.

    const track = carousel.querySelector('.certificados-track');
    const cards = Array.from(track.children);
    const nextButton = carousel.querySelector('.next');
    const prevButton = carousel.querySelector('.prev');

    // Se não houver cards suficientes para rolar, esconde os botões.
    if (track.scrollWidth <= carousel.clientWidth) {
        if (nextButton) nextButton.style.display = 'none';
        if (prevButton) prevButton.style.display = 'none';
        return;
    }

    // Assumindo que os cards foram duplicados no HTML
    const originalCardCount = cards.length / 2;
    let currentIndex = 0;
    let isTransitioning = false;

    const getMoveDistance = () => {
        if (cards.length === 0) return 0;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        return cardWidth + gap;
    };

    const moveTrack = () => {
        track.style.transform = `translateX(-${currentIndex * getMoveDistance()}px)`;
    };

    nextButton.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        track.style.transition = 'transform 0.5s ease-in-out';
        moveTrack();
    });

    prevButton.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (currentIndex === 0) {
            // Salto "invisível" para o final da lista de clones
            track.style.transition = 'none';
            currentIndex = originalCardCount;
            moveTrack();
            track.offsetHeight; // Força o navegador a aplicar a mudança imediatamente
        }

        currentIndex--;
        track.style.transition = 'transform 0.5s ease-in-out';
        moveTrack();
    });

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        // Se chegamos na cópia do primeiro item, saltamos de volta para o original
        if (currentIndex >= originalCardCount) {
            track.style.transition = 'none';
            currentIndex = 0;
            moveTrack();
        }
    });

    const handleResize = () => {
        track.style.transition = 'none';
        currentIndex = 0; // Reseta a posição ao redimensionar
        moveTrack();
    };

    setTimeout(handleResize, 100); // Executa após um pequeno delay para garantir que o layout esteja calculado
    window.addEventListener('resize', handleResize);
}

setupCertificateCarousel();

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