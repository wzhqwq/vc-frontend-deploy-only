import { PreprocessParameter } from "../parameter"

export interface DataWithLabelConfig {
  has_label: true
  label_file_name: string
}
export interface OtherDataWithLabelConfig extends DataWithLabelConfig {
  label_type: 'txt' | 'mat'
  label_name?: string
}
export interface DataWithoutLabelConfig {
  has_label: false
}

export type BioDataConfig = {
  encode: number
  k_mer_k: number
} & (DataWithLabelConfig | DataWithoutLabelConfig)
export type OtherDataConfig = {
  data_matrix_name: string
} & (OtherDataWithLabelConfig | DataWithoutLabelConfig)
export type ImgDataConfig = {
  width: number
  height: number
  batch_size: number
  organization_method: number
  preprocess_config: ImagePreprocessConfig[]
} & (DataWithLabelConfig | DataWithoutLabelConfig)
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

export type ImgPreprocessParameter = PreprocessParameter<ImgDataConfig, 1>
export type TextPreprocessParameter = PreprocessParameter<TextDataConfig, 2>
export type BioPreprocessParameter = PreprocessParameter<BioDataConfig, 3>
export type OtherPreprocessParameter = PreprocessParameter<OtherDataConfig, 4>
export type EachPreprocessParameter =
  | ImgPreprocessParameter
  | TextPreprocessParameter
  | BioPreprocessParameter
  | OtherPreprocessParameter

export type AllImagePreprocessType = 
| "clip"
| "normalize"
| "Gaussian_noise"
| "GaussianBlur"
| "rotate"
| "salt_pepper_noise"
| "contrast"
| "flip"
export interface ImagePreprocessConfig<
  T extends AllImagePreprocessType,
  R extends boolean | undefined = undefined,
  M extends string | undefined = undefined
> {
  type: T
  isRandom: R
  method: M
}
