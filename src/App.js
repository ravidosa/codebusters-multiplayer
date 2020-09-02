/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import './App.css';

const client = new W3CWebSocket(location.origin.replace(/^http/, 'ws'));
const contentDefaultMessage = "Start writing your document here";
const en_alphabet = "abcdefghijklmnopqrstuvwxyz"
const es_alphabet = "abcdefghijklmnñopqrstuvwxyz"
const baconian = ["aaaaa", "aaaab", "aaaba", "aaabb", "aabaa", "aabab", "aabba", "aabbb", "abaaa", "abaaa", "abaab", "ababa", "ababb", "abbaa", "abbab" ,"abbba", "abbbb", "baaaa", "baaab", "baaba", "baabb", "baabb", "babaa", "babab", "babba", "babbb"]
const alt_baconian = [{a: "a", b: "b"}, {a: "b", b: "a"}, {a: "1", b: "0"}, {a: "0", b: "1"}, {a: "/", b: "\\"}, {a: "\\", b: "/"}, {a: "╩", b: "╦"}, {a: "╦", b: "╩"}, {a: "Ṿ", b: "Å"}, {a: "Å", b: "Ṿ"}]
const mangled_words = {"I": "eye", "your": "you're", "you": "ewe", "time": "thyme", "all": "awl", "the": "teh", "one": "won", "sees": "seize", "life": "lief", "for": "four", "to": "two", "choose": "chews", "do": "dew", "not": "knot", "see": "sea", "world": "whirled", "soul": "sole", "be": "bee", "in": "inn", "driving": "dirving", "we": "wee", "have": "halve", "waiter": "wader", "or": "oar", "you'll": "yule", "better": "bettor", "but": "butt", "and": "adn", "their": "there", "years": "yaers", "find": "fined", "by": "buy", "greater": "grater", "take": "taek", "shown": "shone", "told": "tolled", "plate": "plait", "back": "back", "scientist": "scnetiist", "new": "knew", "would": "wood", "an": "in", "that": "taht", "there's": "theirs", "some": "sum", "birth": "berth", "which": "witch", "right": "write", "great": "grate"}

class Cipher extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      userInfo: {
        name: "",
        record: false,
        roomCode: "",
        team: []
      },
      timer: {
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
      }, 
      selectedLetter: "",
      currQ: -1,
      probType: "",
      score: [0, 0],
      questions: [],
      probState: 3,
      loading: false,
      marathon: false,
      multiplayer: false
    }

    this.setLetter = this.setLetter.bind(this);
    this.selectLetter = this.selectLetter.bind(this);
    this.getProb = this.getProb.bind(this);
    this.nextProb = this.nextProb.bind(this);
    this.prevProb = this.prevProb.bind(this);
    this.checkProb = this.checkProb.bind(this);
    this.startMarathon = this.startMarathon.bind(this);
    this.startMultiplayer = this.startMultiplayer.bind(this);
    this.startRun = this.startRun.bind(this);
    this.sendMarathon = this.sendMarathon.bind(this);
    this.setData = this.setData.bind(this);
  }

  setLetter(event) {
    if (event.key === "`" || (event.key >= "a" && event.key <= "z")) {
      if (event.key === "`") {
        event.key = "ñ"
      }
      if (this.state.probType !== "Baconian Cipher") {
        if (this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter) !== -1) {
            let newguess = this.state.questions[this.state.currQ].guesses;
            newguess[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)] = event.key;
            //console.log(this.state.selectedLetter, this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter), this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)], this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)]), this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)]) + 1), this.state.questions[this.state.currQ].alphabet.indexOf(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)]) + 1)), this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)]) + 1))])
            this.setState({ guesses: newguess, selectedLetter: this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.questions[this.state.currQ].plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.selectedLetter)]) + 1))]});
        }
      }
      if (this.state.probType === "Baconian Cipher") {
          let newguess = this.state.questions[this.state.currQ].guesses;
          newguess[this.state.questions[this.state.currQ].mapping.indexOf(this.state.selectedLetter)] = event.key;
          this.setState({ guesses: newguess});
      }
      client.send(JSON.stringify({
        questions: this.state.questions,
        type: "multichange"
      }));
    }
  }

  selectLetter(event) {
    if (this.state.probType !== "Baconian Cipher") {
      if (event.target.innerText[0].match(/[ña-z]/i)) {
        this.setState({ selectedLetter: event.target.innerText[0]});
      }
    }
    else {
      this.setState({ selectedLetter: event.target.innerText.slice(0, 5)});
    }
  }

  async getProb(probType) {
    this.setState({probType: (probType === 'aristocrat' ? "Aristocrat Cipher" : probType === 'affine' ? "Affine Cipher" : probType === 'patristocrat' ? "Patristocrat Cipher" : probType === 'atbash' ? "Atbash Cipher" : probType === 'caesar' ? "Caesar Cipher" : probType === 'xenocrypt' ? "Xenocrypt" : probType === 'baconian' ? "Baconian Cipher": null)})
    let array = (probType !== 'xenocrypt' ? en_alphabet : es_alphabet).split("");
    let a, b = null;
    let hint, encoding = "";
    let mangle = false;
    if (probType === "aristocrat" || probType === "patristocrat" || probType === "xenocrypt") {
      const k = Math.floor(Math.random() * 6);
      if ((k < 3 && probType === "aristocrat") || (k < 1 && probType === "patristocrat") || (k < 6 && probType === "xenocrypt")) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
      else if ((k < 5 && probType === "aristocrat") || (k < 4 && probType === "patristocrat") || (k < 9 && probType === "xenocrypt")) {
        encoding = "k1";
        let k1response = await fetch('https://cors-anywhere.herokuapp.com/https://random-word-api.herokuapp.com/word');
        let k1data = await k1response.json();
        k1data = k1data[0].split('').filter((item, pos, self) => {return self.indexOf(item) === pos;}).join('');
        array = (k1data + array.join("").replace(new RegExp(k1data.split("").join("|"), "gi"), "")).split("");
        const l = Math.floor(Math.random() * (array.length - k1data.length));
        for (let i = array.length; i > l; i--) {
          array.push(array.shift())
        }
        let temp = [];
        for (let m = 0; m < array.length; m++) {
          temp.push((probType !== 'xenocrypt' ? en_alphabet : es_alphabet)[array.indexOf((probType !== 'xenocrypt' ? en_alphabet : es_alphabet)[m])])
        }
        array = temp;
      }
      else if ((k < 6 && probType === "aristocrat") || (k < 6 && probType === "patristocrat") || (k < 12 && probType === "xenocrypt")) {
        encoding = "k2";
        let k2response = await fetch('https://cors-anywhere.herokuapp.com/https://random-word-api.herokuapp.com/word');
        let k2data = await k2response.json();
        k2data = k2data[0].split('').filter((item, pos, self) => {return self.indexOf(item) === pos;}).join('');
        array = (k2data + array.join("").replace(new RegExp(k2data.split("").join("|"), "gi"), "")).split("");
        const l = Math.floor(Math.random() * (array.length - k2data.length));
        for (let i = array.length; i > l; i--) {
          array.push(array.shift())
        }
      }
    }
    else if (probType === "atbash") {
      array.reverse();
    }
    else if (probType === "caesar") {
      for (let i = 0; i < Math.floor(Math.random() * 26); i++) {
        array.push(array.shift())
      }
    }
    else if (probType === "affine") {
      a = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25][Math.floor(Math.random() * 12)];
      b = Math.floor(Math.random() * 26);
      for (let i = 0; i < array.length; i++) {
        array[i] = en_alphabet.charAt((a * i + b) % 26);
      }
    }

    if (probType === "baconian") {
      let response = await fetch('https://cors-anywhere.herokuapp.com/https://random-word-api.herokuapp.com/word');
      let data = await response.json();
      const k = Math.floor(Math.random() * 3);
      if (k < 1) {
        hint = "The message starts with " + data[0].slice(0, 3)
      }
      let obj = alt_baconian[Math.floor(Math.random() * alt_baconian.length)];
      let mapping = baconian.map((key, value) => {return key.replace(new RegExp(Object.keys(obj).join("|"), "gi"), (matched) => {return obj[matched];})})
      let questions = this.state.questions
      questions.push({plaintext: data[0], mapping: mapping, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, type: probType, encoding: encoding, mangle: mangle, error: "", type: probType})
      this.setState({questions: questions, currQ: this.state.currQ + 1});
    }
    else {
      let response = await fetch('https://cors-anywhere.herokuapp.com/https://api.quotable.io/random');
      let data = await response.json();
      if (probType === "aristocrat" || probType === "patristocrat" || probType === "affine") {
        const k = Math.floor(Math.random() * 12);
        if (k < 2 && probType === "aristocrat") {
          data.content = data.content.split(" ").map((key) => {return (mangled_words[key.toLowerCase()] || key)}).join(" ");
          mangle = true;
        }
        if ((k < 6 && probType === "patristocrat") || (k < 3 && probType === "aristocrat")) {
          const l = Math.floor(Math.random() * 8);
          if (l < 3.5) {
            hint = "The message starts with " + data.content.replace(/[^A-Za-z]/g, "").toLowerCase().slice(0, l + 1)
          }
          else {
            hint = "The message ends with " + data.content.replace(/[^A-Za-z]/g, "").toLowerCase().slice(3 - l)
          }
        }
        else if (probType === "affine") {
          if (k < 6) {
            hint = "a = " + a + ", b = " + b;
          }
          else if (k < 9) {
            hint = "The message starts with " + data.content.replace(/[^A-Za-z]/g, "").toLowerCase().slice(0, 2)
          }
          else {
            hint = "The message ends with " + data.content.replace(/[^A-Za-z]/g, "").toLowerCase().slice(-2)
          }
        }
      }
      if (probType === "aristocrat" || probType === "atbash" || probType === "caesar") {
        let questions = this.state.questions
        questions.push({plaintext: data.content.toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: "", type: probType})
        this.setState({questions: questions, currQ: this.state.currQ + 1});
      }
      else if (probType === "patristocrat" || probType === "affine") {
        let questions = this.state.questions
        questions.push({plaintext: data.content.replace(/[^A-Za-z]/g, "").toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: "", type: probType})
        this.setState({questions: questions, currQ: this.state.currQ + 1});
      }
      else if (probType === "xenocrypt") {
        let transresponse = await fetch("https://cors-anywhere.herokuapp.com/https://google-translate-proxy.herokuapp.com/api/translate?query=" + data.content + "&sourceLang=en&targetLang=es", {mode: 'cors'});
        if (transresponse.status === 200) {
          let trans = await transresponse.json();
          //console.log(trans.extract.translation)
          let questions = this.state.questions
          questions.push({plaintext: trans.extract.translation.replace('ñ','|').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('|','ñ').toLowerCase(), source: data.author, mapping: array, guesses: "___________________________".split(""), checked: false, alphabet: es_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: "", type: probType})
          this.setState({questions: questions, currQ: this.state.currQ + 1});
        }
        else {
          if (this.state.marathon) {
            array.splice(array.indexOf("ñ"), 1)
            let questions = this.state.questions
            questions.push({plaintext: data.content.toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: "", type: "aristocrat"})
            this.setState({questions: questions, type: "aristocrat", currQ: this.state.currQ + 1});
          }
          else {
            array.splice(array.indexOf("ñ"), 1)
            let questions = this.state.questions
            questions.push({plaintext: data.content.toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, type: "aristocrat"})
            this.setState({questions: questions, type: "aristocrat", error: "Translation services are down; here's an aristocrat instead!", currQ: this.state.currQ + 1});
          }
        }
      }
    }
  }

  nextProb() {
    if (this.state.marathon) {
      this.checkProb();
      this.getProb(["aristocrat", "atbash", "caesar", "patristocrat", "affine", "baconian", "xenocrypt"][Math.floor(Math.random() * 7)]);
    }
    else if (this.state.multiplayer) {
      this.setState({currQ: this.state.currQ + 1});
    }
    else {
      this.getProb(this.state.probType.split(" ")[0].toLowerCase());
    }
  }

  prevProb() {
    this.setState({currQ: this.state.currQ - 1});
  }

  checkProb() {
    let mistakes = 0;
    if (this.state.probType !== "Baconian Cipher") {
      for (let i = 0; i < this.state.questions[this.state.currQ].alphabet.length; i++) {
        if (this.state.questions[this.state.currQ].alphabet.split("")[i].localeCompare(this.state.questions[this.state.currQ].guesses[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.questions[this.state.currQ].mapping[i])].charAt(0)) && this.state.questions[this.state.currQ].plaintext.indexOf(this.state.questions[this.state.currQ].alphabet.split("")[i]) !== -1) {
          mistakes += 1;
        }
      }
    }
    else {
      for (let i = 0; i < this.state.questions[this.state.currQ].alphabet.length; i++) {
        if (this.state.questions[this.state.currQ].guesses.indexOf(this.state.questions[this.state.currQ].alphabet.split("")[i]) !== i && this.state.questions[this.state.currQ].plaintext.indexOf(this.state.questions[this.state.currQ].alphabet.split("")[i]) !== -1) {
          mistakes += 1;
        }
      }
    }
    if (mistakes < 2 && !this.state.questions[this.state.currQ].checked) {
      this.setState({score: [this.state.score[0] + 1, this.state.score[1] + 1], checked: true})
    }
    else if (!this.state.questions[this.state.currQ].checked) {
      this.setState({score: [this.state.score[0], this.state.score[1] + 1], checked: true})
    }

    if (this.state.marathon && !this.state.questions[this.state.currQ].checked) {
      let currq = this.state.questions;
      currq[this.state.currQ].mistakes = mistakes
      currq[this.state.currQ].time = Math.floor(this.state.timer.timerTime / 1000)
      this.setState({questions: currq});
    }
  }

  async startMarathon() {
    this.setState({probState: 1, score: [0, 0], questions: [], marathon: true, multiplayer: false, probType: "Aristocrat Cipher", currQ: -1})
    await this.stopTimer();
    await this.resetTimer();
    await this.getProb("aristocrat");
    this.startTimer();
  }

  async sendMarathon() {
    if (this.state.userInfo.record) {
      await this.checkProb();
      `await firebase.database().ref('results/' + this.state.userInfo.name + " (" + new Date() + ")").set({
        name: this.state.userInfo.name,
        questions: this.state.questions,
        time: Math.floor(this.state.timer.timerTime / 1000),
        correct: this.state.score[0],
        score: this.state.questions.reduce((a, b) => a + this.computeScore(b), 0)
      });`
    }
    this.setState({probState: 2})
    if (this.state.multiplayer) {
      client.send(JSON.stringify({
        type: "multicomp"
      }));
    }
  }

  computeScore(question) {
    let mistakes = 0;
    if (question.type !== "baconian") {
      for (let i = 0; i < question.alphabet.length; i++) {
        if (question.alphabet.split("")[i].localeCompare(question.guesses[question.alphabet.indexOf(question.mapping[i])].charAt(0)) && question.plaintext.indexOf(question.alphabet.split("")[i]) !== -1) {
          mistakes += 1;
        }
      }
    }
    else {
      for (let i = 0; i < question.alphabet.length; i++) {
        if (question.guesses.indexOf(question.alphabet.split("")[i]) !== i && question.plaintext.indexOf(question.alphabet.split("")[i]) !== -1) {
          mistakes += 1;
        }
      }
    }
    question.mistakes = mistakes
    if (question.type === "atbash" || question.type === "caesar" || question.type === "affine") {
      return Math.max(0, 100 - (100 * Math.max(0, question.mistakes - 2)));
    }
    else if (question.type === "baconian") {
      return Math.max(0, 200 - (100 * Math.max(0, question.mistakes - 2)));
    }
    else if (question.type === "aristocrat") {
      if (question.hint) {
        if (question.mangle) {
          if (question.hint.split(" ")[question.hint.split(" ").length - 1].length > 3) {
            return Math.max(0, 500 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (50 * (question.hint.split(" ")[question.hint.split(" ").length - 1].length - 3)) - (100 * Math.max(0, question.mistakes - 2)));
          }
          else {
            return Math.max(0, 500 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
          }
        }
        else {
          return Math.max(0, 200 - (100 * Math.max(0, question.mistakes - 2)));
        }
      }
      else {
        if (question.mangle) {
          return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
        }
        else {
          return Math.max(0, 350 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
        }
      }
    }
    else if (question.type === "patristocrat") {
      if (question.hint) {
        if (question.hint.split(" ")[question.hint.split(" ").length - 1].length > 3) {
          return Math.max(0, 650 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (50 * (question.hint.split(" ")[question.hint.split(" ").length - 1].length - 3)) - (100 * Math.max(0, question.mistakes - 2)));
        }
        else {
          return Math.max(0, 650 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
        }
      }
      else {
        return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
      }
    }
    else if (question.type === "xenocrypt") {
      return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
    }
  }

  setData(event) {
    let userInfo = this.state.userInfo
    if (event.target.name === "name") {
      userInfo.name = event.target.value
      this.setState({userInfo: userInfo})
    }
    else if (event.target.name === "record") {
      userInfo.record = event.target.checked
      this.setState({userInfo: userInfo})
    }
    else if (event.target.name === "code") {
      userInfo.roomCode = event.target.value
      this.setState({userInfo: userInfo})
    }
  }

  startTimer = () => {
    this.setState({
      timer: {
        timerOn: true,
        timerTime: this.state.timer.timerTime || 0,
        timerStart: Date.now() - this.state.timer.timerTime || Date.now()
      }
    });
    this.timer = setInterval(() => {
      let timer = this.state.timer
      timer.timerTime = Date.now() - this.state.timer.timerStart
      this.setState({timer: timer});
    }, 10);
  };

  stopTimer = () => {
    let timer = this.state.timer
    timer.timerOn = false
    this.setState({timer: timer});
    clearInterval(this.timer);
  };

  resetTimer = () => {
    let timer = this.state.timer
    timer.timerStart = 0
    timer.timerTime = 0
    this.setState({timer: timer});
  };

  logInUser = () => {
    this.setState({probState: 5, questions: []})
    const username = this.state.userInfo.name;
    const room = this.state.userInfo.roomCode;
    if (username.trim() && room.trim()) {
      const data = {
        username: username,
        room: room
      };
      client.send(JSON.stringify({
        ...data,
        type: "userevent"
      }));
    }
  }

  async startMultiplayer() {
    await this.stopTimer();
    await this.resetTimer();
    this.setState({loading: true})
    client.send(JSON.stringify({
      type: "loading"
    }));
    await this.getProb("aristocrat");
    for (let i = 0; i < 18; i++) {
      await this.getProb(["aristocrat", "atbash", "caesar", "patristocrat", "affine", "baconian", "xenocrypt"][Math.floor(Math.random() * 7)]);
    }
    //console.log(this.state.questions)
    this.setState({probState: 1, score: [0, 0], loading: false, marathon: false, multiplayer: true, probType: "Aristocrat Cipher", currQ: 0})
    this.startTimer();
    client.send(JSON.stringify({
      questions: this.state.questions,
      type: "multistart"
    }));
  }

  async startRun(probType) {
    await this.stopTimer();
    await this.resetTimer();
    await this.getProb(probType);
    this.setState({probType: (probType === 'aristocrat' ? "Aristocrat Cipher" : probType === 'affine' ? "Affine Cipher" : probType === 'patristocrat' ? "Patristocrat Cipher" : probType === 'atbash' ? "Atbash Cipher" : probType === 'caesar' ? "Caesar Cipher" : probType === 'xenocrypt' ? "Xenocrypt" : probType === 'baconian' ? "Baconian Cipher": null), probState: 1})
    this.startTimer(); 
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = async (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log(dataFromServer)
      let stateToChange = {};
      if (dataFromServer.type === "userevent") {
        stateToChange = this.state.userInfo
        stateToChange.team = Object.values(dataFromServer.data.users).filter(user => user.room === this.state.userInfo.roomCode);
        this.setState({userInfo: stateToChange})
      }
      else if (dataFromServer.type === "multistart") {
        await this.stopTimer();
        await this.resetTimer();
        this.setState({probState: 1, score: [0, 0], loading: false, marathon: false, multiplayer: true, probType: "Aristocrat Cipher", currQ: 0, questions: dataFromServer.data.questions})
        this.startTimer();
      }
      else if (dataFromServer.type === "multichange") {
        this.setState({questions: dataFromServer.data.questions})
      }
      else if (dataFromServer.type === "multicomp") {
        this.setState({probState: 2})
      }
      else if (dataFromServer.type === "loading") {
        this.setState({loading: true})
      }
      else if (dataFromServer.type === "contentchange") {
        stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
      }

    };
  }

  componentWillUnmount() {
    client.onclose = () => {
      console.log('WebSocket Client Disonnected', this.state.name);
    };
  }
  
  render() {
    let centiseconds = ("0" + (Math.floor(this.state.timer.timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(this.state.timer.timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(this.state.timer.timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(this.state.timer.timerTime / 3600000)).slice(-2);
    return <div className="container">
      <span id="buttonchoice" className="buttonchoice">
        <button className="problemtype" id="aristocrat" onClick={() => this.startRun("aristocrat")}>aristocrat</button>
        <button className="problemtype" id="affine" onClick={() => this.startRun("affine")}>affine</button>
        <button className="problemtype" id="atbash" onClick={() => this.startRun("atbash")}>atbash</button>
        <button className="problemtype" id="caesar" onClick={() => this.startRun("caesar")}>caesar</button>
        <button className="problemtype" id="patristocrat" onClick={() => this.startRun("patristocrat")}>patristocrat</button>
        <button className="problemtype" id="xenocrypt" onClick={() => this.startRun("xenocrypt")}>xenocrypt</button>
        <button className="problemtype" id="baconian" onClick={() => this.startRun("baconian")}>baconian</button>
        <button id="marathon" onClick={() => this.setState({probState: 0})}>marathon</button>
        <button id="multiplayer" onClick={() => this.setState({probState: 4})}>multiplayer</button>
      </span>
      {(this.state.probState === 0) && (
        <div className={`box content`}>
          <h1>codebusters test</h1>
          <p>marathon mode gives you randomized question types from the ones available. if you select the record option, your results will be recorded and sent to a server where others can view your results. it's also an easy way to do codebusters tryouts online. good luck! ヽ(*・ω・)ﾉ</p>
          <label htmlFor="record">record? <input type="checkbox" id="record" name="record" onChange={this.setData}></input></label>
          <br></br>
          <label htmlFor="name">enter name: <input type="text" id="name" name="name" onChange={this.setData}></input></label>
          <br></br>
          <button onClick={this.startMarathon}>start</button>
        </div>
      )}
      {(this.state.probState === 1) && this.state.probType && this.state.questions.length > 0 && (
        <div className={`box content`} tabIndex={-1} onKeyDown={this.setLetter}>
        <h1>{this.state.probType}</h1>
        {this.state.probType !== "Baconian Cipher" && (
          <p>{`Solve this code by ${this.state.questions[this.state.currQ].source} which has been ${(this.state.questions[this.state.currQ].mangle ? "badly misheard and" : "")} encoded as a${("AEIOU".indexOf(this.state.probType.charAt(0)) !== -1 ? "n" : "") + " " + this.state.probType}${(this.state.questions[this.state.currQ].encoding.length > 0 ? " using a " + this.state.questions[this.state.currQ].encoding + " alphabet" : "")}.`}</p>
        )}
        {this.state.probType === "Baconian Cipher" && (
          <p>{`Solve this message which has been encoded as a Baconian Cipher.`}</p>
        )}
        {this.state.questions[this.state.currQ].hint && this.state.questions[this.state.currQ].hint.length > 0 && (
          <p>{"hint: " + this.state.questions[this.state.currQ].hint}</p>
        )}
        {this.state.questions[this.state.currQ].error && this.state.questions[this.state.currQ].error.length > 0 && (
          <p className="warning">{this.state.questions[this.state.currQ].error}</p>
        )}
        {this.state.probType !== "Baconian Cipher" && (
            this.state.questions[this.state.currQ].plaintext.toLowerCase().split(" ").map((word, index) => {
                return(
                    <div className="word" onClick={this.selectLetter}>
                        {
                            word.split("").map((letter, index) => {
                                if (this.state.questions[this.state.currQ].alphabet.indexOf(letter) !== -1) {
                                    return(
                                        <div className="letter">
                                            <div className={`${this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)] === this.state.selectedLetter ? "selected" : ""}`}>{this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)]}</div>
                                            <div>{this.state.questions[this.state.currQ].guesses[this.state.questions[this.state.currQ].alphabet.indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)])]}</div>
                                        </div>
                                    )
                                }
                                else {
                                    return(
                                        <div className="letter">
                                            <div>{letter}</div>
                                            <div>&nbsp;</div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                )
            })
        )}
        {this.state.probType === "Baconian Cipher" && (
            <div className="word" onClick={this.selectLetter}>
                {
                    this.state.questions[this.state.currQ].plaintext.split("").map((letter, index) => {
                        if (this.state.questions[this.state.currQ].alphabet.indexOf(letter) !== -1) {
                            return(
                                <div className="letter">
                                    <div className={`${this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)] === this.state.selectedLetter ? "selected" : ""}`}>{this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)]}</div>
                                    <div>&nbsp;&nbsp;{this.state.questions[this.state.currQ].guesses[this.state.questions[this.state.currQ].mapping.indexOf(this.state.questions[this.state.currQ].mapping[this.state.questions[this.state.currQ].alphabet.indexOf(letter)])]}&nbsp;&nbsp;</div>
                                </div>
                            )
                        }
                        else {
                            return(
                                <div className="letter">
                                    <div>{letter}</div>
                                    <div>&nbsp;</div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        )}
        {this.state.probType !== "Baconian Cipher" && (
            <table>
              <tbody>
                <tr>
                    {
                      this.state.questions[this.state.currQ].alphabet.split("").map((letter, index) => {
                        return <th>{letter}</th>
                      })
                    }
                </tr>
                <tr>
                    {
                      this.state.questions[this.state.currQ].alphabet.split("").map((letter, index) => {
                        return <td>{(this.state.questions[this.state.currQ].plaintext.match(new RegExp(this.state.questions[this.state.currQ].alphabet[this.state.questions[this.state.currQ].mapping.indexOf(letter)], "g")) || []).length}</td>
                      })
                    }
                </tr>
                <tr>
                    {
                      this.state.questions[this.state.currQ].alphabet.split("").map((letter, index) => {
                        return <td>{this.state.questions[this.state.currQ].guesses[this.state.questions[this.state.currQ].alphabet.indexOf(letter)]}</td>
                      })
                    }
                </tr>
              </tbody>
          </table>
        )}
        <div className="stopwatch">
          <div className={`stopwatch-display ${parseInt(minutes) >= 50 ? "warning" : ""}`}>
            {hours} : {minutes} : {seconds} : {centiseconds}
          </div>
          <br></br>
          {this.state.timer.timerOn === false && this.state.timer.timerTime === 0 && (
            <button onClick={this.startTimer}>start</button>
          )}
          {this.state.timer.timerOn === true && !this.state.marathon && !this.state.multiplayer && (
            <button onClick={this.stopTimer}>stop</button>
          )}
          {this.state.timer.timerOn === false && this.state.timer.timerTime > 0 && !this.state.marathon && !this.state.multiplayer && (
            <button onClick={this.startTimer}>resume</button>
          )}
          {this.state.timer.timerOn === false && this.state.timer.timerTime > 0 && !this.state.marathon && !this.state.multiplayer && (
            <button onClick={this.resetTimer}>reset</button>
          )}
        </div>
        {!this.state.multiplayer && (
            <h5>{this.state.score[0] + "/" + this.state.score[1]}</h5>
          )}
        <div className="prevnext">
          {this.state.multiplayer && this.state.currQ > 0 && (
            <button onClick={this.prevProb}>previous</button>
          )}
          {!this.state.multiplayer && (
            <button onClick={this.checkProb}>check</button>
          )}
          {((!this.state.marathon && !this.state.multiplayer) || this.state.marathon || (this.state.multiplayer && this.state.currQ < this.state.questions.length - 1)) && (
            <button onClick={this.nextProb}>next</button>
          )}
          {(this.state.marathon || this.state.multiplayer) && (
            <button onClick={this.sendMarathon}>finish!</button>
          )}
        </div>
      </div>
      )}
      {(this.state.probState === 2) && (
        <div className={`box content`}>
          <h1>test complete!</h1>
          <p>we pride ourselves on transparency. if you selected record, go <a href="https://codebusters-406e6.firebaseio.com/results.json" target="_blank" rel="noopener noreferrer">here</a> to check your results. or <a href="https://github.com/mobiusdonut/codebusters" target="_blank" rel="noopener noreferrer">here</a> to check out the source code.</p>
          <h5>{"score: " + this.state.questions.reduce((a, b) => a + this.computeScore(b), 0)}</h5>
        </div>
      )}
      {(this.state.probState === 3) && (
        <div className={`box content`}>
          <img className="hero" src="img/logo.png" alt="cb"></img>
          <h1 className="bigh">codebusters</h1>
          <h6><a href="https://github.com/mobiusdonut/codebusters/wiki" target="_blank" rel="noopener noreferrer">wiki + resources</a></h6>
          <h6><a href="https://github.com/mobiusdonut" target="_blank" rel="noopener noreferrer">more by me</a></h6>
          <button id="results">results</button>
          <div id="my_dataviz"></div>
        </div>
      )}
      {(this.state.probState === 4) && (
        <div className={`box content`}>
          <h1>multiplayer</h1>
          <p>multiplayer mode lets you work with your teammates remotely. input the room code your partner provided (or one of your own) and get codebusting!</p>
          <label htmlFor="name">enter name: <input type="text" id="name" name="name" onChange={this.setData}></input></label>
          <br></br>
          <label htmlFor="code">enter room code: <input type="text" id="code" name="code" onChange={this.setData}></input></label>
          <br></br>
          <button onClick={this.logInUser}>login</button>
        </div>
      )}
      {(this.state.probState === 5) && (
        <div className={`box content`}>
          <h1>{`waiting room (${this.state.userInfo.roomCode})`}</h1>
          {
            this.state.userInfo.team.map((user, index) => {
              return <p>{user.username}</p>
          })
          }
          <button onClick={this.startMultiplayer}>start</button>
          {(this.state.loading) && (
            <p>loading...</p>
          )}
        </div>
      )}
    </div>;
  }
  
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      userActivity: [],
      username: null,
      text: ''
    };
  }

  /* When content changes, we send the
current content of the editor to the server. */
 onEditorStateChange = (text) => {
   client.send(JSON.stringify({
     type: "contentchange",
     username: this.state.username,
     content: text
   }));
 };

  render() {
    return (
      <Cipher></Cipher>
    );
  }
}

export default App;
