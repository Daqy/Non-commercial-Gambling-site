<script lang="ts" setup>
const props = defineProps<{
  labelInput: string
  type: string
  text?: string
  modelValue: string
  placeholder: string
  showError?: boolean
}>()
// defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label :for="labelInput">
    <span v-if="text">{{ text }}</span>
    <input
      :type="type"
      :id="labelInput"
      :value="modelValue"
      :placeholder="placeholder"
      :class="{ inputError: showError }"
      @input="$emit('update:modelValue', $event.target?.value)"
    />
  </label>
</template>

<style lang="scss" scoped>
.inputError {
  border: 4px solid var(--color-bomb-background) !important;
}

label {
  width: 100%;
  display: flex;
  flex-direction: column;
}

span {
  margin-bottom: 0.25rem;
}

input {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: black;
  font-size: 1em;
  border: none;
}
</style>
