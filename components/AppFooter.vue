<script lang="ts" setup>
const title = useRuntimeConfig().app.name;
const { t } = useI18n();

const config = {
  socials: [
    {
      title: "GitHub",
      icon: "i-mdi-github",
      to: "https://github.com/yuxinqi-chan/content",
      target: "_blank",
    },
  ],
  footer: {
    notice: "Developed with Nuxt",
    smallLinks: [
      {
        label: t("About"),
        to: "/about",
      },
      {
        label: t("Contact"),
        to: "mailto:yuxinqichan@gmail.com",
      },
    ],
  },
};
const notice = config.footer.notice;
const smallLinks = config.footer.smallLinks;
const socials = config.socials;
</script>

<template>
  <Footer
    :links="smallLinks"
    :ui="{ bottom: { left: 'text-sm text-gray-600 dark:text-gray-300' } }"
  >
    <template #left>
      &copy; {{ new Date().getFullYear() }} {{ title }}.
      {{ t("all_rights_reserved") }}.
    </template>

    <template #right>
      <UButton
        v-for="social in socials"
        :key="social.title"
        square
        color="gray"
        variant="ghost"
        v-bind="social"
      />
    </template>
  </Footer>
</template>
