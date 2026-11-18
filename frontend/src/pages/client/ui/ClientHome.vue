<template>
  <div class="client-home">
    <Hero />
    
    <main class="home-content">
      <section class="intro-section">
        <p class="eyebrow">SLOW DOWN · BREATHE · RESET</p>
        <h2>Make space<br />for yourself.</h2>
        <p class="body-copy">
          Thoughtful bodywork, a calm space and a little time that belongs only
          to you.
        </p>
      </section>

      <section class="booking-section" aria-labelledby="booking-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">YOUR NEXT RESET</p>
            <h2 id="booking-title">Choose a master</h2>
          </div>
          <span class="section-index">01 / 03</span>
        </div>

        <p v-if="isLoading" class="muted-copy">Finding available masters…</p>
        <p v-else-if="!masters.length" class="muted-copy">
          No masters are available right now.
        </p>
        <div v-else class="master-list">
          <button
            v-for="(master, index) in masters"
            :key="master.id"
            class="master-card"
            type="button"
            @click="handleChooseMaster(master.id)"
          >
            <span class="master-card__number">0{{ index + 1 }}</span>
            <span class="master-card__name">{{ master.name }}</span>
            <i class="pi pi-arrow-up-right" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section class="location-section">
        <img class="location-section__title" :src="locationTitle" alt="" />
        <div class="location-section__photos">
          <img :src="locationRoomImage" alt="A bright massage studio" />
          <img :src="locationTableImage" alt="A massage table in the studio" />
        </div>
        <p class="location-section__address">ADDRESS: KOČE POPOVIĆA 8</p>
        <img
          class="location-section__map"
          :src="locationMap"
          alt="Map of the studio location"
        />
      </section>

      <section class="project-section">
        <img class="project-section__title" :src="projectTitle" alt="" />
        <div class="project-section__photos">
          <img :src="teamImage" alt="Massage therapist Mitya" />
          <img :src="teamImageTwo" alt="A massage session" />
        </div>
        <p class="project-section__caption">
          A little more ease, one session at a time.
        </p>
      </section>

      <footer class="home-footer">
        <span>MITIN MASSAGE</span>
        <Button
          label="Read client reviews"
          icon="pi pi-arrow-up-right"
          text
          @click="handleOpenReviews"
        />
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ClientSlotsApi } from '../api/client-slots';
import type { MasterDTO } from '../model';
import Hero from './hero/Hero.vue';

import teamImage from '@/shared/ui/assets/mitya_team_img_1.jpg';
import teamImageTwo from '@/shared/ui/assets/mitya_team_img_2.jpg';
import locationTitle from '@/shared/ui/assets/text_space_location.png';
import locationRoomImage from '@/shared/ui/assets/space_loc_1_img.jpg';
import locationTableImage from '@/shared/ui/assets/space_loc_2_img.jpg';
import locationMap from '@/shared/ui/assets/map.png';
import projectTitle from '@/shared/ui/assets/text_project_statement.png';

const router = useRouter();
const masters = ref<MasterDTO[]>([]);
const isLoading = ref(true);

const handleChooseMaster = (masterId: string) => {
  router.push({ name: 'ClientCalendar', params: { masterId } });
};

const handleOpenReviews = () => {
  router.push({ name: 'ClientReviews' });
};

onMounted(async () => {
  try {
    masters.value = await ClientSlotsApi.getMasters();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.client-home {
  padding-bottom: 24px;
  background: var(--color-client-background);
}

.home-content {
  display: grid;
  gap: 44px;
  padding: 40px 20px 20px;
}

.intro-section {
  max-width: 460px;
  padding: 10px 4px;
}

.eyebrow {
  color: var(--color-client-orange);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

h2 {
  margin-top: 12px;
  color: #fff;
  font-size: clamp(30px, 9vw, 44px);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 1.04;
}

.body-copy,
.muted-copy {
  margin-top: 14px;
  color: rgb(255 255 255 / 62%);
  font-size: 14px;
  line-height: 1.6;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-index {
  padding-bottom: 6px;
  color: rgb(255 255 255 / 45%);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.master-list {
  display: grid;
  gap: 10px;
}

.master-card {
  display: flex;
  min-height: 70px;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 18px;
  background: rgb(255 255 255 / 4%);
  color: #fff;
  text-align: left;
}

.master-card__number {
  color: var(--color-client-orange);
  font-size: 11px;
}

.master-card__name {
  flex: 1;
  font-size: 16px;
  font-weight: 550;
}

.location-section {
  display: grid;
  gap: 14px;
  margin-inline: -20px;
  padding: 30px 20px 24px;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 40%), rgb(0 0 0 / 78%)),
    url('@/shared/ui/assets/blue_green_bg.webp') center / cover;
}

.location-section__title,
.project-section__title {
  width: min(78%, 280px);
  height: 56px;
  object-fit: contain;
  object-position: left center;
}

.location-section__photos,
.project-section__photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.location-section__photos img {
  width: 100%;
  height: 176px;
  border-radius: 13px;
  object-fit: cover;
}

.location-section__address {
  color: #fff;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.04em;
}

.location-section__map {
  width: 100%;
  height: 148px;
  border-radius: 13px;
  object-fit: cover;
}

.project-section {
  display: grid;
  gap: 14px;
  margin-inline: -20px;
  padding: 28px 20px 32px;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 40%), rgb(0 0 0 / 68%)),
    url('@/shared/ui/assets/green_top_bg.webp') center / cover;
}

.project-section__photos img {
  width: 100%;
  height: 146px;
  border-radius: 14px;
  object-fit: cover;
}

.project-section__caption {
  color: rgb(255 255 255 / 68%);
  font-size: 13px;
}

.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(255 255 255 / 14%);
  padding-top: 14px;
  color: rgb(255 255 255 / 56%);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.home-footer :deep(.p-button) {
  color: #fff;
  font-size: 11px;
  letter-spacing: normal;
}
</style>
