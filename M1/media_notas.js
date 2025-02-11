/**
* Programa feito na sala de aula. A otimização do código não era prioridade.
*/

const notas = [9.0, 7.0, 10.0]; //Aqui o programa "pediu" as notas dos usuários e recebeu 3 notas

//Aqui é usado um while a pedido do professor. Usei para verificar se cada nota é válida ou não juntamente com uma var notaInvalida que impedirá o programa de executar se houver alguma nota inválida.
let i = 0;
let notaInvalida;
while (i < 3) {
  if (notas[i] < 0 || notas[i] > 10) {
    console.log(`A nota ${notas[i]} é inválida. Deve ser entre 0 e 10.`);
    notaInvalida = true;
    break;
  }
  i++;
}

if (!notaInvalida) {
let media = 0; //A variável "media" foi inicializada e declarada como 0 por enquanto

//Aqui a média é calculada automaticamente com a quantidade de notas que existem, sem ser necessário colocar manualmente
for (i = 0; i < notas.length; i++) {
  media += notas[i];
  if (i === notas.length - 1) {
    media /= notas.length;
  }
}

let aprovacao = media >= 7 ? "APROVADO" : "REPROVADO"; //Variavel aprovacao é declarada e usada para carregar o status de APROVADO ou REPROVADO, dependendo da média.

//Um switch é usado para decidir qual mensagem será exibida para o aluno.
switch (aprovacao) {
  case "APROVADO":
    console.log(`Parabéns, você foi APROVADO com média ${media.toFixed(2)}.`);
    break;
  case "REPROVADO":
    console.log(
      `Infelizmento você foi REPROVADO. Sua média é ${media.toFixed(2)}.`
    );
    break;
  default:
    console.log("Ocorreu algum erro. Fale com a sua secretaria.");
}
} else {
    console.log("Você inseriu uma nota inválida. Tente novamente ou entre em contato com a secretaria.");
}
