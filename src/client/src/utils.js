import _ from 'lodash'

export const getOrderedArray = length => _.times(length, i => i) // returns [1,2,3,4,5,6]
export const setZerosArray = length => _.times(length, () => 0) // returns [0,0,0,0,0,0]
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
