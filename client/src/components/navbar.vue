<template lang="pug">
  .currency.absolute.w-full.h-12
    .fixed.w-full.h-12.bg-white.shadow.top-0.z-20.flex.items-center
      .absolute.h-10.balance.flex.items-center.p-2
        svg(class="w-4/6 h-4/6" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width:30px" xml:space="preserve")
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
        p.font-bold {{ balance.toFixed(0) }}

</template>

<script>
export default {
  props: {
    balance: Number
  }
};
</script>

<style lang="stylus">
  .balance {
    background-color #dfe3e7
    border-radius 0.5rem
    width 8rem
    right 10px
  }
  .balance p {
    margin-left 10px
  }
</style>