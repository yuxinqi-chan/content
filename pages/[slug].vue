<script setup lang="ts">
import { withoutTrailingSlash, joinURL } from "ufo";
import type { BlogPost } from "~/types";

const route = useRoute();

const { data: page } = await useAsyncData(route.path, () =>
  queryContent<BlogPost>(route.path).findOne(),
);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

const title = page.value.head?.title || page.value.title;
const description = page.value.head?.description || page.value.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

if (page.value.image?.src) {
  const site = useSiteConfig();

  useSeoMeta({
    ogImage: joinURL(site.url, page.value.image.src),
    twitterImage: joinURL(site.url, page.value.image.src),
  });
} else {
  defineOgImageComponent("Blog", {
    title,
    description,
    headline: "Blog",
  });
}
</script>
<template>
  <UContainer v-if="page">
    <PageHeader :title="page.title" :description="page.description">
      <template #headline>
        <UBadge v-bind="page.badge" variant="subtle" />
        <span class="text-gray-500 dark:text-gray-400">&middot;</span>
        <time class="text-gray-500 dark:text-gray-400">{{
          new Date(page.date).toLocaleDateString("zh", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        }}</time>
      </template>

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <UButton
          v-for="(author, index) in page.authors"
          :key="index"
          :to="author.to"
          color="white"
          target="_blank"
          size="sm"
        >
          <UAvatar v-bind="author.avatar" :alt="author.name" size="2xs" />

          {{ author.name }}
        </UButton>
      </div>
    </PageHeader>
    <Page>
      <PageBody prose>
        <ContentRenderer v-if="page && page.body" :value="page" />
        <hr />
        <Comment class="mt-4" :reply-to="`blogs:${page._id}`" />
      </PageBody>

      <template #right>
        <ContentToc
          v-if="page.body && page.body.toc"
          :links="page.body.toc.links"
          :title="$t('Table of Contents')"
        />
      </template>
    </Page>
  </UContainer>
</template>
