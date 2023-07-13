import {
  AllImagePreprocessType,
  BioPreprocessParameter,
  ClipConfig,
  ContrastConfig,
  DeKmeansAlgorithmParameter,
  EachAlgorithmParameter,
  EachPreprocessParameter,
  FlipConfig,
  GaussianBlurConfig,
  GaussianNoiseConfig,
  IMClustesAlgorithmParameter,
  ImgDataConfig,
  ImgPreprocessParameter,
  MNMFAlgorithmParameter,
  MNMFConfig,
  MultiCCAlgorithmParameter,
  MultiCCConfig,
  NormalizeConfig,
  OSCAlgorithmParameter,
  OtherPreprocessParameter,
  RotateConfig,
  SaltPepperNoiseConfig,
  TextPreprocessParameter,
} from '@/types/config/details/tasks'
import { ConfigParameterArray, DictConfigParameter } from '@/types/config/parameter'
import { AlgorithmTaskData, PreprocessTaskData } from '@/types/config/project'

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
export const preprocessConfigDict: DictConfigParameter<PreprocessTaskData, 'parameters'> = {
  key: 'parameters',
  type: 'dict',
  description: '预处理配置',
  multiChoice: false,
  properties: [
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
  ],
  default: {
    data_type: 0,
    data_file_name: '',
    data_config: allPreprocessDataConfigParameters[0].default,
  } as PreprocessTaskData['parameters'],
}

const multiCCOptionDict: DictConfigParameter<MultiCCConfig, 'options'> = {
  key: 'options',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'error',
      type: 'float',
      description: '损失率，最好为0.0001',
      default: 0.0001,
    },
    {
      key: 'lambda',
      type: 'float',
      description: '控制着质量和差异之间的权衡的值，最好为100',
      default: 100,
    },
    {
      key: 'maxIter',
      type: 'int',
      description: '最大迭代次数',
      default: 100,
    },
    {
      key: 'mu',
      type: 'float',
      description: '控制着质量和差异之间的权衡的值，最好为100',
      default: 100,
    },
  ],
  default: {
    error: 0.0001,
    lambda: 100,
    maxIter: 100,
    mu: 100,
  },
}
const multiCCConfigDict: DictConfigParameter<MultiCCAlgorithmParameter, 'algo_config'> = {
  key: 'algo_config',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'kFea',
      type: 'int',
      description: '每个共聚类的特征簇的数量',
      default: 10,
    },
    {
      key: 'kSample',
      type: 'int',
      description: '每个共聚类中的样本簇数',
      default: 10,
    },
    {
      key: 'num_clusters',
      type: 'int',
      description: '聚类的簇数',
      default: 10,
    },
    multiCCOptionDict,
  ],
  default: {
    kFea: 10,
    kSample: 10,
    num_clusters: 10,
    options: multiCCOptionDict.default,
  },
}

const deKmeansConfigDict: DictConfigParameter<DeKmeansAlgorithmParameter, 'algo_config'> = {
  key: 'algo_config',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'epochs',
      type: 'int',
      description: '最大迭代次数',
      default: 100,
    },
    {
      key: 'k1',
      type: 'int',
      description: '用于设置第一种聚类的类别数',
      default: 2,
    },
    {
      key: 'k2',
      type: 'int',
      description: '用于设置第二种聚类的类别数',
      default: 2,
    },
    {
      key: 'lambda_val',
      type: 'float',
      description: '用于算法对数据进行正则化操作的参数',
      default: 0.1,
    },
    {
      key: 'num_clusters',
      type: 'int',
      description: '聚类的簇数',
      default: 2,
    },
  ],
  default: {
    epochs: 100,
    k1: 2,
    k2: 2,
    lambda_val: 0.1,
    num_clusters: 2,
  },
}

const imClustesConfigDict: DictConfigParameter<IMClustesAlgorithmParameter, 'algo_config'> = {
  key: 'algo_config',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'Epoch',
      type: 'int',
      description: '最大迭代次数',
      default: 100,
    },
    {
      key: 'LR',
      type: 'float',
      description: '学习率',
      default: 0.01,
    },
    {
      key: 'n_clusters',
      type: 'int',
      description: '聚类的簇数',
      default: 2,
    },
    {
      key: 'num_head',
      type: 'int',
      description: '注意力机制头数',
      default: 2,
    },
  ],
  default: {
    Epoch: 100,
    LR: 0.01,
    n_clusters: 2,
    num_head: 2,
  },
}

const oscConfigDict: DictConfigParameter<OSCAlgorithmParameter, 'algo_config'> = {
  key: 'algo_config',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'epochs',
      type: 'int',
      description: '最大迭代次数',
      default: 100,
    },
    {
      key: 'k',
      type: 'int',
      description: '用于设置聚类种数的参数',
      default: 2,
    },
    {
      key: 'num_clusters',
      type: 'int',
      description: '聚类的簇数',
      default: 2,
    },
  ],
  default: {
    epochs: 100,
    k: 2,
    num_clusters: 2,
  },
}

const mnmfOptionDict: DictConfigParameter<MNMFConfig, 'options'> = {
  key: 'options',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'alpha',
      type: 'float',
      description: '正则化系数',
      default: 0.1,
    },
    {
      key: 'error',
      type: 'float',
      description: '误差阈值，若训练误差低于此值则提前终止算法',
      default: 0.1,
    },
    {
      key: 'minIter',
      type: 'int',
      description: '最小迭代次数',
      default: 10,
    },
    {
      key: 'nReapeat',
      type: 'int',
      description: '每种聚类随机初始化的次数',
      default: 10,
    },
    {
      key: 'stype',
      type: 'int',
      description: '选择计算模式2',
      default: 1,
    },
    {
      key: 'type',
      type: 'int',
      description: '选择计算模式1',
      default: 1,
    },
    {
      key: 'weight',
      type: 'float',
      description: '权重参数',
      default: 0.1,
    },
  ],
  default: {
    alpha: 0.1,
    error: 0.1,
    minIter: 10,
    nReapeat: 10,
    stype: 1,
    type: 1,
    weight: 0.1,
  },
}
const mnmfConfigDict: DictConfigParameter<MNMFAlgorithmParameter, 'algo_config'> = {
  key: 'algo_config',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'epochs',
      type: 'int',
      description: '最大迭代次数',
      default: 100,
    },
    {
      key: 'k',
      type: 'int',
      description: '用于设置聚类种数的参数',
      default: 2,
    },
    {
      key: 'num_clusters',
      type: 'int',
      description: '聚类的簇数',
      default: 2,
    },
    mnmfOptionDict,
  ],
  default: {
    epochs: 100,
    k: 2,
    num_clusters: 2,
    options: mnmfOptionDict.default,
  },
}

const allAlgorithmConfigParameters = [
  multiCCConfigDict,
  deKmeansConfigDict,
  imClustesConfigDict,
  oscConfigDict,
  mnmfConfigDict,
] as DictConfigParameter<EachAlgorithmParameter, 'algo_config'>[]
const algorithmNames = [
  'MultiCC',
  'DeKMeans',
  'iMClustes',
  'OSC',
  'MNMF',
]
export const algorithmConfigDict: DictConfigParameter<AlgorithmTaskData, 'parameters'> = {
  key: 'parameters',
  type: 'dict',
  description: '算法配置',
  multiChoice: false,
  properties: [
    {
      key: 'algo_name',
      type: 'str',
      description: '算法名称',
      default: 'MultiCC',
      selections: algorithmNames,
    },
    {
      key: 'algo_config',
      type: 'dict',
      description: '算法配置',
      multiChoice: true,
      availableValues: allAlgorithmConfigParameters,
      getSelectionIndex(p) {
        return algorithmNames.indexOf(p.algo_name)
      },
      default: allAlgorithmConfigParameters[0].default,
    },
  ],
  default: {
    algo_name: 'MultiCC',
    algo_config: allAlgorithmConfigParameters[0].default,
  } as AlgorithmTaskData['parameters']
}
