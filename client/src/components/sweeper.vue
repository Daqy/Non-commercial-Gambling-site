<template lang="pug">
.centering.float-left(class="w-9/12").flex.justify-center
  .sweeper.w-192.z-10
    .cm-left.w-96.p-2.box-content.shadow-cus.relative.m-8.bg-white(v-for="grid in sweeper")
      .leftSide.w-96.h-96.grid.grid-cols-5.gap-1.grid-rows-5(:id="'grid'+grid.id" :key="'grid'+grid.id")
        a.cursor-pointer.relative.flex.justify-center.items-center#box(v-for="(box, index) in grid.size" :key="index + 1" :id="index + 1" :style="{backgroundColor: darkTheme.gridColor}" @click.once="gridClick")
          p.relative.max-h-full.font-bold.text-white
      .rightSideTopSide.shadow-cus.w-96.absolute.top-0.left-24.bg-white.p-4
        .nextRewardContainer.absolute
          p.font-bold Next Reward
          template
            p(v-if="grid.increment < 1") {{ grid.increment.toFixed(2) }}
            p(v-else) {{ grid.increment.toFixed(0) }}
        .totalStakeContainer.absolute
          p.font-bold Total Stake
          template
            p(v-if="grid.increment < 1") {{ grid.total.toFixed(2) }}
            p(v-else) {{ grid.total.toFixed(0) }}
        template(v-if="grid.gameStatus === 'ongoing'")
          button.bg-orange-500.text-white.font-bold.py-2.px-4.rounded.absolute(class="hover:bg-orange-400" :id="'checkOut'+grid.id" @click.once="checkOutClick") Check Out
        template(v-else-if="grid.gameStatus === 'won'")
          button.text-white.font-bold.py-2.px-4.rounded.cursor-default.absolute(style="background-color: #40c057;" disabled) Cashed Out
        template(v-else)
          button.text-white.font-bold.py-2.px-4.rounded.cursor-default.absolute(style="background-color: #e50000;" disabled) Game Over
      .rightSideBottom.w-96.absolute.left-24.shadow-cus.p-1.overflow-hidden
        .textContainer.overflow-y-scroll.h-full.w-full.pr-6(:class="{redTextEnd: grid.gameStatus==='lost'}" :id="'log'+grid.id")
          p.text-xs(v-for="text in grid.consoleLog" ) {{ text }}
</template>

<script>
export default {
  props: {
    newGame: Object
  },
  data() {
    return {
      darkTheme: {
        gridColor: "#ced4da",
        gridBG: "#34383d",
        BG: "#343a40",
        cashOut: "#fd7e14",
        green: "#40c057"
      },
      sweeper: []
    };
  },
  watch: {
    newGame: function() {
      if (typeof this.newGame !== "undefined") {
        this.sweeper.push({
          id: (this.sweeper.length),
          size: Array(25),
          BombLocation: this.generateBombLocation(this.newGame.numberOfBombs, 25),
          gameStatus: "ongoing",
          increment: Number(this.newGame.increment),
          total: Number(this.newGame.balance),
          numberTimesClicked: 0,
          consoleLog: [`Game has started, price pool: ${this.newGame.balance}`]
        });
      }
    }
  },
  methods: {
    calculateNextReward(value, id) {
      const rewardSweeper = this.sweeper[id];
      const numberOfBombs = rewardSweeper.BombLocation.length;
      const reward = rewardSweeper.increment;
      rewardSweeper.total += reward;
      rewardSweeper.numberTimesClicked += 1;
      rewardSweeper.increment = (rewardSweeper.total * (numberOfBombs / 2 / (25 - Number(rewardSweeper.numberTimesClicked))));
    },
    gridClick(event) {
      const gridIndex = event.target.parentNode.id.split("grid")[1];
      const posIndex = event.target.id;
      if (this.sweeper[gridIndex].gameStatus === "ongoing") {
        if (this.hasBombClicked(this.sweeper[gridIndex], posIndex)) {
          this.bombClicked(gridIndex);
        } else {
          if (this.sweeper[gridIndex].increment < 1) {
            event.target.children[0].textContent = "+" + this.sweeper[gridIndex].increment.toFixed(2);
            this.addMessage(gridIndex, `You have just won ${this.sweeper[gridIndex].increment.toFixed(2)} Bryan's`);
          } else {
            event.target.children[0].textContent = "+" + this.sweeper[gridIndex].increment.toFixed(0);
            this.addMessage(gridIndex, `You have just won ${this.sweeper[gridIndex].increment.toFixed(0)} Bryan's`);
          }
          this.calculateNextReward(this.sweeper[gridIndex].total, gridIndex);
          event.target.style.backgroundColor = "#40c057";
        }
        console.log(`square ${posIndex} has been clicked`);
      }
    },
    generateBombLocation(numberOfBombs, gridSize) {
      const newBombLocation = [];
      const numBomb = numberOfBombs;

      this.add(newBombLocation, true, numBomb);
      this.add(newBombLocation, false, 25 - numBomb);

      return this.mapping(this.shuffle(newBombLocation));
    },
    shuffle(array) {
      for (let arrayIndex = 0; arrayIndex < array.length - 1; arrayIndex++) {
        const rdnIndex = Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0;
        [array[arrayIndex], array[rdnIndex]] = [array[rdnIndex], array[arrayIndex]];
      }
      return array;
    },
    mapping(array) {
      return array.map((element, index) => ({ index, element })).filter(pair => pair.element).map(pair => pair.index + 1);
    },
    add(array, value, repeat) {
      for (let i = 0; i < repeat; i++) {
        array.push(value);
      }
    },
    hasBombClicked(grid, index) {
      for (let i = 0; i < grid.BombLocation.length; i++) {
        if (Number(index) === grid.BombLocation[i]) {
          return true;
        }
      }
      return false;
    },
    showBombs(index) {
      const bombLocation = this.sweeper[index].BombLocation;
      for (let i = 0; i < bombLocation.length; i++) {
        document.getElementById(`grid${index}`).children[bombLocation[i] - 1].style.backgroundColor = "#e50000";
        document.getElementById(`grid${index}`).children[bombLocation[i] - 1].innerHTML = '<svg class="w-5/12 h-5/12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z" fill="#ffffff"/></svg>';
      }
    },
    bombClicked(index) {
      this.addMessage(index, `You have Clicked the Bomb! You have lost ${this.sweeper[index].total.toFixed(0)} Bryan's`);
      const bombLocation = this.sweeper[index].BombLocation;
      this.sweeper[index].gameStatus = "lost";
      for (let i = 0; i < bombLocation.length; i++) {
        document.getElementById(`grid${index}`).children[bombLocation[i] - 1].style.backgroundColor = "#e50000";
        document.getElementById(`grid${index}`).children[bombLocation[i] - 1].innerHTML = '<svg class="w-5/12 h-5/12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z" fill="#ffffff"/></svg>';
      }
    },
    addMessage(index, message) {
      this.sweeper[index].consoleLog.push(message);
      const logBody = document.getElementById(`log${index}`);
      logBody.scrollTop = logBody.scrollHeight;
    },
    checkOutClick(event) {
      const gridIndex = event.target.id.split("checkOut")[1];
      const grid = this.sweeper[gridIndex];
      console.log(grid.numberTimesClicked);
      if (grid.numberTimesClicked > 0) {
        grid.gameStatus = "won";
        console.log("won " + grid.total);
        this.$emit("clicked", grid.total);
        this.showBombs(grid.id);
      }
    }
  }
};
</script>

<style lang="stylus">
  .rightSideTopSide:before {
    background white
    display block
    content "."
    font-size 0px
    width 4px
    height 9rem
    position absolute
    left -4px
    top 0
  }
  .rightSideTopSide {
    height 9rem
  }
  .rightSideBottom {
    height 16rem
    z-index -1
    top 9rem
    background-color #d8d8d8
    scrollbar-width none
  }
  .textContainer {
    box-sizing: content-box;
  }
  .textContainer p:not(:first-child) {
    color green
  }
  .redTextEnd p:last-child {
    color red
  }
  .leftSide:before {
    background white
    display block
    content "."
    font-size 0px
    width 4px
    height 9rem
    position absolute
    right -4px
    top 0
  }
  .totalStakeContainer {
    right 6rem
  }
  .rightSideTopSide button {
    bottom 1rem
  }
  .shadow-cus {
    box-shadow 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
  }
  .cm-left {
    margin-left -1px
  }
  .line-height-c {
    line-height 100%
  }
</style>