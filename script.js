// --- CLASSE CARTA ---
class Carta {
    constructor(valor, naipe) {
        this.valor = valor; // '4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'
        this.naipe = naipe; // 'Paus', 'Copas', 'Espadas', 'Ouros'
    }

    // Retorna a representação da carta para exibição
    toString() {
        // Você pode mapear para símbolos de naipe se quiser: ♥ ♦ ♣ ♠
        return `${this.valor} de ${this.naipe}`;
    }

    // Calcula a força básica da carta. A lógica de manilhas será adicionada no JogoTruco.
    getForcaBase() {
        const ordemTruco = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
        return ordemTruco.indexOf(this.valor);
    }
}

// --- CLASSE BARALHO ---
class Baralho {
    constructor() {
        this.cartas = [];
        this.criarBaralho();
    }

    criarBaralho() {
        const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
        const naipes = ['Paus', 'Copas', 'Espadas', 'Ouros']; // Ajustado para os naipes do Truco

        for (let naipe of naipes) {
            for (let valor of valores) {
                this.cartas.push(new Carta(valor, naipe));
            }
        }
    }

    embaralhar() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]]; // Troca de elementos
        }
    }

    distribuir(numCartas) {
        if (this.cartas.length < numCartas) {
            this.enviarMensagem("Não há cartas suficientes no baralho para distribuir.", true);
            return [];
        }
        return this.cartas.splice(0, numCartas); // Remove do início do array
    }
}

// --- CLASSE JOGADOR ---
class Jogador {
    constructor(nome) {
        this.nome = nome;
        this.mao = [];
        this.pontosRodada = 0; // Pontos ganhos na rodada atual (melhor de 3 mãos)
    }

    receberCartas(cartas) {
        this.mao = cartas;
        this.mao.sort((a, b) => a.getForcaBase() - b.getForcaBase()); // Opcional: ordenar a mão
    }

    jogarCarta(cartaIndex) {
        if (cartaIndex < 0 || cartaIndex >= this.mao.length) {
            this.enviarMensagem("Índice de carta inválido.", true);
            return null;
        }
        return this.mao.splice(cartaIndex, 1)[0]; // Remove e retorna a carta
    }
}

// --- CLASSE JOGO DE TRUCO ---
class JogoTruco {
    constructor(jogador1Nome, jogador2Nome) {
        this.jogador1 = new Jogador(jogador1Nome);
        this.jogador2 = new Jogador(jogador2Nome);
        this.placar = { [jogador1Nome]: 0, [jogador2Nome]: 0 };
        this.baralho = null;
        this.virada = null; // A carta virada que define as manilhas
        this.manilhas = {}; // Objeto para armazenar as manilhas (ex: {'Paus': 'Q', 'Copas': 'J'})

        this.rodadaAtual = 0;
        this.maoAtualNum = 0; // Contagem das "mãos" dentro da rodada (0, 1, 2)
        this.cartasNaMesa = []; // Cartas jogadas na mão atual
        this.quemEhAMao = null; // Referência ao objeto Jogador que é a mão da rodada
        this.quemComecaAMao = null; // Referência ao objeto Jogador que começa a jogar a mão atual

        // Elementos da interface
        this.elJogador1Pontos = document.getElementById('jogador1-pontos');
        this.elJogador2Pontos = document.getElementById('jogador2-pontos');
        this.elCartaVirada = document.getElementById('carta-virada');
        this.elMesaJogador1 = document.getElementById('carta-jogada-jogador1');
        this.elMesaJogador2 = document.getElementById('carta-jogada-jogador2');
        this.elMaoJogador1 = document.getElementById('mao-jogador1');
        this.elMensagens = document.getElementById('mensagens-jogo');
        this.btnNovaRodada = document.getElementById('btn-nova-rodada');
        this.btnTruco = document.getElementById('btn-truco');
        this.btnAceitar = document.getElementById('btn-aceitar');
        this.btnCorrer = document.getElementById('btn-correr');

        this.adicionarEventos();
        this.atualizarPlacarUI();
        this.enviarMensagem("Clique em 'Nova Rodada' para começar!");
    }

    adicionarEventos() {
        this.btnNovaRodada.addEventListener('click', () => this.iniciarNovaRodada());
        // Adicione eventos para os botões de truco, aceitar, correr aqui
        this.elMaoJogador1.addEventListener('click', (event) => {
            if (event.target.classList.contains('carta')) {
                const index = parseInt(event.target.dataset.index);
                this.jogarCarta(this.jogador1, index);
            }
        });
    }

    enviarMensagem(msg, isError = false) {
        this.elMensagens.textContent = msg;
        this.elMensagens.style.backgroundColor = isError ? '#dc3545' : '#17a2b8';
    }

    atualizarPlacarUI() {
        this.elJogador1Pontos.textContent = this.placar[this.jogador1.nome];
        this.elJogador2Pontos.textContent = this.placar[this.jogador2.nome];
    }

    // Renderiza as cartas na mão do jogador (no momento, apenas jogador1)
    renderizarMao(jogador) {
        this.elMaoJogador1.innerHTML = '<h3>Sua Mão:</h3>';
        jogador.mao.forEach((carta, index) => {
            const divCarta = document.createElement('div');
            divCarta.classList.add('carta', carta.naipe.toLowerCase()); // Adiciona classe para estilização de naipe
            divCarta.dataset.index = index;
            divCarta.innerHTML = `
                <span>${carta.valor}</span>
                <span>${this.getNaipeSimbolo(carta.naipe)}</span>
            `;
            this.elMaoJogador1.appendChild(divCarta);
        });
    }

    getNaipeSimbolo(naipe) {
        switch (naipe) {
            case 'Ouros': return '♦';
            case 'Espadas': return '♠';
            case 'Copas': return '♥';
            case 'Paus': return '♣';
            default: return '';
        }
    }

    renderizarCartaNaMesa(jogadorId, carta) {
        const elCartaMesa = jogadorId === 1 ? this.elMesaJogador1 : this.elMesaJogador2;
        if (carta) {
            elCartaMesa.classList.add('carta', carta.naipe.toLowerCase());
            elCartaMesa.innerHTML = `
                <span>${carta.valor}</span>
                <span>${this.getNaipeSimbolo(carta.naipe)}</span>
            `;
        } else {
            elCartaMesa.innerHTML = '';
            elCartaMesa.className = 'carta'; // Limpa classes de naipe
        }
    }

    iniciarNovaRodada() {
        this.rodadaAtual++;
        this.baralho = new Baralho();
        this.baralho.embaralhar();

        // Limpar cartas da mesa e da mão visualmente
        this.renderizarCartaNaMesa(1, null);
        this.renderizarCartaNaMesa(2, null);
        this.elMaoJogador1.innerHTML = '<h3>Sua Mão:</h3>'; // Limpa a mão visualmente
        this.jogador1.mao = []; // Limpa a mão do jogador
        this.jogador2.mao = []; // Limpa a mão do CPU

        this.virada = this.baralho.distribuir(1)[0];
        this.elCartaVirada.classList.add('carta', this.virada.naipe.toLowerCase());
        this.elCartaVirada.innerHTML = `
            <span>${this.virada.valor}</span>
            <span>${this.getNaipeSimbolo(this.virada.naipe)}</span>
        `;

        this.definirManilhas();

        this.jogador1.receberCartas(this.baralho.distribuir(3));
        this.jogador2.receberCartas(this.baralho.distribuir(3));

        this.renderizarMao(this.jogador1);

        this.maoAtualNum = 0; // Resetar para a primeira mão da rodada
        this.jogador1.pontosRodada = 0;
        this.jogador2.pontosRodada = 0;

        // Alternar quem é a "mão" (quem começa a rodada)
        this.quemEhAMao = (this.rodadaAtual % 2 === 1) ? this.jogador1 : this.jogador2;
        this.quemComecaAMao = this.quemEhAMao; // Quem é a mão começa a primeira "mão"

        this.enviarMensagem(`--- INÍCIO DA RODADA ${this.rodadaAtual} ---`);
        this.enviarMensagem(`Carta virada: ${this.virada}. ${this.quemEhAMao.nome} é a mão.`);

        // Habilitar/desabilitar botões
        this.btnNovaRodada.disabled = true;
        this.btnTruco.disabled = false;

        // Se o CPU for a mão, ele joga primeiro
        if (this.quemComecaAMao === this.jogador2) {
            this.jogadaCPU();
        }
    }

    definirManilhas() {
        const ordemValores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
        const indexVirada = ordemValores.indexOf(this.virada.valor);
        const valorManilha = ordemValores[(indexVirada + 1) % ordemValores.length];

        this.manilhas = {
            'Paus': null, 'Copas': null, 'Espadas': null, 'Ouros': null
        };

        // As manilhas são o valor 'seguinte' em cada naipe, com uma ordem de desempate de naipes
        // A ordem de desempate das manilhas é Copas < Ouros < Espadas < Paus (Zé, Gato, Cachorro, Zap)
        const ordemNaipesManilha = ['Copas', 'Ouros', 'Espadas', 'Paus'];
        let manilhaIndex = 0;
        for (let naipe of ordemNaipesManilha) {
            this.manilhas[naipe] = { valor: valorManilha, ordem: manilhaIndex++ };
        }
    }

    // Compara duas cartas e retorna o vencedor (1 para carta1, 2 para carta2, 0 para empate)
    compararCartas(carta1, carta2) {
        // 1. Verificar se são manilhas
        const isManilha1 = this.manilhas[carta1.naipe] && this.manilhas[carta1.naipe].valor === carta1.valor;
        const isManilha2 = this.manilhas[carta2.naipe] && this.manilhas[carta2.naipe].valor === carta2.valor;

        if (isManilha1 && isManilha2) {
            return this.manilhas[carta1.naipe].ordem > this.manilhas[carta2.naipe].ordem ? 1 : 2;
        } else if (isManilha1) {
            return 1; // Carta1 é manilha e Carta2 não
        } else if (isManilha2) {
            return 2; // Carta2 é manilha e Carta1 não
        }

        // 2. Se não são manilhas, comparar pela força base
        const forca1 = carta1.getForcaBase();
        const forca2 = carta2.getForcaBase();

        if (forca1 > forca2) {
            return 1;
        } else if (forca2 > forca1) {
            return 2;
        } else {
            return 0; // Empate
        }
    }

    jogarCarta(jogador, cartaIndex) {
        if (jogador !== this.quemComecaAMao) {
            this.enviarMensagem(`Não é a vez de ${jogador.nome} jogar.`, true);
            return;
        }

        const cartaJogada = jogador.jogarCarta(cartaIndex);
        if (!cartaJogada) return; // Erro na jogada

        this.cartasNaMesa.push({ jogador: jogador, carta: cartaJogada });
        this.enviarMensagem(`${jogador.nome} jogou ${cartaJogada}`);

        if (jogador === this.jogador1) {
            this.renderizarCartaNaMesa(1, cartaJogada);
            this.renderizarMao(this.jogador1); // Atualiza a mão do jogador
            this.quemComecaAMao = this.jogador2; // Passa a vez para o CPU
            // Pequeno delay para a jogada do CPU
            setTimeout(() => this.jogadaCPU(), 1000);
        } else { // Jogada do CPU
            this.renderizarCartaNaMesa(2, cartaJogada);
            this.quemComecaAMao = this.jogador1; // Passa a vez para o jogador 1
            this.verificarFimDaMao();
        }
    }

    // Lógica simples para o CPU jogar uma carta (aleatória por enquanto)
    jogadaCPU() {
        if (this.jogador2.mao.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.jogador2.mao.length);
            this.jogarCarta(this.jogador2, randomIndex);
        }
    }

    verificarFimDaMao() {
        if (this.cartasNaMesa.length === 2) {
            // Ambas as cartas foram jogadas, comparar e definir vencedor da mão
            const cartaJogador1 = this.cartasNaMesa[0].jogador === this.jogador1 ? this.cartasNaMesa[0].carta : this.cartasNaMesa[1].carta;
            const cartaJogador2 = this.cartasNaMesa[0].jogador === this.jogador2 ? this.cartasNaMesa[0].carta : this.cartasNaMesa[1].carta;

            const resultado = this.compararCartas(cartaJogador1, cartaJogador2);

            let vencedorMao = null;
            if (resultado === 1) {
                vencedorMao = this.jogador1;
                this.jogador1.pontosRodada++;
                this.enviarMensagem(`${this.jogador1.nome} ganhou a mão!`);
            } else if (resultado === 2) {
                vencedorMao = this.jogador2;
                this.jogador2.pontosRodada++;
                this.enviarMensagem(`${this.jogador2.nome} ganhou a mão!`);
            } else {
                this.enviarMensagem("Mão empatada!");
                // Lógica de empate no truco é complexa: quem ganha a próxima mão leva os pontos
                // ou se for a última mão, quem tinha a "mão" leva.
                // Por simplicidade, vamos dar um ponto para ambos em caso de empate na mão.
                this.jogador1.pontosRodada++;
                this.jogador2.pontosRodada++;
            }

            this.maoAtualNum++;
            this.cartasNaMesa = []; // Limpa a mesa para a próxima mão

            // Definir quem começa a próxima mão
            if (vencedorMao) {
                this.quemComecaAMao = vencedorMao;
            } else { // Em caso de empate, quem era a mão continua sendo
                this.quemComecaAMao = this.quemEhAMao;
            }


            setTimeout(() => {
                this.renderizarCartaNaMesa(1, null); // Limpa as cartas da mesa visualmente
                this.renderizarCartaNaMesa(2, null);
                this.verificarFimDaRodada();
            }, 2000);
        }
    }

    verificarFimDaRodada() {
        let vencedorRodada = null;

        // Regras simplificadas para melhor de 3 mãos
        if (this.jogador1.pontosRodada >= 2) {
            vencedorRodada = this.jogador1;
        } else if (this.jogador2.pontosRodada >= 2) {
            vencedorRodada = this.jogador2;
        } else if (this.maoAtualNum === 3) {
            // Se chegou na 3ª mão e ainda não há vencedor claro (ex: 1-1-1 ou 1-0-1 etc)
            // A regra real de empate na rodada é complexa, vamos simplificar:
            if (this.jogador1.pontosRodada > this.jogador2.pontosRodada) {
                vencedorRodada = this.jogador1;
            } else if (this.jogador2.pontosRodada > this.jogador1.pontosRodada) {
                vencedorRodada = this.jogador2;
            } else {
                // Em caso de empate total na rodada, a mão leva
                vencedorRodada = this.quemEhAMao;
            }
        }

        if (vencedorRodada) {
            this.placar[vencedorRodada.nome] += 1; // Ganha 1 ponto por padrão (sem truco)
            this.atualizarPlacarUI();
            this.enviarMensagem(`${vencedorRodada.nome} ganhou a rodada!`);

            this.btnNovaRodada.disabled = false;
            this.btnTruco.disabled = true;

            // Verificar se o jogo terminou
            if (this.placar[this.jogador1.nome] >= 12) {
                this.enviarMensagem(`${this.jogador1.nome} venceu o jogo!`);
                this.btnNovaRodada.disabled = true; // Desabilita nova rodada se o jogo acabou
            } else if (this.placar[this.jogador2.nome] >= 12) {
                this.enviarMensagem(`${this.jogador2.nome} venceu o jogo!`);
                this.btnNovaRodada.disabled = true;
            }

        } else {
            // Se a rodada ainda não terminou, prepare para a próxima mão
            this.enviarMensagem(`Próxima mão! ${this.quemComecaAMao.nome} joga.`);
            // Se o CPU for começar a próxima mão, ele joga
            if (this.quemComecaAMao === this.jogador2) {
                setTimeout(() => this.jogadaCPU(), 1000);
            }
        }
    }

    // --- Lógica de Truco (Placeholder) ---
    // Você vai precisar de estados para o truco: nenhum, pedido, aceito, corrido
    // E funções para gerenciar os botões e a pontuação do truco
    pedirTruco() {
        this.enviarMensagem("Truco!!!!");
        // Habilitar botões Aceitar/Correr
        this.btnAceitar.disabled = false;
        this.btnCorrer.disabled = false;
        this.btnTruco.disabled = true; // Não pode pedir truco de novo
    }

    aceitarTruco() {
        this.enviarMensagem("Truco aceito! Vale 3!");
        this.btnAceitar.disabled = true;
        this.btnCorrer.disabled = true;
        // Lógica para permitir o aumento do truco (6, 9, 12)
    }

    correrDoTruco() {
        this.enviarMensagem("Correu! O outro time ganha 1 ponto.");
        // O time que pediu truco ganha 1 ponto
        // Iniciar nova rodada
    }
}

// --- Inicialização do Jogo ---
document.addEventListener('DOMContentLoaded', () => {
    // Definir os nomes dos jogadores (você pode pedir input do usuário)
    const nomeJogador1 = "Você";
    const nomeJogador2 = "CPU";

    // Atualiza os nomes no placar
    document.getElementById('jogador1-nome').textContent = nomeJogador1;
    document.getElementById('jogador2-nome').textContent = nomeJogador2;

    const jogo = new JogoTruco(nomeJogador1, nomeJogador2);
});