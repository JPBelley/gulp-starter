class Person {
  constructor (name) {
    this.name = name;
  }
  hello() {
    return 'Hello ' + this.name;
  }
}

var person = new Person('JPB');


console.log(person.hello());
