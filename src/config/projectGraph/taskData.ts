import {
  BioDataConfig,
  BioPreprocessParameter,
  ImgDataConfig,
  ImgPreprocessParameter,
  OtherDataConfig,
  OtherPreprocessParameter,
  TextDataConfig,
  TextPreprocessParameter,
} from '@/types/config/details/tasks'
import { ConfigParameter, ConfigParameterArray, PreprocessParameter } from '@/types/config/parameter'

export const defaultImgPreprocessParameter: ImgPreprocessParameter = {
  data_type: 0,
  data_file_name: '',
  data_config: {
    width: 400,
    height: 400,
    batch_size: 16,
    organization_method: 1,
    has_label: false,
    preprocess_config: [],
  },
}
export const dataTypeParameter: ConfigParameter<
  'int',
  'data_type',
  PreprocessParameter<any, any>
> = {
  key: 'data_type',
  type: 'int',
  description: '数据类型',
  default: 0,
  selections: ['图片', '文本', '生物序列', '其他'],
}
export const imgDataConfigParameters: ConfigParameterArray<ImgDataConfig> = [
  { key: 'width', type: 'int', description: '压缩目标宽度', default: 400 },
  { key: 'height', type: 'int', description: '压缩目标高度', default: 400 },
  { key: 'batch_size', type: 'int', description: '分批大小', default: 16 },
  { key: 'organization_method', type: 'int', description: '数据组织方式', default: 1 },
  { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
  {
    key: 'label_file_name',
    type: 'str',
    description: '标签文件',
    default: '',
    shown: (p) => p.has_label,
  },
  { key: 'preprocess_config', type: 'list', description: '预处理配置', default: [] },
]
export const defaultTextPreprocessParameter: TextPreprocessParameter = {
  data_type: 1,
  data_file_name: '',
  data_config: {
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
export const textDataConfigParameters: ConfigParameterArray<TextDataConfig> = [
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
    properties: [
      { key: 'epochs', type: 'int', description: '训练轮数', default: 100 },
      { key: 'learn_rate', type: 'float', description: '学习率', default: 0.01 },
      { key: 'embedding_size', type: 'int', description: '嵌入维度', default: 100 },
      { key: 'window_size', type: 'int', description: '窗口大小', default: 5 },
    ],
    shown: (p) => p.encode_method == 1,
  } as ConfigParameter<'dict', 'encode_args', TextDataConfig>,
]
export const defaultBioPreprocessParameter: BioPreprocessParameter = {
  data_type: 2,
  data_file_name: '',
  data_config: {
    encode: 0,
    k_mer_k: 3,
    has_label: false,
  },
}
export const bioDataConfigParameters: ConfigParameterArray<BioDataConfig> = [
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
    shown: (p) => p.encode == 1,
  },
  { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
  {
    key: 'label_file_name',
    type: 'str',
    description: '标签文件',
    default: '',
    shown: (p) => p.has_label,
  },
]
export const defaultOtherPreprocessParameter: OtherPreprocessParameter = {
  data_type: 3,
  data_file_name: '',
  data_config: {
    data_matrix_name: '',
    has_label: false,
  },
}
export const otherDataConfigParameters: ConfigParameterArray<OtherDataConfig> = [
  { key: 'data_matrix_name', type: 'str', description: '数据文件中矩阵的变量名', default: '' },
  { key: 'has_label', type: 'bool', description: '是否有标签', default: false },
  {
    key: 'label_file_name',
    type: 'str',
    description: '标签文件',
    default: '',
    shown: (p) => p.has_label,
  },
  {
    key: 'label_type',
    type: 'str',
    description: '标签文件类型',
    default: 'txt',
    shown: (p) => p.has_label,
    selections: ['txt', 'mat'],
  },
  {
    key: 'label_name',
    type: 'str',
    description: '标签文件中矩阵的变量名',
    default: '',
    shown: (p) => p.has_label && p.label_type == 'mat',
  },
]

export const allPreprocessDataConfigParameters = [
  imgDataConfigParameters,
  textDataConfigParameters,
  bioDataConfigParameters,
  otherDataConfigParameters,
]
export const allPreprocessDefaultParameters = [
  defaultImgPreprocessParameter,
  defaultTextPreprocessParameter,
  defaultBioPreprocessParameter,
  defaultOtherPreprocessParameter,
]
