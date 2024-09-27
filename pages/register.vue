<script lang="ts" setup>
definePageMeta({
  layout: "centered",
  middleware: "guest",
});

const { t } = useI18n();
const title = t("Register");
const description = t(
  "Use one of the following providers to login to your account",
);

useSeoMeta({
  title,
  description,
});
</script>

<template>
  <UCard class="min-w-[400px]">
    <AuthForm
      :title
      :description
      align="bottom"
      :providers="[
        {
          label: 'GitHub',
          icon: 'i-simple-icons-github',
          color: 'gray',
          external: true,
          to: '/auth/github',
        },
        {
          label: 'Twitch',
          icon: 'i-simple-icons-twitch',
          color: 'gray',
          external: true,
          to: '/auth/twitch',
        },
      ]"
    >
      <template #footer>
        <div class="flex justify-between">
          <div></div>
          <div>
            <NuxtLink to="/" class="text-primary font-medium">
              {{ $t("Back to home") }}
            </NuxtLink>
          </div>
        </div>
      </template>
    </AuthForm>
  </UCard>
</template>
