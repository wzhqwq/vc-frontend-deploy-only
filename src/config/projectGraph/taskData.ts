import {
  BioPreprocessParameter,
  EncodeArgs,
  ImgPreprocessParameter,
  OtherPreprocessParameter,
  TextPreprocessParameter,
} from '@/types/config/details/tasks'
import {
  ConfigParameterArray,
  DictConfigParameter,
  PreprocessParameter,
} from '@/types/config/parameter'

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
      default: [],
      availableValues: [],
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
      ] as ConfigParameterArray<EncodeArgs>,
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
]
export const preprocessConfigParameters: ConfigParameterArray<PreprocessParameter<any, any>> = [
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
    boundSelectionKey: 'data_type',
    default: allPreprocessDataConfigParameters[0].default,
  },
]
