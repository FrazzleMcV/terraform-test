export default {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['id', 'title', 'description']
  }
} as const;
