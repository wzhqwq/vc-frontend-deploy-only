import {
  BioPreprocessParameter,
  ImgDataConfig,
  ImgPreprocessParameter,
  OtherPreprocessParameter,
  TextPreprocessParameter,
} from '@/types/config/details/tasks'
import { ConfigParameter, ConfigParameterArray } from '@/types/config/parameter'

export const defaultImgPreprocessParameter: ImgPreprocessParameter = {
  data_type: 1,
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
  { key: 'preprocess_config', type: 'array', description: '预处理配置', default: [] },
]
export const defaultTextPreprocessParameter: TextPreprocessParameter = {
  data_type: 2,
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
export const defaultBioPreprocessParameter: BioPreprocessParameter = {
  data_type: 3,
  data_file_name: '',
  data_config: {
    encode: 0,
    k_mer_k: 3,
    has_label: false,
  },
}
export const defaultOtherPreprocessParameter: OtherPreprocessParameter = {
  data_type: 4,
  data_file_name: '',
  data_config: {
    data_matrix_name: '',
    has_label: false,
  },
}
