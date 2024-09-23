<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const title = "Profile";
const description = "Manage your profile settings.";

useSeoMeta({
  title,
  description,
});
</script>

<template>
  <UContainer>
    <Page>
      <PageHeader :title />
      <PageBody class="flex flex-col gap-12">
        <ProfileSectionInformation />

        <ProfileSectionProviders />

        <UDivider />

        <ProfileSectionDeleteAccount />
      </PageBody>
    </Page>
  </UContainer>
</template>
