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
export type RandomizedImagePreprocessType = Omit<AllImagePreprocessType, 'normalize'>
export interface RandomImagePreprocessConfig<
  T extends RandomizedImagePreprocessType,
  A extends Record<string, any>,
> {
  type: T
  isRandom: boolean
  args?: A
}
export interface NormalizeImagePreprocessConfig {
  type: 'normalize'
  method: 'min_max' | 'mean'
  args?: MeanNormalizeArgs
}
export interface MeanNormalizeArgs {
  mean: [number, number, number]
  std: [number, number, number]
}
export interface ClipRandomArgs {
  x: number
  y: number
  width: number
  height: number
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

export type ImagePreprocessConfig =
  | RandomImagePreprocessConfig<'clip', ClipRandomArgs>
  | NormalizeImagePreprocessConfig
  | RandomImagePreprocessConfig<'Gaussian_noise', GaussianNoiseRandomArgs>
  | RandomImagePreprocessConfig<'GaussianBlur', GaussianBlurRandomArgs>
  | RandomImagePreprocessConfig<'rotate', RotateRandomArgs>
  | RandomImagePreprocessConfig<'salt_pepper_noise', SaltPepperNoiseRandomArgs>
  | RandomImagePreprocessConfig<'contrast', ContrastRandomArgs>
  | RandomImagePreprocessConfig<'flip', FlipRandomArgs>
