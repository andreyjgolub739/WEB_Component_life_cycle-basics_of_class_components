import React from 'react';

function App() {
  return (
    <div className="App">
      <Timer />
      <hr />
      <ApiFetcher />
      <hr />
      <Parent />
    </div>
  );
}

//Завдання 1
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isRunning: false
    };
    console.log("constructor: Компонент створено.");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate: Чи потрібно оновлювати компонент?");
    return nextState.seconds !== this.state.seconds ||
           nextState.isRunning !== this.state.isRunning;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate: Компонент оновлено.");
    console.log("Попередній стан:", prevState.count);
    console.log("Поточний стан:", this.state.count);

    if (prevState.isRunning !== this.state.isRunning) {
      if (this.state.isRunning) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }
  }

  componentDidMount() {
    console.log("componentDidMount: Компонент змонтовано.");
    this.startTimer();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount: Компонент буде видалено.");
    this.stopTimer();
  }

  startTimer = () => {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.setState({ seconds: this.state.seconds + 1 });
      }, 1000);
    }
    this.setState({ isRunning: true });
  };

  stopTimer = () => {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.setState({ isRunning: false });
  };

  resetTimer = () => {
    this.setState({ seconds: 0 });
  };

  render() {
    console.log("render: Компонент відображається.");
    return (
      <h2>Секундомір</h2>,
      <div>
        <p>Лічильник: {this.state.seconds} сек.</p>
        <button onClick={this.startTimer}>Старт</button>
        <button onClick={this.stopTimer}>Пауза</button>
        <button onClick={this.resetTimer}>Скинути</button>
      </div>
    );
  }
}

// Завдання 2
class ApiFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      users: [],
    };
    console.log("constructor: Компонент створено.");
  }

  componentDidMount() {
    console.log("componentDidMount: Компонент змонтовано.");
    this.fetchData();
  }

  fetchData = () => {
    console.log("fetchData: Отримання даних з API.");
    
    // Імітуємо завантаження даних з API
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Іван Петренко', age: 28 },
        { id: 2, name: 'Марія Коваленко', age: 32 },
        { id: 3, name: 'Олександр Шевченко', age: 24 }
      ];
      
      this.setState({ 
        users: mockUsers
      });
    }, 1500);
  }

  render() {
    console.log("render: Компонент відображається.");
    const { users } = this.state;

    return (
      <div>
        <h2>Дані користувачів</h2>

        <ul>
          {users.map(user => (
            <li key={user.id}>
              <h3>{user.name}</h3>
              <p>Вік: {user.age}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// Завдання 3
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showChild: true,
      childCounter: 0
    };
    console.log("constructor: Компонент створено.");
  }

  toggleChild = () => {
    this.setState(prevState => ({
      showChild: !prevState.showChild
    }));
  }

  // Метод для оновлення лічильника від дочірнього компонента
  updateChildCounter = (newValue) => {
    this.setState({ childCounter: newValue });
    console.log("Parent - updateChildCounter: Оновлено значення лічильника:", newValue);
  }

  render() {
    console.log("render: Компонент відображається.");
    return (
      <div>
        <h2>Дані користувачів</h2>
        <button onClick={this.toggleChild}>
          {this.state.showChild ? "Сховати" : "Показати"} дочірній компонент
        </button>

        {this.state.showChild && <Child 
          counter={this.state.childCounter}
          onCounterChange={this.updateChildCounter}
        />}
      </div>
    );
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      counter: 0
    };
    console.log("constructor: Компонент створено.");
  }

  // Отримуємо оновлені пропси
  static getStateFromProps(props, state) {
    // Синхронізуємо локальний стан з батьківським, якщо вони відрізняються
    if (props.counter !== state.counter) {
      return { counter: props.counter };
    }
    return null;
  }

  incrementCounter = () => {
    this.setState(prevState => {
      const newCounter = prevState.counter + 1;
      // Повідомляємо батьківський компонент про зміну
      this.props.onCounterChange(newCounter);
      return { counter: newCounter };
    });
  }

  render() {
    console.log("render: Компонент відображається.");
    return (
      <div>
        <h3>Дочірній компонент</h3>
        <p>Лічильник: {this.state.counter}</p>
        <button onClick={this.incrementCounter}>Збільшити лічильник</button>
      </div>
    );
  }
}

export default App;