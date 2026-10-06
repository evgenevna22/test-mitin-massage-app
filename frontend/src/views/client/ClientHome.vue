<template>
  <RoleSwitcher view-as="admin" />

  <header>
    <Hero />
  </header>
  <main>
    <h3>The firing slots:</h3>
    <div v-for="slot in upcoming" :key="slot.id">
      date: {{ slot.date }} | time: {{ slot.time }}
      <router-link v-slot="{ href, navigate }" :to="'form'" custom>
        <a :href="href" @click="navigate">
          date: {{ slot.date }} | time: {{ slot.time }}
        </a>
      </router-link>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { RoleSwitcher } from '@components';
import Hero from './hero/Hero.vue';
import { useGetAppointments } from '@/shared/composables';
import { computed } from 'vue';

const { appointments } = useGetAppointments();

const upcoming = computed(() => appointments.value.slice(0, 5));
</script>

<style lang="scss"></style>
