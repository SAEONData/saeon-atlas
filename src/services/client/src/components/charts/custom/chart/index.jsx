import ReactEcharts from 'echarts-for-react'
import theme from '../../../../lib/echarts-theme'

export default props => {
  const { id, title, description, type, config, data, setOption } = props

  let tempOption = () => ({})
  if (setOption) tempOption = new Function('return ' + setOption)()
  return <ReactEcharts option={tempOption()} />
}
