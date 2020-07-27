import React, {
  forwardRef,
  Children,
  isValidElement,
  useContext,
  createContext,
  cloneElement,
  useRef,
  useEffect,
} from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useMediaQuery, ListSubheader } from '@material-ui/core'
import { VariableSizeList } from 'react-window'

const LISTBOX_PADDING = 8

const useResetCache = data => {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

const OuterElementContext = createContext({})

export default forwardRef(({ children, ...other }, ref) => {
  const itemData = Children.toArray(children)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = child =>
    isValidElement(child) && child.type === ListSubheader ? 48 : itemSize

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={useResetCache(itemCount)}
          outerElementType={forwardRef((props, ref) => {
            const outerProps = useContext(OuterElementContext)
            return <div ref={ref} {...props} {...outerProps} />
          })}
          innerElementType="ul"
          itemSize={index => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {({ data, index, style }) =>
            cloneElement(data[index], {
              style: {
                ...style,
                top: style.top + LISTBOX_PADDING,
              },
            })
          }
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})