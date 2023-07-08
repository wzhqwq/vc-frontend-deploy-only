export interface PreProcessImageParameter {
  width: number
  height: number
  batch_size: number
  organization_method: number
  has_label: boolean
  label_path: string
  preprocess_config: PreprocessConfig[]
}

export type AllPreProcessImageType = 
| "clip"
| "normalize"
| "Gaussian_noise"
| "GaussianBlur"
| "rotate"
| "salt_pepper_noise"
| "contrast"
| "flip"
export interface PreprocessConfig<
  T extends AllPreProcessImageType,
  R extends boolean | undefined = undefined,
  M extends string | undefined = undefined
> {
  type: T
  isRandom: R
  method: M
}
