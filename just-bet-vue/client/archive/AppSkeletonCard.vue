<script lang="ts" setup>
import AppCard from '~components/AppCard.vue'
import AppSkeletonLoader from '~components/AppSkeletonLoader.vue'
</script>

<template>
  <AppCard heading="">
    <template #heading>
      <div class="text-container">
        <AppSkeletonLoader height="100%" />
      </div>
    </template>
    <template #extra>
      <div class="text-container">
        <AppSkeletonLoader height="100%" />
      </div>
    </template>
    <div class="app-skeleton-container">
      <section class="left-section">
        <AppSkeletonLoader height="100%" />
      </section>
      <section class="right-section">
        <div>
          <div class="top-container">
            <AppSkeletonLoader height="100%" />
          </div>
          <div class="bottom-container">
            <div>
              <AppSkeletonLoader height="100%" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppCard>
  <div class="skeleton-footer">
    <AppSkeletonLoader color="var(--color-card-main)" height="2rem" />
  </div>
</template>

<style lang="scss" scoped>
.text-container {
  width: 300px;
  height: 2rem;
}

.skeleton-footer {
  width: 100%;
  position: relative;
  display: flex;
  flex-grow: 1;
  padding: 50px 40px;
  display: flex;
  align-items: flex-start;
  color: var(--color-text-subtle);
  justify-content: space-between;
}
.app-skeleton-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  section {
    display: flex;
    align-items: center;
  }
}

.right-section {
  width: 100%;
  height: 100%;
  position: relative;

  > div {
    padding: 0px 10%;
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .top-container {
    width: 90%;
    height: 150px;
  }

  .bottom-container {
    width: 80%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      height: 75px;
      width: 100%;
    }
  }
}

.left-section {
  height: 100%;
  aspect-ratio: 1/1;
  padding: 50px;

  &::after {
    content: '';
    height: 90%;
    position: absolute;
    width: 2px;
    background: var(--color-container-titles);
    right: -1px;
  }
}
</style>
