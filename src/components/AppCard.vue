<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routerPathPrettify } from '~services/routerPathPrettify'
import { Icons } from '~components/icons'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
  heading: string
}>()

const routeOptions = router.options.routes

const NavigationOptions = computed(() => {
  return routeOptions.filter(
    (route) =>
      route?.meta?.navigational &&
      route?.meta?.navigateTo &&
      props.heading !== routerPathPrettify(route.path)
  )
})

const showDropdown = ref(false)
</script>

<template>
  <div class="main-container">
    <div class="heading-container">
      <div
        class="dropdown"
        @click="
          () => {
            if (route.meta.navigational) {
              showDropdown = !showDropdown
            }
          }
        "
      >
        <div class="icon">
          <slot name="icon" />
        </div>
        <slot name="heading">
          <h2>{{ heading }}</h2>
          <span v-if="route.meta.navigational">
            <component
              :is="Icons.expand"
              :style="showDropdown ? 'transform: rotate(180deg)' : ''"
            />
          </span>
        </slot>
      </div>

      <div class="side-container">
        <slot name="extra" />
      </div>
    </div>
    <div class="dropdown-content" v-if="showDropdown && route.meta?.requiresAuth">
      <!-- {{ route }} -->

      <div
        class="navigate hover"
        v-for="(navigation, index) in NavigationOptions"
        :key="index"
        @click="
          () => {
            router.push({ name: navigation.name })
            showDropdown = false
          }
        "
      >
        <div class="dropdown-icon">
          <component :is="Icons[routerPathPrettify(navigation.path).toLowerCase()]" />
        </div>
        {{ routerPathPrettify(navigation.path) }}
      </div>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.dropdown-icon {
  fill: white;
  width: 30px;
  height: 30px;
  margin-right: 15px;
}

.hover:hover {
  cursor: pointer;
  background: var(--color-container-heading-hover);
}

.navigate {
  display: flex;
  align-items: center;
  padding: 1rem;
  min-width: 250px;
  text-transform: capitalize;

  &:not(:last-child)::after {
    content: '';
    width: 90%;
    height: 2px;
    background: var(--color-text-subtle);
    position: absolute;
    left: 5%;
    z-index: 1;
    bottom: -1px;
  }
}
.dropdown-content {
  position: absolute;
  z-index: 1;
  top: 74px;
  left: 0px;
  background: var(--color-container-titles);
  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.dropdown {
  height: 100%;
  width: -webkit-max-content;
  min-width: -webkit-fit-content;
  display: flex;
  margin-right: auto;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  & > h2 {
    min-width: max-content;
  }

  span {
    position: relative;
    top: 3px;
    width: 1.5rem;
    height: 1.5rem;

    & > svg {
      height: 100%;
      height: 100%;
      fill: white;
    }
  }
}
.main-container {
  max-width: 1000px;
  background-color: var(--color-container-main);
  width: 100%;
  aspect-ratio: 3.35/2;
  /* min-height: 597px;
  height: 0%; */
  // above code sets the default aspect ratio to 3.35 but allows for bigger heights
  display: flex;
  /* overflow: hidden; */
  border-radius: 10px;
  flex-direction: column;
  margin-bottom: var(--margin-bottom-main-container);
}

.heading-container {
  background-color: var(--color-container-titles);
  width: 100%;
  min-width: 100%;
  min-height: 75px;
  max-height: 75px;
  border-radius: 10px 10px 0px 0px;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  display: flex;
  align-items: center;
  text-transform: capitalize;
  padding: 0px 20px;
}

.side-container {
  margin-left: auto;
}

.icon {
  height: 45%;

  aspect-ratio: 1/1;
  margin-right: 10px;

  :deep(svg) {
    fill: white;
  }
}
</style>
