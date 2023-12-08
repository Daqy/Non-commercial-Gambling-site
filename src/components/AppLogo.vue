<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    validator(value: string) {
      return value.includes(' ')
    }
  }
})

const titleSections = Object.fromEntries(
  props.title?.split(' ').map((section, index) => [index === 0 ? 'start' : 'end', section])
)
</script>

<template>
  <h1>
    <span class="colouredText">{{ titleSections.start }}</span
    >{{ titleSections.end }}
  </h1>
</template>

<style lang="scss" scoped>
h1 {
  text-transform: uppercase;
  margin: 15px 0px;
}

.colouredText {
  color: var(--color-hightlight-green);
  margin-right: 8px;

  &::after {
    position: absolute;
    content: '';
    width: 5px;
    height: 5px;
    background-color: var(--color-hightlight-green);
    top: 50%;
    transform: translate(0%, 0%) rotate(45deg);
  }
}
</style>
