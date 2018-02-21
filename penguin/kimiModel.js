const User = require('./../server/user/userModel');


class Penguin {
  constructor(name) {
    this.name = name;
    this.happiness = 50;
    this.energy = 100;  //very energetic
    this.hunger = 0;    //not hungry, max=100 means starving
    this.HUNGER_SPEED = 6000;
    this.UPDATE_SPEED = 6000;
    this.busy = false;
    this.playingWith = '';
    this.currUserFn = 0;
    this.relaxfunc = null;
    this.userUpdatefunc = null;
    setInterval(this.increaseHunger.bind(this), this.HUNGER_SPEED);
  }

  increaseHunger() {
    if (this.hunger < 100) {
      this.hunger++;
      console.log(`hunger is ${this.hunger}, busy: ${this.busy}, playing with ${this.playingWith}, currUserFn is ${this.currUserFn} now`);
    }
  }

  feed(food) {
    if (this.hunger === 0) return 'full';
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
        this.hunger = 0;
        this.happiness -= 20;
        break;
      case 'ramen':
        this.happiness += 50;
        break;
      default:
        this.happiness -= 1;
    }
    if (this.hunger < 0) this.hunger = 0;
  }

  play(user) {
    const playOrNot = Penguin.willingnessToPlay(user.friendliness);  // true for play, false for stay alone
    if (playOrNot) {
      clearTimeout(this.relaxfunc);
      clearInterval(this.userUpdatefunc);
      //play 5-20 min
      const playtime = Math.round(15*(Math.random())+5);
      console.log('playtime = ', playtime);
      this.busy = true;
      this.currUserFn = user.friendliness;
      this.playingWith = user.username;
      this.relaxfunc = setTimeout(Penguin.relax.bind(this), playtime*this.UPDATE_SPEED); //should be 60000, 6000 for testing reason
      this.userUpdatefunc = setInterval(Penguin.userUpdate.bind(this), this.UPDATE_SPEED*2);

    }
  }



  static willingnessToPlay(friendliness) {
    if (friendliness < 10) return false;
    if (friendliness > 999) return true;
    const prob = Math.round((1 - (5/(friendliness-5)))*100);
    const rand = Math.round(100*(Math.random()));
    console.log(`prob=${prob}%, rand=${rand}%`);
    return prob > rand;

  }

  static relax() {
    clearInterval(this.userUpdatefunc);
    this.busy = false;
    this.playingWith = '';
    this.currUserFn = 0;
  }

  static userUpdate() {
    const change = {
      friendliness: this.currUserFn + 5
    }
    User.findOneAndUpdate({username: this.playingWith}, change ,(err, result) => {
      if (err) {
        console.log('fail to update -- kimi');
      }
      this.currUserFn += 5;
      console.log(`Kimi likes ${this.playingWith}`);
    });
  }
}



const kimi = new Penguin('kimi');


module.exports = kimi;
