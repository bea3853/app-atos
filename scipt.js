/**
 * script.js
 * Gerenciador de interação, menus, modais e efeitos de cards 3D.
 */

// Dados das letras dos Louvores
const lyricsData = {
    'letra-1': {
        title: "Vem Habitar",
        artist: "Ministério de Adoração",
        body: `Vem habitar em nós, Senhor
        Faz Teu trono em nosso altar
        A nossa alma clama por Ti
        Queremos ver Tua glória reinar
        
        Santo, Santo é o Senhor
        A nossa oferta é o nosso amor
        Vem incendiar este lugar
        Vem sobre nós habitar...`
    },
    'letra-2': {
        title: "A Ele a Glória",
        artist: "Coral de Jovens",
        body: `Porque Dele e por Ele
        E para Ele são todas as coisas
        A Ele a glória, para sempre
        Amém!
        
        Quão profundas riquezas
        Do saber e do conhecer de Deus
        Seus juízos são insondáveis
        Seus caminhos caminhos de amor.`
    },
    'letra-3': {
        title: "Santo Espírito",
        artist: "Adoração & Fé",
        body: `Não há nada igual
        Não há nada melhor
        Que a Tua presença, meu Consolador
        
        Espírito Santo, és bem-vindo aqui
        Inunda o meu ser, toma o Teu lugar
        Queremos sentir Teu mover de amor
        Ser guiados por Ti, ó meu Senhor.`
    },
    'letra-4': {
        title: "Ruja o Leão",
        artist: "Geração Eleita",
        body: `A terra treme diante do Rei
        Os povos se dobram ao Teu poder
        O Teu exército se levanta
        Para declarar que és o Senhor
        
        Ruja o Leão da Tribo de Judá
        Vem neste templo reinar
        Quebra as cadeias, traz libertação
        Cria em nós um novo coração.`
    }
};

// Elementos DOM
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-link");
const modal = document.getElementById("lyrics-modal");
const modalTitle = document.getElementById("modal-title");
const modalArtist = document.getElementById("modal-artist");
const modalBody = document.getElementById("modal-body");
const downloadBtn = document.getElementById("download-btn");

// Init
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initThreeDCardEffect();
    initPdfDownloadMock();
});

// 1. Menu Responsivo & Rolagem Suave
function initNavigation() {
    // Hamburger Menu Toggle
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Fecha menu ao clicar em qualquer item
    navLinks.forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // Scroll Spy e Mudança de Navbar Fixa
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Detecta qual seção está ativa para marcar na Navbar
        let currentSection = "";
        const sections = document.querySelectorAll("section, header");
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active");
            }
        });
    });
}

// 2. Modais de Letras
function openModal(songId) {
    const song = lyricsData[songId];
    if (song && modal) {
        modalTitle.textContent = song.title;
        modalArtist.textContent = song.artist;
        modalBody.textContent = song.body;
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Desativa scroll do fundo
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto"; // Reativa scroll
    }
}

// Fecha modal clicando fora da caixa de conteúdo
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

// 3. Efeito Parallax/3D de Cards (Tesla/Apple Style)
function initThreeDCardEffect() {
    const cards = document.querySelectorAll(".card-3d");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // coordenada X dentro do elemento
            const y = e.clientY - rect.top;  // coordenada Y dentro do elemento

            // Calcula inclinação relativa ao centro do card
            const rotateX = (rect.height / 2 - y) / 12; // limite de 15 graus
            const rotateY = -(rect.width / 2 - x) / 12;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reseta o card quando o mouse sai do elemento
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    });
}

// 4. Mock para Geração e Download de PDF nativo sem backend
function initPdfDownloadMock() {
    if (!downloadBtn) return;

    downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Altera o texto para indicar processamento elegante
        const originalContent = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<span class="shiny-effect"></span><i class="fa-solid fa-spinner fa-spin"></i> Gerando Convite...`;
        
        setTimeout(() => {
            // Criação de uma imagem em Canvas convertida de forma nativa para PDF falso
            // Isso evita a necessidade de um backend ou dependência de pacotes pesados no Netlify
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 800;
            const ctx = canvas.getContext('2d');
            
            // Desenha um convite digital bonito dentro do canvas
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(0, 0, 600, 800);
            
            // Bordas e Detalhes
            ctx.strokeStyle = '#e63946';
            ctx.lineWidth = 6;
            ctx.strokeRect(20, 20, 560, 760);
            
            // Texto
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Georgia';
            ctx.textAlign = 'center';
            ctx.fillText('CONGRESSO SANTIFICADOS', 300, 200);
            
            ctx.fillStyle = '#e63946';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('CATEDRAL DA ALIANÇA', 300, 250);
            
            ctx.fillStyle = '#a0a0a5';
            ctx.font = 'italic 20px Georgia';
            ctx.fillText('"Segui a paz com todos e a santificação..."', 300, 360);
            ctx.fillText('Hebreus 12:14', 300, 400);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Arial';
            ctx.fillText('Data: 14 a 18 de Outubro, 2026', 300, 520);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = '#a0a0a5';
            ctx.fillText('Sua presença é essencial para nós.', 300, 570);
            
            // Transforma o canvas em um link de download de imagem (JPEG/PNG) de alta qualidade
            // No Netlify, isso funciona instantaneamente, sem travar o navegador
            const link = document.createElement('a');
            link.download = 'convite-congresso-2026.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Restaura o botão original
            downloadBtn.innerHTML = originalContent;
        }, 1500);
    });
}