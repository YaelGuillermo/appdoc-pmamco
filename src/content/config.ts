import { defineCollection } from 'astro:content';

const docs = defineCollection({
  schema: ({ image }) => ({
    title: { type: 'string', required: true },
    description: { type: 'string' },
    pubDate: { type: 'date', required: true },
    updatedDate: { type: 'date' },
    heroImage: image(),
  }),
});

export const collections = { docs };