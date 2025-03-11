// ./scene2.js
/**
 * GameScene2 - Segunda fase do jogo do labirinto
 * Esta cena é carregada após o jogador completar a primeira fase
 */
class GameScene2 extends Phaser.Scene {
  constructor() {
    super("GameScene2");
    this.score = 0; // Armazena a pontuação do jogador
    this.hasKey = false; // Indica se o jogador pegou a chave
    this.gems = 0; // Contador de gemas coletadas
    this.gemsRequired = 3; // Número de gemas necessárias para ativar a porta
  }

  /**
   * Precarrega todos os assets necessários para a cena
   */
  preload() {
    // Carrega as imagens necessárias se ainda não foram carregadas
    if (!this.textures.exists("gem")) {
      this.load.image("gem", "assets/key.png"); // Reutilizando o asset da chave como gema
    }

    // Carrega o fundo específico desta fase
    this.load.image("backgroundGame2", "assets/background_game2.png");
  }

  /**
   * Inicializa a cena, criando todos os elementos de jogo
   * @param {object} data - Dados transferidos da cena anterior
   */
  create(data) {
    // Recupera a pontuação da cena anterior
    if (data && data.score) {
      this.score = data.score;
    }

    // Adiciona o fundo da fase 2
    this.add.image(400, 300, "backgroundGame2");

    // Adiciona título da fase (centralizado no topo)
    const title = this.add.text(400, 30, "Fase 2 - Colete as Gemas", {
      fontSize: "32px",
      fill: "#fff",
      fontStyle: "bold",
    });
    title.setOrigin(0.5, 0); // Centraliza o texto horizontalmente

    // Cria o jogador na posição inicial
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Configura a porta que leva à vitória
    this.door = this.physics.add.sprite(700, 500, "door");
    this.door.setTint(0xff0000); // Porta vermelha (desativada)

    // Cria os inimigos com padrões de movimento diferentes
    this.enemies = this.physics.add.group();

    // Inimigo 1 - movimento horizontal
    let enemy1 = this.enemies.create(300, 200, "enemy");
    enemy1.setVelocityX(150);
    enemy1.setBounce(1, 1);
    enemy1.setCollideWorldBounds(true);

    // Inimigo 2 - movimento vertical
    let enemy2 = this.enemies.create(500, 300, "enemy");
    enemy2.setVelocityY(150);
    enemy2.setBounce(1, 1);
    enemy2.setCollideWorldBounds(true);

    // Inimigo 3 - movimento diagonal
    let enemy3 = this.enemies.create(400, 400, "enemy");
    enemy3.setVelocity(100, 100);
    enemy3.setBounce(1, 1);
    enemy3.setCollideWorldBounds(true);

    // Cria as gemas para coleta
    this.gemGroup = this.physics.add.group();
    this.spawnGems();

    // Interface do usuário - separando os textos para evitar sobreposição
    // Texto de pontuação no canto superior esquerdo
    this.scoreText = this.add.text(16, 16, "Placar: " + this.score, {
      fontSize: "28px",
      fill: "#fff",
    });

    // Texto de gemas logo abaixo da pontuação
    this.gemText = this.add.text(16, 60, "Gemas: 0/" + this.gemsRequired, {
      fontSize: "24px",
      fill: "#0f0",
    });

    // Adiciona instruções
    const instructions = this.add.text(400, 550, "Colete todas as gemas para ativar a porta!", {
      fontSize: "20px",
      fill: "#fff",
    });
    instructions.setOrigin(0.5, 0); // Centraliza o texto horizontalmente

    // Configura as colisões e interações
    this.physics.add.overlap(this.player, this.gemGroup, this.collectGem, null, this);
    this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

    // Configura os controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /**
   * Atualização contínua do jogo, executada a cada frame
   */
  update() {
    // Controle do movimento do jogador
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }

    // Atualiza a cor da porta com base nas gemas coletadas
    if (this.gems >= this.gemsRequired && !this.hasKey) {
      this.door.setTint(0x00ff00); // Porta verde (ativada)
      this.hasKey = true;
    }
  }

  /**
   * Cria as gemas em posições aleatórias do mapa
   */
  spawnGems() {
    // Limpa gemas existentes
    this.gemGroup.clear(true, true);

    // Cria posições aleatórias para as gemas, evitando sobreposição
    const positions = [];
    for (let i = 0; i < this.gemsRequired; i++) {
      let x, y, validPosition;
      do {
        validPosition = true;
        x = Phaser.Math.Between(100, 700);
        y = Phaser.Math.Between(100, 500);

        // Verifica se está longe o suficiente de outras gemas
        for (let pos of positions) {
          if (Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < 100) {
            validPosition = false;
            break;
          }
        }
      } while (!validPosition);

      positions.push({ x, y });
      const gem = this.gemGroup.create(x, y, "gem");
      gem.setTint(0x00ffff); // Cor diferente para distinguir das chaves
    }
  }

  /**
   * Função chamada quando o jogador coleta uma gema
   * @param {object} player - Sprite do jogador
   * @param {object} gem - Sprite da gema coletada
   */
  collectGem(player, gem) {
    gem.destroy();
    this.score += 20;
    this.gems += 1;

    // Atualiza a interface
    this.scoreText.setText("Placar: " + this.score);
    this.gemText.setText("Gemas: " + this.gems + "/" + this.gemsRequired);

    // Efeito de som ou visual poderia ser adicionado aqui
  }

  /**
   * Função chamada quando o jogador tenta entrar na porta
   * @param {object} player - Sprite do jogador
   * @param {object} door - Sprite da porta
   */
  enterDoor(player, door) {
    if (this.hasKey) {
      // Transição para a tela de vitória, passando a pontuação final
      this.scene.start("WinScene", { score: this.score });
    }
  }

  /**
   * Função chamada quando o jogador colide com um inimigo
   * @param {object} player - Sprite do jogador
   * @param {object} enemy - Sprite do inimigo
   */
  hitEnemy(player, enemy) {
    // Game over quando atingido por um inimigo
    this.scene.start("GameOverScene", { score: this.score });
  }
}

// Exporta a classe para ser usada no arquivo principal
export default GameScene2;

/** O que vi sobre POO no código:
 * Classes (MenuScene, GameScene, GameScene2, GameOverScene, WinScene)
 * Herança (GameScene2 extends Phaser.Scene, GameOverScene extends Phaser.Scene)
 * Métodos (preload, create, update, collectGem, enterDoor, hitEnemy)
 */

/** O que mudei:
 * Implementei o sistema de módulos usando export default GameScene2 e import
 * Melhorei a classe GameScene2 para que ela tenha mais inimigos e chaves para coletar
 * Adicionei um contador de gemas e uma porta que só abre quando o jogador coleta todas as gemas
 * Adicionei uma função para criar gemas em posições aleatórias
 * Adicionei uma função para coletar gemas
 * Adicionei passagem de dados entre cenas com o parâmetro data
 */
