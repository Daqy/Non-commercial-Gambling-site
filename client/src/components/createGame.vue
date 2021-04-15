<template lang="pug">
  .h-screen.float-left(class="w-3/12")
    .fixed.h-screen(class="w-3/12")
      .bg-white.p-5.flex.flex-wrap.justify-center.rounded.m-2.shadow(class="w-11/12")
        .h-12.rounded.m-2.bgColor.topbar.flex.overflow-hidden(class="w-4/5")
          .bgColorTopBar.prefix.flex.justify-center.items-center(class="w-2/12")
            svg(class="w-4/6 h-4/6" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve")
              title Bryan's
              polygon(style="fill:#70f2a4;" points="360.129,172.138 256,472.276 512,172.138 ")
              g
                polygon(style="fill:#50dd89;" points="105.931,39.724 0,172.138 151.871,172.138")
                polygon(style="fill:#50dd89;" points="360.129,172.138 512,172.138 406.069,39.724")
                polygon(style="fill:#50dd89;" points="360.129,172.138 256,39.724 151.871,172.138")
              polygon(style="fill:#38c674;" points="256,39.724 105.931,39.724 151.871,172.138")
              polygon(style="fill:#38c674;" points="406.069,39.724 256,39.724 360.129,172.138")
              polygon(style="fill:#38c674;" points="151.871,172.138 256,472.276 360.129,172.138")
              polygon(style="fill:#1ba552;" points="0,172.138 256,472.276 151.871,172.138")
            </svg>
          input.bgColorTopBar.p-2.font-bold(placeholder="bet amount" value="0" class="w-5/12" @keydown="preventAlphaKey" v-model="inputBalance")
          div.grid.grid-cols-3.borderLine.relative.overflow-hidden(class="w-6/12")
            .half.flex.justify-center.items-center.relative.cursor-pointer.font-bold(v-for="m in ['1/2', '2x', 'max']" @click="changeInputBalance($event)")
              p {{ m }}
        .h-12.rounded.m-2.bgColor.grid.grid-cols-4.borderLine.relative.overflow-hidden(class="w-4/5")
          .test.relative.flex.justify-center.items-center.cursor-pointer.font-bold(v-for="n in Multipliers" :class="{ active: n.isSelected }" @click="changeSelected(n.id)") {{ n.multiplier }}
        .h-12.rounded.m-2.join.flex.justify-center.items-center.cursor-pointer(class="w-4/5" @click="createGame()")
          p.font-bold Create Game
</template>

<script>

export default {
  props: {
    balance: Number
  },
  data() {
    return {
      inputBalance: "",
      Multipliers: [
        { id: 0, multiplier: 1, isSelected: true },
        { id: 1, multiplier: 3, isSelected: false },
        { id: 2, multiplier: 5, isSelected: false },
        { id: 3, multiplier: 24, isSelected: false }
      ]
    };
  },
  methods: {
    changeSelected(selectedMultiplierIndex) {
      const currentSelectedMultiplierIndex = this.selectedMultiplierIndex();
      this.Multipliers[currentSelectedMultiplierIndex].isSelected = false;
      this.Multipliers[selectedMultiplierIndex].isSelected = true;
    },
    selectedMultiplierIndex() {
      for (let i = 0; i < this.Multipliers.length; i++) {
        if (this.Multipliers[i].isSelected) {
          return i;
        }
      }
    },
    preventAlphaKey(e) {
      const allowedValues = "1234567890".split("");

      if (!allowedValues.includes(e.key) && e.key !== "Backspace") {
        e.preventDefault();
      }
    },
    changeInputBalance(e) {
      const multiplier = this.findMultiplier(e.target.textContent);
      if (multiplier === -1) {
        this.inputBalance = this.balance;
      } else {
        this.inputBalance *= multiplier;
      }
    },
    findMultiplier(value) {
      if (value === "1/2") {
        return 0.5;
      } else if (value === "2x") {
        return 2;
      } else {
        return -1;
      }
    },
    calculateIncrement(balance, numberOfBombs) {
      if (numberOfBombs === 24) {
        return balance * 20;
      } else {
        return balance * (numberOfBombs / 2 / 25);
      }
    },
    createGame() {
      const inputBalance = this.inputBalance;
      if (inputBalance > 0 && inputBalance <= this.balance) {
        let tempBalance = this.balance;
        tempBalance -= inputBalance;
        const selectedMultiplier = this.Multipliers[this.selectedMultiplierIndex()].multiplier;
        this.$emit("clicked", {
          numberOfBombs: selectedMultiplier,
          increment: this.calculateIncrement(inputBalance, selectedMultiplier),
          balance: inputBalance,
          actualBalance: tempBalance
        });
      }
    }
  }
};
</script>

<style lang="stylus">
  .join {
    background-color #abce79
  }
  .bgColor {
    background-color #b4bbc2
  }
  .active {
   background-color #d5dadf
  }
  .borderLine div:not(:last-child):after {
    content ""
    background-color #dfe3e7
    position absolute
    bottom 30%
    right -1.5px
    height 40%
    width 2.5px
    z-index 1
  }
  .borderLine div:not(.active):hover {
    background-color #d1d6dc
  }
  .topbar > * {
    height 100%
  }
  .bgColorTopBar {
    background-color #dfe3e7
  }
</style>