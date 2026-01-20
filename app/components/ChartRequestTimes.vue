<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { AppRouterOutputs } from '~~/server/trpc'

// Register required components
use([
  SVGRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TransformComponent,
])

type Request = AppRouterOutputs['webhook']['list']['requests'][number]

type Props = {
  requests: Request[]
}

const props = defineProps<Props>()

type TimeInterval = {
  label: string
  value: number // milliseconds
}

const timeIntervals: TimeInterval[] = [
  { label: '1 minute', value: 60 * 1000 },
  { label: '5 minutes', value: 5 * 60 * 1000 },
  { label: '10 minutes', value: 10 * 60 * 1000 },
  { label: '30 minutes', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '6 hours', value: 6 * 60 * 60 * 1000 },
  { label: '12 hours', value: 12 * 60 * 60 * 1000 },
  { label: '1 day', value: 24 * 60 * 60 * 1000 },
]

const defaultInterval = timeIntervals.find(i => i.label === '30 minutes')?.value ?? timeIntervals[0]!.value
const selectedInterval = ref(defaultInterval) // Default to 30 minutes

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0B'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const chartOptions = computed(() => {
  if (!props.requests || props.requests.length === 0) {
    return {
      dataset: [],
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [],
          type: 'line',
        },
      ],
    }
  }

  // Sort requests by createdAt
  const sortedRequests = [...props.requests].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  // Calculate bodySize and headersSize for each request
  const source = [
    ['timestamp', 'count', 'headersSize', 'bodySize'],
    ...sortedRequests.map((r) => {
      const bodySize = r.body ? new Blob([r.body]).size : 0
      const headersSize = r.headers ? new Blob([r.headers]).size : 0
      return [
        new Date(r.createdAt).toISOString(),
        1, // count
        headersSize,
        bodySize,
      ]
    }),
  ]

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        if (!Array.isArray(params)) return ''
        const lines: string[] = []
        params.forEach((param) => {
          if (
            param
            && typeof param === 'object'
            && 'seriesName' in param
            && 'value' in param
          ) {
            const value = param.value as number
            const name = param.seriesName as string
            if (name === 'Request Count') {
              lines.push(`${name}: ${value}`)
            }
            else if (name === 'Headers Size') {
              lines.push(`${name}: ${formatBytes(value)}`)
            }
            else if (name === 'Body Size') {
              lines.push(`${name}: ${formatBytes(value)}`)
            }
          }
        })
        if (params[0] && typeof params[0] === 'object' && 'axisValue' in params[0]) {
          const timestamp = new Date(params[0].axisValue as string)
          return `<div><strong>${timestamp.toLocaleString()}</strong></div>${lines.join('<br>')}`
        }
        return lines.join('<br>')
      },
    },
    legend: {
      data: ['Request Count', 'Headers Size', 'Body Size'],
      top: 10,
    },
    dataset: [
      {
        source,
        dimensions: [
          { name: 'timestamp', type: 'time' },
          { name: 'count', type: 'number' },
          { name: 'headersSize', type: 'number' },
          { name: 'bodySize', type: 'number' },
        ],
      },
      {
        transform: {
          type: 'aggregate',
          config: {
            dimension: 'timestamp',
            method: 'sum',
            interval: selectedInterval.value,
          },
        },
      },
    ],
    xAxis: {
      type: 'time',
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Size (bytes)',
        position: 'right',
      },
    ],
    series: [
      {
        name: 'Request Count',
        type: 'line',
        datasetIndex: 1,
        encode: {
          x: 'timestamp',
          y: 'count',
        },
        yAxisIndex: 0,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: 'Headers Size',
        type: 'line',
        datasetIndex: 1,
        encode: {
          x: 'timestamp',
          y: 'headersSize',
        },
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: 'Body Size',
        type: 'line',
        datasetIndex: 1,
        encode: {
          x: 'timestamp',
          y: 'bodySize',
        },
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  }
})
</script>

<template>
  <div class="w-full">
    <div class="mb-4 flex items-center gap-2">
      <label
        for="interval-select"
        class="text-sm font-medium text-gray-400"
      >
        Group by:
      </label>
      <USelect
        id="interval-select"
        v-model="selectedInterval"
        :options="timeIntervals"
        option-attribute="label"
        value-attribute="value"
        class="w-40"
      />
    </div>
    <v-chart
      class="chart"
      :option="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
