interface Distribution {
  id: string,
  name: string,
  createdAt: string,
  createdBy: string,
  modifiedAt: string,
  modifiedBy: string,
  md5hash: string
}

interface DistributionList {
  offset: number,
  max: number,
  count: number,
  more: boolean,
  total: number,
  items: Array<Distribution>
}