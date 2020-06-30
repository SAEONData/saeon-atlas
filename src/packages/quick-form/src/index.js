import { useState, useEffect } from 'react'

export default props => {
  const [fields, updateAllFields] = useState(
    Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          Object.prototype.hasOwnProperty.call(props, key) &&
          key !== 'children' &&
          key !== 'effects'
      )
    )
  )

  useEffect(
    () =>
      props.effects?.forEach(effect => {
        effect(fields)
      }),
    Object.entries(fields).map(([, v]) => v)
  )

  const updateForm = obj => {
    updateAllFields(Object.assign({ ...fields }, obj))
  }

  return props.children({
    updateForm,
    ...fields,
  })
}