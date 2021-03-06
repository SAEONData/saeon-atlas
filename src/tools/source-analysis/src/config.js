import dotenv from 'dotenv'
import subDays from 'date-fns/subDays/index.js'
import format from 'date-fns/format/index.js'
dotenv.config()

export const GQL_ENDPOINT = process.env.GQL_ENDPOINT || 'https://api.github.com/graphql'

export const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN || null

export const OUTPUT_FILEPATH =
  process.env.OUTPUT_FILEPATH || `./output/${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.csv`

export const REPOSITORY_OWNER = process.env.REPOSITORY_OWNER || 'SAEONData'

export const REPOSITORY_NAME = process.env.REPOSITORY_NAME || 'catalogue'

export const REPOSITORY_BRANCH = process.env.REPOSITORY_BRANCH || 'next'

export const SINCE = process.env.SINCE || format(subDays(new Date(), 14), 'yyyy/MM/dd')
