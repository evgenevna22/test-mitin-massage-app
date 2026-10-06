<template>
  <div class="book-form">
    <FloatLabel variant="on">
      <InputText id="username" v-model="username" disabled />
      <label for="username">Username</label>
    </FloatLabel>
    <FloatLabel variant="on">
      <InputText id="comment" v-model="comment" />
      <label for="comment">Comment</label>
    </FloatLabel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = '@username';
const comment = ref('');
</script>

<style scoped></style>
