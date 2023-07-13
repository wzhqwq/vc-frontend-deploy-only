import { Chip, CircularProgress } from '@mui/joy'

import CropDinIcon from '@mui/icons-material/CropDin'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded'
import ReportRoundedIcon from '@mui/icons-material/ReportRounded'

export const taskStatus = [
  undefined,
  <Chip color="neutral" variant="soft" startDecorator={<CropDinIcon />}>
    已创建
  </Chip>,
  <Chip
    color="warning"
    variant="solid"
    startDecorator={<HourglassTopRoundedIcon className="hourglass-spinning" />}
  >
    等待运行
  </Chip>,
  <Chip
    color="primary"
    variant="soft"
    startDecorator={<CircularProgress size="sm" variant="plain" />}
  >
    运行中
  </Chip>,
  <Chip color="success" startDecorator={<CheckRoundedIcon />}>
    已完成
  </Chip>,
  <Chip color="neutral" startDecorator={<StopCircleRoundedIcon />}>
    手动中止
  </Chip>,
  <Chip color="danger" startDecorator={<ReportRoundedIcon />}>
    异常中止
  </Chip>,
]

export const taskStatusIcon = [
  undefined,
  <CropDinIcon />,
  <HourglassTopRoundedIcon className="hourglass-spinning" />,
  <CircularProgress color="neutral" variant="plain" />,
  <CheckRoundedIcon />,
  <StopCircleRoundedIcon />,
  <ReportRoundedIcon />,
]
export const taskStatusText = [
  undefined,
  '已创建',
  '等待运行',
  '运行中',
  '已完成',
  '手动中止',
  '异常中止',
]

export const modelKinds = [
  <Chip color="primary" variant="soft">
    深度学习模型
  </Chip>,
  <Chip color="neutral" variant="soft">
    Python代码
  </Chip>,
]
