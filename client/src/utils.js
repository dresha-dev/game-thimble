import _ from 'lodash';

export const getOrderedArray = length => _.times(length, i => i);
export const setZerosArray = length => _.times(length, () => 0);
