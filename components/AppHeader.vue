<script lang="ts" setup>
import type { HeaderLink } from "@/types";

const { loggedIn, session, user } = useUserSession();
const { t, locale } = useI18n();
const links = computed<HeaderLink[]>(() => {
  const links: HeaderLink[] = [
    {
      label: t("Blog"),
      to: "/blogs",
    },
    {
      label: t("Picture"),
      to: "/picture",
    },
    {
      label: t("Media"),
      children: [
        {
          label: t("Movies"),
          to: "/movies",
          icon: "i-mdi-movie",
        },
        {
          label: t("Tv"),
          to: "/tv",
          icon: "i-mdi-television",
        },
      ],
    },
    {
      label: t("Finance"),
      to: "/finance",
    },
    // {
    //   label: t("Tools"),
    //   children: [
    //     {
    //       label: t("id-photo-generator"),
    //       icon: "i-mdi-camera",
    //       target: "_blank",
    //       to: "https://idphotos.compilesoul.com",
    //     },
    //     {
    //       label: t("pdf-converter"),
    //       icon: "i-mdi-file-pdf",
    //       target: "_blank",
    //       to: locale.value.includes("zh")
    //         ? "https://pdf.compilesoul.com/?lang=zh_CN"
    //         : "https://pdf.compilesoul.com",
    //     },
    //     {
    //       label: t("web-ssh"),
    //       icon: "i-mdi-terminal",
    //       target: "_blank",
    //       to: "https://sshwifty.compilesoul.com",
    //     },
    //     {
    //       label: t("short-link"),
    //       icon: "i-mdi-link",
    //       to: "/shortLink",
    //     },
    //   ],
    // },
  ];

  return links;
});

const items = [
  [
    {
      label: "Profile",
      to: "/profile",
      icon: "i-mdi-account-box",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-mdi-logout",
      click: async () => {
        await $fetch("/api/_auth/session", {
          method: "DELETE",
        });

        session.value = {};

        await navigateTo("/");
      },
    },
  ],
];

const title = useRuntimeConfig().app.name;
const icon = useAppConfig().app.logo;
</script>

<template>
  <Header :title :links="links" :ui="{ logo: 'items-center' }">
    <template #logo>
      <img class="h-6 w-6" :src="icon" aria-hidden />

      <span> {{ title }} </span>
    </template>

    <template #right>
      <template v-if="loggedIn && user">
        <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
          <UButton
            color="gray"
            aria-label="Profile picture of connected user"
            variant="ghost"
            square
          >
            <AppAvatar :src="user.avatar" />
          </UButton>
        </UDropdown>
      </template>
      <template v-else>
        <ContentSearchButton class="max-w-48" :label="t('Search')" />
        <UButton to="/login" color="gray" variant="ghost">
          {{ $t("Login") }}
        </UButton>
        <UButton to="/register" color="black" variant="solid">
          {{ $t("Register") }}
        </UButton>
      </template>
    </template>
  </Header>
</template>
