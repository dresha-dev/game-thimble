import _ from 'lodash'

export const getOrderedArray = length => _.times(length, i => i)
export const setZerosArray = length => _.times(length, () => 0)
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
