import { PreprocessParameter } from '../parameter'

export interface DataLabelConfig {
  has_label: boolean
  label_file_name?: string
}
export interface OtherDataLabelConfig extends DataLabelConfig {
  label_type?: 'txt' | 'mat'
  label_name?: string
}

export type BioDataConfig = {
  encode: number
  k_mer_k: number
} & DataLabelConfig
export type OtherDataConfig = {
  data_matrix_name: string
} & OtherDataLabelConfig
export type ImgDataConfig = {
  width: number
  height: number
  batch_size: number
  organization_method: number
  preprocess_config: ImagePreprocessConfig[]
} & DataLabelConfig
export interface TextDataConfig {
  delete_chars: string
  encode_method: number
  encode_args: EncodeArgs
}
export interface EncodeArgs {
  epochs: number
  learn_rate: number
  embedding_size: number
  window_size: number
}

export type ImgPreprocessParameter = PreprocessParameter<ImgDataConfig, 0>
export type TextPreprocessParameter = PreprocessParameter<TextDataConfig, 1>
export type BioPreprocessParameter = PreprocessParameter<BioDataConfig, 2>
export type OtherPreprocessParameter = PreprocessParameter<OtherDataConfig, 3>
export type EachPreprocessParameter =
  | ImgPreprocessParameter
  | TextPreprocessParameter
  | BioPreprocessParameter
  | OtherPreprocessParameter

export type AllImagePreprocessType =
  | 'clip'
  | 'normalize'
  | 'Gaussian_noise'
  | 'GaussianBlur'
  | 'rotate'
  | 'salt_pepper_noise'
  | 'contrast'
  | 'flip'
export interface ImagePreprocessConfig<
  T extends AllImagePreprocessType,
  A extends Record<string, any>,
> {
  type: T
  isRandom: T extends 'normalize' ? undefined : boolean
  method: T extends 'normalize' ? 'min_max' | 'mean' : undefined
  args?: A
}
export interface ClipRandomArgs {
  x: number
  y: number
  width: number
  height: number
}
export interface MeanNormalizeArgs {
  mean: [number, number, number]
  std: [number, number, number]
}
export interface GaussianNoiseRandomArgs {
  mean: number
  sigma: number
}
export interface GaussianBlurRandomArgs {
  ksize: [number, number]
  sigmaX: number
}
export interface RotateRandomArgs {
  x: number
  y: number
  angle: number
}
export interface SaltPepperNoiseRandomArgs {
  occupy_rate: number
  salt_pepper_rate: number
}
export interface ContrastRandomArgs {
  alpha: number
  beta: number
}
export interface FlipRandomArgs {
  flipCode: number
}

export type ClipConfig = ImagePreprocessConfig<'clip', ClipRandomArgs>
export type NormalizeConfig = ImagePreprocessConfig<'normalize', MeanNormalizeArgs>
export type GaussianNoiseConfig = ImagePreprocessConfig<'Gaussian_noise', GaussianNoiseRandomArgs>
export type GaussianBlurConfig = ImagePreprocessConfig<'GaussianBlur', GaussianBlurRandomArgs>
export type RotateConfig = ImagePreprocessConfig<'rotate', RotateRandomArgs>
export type SaltPepperNoiseConfig = ImagePreprocessConfig<
  'salt_pepper_noise',
  SaltPepperNoiseRandomArgs
>
export type ContrastConfig = ImagePreprocessConfig<'contrast', ContrastRandomArgs>
export type FlipConfig = ImagePreprocessConfig<'flip', FlipRandomArgs>

export type EachImagePreprocessConfig =
  | ClipConfig
  | NormalizeConfig
  | GaussianNoiseConfig
  | GaussianBlurConfig
  | RotateConfig
  | SaltPepperNoiseConfig
  | ContrastConfig
  | FlipConfig
