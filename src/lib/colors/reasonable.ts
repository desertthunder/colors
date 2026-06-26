import type { Palette } from './types'

const sourceUrl = 'https://raw.githubusercontent.com/matthewhowell/reasonable-colors/master/reasonable-colors.css'

export const reasonablePalette = {
  id: 'reasonable',
  name: 'Reasonable Colors',
  sourceUrl: sourceUrl,
  groups: [
    {
      name: 'Gray',
      swatches: [
        { name: 'gray-1', token: '--color-gray-1', value: { space: 'hex', value: '#f6f6f6' } },
        { name: 'gray-2', token: '--color-gray-2', value: { space: 'hex', value: '#e2e2e2' } },
        { name: 'gray-3', token: '--color-gray-3', value: { space: 'hex', value: '#8b8b8b' } },
        { name: 'gray-4', token: '--color-gray-4', value: { space: 'hex', value: '#6f6f6f' } },
        { name: 'gray-5', token: '--color-gray-5', value: { space: 'hex', value: '#3e3e3e' } },
        { name: 'gray-6', token: '--color-gray-6', value: { space: 'hex', value: '#222222' } },
      ],
    },
    {
      name: 'Rose',
      swatches: [
        { name: 'rose-1', token: '--color-rose-1', value: { space: 'hex', value: '#fff7f9' } },
        { name: 'rose-2', token: '--color-rose-2', value: { space: 'hex', value: '#ffdce5' } },
        { name: 'rose-3', token: '--color-rose-3', value: { space: 'hex', value: '#ff3b8d' } },
        { name: 'rose-4', token: '--color-rose-4', value: { space: 'hex', value: '#db0072' } },
        { name: 'rose-5', token: '--color-rose-5', value: { space: 'hex', value: '#800040' } },
        { name: 'rose-6', token: '--color-rose-6', value: { space: 'hex', value: '#4c0023' } },
      ],
    },
    {
      name: 'Raspberry',
      swatches: [
        { name: 'raspberry-1', token: '--color-raspberry-1', value: { space: 'hex', value: '#fff8f8' } },
        { name: 'raspberry-2', token: '--color-raspberry-2', value: { space: 'hex', value: '#ffdddf' } },
        { name: 'raspberry-3', token: '--color-raspberry-3', value: { space: 'hex', value: '#ff426c' } },
        { name: 'raspberry-4', token: '--color-raspberry-4', value: { space: 'hex', value: '#de0051' } },
        { name: 'raspberry-5', token: '--color-raspberry-5', value: { space: 'hex', value: '#82002c' } },
        { name: 'raspberry-6', token: '--color-raspberry-6', value: { space: 'hex', value: '#510018' } },
      ],
    },
    {
      name: 'Red',
      swatches: [
        { name: 'red-1', token: '--color-red-1', value: { space: 'hex', value: '#fff8f6' } },
        { name: 'red-2', token: '--color-red-2', value: { space: 'hex', value: '#ffddd8' } },
        { name: 'red-3', token: '--color-red-3', value: { space: 'hex', value: '#ff4647' } },
        { name: 'red-4', token: '--color-red-4', value: { space: 'hex', value: '#e0002b' } },
        { name: 'red-5', token: '--color-red-5', value: { space: 'hex', value: '#830014' } },
        { name: 'red-6', token: '--color-red-6', value: { space: 'hex', value: '#530003' } },
      ],
    },
    {
      name: 'Orange',
      swatches: [
        { name: 'orange-1', token: '--color-orange-1', value: { space: 'hex', value: '#fff8f5' } },
        { name: 'orange-2', token: '--color-orange-2', value: { space: 'hex', value: '#ffded1' } },
        { name: 'orange-3', token: '--color-orange-3', value: { space: 'hex', value: '#fd4d00' } },
        { name: 'orange-4', token: '--color-orange-4', value: { space: 'hex', value: '#cd3c00' } },
        { name: 'orange-5', token: '--color-orange-5', value: { space: 'hex', value: '#752100' } },
        { name: 'orange-6', token: '--color-orange-6', value: { space: 'hex', value: '#401600' } },
      ],
    },
    {
      name: 'Cinnamon',
      swatches: [
        { name: 'cinnamon-1', token: '--color-cinnamon-1', value: { space: 'hex', value: '#fff8f3' } },
        { name: 'cinnamon-2', token: '--color-cinnamon-2', value: { space: 'hex', value: '#ffdfc6' } },
        { name: 'cinnamon-3', token: '--color-cinnamon-3', value: { space: 'hex', value: '#d57300' } },
        { name: 'cinnamon-4', token: '--color-cinnamon-4', value: { space: 'hex', value: '#ac5c00' } },
        { name: 'cinnamon-5', token: '--color-cinnamon-5', value: { space: 'hex', value: '#633300' } },
        { name: 'cinnamon-6', token: '--color-cinnamon-6', value: { space: 'hex', value: '#371d00' } },
      ],
    },
    {
      name: 'Amber',
      swatches: [
        { name: 'amber-1', token: '--color-amber-1', value: { space: 'hex', value: '#fff8ef' } },
        { name: 'amber-2', token: '--color-amber-2', value: { space: 'hex', value: '#ffe0b2' } },
        { name: 'amber-3', token: '--color-amber-3', value: { space: 'hex', value: '#b98300' } },
        { name: 'amber-4', token: '--color-amber-4', value: { space: 'hex', value: '#926700' } },
        { name: 'amber-5', token: '--color-amber-5', value: { space: 'hex', value: '#523800' } },
        { name: 'amber-6', token: '--color-amber-6', value: { space: 'hex', value: '#302100' } },
      ],
    },
    {
      name: 'Yellow',
      swatches: [
        { name: 'yellow-1', token: '--color-yellow-1', value: { space: 'hex', value: '#fff9e5' } },
        { name: 'yellow-2', token: '--color-yellow-2', value: { space: 'hex', value: '#ffe53e' } },
        { name: 'yellow-3', token: '--color-yellow-3', value: { space: 'hex', value: '#9c8b00' } },
        { name: 'yellow-4', token: '--color-yellow-4', value: { space: 'hex', value: '#7d6f00' } },
        { name: 'yellow-5', token: '--color-yellow-5', value: { space: 'hex', value: '#463d00' } },
        { name: 'yellow-6', token: '--color-yellow-6', value: { space: 'hex', value: '#292300' } },
      ],
    },
    {
      name: 'Lime',
      swatches: [
        { name: 'lime-1', token: '--color-lime-1', value: { space: 'hex', value: '#f7ffac' } },
        { name: 'lime-2', token: '--color-lime-2', value: { space: 'hex', value: '#d5f200' } },
        { name: 'lime-3', token: '--color-lime-3', value: { space: 'hex', value: '#819300' } },
        { name: 'lime-4', token: '--color-lime-4', value: { space: 'hex', value: '#677600' } },
        { name: 'lime-5', token: '--color-lime-5', value: { space: 'hex', value: '#394100' } },
        { name: 'lime-6', token: '--color-lime-6', value: { space: 'hex', value: '#222600' } },
      ],
    },
    {
      name: 'Chartreuse',
      swatches: [
        { name: 'chartreuse-1', token: '--color-chartreuse-1', value: { space: 'hex', value: '#e5ffc3' } },
        { name: 'chartreuse-2', token: '--color-chartreuse-2', value: { space: 'hex', value: '#98fb00' } },
        { name: 'chartreuse-3', token: '--color-chartreuse-3', value: { space: 'hex', value: '#5c9b00' } },
        { name: 'chartreuse-4', token: '--color-chartreuse-4', value: { space: 'hex', value: '#497c00' } },
        { name: 'chartreuse-5', token: '--color-chartreuse-5', value: { space: 'hex', value: '#264500' } },
        { name: 'chartreuse-6', token: '--color-chartreuse-6', value: { space: 'hex', value: '#182600' } },
      ],
    },
    {
      name: 'Green',
      swatches: [
        { name: 'green-1', token: '--color-green-1', value: { space: 'hex', value: '#e0ffd9' } },
        { name: 'green-2', token: '--color-green-2', value: { space: 'hex', value: '#72ff6c' } },
        { name: 'green-3', token: '--color-green-3', value: { space: 'hex', value: '#00a21f' } },
        { name: 'green-4', token: '--color-green-4', value: { space: 'hex', value: '#008217' } },
        { name: 'green-5', token: '--color-green-5', value: { space: 'hex', value: '#004908' } },
        { name: 'green-6', token: '--color-green-6', value: { space: 'hex', value: '#062800' } },
      ],
    },
    {
      name: 'Emerald',
      swatches: [
        { name: 'emerald-1', token: '--color-emerald-1', value: { space: 'hex', value: '#dcffe6' } },
        { name: 'emerald-2', token: '--color-emerald-2', value: { space: 'hex', value: '#5dffa2' } },
        { name: 'emerald-3', token: '--color-emerald-3', value: { space: 'hex', value: '#00a05a' } },
        { name: 'emerald-4', token: '--color-emerald-4', value: { space: 'hex', value: '#008147' } },
        { name: 'emerald-5', token: '--color-emerald-5', value: { space: 'hex', value: '#004825' } },
        { name: 'emerald-6', token: '--color-emerald-6', value: { space: 'hex', value: '#002812' } },
      ],
    },
    {
      name: 'Aquamarine',
      swatches: [
        { name: 'aquamarine-1', token: '--color-aquamarine-1', value: { space: 'hex', value: '#daffef' } },
        { name: 'aquamarine-2', token: '--color-aquamarine-2', value: { space: 'hex', value: '#42ffc6' } },
        { name: 'aquamarine-3', token: '--color-aquamarine-3', value: { space: 'hex', value: '#009f78' } },
        { name: 'aquamarine-4', token: '--color-aquamarine-4', value: { space: 'hex', value: '#007f5f' } },
        { name: 'aquamarine-5', token: '--color-aquamarine-5', value: { space: 'hex', value: '#004734' } },
        { name: 'aquamarine-6', token: '--color-aquamarine-6', value: { space: 'hex', value: '#00281b' } },
      ],
    },
    {
      name: 'Teal',
      swatches: [
        { name: 'teal-1', token: '--color-teal-1', value: { space: 'hex', value: '#d7fff7' } },
        { name: 'teal-2', token: '--color-teal-2', value: { space: 'hex', value: '#00ffe4' } },
        { name: 'teal-3', token: '--color-teal-3', value: { space: 'hex', value: '#009e8c' } },
        { name: 'teal-4', token: '--color-teal-4', value: { space: 'hex', value: '#007c6e' } },
        { name: 'teal-5', token: '--color-teal-5', value: { space: 'hex', value: '#00443c' } },
        { name: 'teal-6', token: '--color-teal-6', value: { space: 'hex', value: '#002722' } },
      ],
    },
    {
      name: 'Cyan',
      swatches: [
        { name: 'cyan-1', token: '--color-cyan-1', value: { space: 'hex', value: '#c4fffe' } },
        { name: 'cyan-2', token: '--color-cyan-2', value: { space: 'hex', value: '#00fafb' } },
        { name: 'cyan-3', token: '--color-cyan-3', value: { space: 'hex', value: '#00999a' } },
        { name: 'cyan-4', token: '--color-cyan-4', value: { space: 'hex', value: '#007a7b' } },
        { name: 'cyan-5', token: '--color-cyan-5', value: { space: 'hex', value: '#004344' } },
        { name: 'cyan-6', token: '--color-cyan-6', value: { space: 'hex', value: '#002525' } },
      ],
    },
    {
      name: 'Powder',
      swatches: [
        { name: 'powder-1', token: '--color-powder-1', value: { space: 'hex', value: '#dafaff' } },
        { name: 'powder-2', token: '--color-powder-2', value: { space: 'hex', value: '#8df0ff' } },
        { name: 'powder-3', token: '--color-powder-3', value: { space: 'hex', value: '#0098a9' } },
        { name: 'powder-4', token: '--color-powder-4', value: { space: 'hex', value: '#007987' } },
        { name: 'powder-5', token: '--color-powder-5', value: { space: 'hex', value: '#004048' } },
        { name: 'powder-6', token: '--color-powder-6', value: { space: 'hex', value: '#002227' } },
      ],
    },
    {
      name: 'Sky',
      swatches: [
        { name: 'sky-1', token: '--color-sky-1', value: { space: 'hex', value: '#e3f7ff' } },
        { name: 'sky-2', token: '--color-sky-2', value: { space: 'hex', value: '#aee9ff' } },
        { name: 'sky-3', token: '--color-sky-3', value: { space: 'hex', value: '#0094b4' } },
        { name: 'sky-4', token: '--color-sky-4', value: { space: 'hex', value: '#007590' } },
        { name: 'sky-5', token: '--color-sky-5', value: { space: 'hex', value: '#00404f' } },
        { name: 'sky-6', token: '--color-sky-6', value: { space: 'hex', value: '#001f28' } },
      ],
    },
    {
      name: 'Cerulean',
      swatches: [
        { name: 'cerulean-1', token: '--color-cerulean-1', value: { space: 'hex', value: '#e8f6ff' } },
        { name: 'cerulean-2', token: '--color-cerulean-2', value: { space: 'hex', value: '#b9e3ff' } },
        { name: 'cerulean-3', token: '--color-cerulean-3', value: { space: 'hex', value: '#0092c5' } },
        { name: 'cerulean-4', token: '--color-cerulean-4', value: { space: 'hex', value: '#00749d' } },
        { name: 'cerulean-5', token: '--color-cerulean-5', value: { space: 'hex', value: '#003c54' } },
        { name: 'cerulean-6', token: '--color-cerulean-6', value: { space: 'hex', value: '#001d2a' } },
      ],
    },
    {
      name: 'Azure',
      swatches: [
        { name: 'azure-1', token: '--color-azure-1', value: { space: 'hex', value: '#e8f2ff' } },
        { name: 'azure-2', token: '--color-azure-2', value: { space: 'hex', value: '#c6e0ff' } },
        { name: 'azure-3', token: '--color-azure-3', value: { space: 'hex', value: '#008fdb' } },
        { name: 'azure-4', token: '--color-azure-4', value: { space: 'hex', value: '#0071af' } },
        { name: 'azure-5', token: '--color-azure-5', value: { space: 'hex', value: '#003b5e' } },
        { name: 'azure-6', token: '--color-azure-6', value: { space: 'hex', value: '#001c30' } },
      ],
    },
    {
      name: 'Blue',
      swatches: [
        { name: 'blue-1', token: '--color-blue-1', value: { space: 'hex', value: '#f0f4ff' } },
        { name: 'blue-2', token: '--color-blue-2', value: { space: 'hex', value: '#d4e0ff' } },
        { name: 'blue-3', token: '--color-blue-3', value: { space: 'hex', value: '#0089fc' } },
        { name: 'blue-4', token: '--color-blue-4', value: { space: 'hex', value: '#006dca' } },
        { name: 'blue-5', token: '--color-blue-5', value: { space: 'hex', value: '#00386d' } },
        { name: 'blue-6', token: '--color-blue-6', value: { space: 'hex', value: '#001a39' } },
      ],
    },
    {
      name: 'Indigo',
      swatches: [
        { name: 'indigo-1', token: '--color-indigo-1', value: { space: 'hex', value: '#f3f3ff' } },
        { name: 'indigo-2', token: '--color-indigo-2', value: { space: 'hex', value: '#deddff' } },
        { name: 'indigo-3', token: '--color-indigo-3', value: { space: 'hex', value: '#657eff' } },
        { name: 'indigo-4', token: '--color-indigo-4', value: { space: 'hex', value: '#0061fc' } },
        { name: 'indigo-5', token: '--color-indigo-5', value: { space: 'hex', value: '#00328a' } },
        { name: 'indigo-6', token: '--color-indigo-6', value: { space: 'hex', value: '#001649' } },
      ],
    },
    {
      name: 'Violet',
      swatches: [
        { name: 'violet-1', token: '--color-violet-1', value: { space: 'hex', value: '#f7f1ff' } },
        { name: 'violet-2', token: '--color-violet-2', value: { space: 'hex', value: '#e8daff' } },
        { name: 'violet-3', token: '--color-violet-3', value: { space: 'hex', value: '#9b70ff' } },
        { name: 'violet-4', token: '--color-violet-4', value: { space: 'hex', value: '#794aff' } },
        { name: 'violet-5', token: '--color-violet-5', value: { space: 'hex', value: '#2d0fbf' } },
        { name: 'violet-6', token: '--color-violet-6', value: { space: 'hex', value: '#0b0074' } },
      ],
    },
    {
      name: 'Purple',
      swatches: [
        { name: 'purple-1', token: '--color-purple-1', value: { space: 'hex', value: '#fdf4ff' } },
        { name: 'purple-2', token: '--color-purple-2', value: { space: 'hex', value: '#f7d9ff' } },
        { name: 'purple-3', token: '--color-purple-3', value: { space: 'hex', value: '#d150ff' } },
        { name: 'purple-4', token: '--color-purple-4', value: { space: 'hex', value: '#b01fe3' } },
        { name: 'purple-5', token: '--color-purple-5', value: { space: 'hex', value: '#660087' } },
        { name: 'purple-6', token: '--color-purple-6', value: { space: 'hex', value: '#3a004f' } },
      ],
    },
    {
      name: 'Magenta',
      swatches: [
        { name: 'magenta-1', token: '--color-magenta-1', value: { space: 'hex', value: '#fff3fc' } },
        { name: 'magenta-2', token: '--color-magenta-2', value: { space: 'hex', value: '#ffd7f6' } },
        { name: 'magenta-3', token: '--color-magenta-3', value: { space: 'hex', value: '#f911e0' } },
        { name: 'magenta-4', token: '--color-magenta-4', value: { space: 'hex', value: '#ca00b6' } },
        { name: 'magenta-5', token: '--color-magenta-5', value: { space: 'hex', value: '#740068' } },
        { name: 'magenta-6', token: '--color-magenta-6', value: { space: 'hex', value: '#44003c' } },
      ],
    },
    {
      name: 'Pink',
      swatches: [
        { name: 'pink-1', token: '--color-pink-1', value: { space: 'hex', value: '#fff7fb' } },
        { name: 'pink-2', token: '--color-pink-2', value: { space: 'hex', value: '#ffdcec' } },
        { name: 'pink-3', token: '--color-pink-3', value: { space: 'hex', value: '#ff2fb2' } },
        { name: 'pink-4', token: '--color-pink-4', value: { space: 'hex', value: '#d2008f' } },
        { name: 'pink-5', token: '--color-pink-5', value: { space: 'hex', value: '#790051' } },
        { name: 'pink-6', token: '--color-pink-6', value: { space: 'hex', value: '#4b0030' } },
      ],
    },
  ],
} satisfies Palette
