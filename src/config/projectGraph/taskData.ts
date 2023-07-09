import { BioPreprocessParameter, ImgPreprocessParameter, OtherPreprocessParameter, TextPreprocessParameter } from "@/types/config/details/tasks";

export const defaultImgPreprocessParameter: ImgPreprocessParameter = {
  data_type: 1,
  data_file_name: '',
  data_config: {
    width: 400,
    height: 400,
    batch_size: 16,
    organization_method: 1,
    has_label: false,
    preprocess_config: []
  },
}
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

