export type OptionType = {
  id: string,
  name: string,
  value?: string
}

export type LabType = {
  name: string,
  id: string
}

export type BiomarkerType = {
  name: string,
  id: string
}

export type CollectionMethodType = {
  id: string,
  name: string,
  value: string
}

export type PanelType = {
  id: string,
  name: string,
  lab: LabType,
  collectionMethod: CollectionMethodType,
  biomarkers: BiomarkerType[]
}