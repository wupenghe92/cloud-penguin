class Penguin {
  constructor(name) {
    this.name = name;
    this.happiness = 50;
    this.energy = 100;  //very energetic
    this.hunger = 0;    //very hungry, max=100 means full
    this.HUNGER_SPEED = 10000;
    this.busy = false;
    setInterval(this.increaseHunger.bind(this), this.HUNGER_SPEED);
  }

  increaseHunger() {
    if (this.hunger < 100) {
      this.hunger++;
      console.log(`Kimi\'s hunger is ${this.hunger} now`);
    }
  }

  feed(food) {
    food = food.toLowerCase();
    switch(food) {
      case '':
        this.hunger--;
        break;
      case 'fish':
        this.hunger -= 4;
        this.happiness += 2
        break;
      case 'squid':
        this.hunger -= 6;
        this.happiness += 4
        break;
      case 'shrimp':
        this.hunger -= 2;
        this.happiness += 1
        break;
      case 'penguin':
        this.hunger = 100;
        this.happiness -= 20;
        break;
      default:
        this.happiness -= 1;
    }
    if (this.hunger < 0) this.hunger = 0;
  }

  play(friendliness) {
    const playOrNot = this.willingnessToPlay(friendliness);  // true for play, false for stay alone
    if (playOrNot) {
      //play 5-20 min
      const playtime = Math.round(15*(Math.random())+5);
      this.busy = true;
      setTimeout(this.relax.bind(this), playtime*60000);
    }
  }



  static willingnessToPlay(friendliness) {
    if (friendliness < 10) return false;
    if (friendliness > 999) return true;
    const prob = Math.round((1 - (5/(friendliness-5)))*100);
    const rand = 100*(Math.random());
    console.log(`prob=${prob}%, rand=${rand}%`);
    return prob > rand;
  }

  static relax() {
    this.busy = false;
  }

}





const kimi = new Penguin('kimi');


module.exports = kimi;
