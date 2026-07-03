<template>
  <Breadcrumb :model="breadcrumbs">
    <template #item="{ item, props }">
      <router-link v-slot="{ href, navigate }" :to="item.url ?? ''" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span v-if="item.icon" :class="[item.icon, 'text-color']" />
          <span class="text-primary font-semibold">{{ item.title }}</span>
        </a>
      </router-link>
    </template>
  </Breadcrumb>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '../composables'

const { breadcrumbs } = useBreadcrumbs()
</script>

<style lang="scss"></style>
