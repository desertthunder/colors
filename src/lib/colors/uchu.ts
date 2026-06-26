import type { Palette } from './types'

const sourceUrl = 'https://code.webb.page/nevercease/uchu.git/plain/src/colors.ts'

/** uchu primary and pastel colors normalized for the app. */
export const uchuPalette = {
  id: 'uchu',
  name: 'uchu',
  sourceUrl: sourceUrl,
  groups: [
    {
      name: 'Base',
      swatches: [
        { name: 'yang', token: '--uchu-yang', value: { space: 'oklch', value: 'oklch(0.994 0 0)' } },
        { name: 'yin', token: '--uchu-yin', value: { space: 'oklch', value: 'oklch(0.1438 0.007 256.88)' } },
      ],
    },
    {
      name: 'Blue',
      swatches: [
        { name: 'blue-1', token: '--uchu-blue-1', value: { space: 'oklch', value: 'oklch(0.8966 0.046 260.67)' } },
        { name: 'blue-2', token: '--uchu-blue-2', value: { space: 'oklch', value: 'oklch(0.8017 0.091 258.88)' } },
        { name: 'blue-3', token: '--uchu-blue-3', value: { space: 'oklch', value: 'oklch(0.7094 0.136 258.06)' } },
        { name: 'blue-4', token: '--uchu-blue-4', value: { space: 'oklch', value: 'oklch(0.6239 0.181 258.33)' } },
        { name: 'blue-5', token: '--uchu-blue-5', value: { space: 'oklch', value: 'oklch(0.5487 0.222 260.33)' } },
        { name: 'blue-6', token: '--uchu-blue-6', value: { space: 'oklch', value: 'oklch(0.5115 0.204 260.17)' } },
        { name: 'blue-7', token: '--uchu-blue-7', value: { space: 'oklch', value: 'oklch(0.4736 0.185 259.89)' } },
        { name: 'blue-8', token: '--uchu-blue-8', value: { space: 'oklch', value: 'oklch(0.4348 0.17 260.2)' } },
        { name: 'blue-9', token: '--uchu-blue-9', value: { space: 'oklch', value: 'oklch(0.3953 0.15 259.87)' } },
      ],
    },
    {
      name: 'Gray',
      swatches: [
        { name: 'gray-1', token: '--uchu-gray-1', value: { space: 'oklch', value: 'oklch(0.9557 0.003 286.35)' } },
        { name: 'gray-2', token: '--uchu-gray-2', value: { space: 'oklch', value: 'oklch(0.9204 0.002 197.12)' } },
        { name: 'gray-3', token: '--uchu-gray-3', value: { space: 'oklch', value: 'oklch(0.8828 0.003 286.34)' } },
        { name: 'gray-4', token: '--uchu-gray-4', value: { space: 'oklch', value: 'oklch(0.8468 0.002 197.12)' } },
        { name: 'gray-5', token: '--uchu-gray-5', value: { space: 'oklch', value: 'oklch(0.8073 0.002 247.84)' } },
        { name: 'gray-6', token: '--uchu-gray-6', value: { space: 'oklch', value: 'oklch(0.7503 0.002 247.85)' } },
        { name: 'gray-7', token: '--uchu-gray-7', value: { space: 'oklch', value: 'oklch(0.6901 0.003 286.32)' } },
        { name: 'gray-8', token: '--uchu-gray-8', value: { space: 'oklch', value: 'oklch(0.6312 0.004 219.55)' } },
        { name: 'gray-9', token: '--uchu-gray-9', value: { space: 'oklch', value: 'oklch(0.5682 0.004 247.89)' } },
      ],
    },
    {
      name: 'Green',
      swatches: [
        { name: 'green-1', token: '--uchu-green-1', value: { space: 'oklch', value: 'oklch(0.9396 0.05 148.74)' } },
        { name: 'green-2', token: '--uchu-green-2', value: { space: 'oklch', value: 'oklch(0.8877 0.096 147.71)' } },
        { name: 'green-3', token: '--uchu-green-3', value: { space: 'oklch', value: 'oklch(0.8374 0.139 146.57)' } },
        { name: 'green-4', token: '--uchu-green-4', value: { space: 'oklch', value: 'oklch(0.7933 0.179 145.62)' } },
        { name: 'green-5', token: '--uchu-green-5', value: { space: 'oklch', value: 'oklch(0.7523 0.209 144.64)' } },
        { name: 'green-6', token: '--uchu-green-6', value: { space: 'oklch', value: 'oklch(0.7003 0.194 144.71)' } },
        { name: 'green-7', token: '--uchu-green-7', value: { space: 'oklch', value: 'oklch(0.6424 0.175 144.92)' } },
        { name: 'green-8', token: '--uchu-green-8', value: { space: 'oklch', value: 'oklch(0.5883 0.158 145.05)' } },
        { name: 'green-9', token: '--uchu-green-9', value: { space: 'oklch', value: 'oklch(0.5277 0.138 145.41)' } },
      ],
    },
    {
      name: 'Orange',
      swatches: [
        { name: 'orange-1', token: '--uchu-orange-1', value: { space: 'oklch', value: 'oklch(0.9383 0.037 56.93)' } },
        { name: 'orange-2', token: '--uchu-orange-2', value: { space: 'oklch', value: 'oklch(0.8837 0.072 55.8)' } },
        { name: 'orange-3', token: '--uchu-orange-3', value: { space: 'oklch', value: 'oklch(0.8356 0.107 56.49)' } },
        { name: 'orange-4', token: '--uchu-orange-4', value: { space: 'oklch', value: 'oklch(0.7875 0.141 54.32)' } },
        { name: 'orange-5', token: '--uchu-orange-5', value: { space: 'oklch', value: 'oklch(0.7461 0.171 51.56)' } },
        { name: 'orange-6', token: '--uchu-orange-6', value: { space: 'oklch', value: 'oklch(0.6933 0.157 52.18)' } },
        { name: 'orange-7', token: '--uchu-orange-7', value: { space: 'oklch', value: 'oklch(0.638 0.142 52.1)' } },
        { name: 'orange-8', token: '--uchu-orange-8', value: { space: 'oklch', value: 'oklch(0.5828 0.128 52.2)' } },
        { name: 'orange-9', token: '--uchu-orange-9', value: { space: 'oklch', value: 'oklch(0.5249 0.113 51.98)' } },
      ],
    },
    {
      name: 'Pink',
      swatches: [
        { name: 'pink-1', token: '--uchu-pink-1', value: { space: 'oklch', value: 'oklch(0.958 0.023 354.27)' } },
        { name: 'pink-2', token: '--uchu-pink-2', value: { space: 'oklch', value: 'oklch(0.9214 0.046 352.31)' } },
        { name: 'pink-3', token: '--uchu-pink-3', value: { space: 'oklch', value: 'oklch(0.889 0.066 354.39)' } },
        { name: 'pink-4', token: '--uchu-pink-4', value: { space: 'oklch', value: 'oklch(0.8543 0.09 354.1)' } },
        { name: 'pink-5', token: '--uchu-pink-5', value: { space: 'oklch', value: 'oklch(0.8223 0.112 355.33)' } },
        { name: 'pink-6', token: '--uchu-pink-6', value: { space: 'oklch', value: 'oklch(0.7637 0.101 355.37)' } },
        { name: 'pink-7', token: '--uchu-pink-7', value: { space: 'oklch', value: 'oklch(0.7023 0.092 354.96)' } },
        { name: 'pink-8', token: '--uchu-pink-8', value: { space: 'oklch', value: 'oklch(0.6411 0.084 353.91)' } },
        { name: 'pink-9', token: '--uchu-pink-9', value: { space: 'oklch', value: 'oklch(0.5768 0.074 353.14)' } },
      ],
    },
    {
      name: 'Purple',
      swatches: [
        { name: 'purple-1', token: '--uchu-purple-1', value: { space: 'oklch', value: 'oklch(0.891 0.046 305.24)' } },
        { name: 'purple-2', token: '--uchu-purple-2', value: { space: 'oklch', value: 'oklch(0.7868 0.091 305)' } },
        { name: 'purple-3', token: '--uchu-purple-3', value: { space: 'oklch', value: 'oklch(0.685 0.136 303.78)' } },
        { name: 'purple-4', token: '--uchu-purple-4', value: { space: 'oklch', value: 'oklch(0.5847 0.181 302.06)' } },
        { name: 'purple-5', token: '--uchu-purple-5', value: { space: 'oklch', value: 'oklch(0.4939 0.215 298.31)' } },
        { name: 'purple-6', token: '--uchu-purple-6', value: { space: 'oklch', value: 'oklch(0.4611 0.198 298.4)' } },
        { name: 'purple-7', token: '--uchu-purple-7', value: { space: 'oklch', value: 'oklch(0.4277 0.181 298.49)' } },
        { name: 'purple-8', token: '--uchu-purple-8', value: { space: 'oklch', value: 'oklch(0.3946 0.164 298.29)' } },
        { name: 'purple-9', token: '--uchu-purple-9', value: { space: 'oklch', value: 'oklch(0.3601 0.145 298.35)' } },
      ],
    },
    {
      name: 'Red',
      swatches: [
        { name: 'red-1', token: '--uchu-red-1', value: { space: 'oklch', value: 'oklch(0.8898 0.052 3.28)' } },
        { name: 'red-2', token: '--uchu-red-2', value: { space: 'oklch', value: 'oklch(0.7878 0.109 4.54)' } },
        { name: 'red-3', token: '--uchu-red-3', value: { space: 'oklch', value: 'oklch(0.6986 0.162 7.82)' } },
        { name: 'red-4', token: '--uchu-red-4', value: { space: 'oklch', value: 'oklch(0.6273 0.209 12.37)' } },
        { name: 'red-5', token: '--uchu-red-5', value: { space: 'oklch', value: 'oklch(0.5863 0.231 19.6)' } },
        { name: 'red-6', token: '--uchu-red-6', value: { space: 'oklch', value: 'oklch(0.5441 0.214 19.06)' } },
        { name: 'red-7', token: '--uchu-red-7', value: { space: 'oklch', value: 'oklch(0.4995 0.195 18.34)' } },
        { name: 'red-8', token: '--uchu-red-8', value: { space: 'oklch', value: 'oklch(0.458 0.177 17.7)' } },
        { name: 'red-9', token: '--uchu-red-9', value: { space: 'oklch', value: 'oklch(0.4117 0.157 16.58)' } },
      ],
    },
    {
      name: 'Yellow',
      swatches: [
        { name: 'yellow-1', token: '--uchu-yellow-1', value: { space: 'oklch', value: 'oklch(0.9705 0.039 91.2)' } },
        { name: 'yellow-2', token: '--uchu-yellow-2', value: { space: 'oklch', value: 'oklch(0.95 0.07 92.39)' } },
        { name: 'yellow-3', token: '--uchu-yellow-3', value: { space: 'oklch', value: 'oklch(0.9276 0.098 92.58)' } },
        { name: 'yellow-4', token: '--uchu-yellow-4', value: { space: 'oklch', value: 'oklch(0.9092 0.125 92.56)' } },
        { name: 'yellow-5', token: '--uchu-yellow-5', value: { space: 'oklch', value: 'oklch(0.89 0.146 91.5)' } },
        { name: 'yellow-6', token: '--uchu-yellow-6', value: { space: 'oklch', value: 'oklch(0.8239 0.133 91.5)' } },
        { name: 'yellow-7', token: '--uchu-yellow-7', value: { space: 'oklch', value: 'oklch(0.7584 0.122 92.21)' } },
        { name: 'yellow-8', token: '--uchu-yellow-8', value: { space: 'oklch', value: 'oklch(0.6914 0.109 91.04)' } },
        { name: 'yellow-9', token: '--uchu-yellow-9', value: { space: 'oklch', value: 'oklch(0.6229 0.097 91.9)' } },
      ],
    },
    {
      name: 'Yin',
      swatches: [
        { name: 'yin-1', token: '--uchu-yin-1', value: { space: 'oklch', value: 'oklch(0.9187 0.003 264.54)' } },
        { name: 'yin-2', token: '--uchu-yin-2', value: { space: 'oklch', value: 'oklch(0.8461 0.004 286.31)' } },
        { name: 'yin-3', token: '--uchu-yin-3', value: { space: 'oklch', value: 'oklch(0.7689 0.004 247.87)' } },
        { name: 'yin-4', token: '--uchu-yin-4', value: { space: 'oklch', value: 'oklch(0.6917 0.004 247.88)' } },
        { name: 'yin-5', token: '--uchu-yin-5', value: { space: 'oklch', value: 'oklch(0.6101 0.005 271.34)' } },
        { name: 'yin-6', token: '--uchu-yin-6', value: { space: 'oklch', value: 'oklch(0.5279 0.005 271.32)' } },
        { name: 'yin-7', token: '--uchu-yin-7', value: { space: 'oklch', value: 'oklch(0.4387 0.005 271.3)' } },
        { name: 'yin-8', token: '--uchu-yin-8', value: { space: 'oklch', value: 'oklch(0.3502 0.005 236.66)' } },
        { name: 'yin-9', token: '--uchu-yin-9', value: { space: 'oklch', value: 'oklch(0.2511 0.006 258.36)' } },
      ],
    },
    {
      name: 'Pastel Blue',
      swatches: [
        {
          name: 'pastel-blue-1',
          token: '--uchu-pastel-blue-1',
          value: { space: 'oklch', value: 'oklch(0.9 0.028 261)' },
        },
        {
          name: 'pastel-blue-2',
          token: '--uchu-pastel-blue-2',
          value: { space: 'oklch', value: 'oklch(0.8 0.048 260)' },
        },
        {
          name: 'pastel-blue-3',
          token: '--uchu-pastel-blue-3',
          value: { space: 'oklch', value: 'oklch(0.7 0.072 259)' },
        },
        {
          name: 'pastel-blue-4',
          token: '--uchu-pastel-blue-4',
          value: { space: 'oklch', value: 'oklch(0.6 0.096 259)' },
        },
        {
          name: 'pastel-blue-5',
          token: '--uchu-pastel-blue-5',
          value: { space: 'oklch', value: 'oklch(0.51 0.124 262)' },
        },
        {
          name: 'pastel-blue-6',
          token: '--uchu-pastel-blue-6',
          value: { space: 'oklch', value: 'oklch(0.48 0.112 261)' },
        },
        {
          name: 'pastel-blue-7',
          token: '--uchu-pastel-blue-7',
          value: { space: 'oklch', value: 'oklch(0.44 0.1 261)' },
        },
        {
          name: 'pastel-blue-8',
          token: '--uchu-pastel-blue-8',
          value: { space: 'oklch', value: 'oklch(0.41 0.096 262)' },
        },
        {
          name: 'pastel-blue-9',
          token: '--uchu-pastel-blue-9',
          value: { space: 'oklch', value: 'oklch(0.37 0.084 261)' },
        },
      ],
    },
    {
      name: 'Pastel Gray',
      swatches: [
        {
          name: 'pastel-gray-1',
          token: '--uchu-pastel-gray-1',
          value: { space: 'oklch', value: 'oklch(0.96 0.004 287)' },
        },
        {
          name: 'pastel-gray-2',
          token: '--uchu-pastel-gray-2',
          value: { space: 'oklch', value: 'oklch(0.92 0.004 195)' },
        },
        {
          name: 'pastel-gray-3',
          token: '--uchu-pastel-gray-3',
          value: { space: 'oklch', value: 'oklch(0.88 0.004 287)' },
        },
        {
          name: 'pastel-gray-4',
          token: '--uchu-pastel-gray-4',
          value: { space: 'oklch', value: 'oklch(0.85 0.004 195)' },
        },
        {
          name: 'pastel-gray-5',
          token: '--uchu-pastel-gray-5',
          value: { space: 'oklch', value: 'oklch(0.81 0.004 243)' },
        },
        {
          name: 'pastel-gray-6',
          token: '--uchu-pastel-gray-6',
          value: { space: 'oklch', value: 'oklch(0.75 0.004 245)' },
        },
        {
          name: 'pastel-gray-7',
          token: '--uchu-pastel-gray-7',
          value: { space: 'oklch', value: 'oklch(0.69 0.008 286)' },
        },
        {
          name: 'pastel-gray-8',
          token: '--uchu-pastel-gray-8',
          value: { space: 'oklch', value: 'oklch(0.63 0.004 215)' },
        },
        {
          name: 'pastel-gray-9',
          token: '--uchu-pastel-gray-9',
          value: { space: 'oklch', value: 'oklch(0.57 0.004 269)' },
        },
      ],
    },
    {
      name: 'Pastel Green',
      swatches: [
        {
          name: 'pastel-green-1',
          token: '--uchu-pastel-green-1',
          value: { space: 'oklch', value: 'oklch(0.94 0.032 149)' },
        },
        {
          name: 'pastel-green-2',
          token: '--uchu-pastel-green-2',
          value: { space: 'oklch', value: 'oklch(0.88 0.056 148)' },
        },
        {
          name: 'pastel-green-3',
          token: '--uchu-pastel-green-3',
          value: { space: 'oklch', value: 'oklch(0.83 0.076 147)' },
        },
        {
          name: 'pastel-green-4',
          token: '--uchu-pastel-green-4',
          value: { space: 'oklch', value: 'oklch(0.78 0.1 146)' },
        },
        {
          name: 'pastel-green-5',
          token: '--uchu-pastel-green-5',
          value: { space: 'oklch', value: 'oklch(0.73 0.116 145)' },
        },
        {
          name: 'pastel-green-6',
          token: '--uchu-pastel-green-6',
          value: { space: 'oklch', value: 'oklch(0.68 0.108 145)' },
        },
        {
          name: 'pastel-green-7',
          token: '--uchu-pastel-green-7',
          value: { space: 'oklch', value: 'oklch(0.63 0.1 145)' },
        },
        {
          name: 'pastel-green-8',
          token: '--uchu-pastel-green-8',
          value: { space: 'oklch', value: 'oklch(0.57 0.088 146)' },
        },
        {
          name: 'pastel-green-9',
          token: '--uchu-pastel-green-9',
          value: { space: 'oklch', value: 'oklch(0.51 0.08 146)' },
        },
      ],
    },
    {
      name: 'Pastel Orange',
      swatches: [
        {
          name: 'pastel-orange-1',
          token: '--uchu-pastel-orange-1',
          value: { space: 'oklch', value: 'oklch(0.94 0.02 55)' },
        },
        {
          name: 'pastel-orange-2',
          token: '--uchu-pastel-orange-2',
          value: { space: 'oklch', value: 'oklch(0.88 0.04 56)' },
        },
        {
          name: 'pastel-orange-3',
          token: '--uchu-pastel-orange-3',
          value: { space: 'oklch', value: 'oklch(0.83 0.056 57)' },
        },
        {
          name: 'pastel-orange-4',
          token: '--uchu-pastel-orange-4',
          value: { space: 'oklch', value: 'oklch(0.78 0.076 55)' },
        },
        {
          name: 'pastel-orange-5',
          token: '--uchu-pastel-orange-5',
          value: { space: 'oklch', value: 'oklch(0.73 0.092 53)' },
        },
        {
          name: 'pastel-orange-6',
          token: '--uchu-pastel-orange-6',
          value: { space: 'oklch', value: 'oklch(0.68 0.084 54)' },
        },
        {
          name: 'pastel-orange-7',
          token: '--uchu-pastel-orange-7',
          value: { space: 'oklch', value: 'oklch(0.62 0.076 54)' },
        },
        {
          name: 'pastel-orange-8',
          token: '--uchu-pastel-orange-8',
          value: { space: 'oklch', value: 'oklch(0.57 0.068 54)' },
        },
        {
          name: 'pastel-orange-9',
          token: '--uchu-pastel-orange-9',
          value: { space: 'oklch', value: 'oklch(0.51 0.06 53)' },
        },
      ],
    },
    {
      name: 'Pastel Pink',
      swatches: [
        {
          name: 'pastel-pink-1',
          token: '--uchu-pastel-pink-1',
          value: { space: 'oklch', value: 'oklch(0.96 0.016 353)' },
        },
        {
          name: 'pastel-pink-2',
          token: '--uchu-pastel-pink-2',
          value: { space: 'oklch', value: 'oklch(0.92 0.028 351)' },
        },
        {
          name: 'pastel-pink-3',
          token: '--uchu-pastel-pink-3',
          value: { space: 'oklch', value: 'oklch(0.89 0.036 355)' },
        },
        {
          name: 'pastel-pink-4',
          token: '--uchu-pastel-pink-4',
          value: { space: 'oklch', value: 'oklch(0.85 0.048 353)' },
        },
        {
          name: 'pastel-pink-5',
          token: '--uchu-pastel-pink-5',
          value: { space: 'oklch', value: 'oklch(0.82 0.06 354)' },
        },
        {
          name: 'pastel-pink-6',
          token: '--uchu-pastel-pink-6',
          value: { space: 'oklch', value: 'oklch(0.76 0.056 354)' },
        },
        {
          name: 'pastel-pink-7',
          token: '--uchu-pastel-pink-7',
          value: { space: 'oklch', value: 'oklch(0.7 0.048 355)' },
        },
        {
          name: 'pastel-pink-8',
          token: '--uchu-pastel-pink-8',
          value: { space: 'oklch', value: 'oklch(0.64 0.044 354)' },
        },
        {
          name: 'pastel-pink-9',
          token: '--uchu-pastel-pink-9',
          value: { space: 'oklch', value: 'oklch(0.58 0.04 353)' },
        },
      ],
    },
    {
      name: 'Pastel Purple',
      swatches: [
        {
          name: 'pastel-purple-1',
          token: '--uchu-pastel-purple-1',
          value: { space: 'oklch', value: 'oklch(0.89 0.028 304)' },
        },
        {
          name: 'pastel-purple-2',
          token: '--uchu-pastel-purple-2',
          value: { space: 'oklch', value: 'oklch(0.79 0.052 307)' },
        },
        {
          name: 'pastel-purple-3',
          token: '--uchu-pastel-purple-3',
          value: { space: 'oklch', value: 'oklch(0.68 0.072 305)' },
        },
        {
          name: 'pastel-purple-4',
          token: '--uchu-pastel-purple-4',
          value: { space: 'oklch', value: 'oklch(0.57 0.1 304)' },
        },
        {
          name: 'pastel-purple-5',
          token: '--uchu-pastel-purple-5',
          value: { space: 'oklch', value: 'oklch(0.46 0.128 303)' },
        },
        {
          name: 'pastel-purple-6',
          token: '--uchu-pastel-purple-6',
          value: { space: 'oklch', value: 'oklch(0.43 0.116 303)' },
        },
        {
          name: 'pastel-purple-7',
          token: '--uchu-pastel-purple-7',
          value: { space: 'oklch', value: 'oklch(0.4 0.108 302)' },
        },
        {
          name: 'pastel-purple-8',
          token: '--uchu-pastel-purple-8',
          value: { space: 'oklch', value: 'oklch(0.37 0.1 303)' },
        },
        {
          name: 'pastel-purple-9',
          token: '--uchu-pastel-purple-9',
          value: { space: 'oklch', value: 'oklch(0.34 0.084 302)' },
        },
      ],
    },
    {
      name: 'Pastel Red',
      swatches: [
        { name: 'pastel-red-1', token: '--uchu-pastel-red-1', value: { space: 'oklch', value: 'oklch(0.89 0.032 2)' } },
        { name: 'pastel-red-2', token: '--uchu-pastel-red-2', value: { space: 'oklch', value: 'oklch(0.78 0.06 3)' } },
        { name: 'pastel-red-3', token: '--uchu-pastel-red-3', value: { space: 'oklch', value: 'oklch(0.68 0.088 5)' } },
        { name: 'pastel-red-4', token: '--uchu-pastel-red-4', value: { space: 'oklch', value: 'oklch(0.59 0.12 8)' } },
        {
          name: 'pastel-red-5',
          token: '--uchu-pastel-red-5',
          value: { space: 'oklch', value: 'oklch(0.52 0.136 14)' },
        },
        {
          name: 'pastel-red-6',
          token: '--uchu-pastel-red-6',
          value: { space: 'oklch', value: 'oklch(0.49 0.128 13)' },
        },
        {
          name: 'pastel-red-7',
          token: '--uchu-pastel-red-7',
          value: { space: 'oklch', value: 'oklch(0.45 0.116 13)' },
        },
        {
          name: 'pastel-red-8',
          token: '--uchu-pastel-red-8',
          value: { space: 'oklch', value: 'oklch(0.41 0.104 12)' },
        },
        {
          name: 'pastel-red-9',
          token: '--uchu-pastel-red-9',
          value: { space: 'oklch', value: 'oklch(0.37 0.092 11)' },
        },
      ],
    },
    {
      name: 'Pastel Yellow',
      swatches: [
        {
          name: 'pastel-yellow-1',
          token: '--uchu-pastel-yellow-1',
          value: { space: 'oklch', value: 'oklch(0.97 0.024 94)' },
        },
        {
          name: 'pastel-yellow-2',
          token: '--uchu-pastel-yellow-2',
          value: { space: 'oklch', value: 'oklch(0.95 0.036 92)' },
        },
        {
          name: 'pastel-yellow-3',
          token: '--uchu-pastel-yellow-3',
          value: { space: 'oklch', value: 'oklch(0.92 0.052 92)' },
        },
        {
          name: 'pastel-yellow-4',
          token: '--uchu-pastel-yellow-4',
          value: { space: 'oklch', value: 'oklch(0.9 0.068 91)' },
        },
        {
          name: 'pastel-yellow-5',
          token: '--uchu-pastel-yellow-5',
          value: { space: 'oklch', value: 'oklch(0.88 0.084 92)' },
        },
        {
          name: 'pastel-yellow-6',
          token: '--uchu-pastel-yellow-6',
          value: { space: 'oklch', value: 'oklch(0.82 0.076 92)' },
        },
        {
          name: 'pastel-yellow-7',
          token: '--uchu-pastel-yellow-7',
          value: { space: 'oklch', value: 'oklch(0.75 0.068 92)' },
        },
        {
          name: 'pastel-yellow-8',
          token: '--uchu-pastel-yellow-8',
          value: { space: 'oklch', value: 'oklch(0.69 0.064 91)' },
        },
        {
          name: 'pastel-yellow-9',
          token: '--uchu-pastel-yellow-9',
          value: { space: 'oklch', value: 'oklch(0.62 0.056 90)' },
        },
      ],
    },
    {
      name: 'Pastel Yin',
      swatches: [
        {
          name: 'pastel-yin-1',
          token: '--uchu-pastel-yin-1',
          value: { space: 'oklch', value: 'oklch(0.9187 0.003 264.54)' },
        },
        {
          name: 'pastel-yin-2',
          token: '--uchu-pastel-yin-2',
          value: { space: 'oklch', value: 'oklch(0.8461 0.004 286.31)' },
        },
        {
          name: 'pastel-yin-3',
          token: '--uchu-pastel-yin-3',
          value: { space: 'oklch', value: 'oklch(0.7689 0.004 247.87)' },
        },
        {
          name: 'pastel-yin-4',
          token: '--uchu-pastel-yin-4',
          value: { space: 'oklch', value: 'oklch(0.6917 0.004 247.88)' },
        },
        {
          name: 'pastel-yin-5',
          token: '--uchu-pastel-yin-5',
          value: { space: 'oklch', value: 'oklch(0.6101 0.005 271.34)' },
        },
        {
          name: 'pastel-yin-6',
          token: '--uchu-pastel-yin-6',
          value: { space: 'oklch', value: 'oklch(0.5279 0.005 271.32)' },
        },
        {
          name: 'pastel-yin-7',
          token: '--uchu-pastel-yin-7',
          value: { space: 'oklch', value: 'oklch(0.4387 0.005 271.3)' },
        },
        {
          name: 'pastel-yin-8',
          token: '--uchu-pastel-yin-8',
          value: { space: 'oklch', value: 'oklch(0.3502 0.005 236.66)' },
        },
        {
          name: 'pastel-yin-9',
          token: '--uchu-pastel-yin-9',
          value: { space: 'oklch', value: 'oklch(0.2511 0.006 258.36)' },
        },
      ],
    },
  ],
} satisfies Palette
