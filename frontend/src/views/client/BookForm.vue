<template>
  <div class="book-form">
    <FloatLabel variant="on">
      <InputText id="massage-type" v-model="massageType" />
      <label for="massage-type">Тип массажа</label>
    </FloatLabel>
    <FloatLabel variant="on">
      <InputText id="comment" v-model="comment" />
      <label for="comment">Comment</label>
    </FloatLabel>
  </div>
</template>

<script setup lang="ts">
const massageType = defineModel<string>('massageType', { required: true });
const comment = defineModel<string>('comment', { required: true });
</script>

<style scoped></style>
