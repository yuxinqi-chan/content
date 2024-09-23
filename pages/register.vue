<script lang="ts" setup>
definePageMeta({
  layout: "centered",
  middleware: "guest",
});

const title = "Register";
const description =
  "Use one of the following providers to register for an account.";

useSeoMeta({
  title,
  description,
});
</script>

<template>
  <UCard>
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
      By signing in, you agree to our
      <NuxtLink to="/" class="text-primary font-medium">
        Terms of Service </NuxtLink
      >.
    </AuthForm>
  </UCard>
</template>
