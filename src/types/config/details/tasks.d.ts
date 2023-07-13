import { AlgorithmParameter, PreprocessParameter } from '../parameter'

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

/**
 * MultiCC
 */
export interface MultiCCConfig {
  /**
   * 每个共聚类的特征簇的数量
   */
  kFea: number
  /**
   * 每个共聚类中的样本簇数
   */
  kSample: number
  /**
   * 聚类的簇数
   */
  num_clusters: number
  options: MultiCCOptions
}

export interface MultiCCOptions {
  /**
   * 损失率，最好为0.0001
   */
  error: number
  /**
   * 控制着质量和差异之间的权衡的值，最好为100
   */
  lambda: number
  /**
   * 最大迭代次数
   */
  maxIter: number
  /**
   * 控制着质量和差异之间的权衡的值，最好为100
   */
  mu: number
}

/**
 * DeKmeansConfig
 */
export interface DeKmeansConfig {
  /**
   * 最大迭代次数
   */
  epochs: number
  /**
   * 用于设置第一种聚类的类别数
   */
  k1: number
  /**
   * 用于设置第二种聚类的类别数
   */
  k2: number
  /**
   * 用于算法对数据进行正则化操作的参数
   */
  lambda_val: number
  /**
   * 聚类数，只能为2
   */
  num_clusters: number
}

/**
 * iMClustesConfig
 */
export interface IMClustesConfig {
  /**
   * 迭代次数
   */
  Epoch: number
  /**
   * 学习率
   */
  LR: number
  /**
   * 聚类的簇数
   */
  n_clusters: number
  /**
   * 注意力机制头数
   */
  num_head: number
}

/**
 * OSCConfig
 */
export interface OSCConfig {
  /**
   * 最大迭代次数
   */
  epochs: number
  /**
   * 用于设置聚类种数的参数
   */
  k: number
  num_clusters: number
}

/**
 * MNMFConfig
 */
export interface MNMFConfig {
  /**
   * 最大迭代次数
   */
  epochs: number
  /**
   * 用于设置聚类种数的参数
   */
  k: number[] | number
  /**
   * 聚类数，k若为数组，k的长度应与num_clusters相等
   */
  num_clusters: number
  /**
   * 一个字典，包含一些参数
   */
  options: MNMFOptions
}

/**
 * 一个字典，包含一些参数
 */
export interface MNMFOptions {
  /**
   * 正则化系数
   */
  alpha: number
  /**
   * 误差阈值，若训练误差低于此值则提前终止算法
   */
  error: number
  /**
   * 最小迭代次数
   */
  minIter: number
  /**
   * 每种聚类随机初始化的次数
   */
  nReapeat: number
  /**
   * 选择计算模式2
   */
  stype: number
  /**
   * 选择计算模式1
   */
  type: number
  /**
   * 权重参数
   */
  weight: number
}

export type MultiCCAlgorithmParameter = AlgorithmParameter<MultiCCConfig>
export type DeKmeansAlgorithmParameter = AlgorithmParameter<DeKmeansConfig>
export type IMClustesAlgorithmParameter = AlgorithmParameter<IMClustesConfig>
export type OSCAlgorithmParameter = AlgorithmParameter<OSCConfig>
export type MNMFAlgorithmParameter = AlgorithmParameter<MNMFConfig>

export type EachAlgorithmParameter =
  | MultiCCAlgorithmParameter
  | DeKmeansAlgorithmParameter
  | IMClustesAlgorithmParameter
  | OSCAlgorithmParameter
  | MNMFAlgorithmParameter
