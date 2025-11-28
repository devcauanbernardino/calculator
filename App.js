// Importa o componente StatusBar da biblioteca expo-status-bar para controlar a barra de status do dispositivo.
import { StatusBar } from "expo-status-bar";
// Importa a classe Component da biblioteca "react", que é a base para criar componentes de classe.
import { Component } from "react";
// Importa componentes essenciais do "react-native".
// Platform: para detectar se o app está rodando em iOS ou Android.
// StyleSheet: para criar e otimizar folhas de estilo.
// Text: para renderizar texto.
// View: um container que organiza outros componentes, similar a uma <div> na web.
import { Platform, StyleSheet, Text, View } from "react-native";
// Importa o componente personalizado Button de um arquivo local.
import Button from "./src/components/Button";
// Importa o componente personalizado Display de um arquivo local.
import Display from "./src/components/Display";

// Define o estado inicial da calculadora. Isso é útil para resetar a calculadora.
const initialState = {
  displayValue: "0",      // O valor que aparece no visor da calculadora.
  clearDisplay: false,    // Um booleano que indica se o visor deve ser limpo no próximo dígito.
  operation: null,        // Armazena a operação matemática selecionada (+, -, *, /).
  values: [0, 0],         // Um array para guardar os dois números da operação.
  current: 0,             // Indica qual dos 'values' (índice 0 ou 1) está sendo digitado.
};

// Define a classe principal do aplicativo, que herda de Component.
export default class App extends Component {
  // Inicializa o estado do componente com uma cópia do 'initialState'.
  state = { ...initialState };

  // Função para adicionar um dígito ao visor. Recebe o dígito 'n' como argumento.
  addDigit = (n) => {
    // Verifica se o visor deve ser limpo. Isso acontece se o valor atual for "0"
    // ou se a flag 'clearDisplay' for verdadeira (após uma operação).
    const clearDisplay =
      this.state.displayValue === "0" || this.state.clearDisplay;

    // Impede que mais de um ponto decimal seja adicionado ao número.
    // Se 'n' é um ponto, o visor não deve ser limpo e já deve incluir um ponto, a função retorna.
    if (n === "." && !clearDisplay && this.state.displayValue.includes(".")) {
      return;
    }

    // Se 'clearDisplay' for verdadeiro, o valor atual é uma string vazia, senão, é o valor do visor.
    const currentValue = clearDisplay ? "" : this.state.displayValue;
    // Concatena o dígito 'n' ao valor atual para formar o novo valor do visor.
    const displayValue = currentValue + n;
    // Atualiza o estado com o novo valor do visor e define 'clearDisplay' como falso.
    this.setState({ displayValue, clearDisplay: false });

    // Se o dígito adicionado não for um ponto decimal...
    if (n !== ".") {
      // Converte o valor do visor (string) para um número de ponto flutuante.
      const newValue = parseFloat(displayValue);
      // Cria uma cópia do array 'values' do estado.
      const values = [...this.state.values];
      // Atualiza o valor no índice 'current' (0 ou 1) do array 'values'.
      values[this.state.current] = newValue;
      // Atualiza o estado com o novo array 'values'.
      this.setState({ values });
    }
  };

  // Função para limpar a memória e resetar a calculadora para o estado inicial.
  clearMemory = () => {
    this.setState({ ...initialState });
  };

  // Função para definir a operação matemática.
  setOperation = (operation) => {
    // Se estivermos inserindo o primeiro número (current === 0)...
    if (this.state.current === 0) {
      // Atualiza o estado: define a operação, muda 'current' para 1 e prepara para limpar o visor.
      this.setState({ operation, current: 1, clearDisplay: true });
    } else { // Se já estivermos inserindo o segundo número...
      // Verifica se a operação é o sinal de igual (=).
      const equals = operation === "=";
      // Cria uma cópia do array 'values' do estado.
      const values = { ...this.state.values };
      try {
        // Tenta executar o cálculo usando 'eval'. Ex: eval("2 + 3").
        // Isso calcula o resultado de 'values[0] operação values[1]'.
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`);
      } catch (e) {
        // Se ocorrer um erro no 'eval' (ex: divisão por zero), mantém o valor original.
        values[0] = this.state.values[0];
      }
      // Reseta o segundo valor para 0.
      values[1] = 0;
      // Atualiza o estado com o resultado da operação.
      this.setState({
        displayValue: `${values[0]}`, // Mostra o resultado no visor.
        operation: equals ? null : operation, // Se for '=', limpa a operação, senão, define a nova.
        current: equals ? 0 : 1, // Se for '=', volta a editar o primeiro número, senão, continua no segundo.
        clearDisplay: true, // Prepara para limpar o visor no próximo dígito.
        values, // Atualiza o array de valores.
      });
    }
  };

  // Método 'render' que descreve como o componente deve ser exibido na tela.
  render() {
    return (
      // O container principal do aplicativo.
      <View style={styles.container}>
        {/* Componente que exibe o valor atual da calculadora. */}
        <Display value={this.state.displayValue} />
        {/* Container para todos os botões. */}
        <View style={styles.buttons}>
          {/* Cada linha abaixo é um componente Button com suas propriedades (props). */}
          {/* 'label' é o texto do botão. */}
          {/* 'triple', 'double', 'operation' são props para estilização. */}
          {/* 'onClick' define a função que será chamada quando o botão for pressionado. */}
          <Button label="AC" triple onClick={this.clearMemory}></Button>
          <Button label="/" operation onClick={this.setOperation}></Button>
          <Button label="7" onClick={this.addDigit}></Button>
          <Button label="8" onClick={this.addDigit}></Button>
          <Button label="9" onClick={this.addDigit}></Button>
          <Button label="*" operation onClick={this.setOperation}></Button>
          <Button label="4" onClick={this.addDigit}></Button>
          <Button label="5" onClick={this.addDigit}></Button>
          <Button label="6" onClick={this.addDigit}></Button>
          <Button label="-" operation onClick={this.setOperation}></Button>
          <Button label="1" onClick={this.addDigit}></Button>
          <Button label="2" onClick={this.addDigit}></Button>
          <Button label="3" onClick={this.addDigit}></Button>
          <Button label="+" operation onClick={this.setOperation}></Button>
          <Button label="0" double onClick={this.addDigit}></Button>
          <Button label="." onClick={this.addDigit}></Button>
          <Button label="=" operation onClick={this.setOperation}></Button>
        </View>
      </View>
    );
  }
}

// Cria um objeto de estilos usando StyleSheet para otimização.
const styles = StyleSheet.create({
  // Estilo para o container principal, fazendo-o ocupar toda a tela.
  container: {
    flex: 1,
  },
  // Estilo para o container dos botões.
  buttons: {
    flexDirection: "row", // Organiza os botões em uma linha.
    flexWrap: "wrap",     // Permite que os botões quebrem para a próxima linha.
  },
});
