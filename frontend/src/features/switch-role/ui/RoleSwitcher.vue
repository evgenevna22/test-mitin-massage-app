<template>
  <button
    v-if="userStore.canSwitchRole"
    class="role-switcher"
    :disabled="isSwitching"
    @click="switchToClient"
  >
    {{ isSwitching ? 'switching…' : 'client app' }}
  </button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/entities/user/model/user-store';
import { useSwitchRole } from '../model/use-switch-role';

const userStore = useUserStore();
const { isSwitching, switchToClient } = useSwitchRole();
</script>

<style lang="scss" scoped>
.role-switcher {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 2px;
  color: greenyellow;
  font-size: 17px;
  font-weight: 700;
  text-shadow: 2px 2px black;
  border: 1px solid red;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  box-shadow: 0 0 7px 4px #dba3c7;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
}
</style>
