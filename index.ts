import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

import type { Schema } from '@pdfme/generator'
import generator from '@pdfme/generator'
const { generate } = generator

import { setDate, format } from 'date-fns'
const date = setDate(new Date(), 25)

import { getFiles } from './utils/index.js'
import { coreSchema } from './coreSchema.js'

const formattedSchema: Record<string, Schema> = Object.fromEntries(
  Object.entries(coreSchema).map(([k, v]) => [
    k,
    {
      position: {
        x: v[0],
        y: v[1],
      },
      width: v[2],
      height: v[3],
      type: 'text',
      fontSize: k === 'total' ? 10 : k === 'companyNameBottom' ? 8 : 9,
      alignment:
        k === 'paymentAmount' || k === 'reimbursementAmount' || k === 'total'
          ? 'right'
          : 'left',
      characterSpacing: 0,
      lineHeight: 1,
      ...(k === 'total' && { backgroundColor: '#F3F3F3' }),
    },
  ])
)

const configRaw = JSON.parse((await readFile('config.json')).toString())
const config = Object.fromEntries(
  Object.entries(configRaw).map(([k, v]) => {
    return [k, Array.isArray(v) ? v.join('\n') : v]
  })
)
config.companyNameBottom = config.companyName

let invoiceNumber = 1

if (existsSync('output')) {
  for await (const f of getFiles('output')) {
    if (f.endsWith('.pdf')) invoiceNumber++
  }
}

const inputs = [
  {
    ...config,
    invoiceNumber: invoiceNumber.toString(),
    invoiceDate: format(date, 'MMM dd, yyyy'),
    paymentText: config.paymentText
      ? `${config.paymentText} in ${format(date, 'MMMM')} ${format(
          date,
          'yyyy'
        )}`
      : '',
    paymentAmount: config.paymentAmount ? `${config.paymentAmount} USD` : '',
    reimbursementAmount: config.reimbursementAmount
      ? `${config.reimbursementAmount} USD`
      : '',
    total: `${
      ((config.paymentAmount ?? 0) as number) +
      ((config.reimbursementAmount ?? 0) as number)
    } USD`,
  },
]

const basePdf = await readFile('basePdf.pdf')
const template = {
  schemas: [formattedSchema],
  basePdf,
}
const generatedPdf = await generate({ template, inputs })

const dir = `output/${format(date, 'yyyy')}/${format(date, 'MM')}/`
await mkdir(dir, { recursive: true })
await writeFile(dir + `Invoice ${invoiceNumber}.pdf`, generatedPdf)
