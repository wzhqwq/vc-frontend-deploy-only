import {
  AllImagePreprocessType,
  BioPreprocessParameter,
  ClipConfig,
  ContrastConfig,
  EachPreprocessParameter,
  FlipConfig,
  GaussianBlurConfig,
  GaussianNoiseConfig,
  ImgDataConfig,
  ImgPreprocessParameter,
  NormalizeConfig,
  OtherPreprocessParameter,
  RotateConfig,
  SaltPepperNoiseConfig,
  TextPreprocessParameter,
} from '@/types/config/details/tasks'
import { ConfigParameterArray, DictConfigParameter } from '@/types/config/parameter'

export const clipArgs: DictConfigParameter<ClipConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '裁剪参数',
  multiChoice: false,
  properties: [
    { key: 'x', type: 'int', description: '裁剪起始点x', default: 0 },
    { key: 'y', type: 'int', description: '裁剪起始点y', default: 0 },
    { key: 'width', type: 'int', description: '裁剪宽度', default: 0 },
    { key: 'height', type: 'int', description: '裁剪高度', default: 0 },
  ],
  default: { x: 0, y: 0, width: 0, height: 0 },
}
export const meanNormalizeArgs: DictConfigParameter<NormalizeConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '归一化参数',
  multiChoice: false,
  properties: [
    { key: 'mean', type: 'tuple3', description: '均值', default: [0.485, 0.456, 0.406] },
    { key: 'std', type: 'tuple3', description: '标准差', default: [0.229, 0.224, 0.225] },
  ],
  default: { mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225] },
}
export const gaussianNoiseArgs: DictConfigParameter<GaussianNoiseConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '高斯噪声参数',
  multiChoice: false,
  properties: [
    { key: 'mean', type: 'float', description: '均值', default: 0 },
    { key: 'sigma', type: 'float', description: '标准差', default: 0 },
  ],
  default: { mean: 0, sigma: 0 },
}
export const gaussianBlurArgs: DictConfigParameter<GaussianBlurConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '高斯模糊参数',
  multiChoice: false,
  properties: [
    { key: 'ksize', type: 'tuple2', description: '卷积核大小', default: [0, 0] },
    { key: 'sigmaX', type: 'float', description: '标准差', default: 0 },
  ],
  default: { ksize: [0, 0], sigmaX: 0 },
}
export const rotateArgs: DictConfigParameter<RotateConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '旋转参数',
  multiChoice: false,
  properties: [
    { key: 'x', type: 'int', description: '旋转中心x', default: 0 },
    { key: 'y', type: 'int', description: '旋转中心y', default: 0 },
    { key: 'angle', type: 'float', description: '旋转角度', default: 0 },
  ],
  default: { x: 0, y: 0, angle: 0 },
}
export const saltPepperNoiseArgs: DictConfigParameter<SaltPepperNoiseConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '椒盐噪声参数',
  multiChoice: false,
  properties: [
    { key: 'occupy_rate', type: 'float', description: '占比', default: 0 },
    { key: 'salt_pepper_rate', type: 'float', description: '椒盐比例', default: 0 },
  ],
  default: { occupy_rate: 0, salt_pepper_rate: 0 },
}
export const contrastArgs: DictConfigParameter<ContrastConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '对比度亮度参数',
  multiChoice: false,
  properties: [
    { key: 'alpha', type: 'float', description: '对比度', default: 0 },
    { key: 'beta', type: 'float', description: '亮度', default: 0 },
  ],
  default: { alpha: 0, beta: 0 },
}
export const flipArgs: DictConfigParameter<FlipConfig, 'args'> = {
  key: 'args',
  type: 'dict',
  description: '翻转参数',
  multiChoice: false,
  properties: [{ key: 'flipCode', type: 'int', description: '翻转方式', default: 0 }],
  default: { flipCode: 0 },
}
const imgPreprocessTypes: AllImagePreprocessType[] = [
  'clip',
  'normalize',
  'Gaussian_noise',
  'GaussianBlur',
  'rotate',
  'salt_pepper_noise',
  'contrast',
  'flip',
]
export const imgPreprocessConfigDict: DictConfigParameter<ImgDataConfig, 'preprocess_config'> = {
  key: 'preprocess_config',
  type: 'dict',
  description: '',
  multiChoice: false,
  properties: [
    {
      key: 'type',
      type: 'str',
      description: '预处理类型',
      default: 'clip',
      selections: imgPreprocessTypes,
    },
    {
      key: 'isRandom',
      type: 'bool',
      description: '是否随机参数',
      default: false,
      canShow: (p) => p.type != 'normalize',
    },
    {
      key: 'method',
      type: 'str',
      description: '归一化方法',
      default: 'mean',
      selections: ['min_max', 'mean'],
      canShow: (p) => p.type == 'normalize',
    },
    {
      key: 'args',
      type: 'dict',
      description: '参数',
      multiChoice: true,
      availableValues: [
        clipArgs,
        meanNormalizeArgs,
        gaussianNoiseArgs,
        gaussianBlurArgs,
        rotateArgs,
        saltPepperNoiseArgs,
        contrastArgs,
        flipArgs,
      ],
      canShow: (p) => (p.type == 'normalize' ? p.method == 'mean' : !p.isRandom),
      getSelectionIndex(parameters) {
        return imgPreprocessTypes.indexOf(parameters.type)
      },
      default: clipArgs.default,
    },
  ],
  default: { type: 'clip', isRandom: false, args: clipArgs.default },
}

export const imgDataConfigDict: DictConfigParameter<ImgPreprocessParameter, 'data_config'> = {
  key: 'data_config',
  type: 'dict',
  description: '数据配置',
  multiChoice: false,
  properties: [
    { key: 'width', type: 'int', description: '压缩目标宽度', default: 400 },
    { key: 'height', type: 'int', description: '压缩目标高度', default: 400 },
    { key: 'batch_size', type: 'int', description: '分批大小', default: 16 },
    { key: 'organization_method', type: 'int', description: '数据组织方式', default: 1 },
    { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
    {
      key: 'label_file_name',
      type: 'file',
      description: '标签文件',
      default: '',
      canShow: (p) => p.has_label,
    },
    {
      key: 'preprocess_config',
      type: 'list',
      description: '预处理配置',
      model: imgPreprocessConfigDict,
      default: [],
    },
  ],
  default: {
    width: 400,
    height: 400,
    batch_size: 16,
    organization_method: 1,
    has_label: false,
    preprocess_config: [],
  },
}
export const textDataConfigDict: DictConfigParameter<TextPreprocessParameter, 'data_config'> = {
  key: 'data_config',
  type: 'dict',
  description: '数据配置',
  multiChoice: false,
  properties: [
    { key: 'delete_chars', type: 'str', description: '删除字符', default: ',' },
    {
      key: 'encode_method',
      type: 'int',
      description: '编码方法',
      default: 1,
      selections: ['one_hot', 'wordEmbedding'],
    },
    {
      key: 'encode_args',
      type: 'dict',
      description: '编码参数',
      multiChoice: false,
      properties: [
        { key: 'epochs', type: 'int', description: '训练轮数', default: 100 },
        { key: 'learn_rate', type: 'float', description: '学习率', default: 0.01 },
        { key: 'embedding_size', type: 'int', description: '嵌入维度', default: 100 },
        { key: 'window_size', type: 'int', description: '窗口大小', default: 5 },
      ],
      default: {
        epochs: 100,
        learn_rate: 0.01,
        embedding_size: 100,
        window_size: 5,
      },
      canShow: (p) => p.encode_method == 1,
    },
  ],
  default: {
    delete_chars: ',',
    encode_method: 1,
    encode_args: {
      epochs: 100,
      learn_rate: 0.01,
      embedding_size: 100,
      window_size: 5,
    },
  },
}
export const bioDataConfigDict: DictConfigParameter<BioPreprocessParameter, 'data_config'> = {
  key: 'data_config',
  type: 'dict',
  description: '数据配置',
  multiChoice: false,
  properties: [
    {
      key: 'encode',
      type: 'int',
      description: '编码方法',
      default: 0,
      selections: ['不编码', 'k_mer', 'huffman'],
    },
    {
      key: 'k_mer_k',
      type: 'int',
      description: 'k_mer参数',
      default: 3,
      canShow: (p) => p.encode == 1,
    },
    { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
    {
      key: 'label_file_name',
      type: 'file',
      description: '标签文件',
      default: '',
      canShow: (p) => p.has_label,
    },
  ],
  default: {
    encode: 0,
    k_mer_k: 3,
    has_label: false,
  },
}
export const otherDataConfigDict: DictConfigParameter<OtherPreprocessParameter, 'data_config'> = {
  key: 'data_config',
  type: 'dict',
  description: '数据配置',
  multiChoice: false,
  properties: [
    { key: 'data_matrix_name', type: 'str', description: '数据文件中矩阵的变量名', default: '' },
    { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
    {
      key: 'label_file_name',
      type: 'file',
      description: '标签文件',
      default: '',
      canShow: (p) => p.has_label,
    },
    {
      key: 'label_type',
      type: 'str',
      description: '标签文件类型',
      default: 'txt',
      canShow: (p) => p.has_label,
      selections: ['txt', 'mat'],
    },
    {
      key: 'label_name',
      type: 'str',
      description: '标签文件中矩阵的变量名',
      default: '',
      canShow: (p) => p.has_label && p.label_type == 'mat',
    },
  ],
  default: {
    data_matrix_name: '',
    has_label: false,
  },
}

const allPreprocessDataConfigParameters = [
  imgDataConfigDict,
  textDataConfigDict,
  bioDataConfigDict,
  otherDataConfigDict,
] as DictConfigParameter<EachPreprocessParameter, 'data_config'>[]
export const preprocessConfigParameters: ConfigParameterArray<EachPreprocessParameter> = [
  {
    key: 'data_type',
    type: 'int',
    description: '数据类型',
    default: 0,
    selections: ['图片', '文本', '生物序列', '其他'],
  },
  {
    key: 'data_file_name',
    type: 'file',
    description: '数据文件',
    default: '',
  },
  {
    key: 'data_config',
    type: 'dict',
    description: '数据配置',
    multiChoice: true,
    availableValues: allPreprocessDataConfigParameters,
    getSelectionIndex(p) {
      return p.data_type
    },
    default: allPreprocessDataConfigParameters[0].default,
  },
]
