import { defineConfig } from 'orval'

export default defineConfig({
  nexo: {
    input: {
      target: './spec/openapi.yaml',
      override: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformer: (spec: Record<string, any>) => {
          const s = spec
          // Fix Go time.Time mapped as empty object — should be a date-time string
          if (s.components?.schemas?.Time) {
            s.components.schemas.Time = {
              type: 'string',
              format: 'date-time',
            }
          }
          return s
        },
      },
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          version: 5,
          signal: true,
        },
      },
    },
  },
})
