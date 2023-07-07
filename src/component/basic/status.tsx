import { Chip } from "@mui/joy";

import CropDinIcon from '@mui/icons-material/CropDin';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';

export const taskStatus = [
  undefined,
  <Chip color='neutral' variant="soft" startDecorator={<CropDinIcon />}>已创建</Chip>,
  <Chip color='warning' variant="soft" startDecorator={<HourglassTopRoundedIcon />}>等待运行</Chip>,
  <Chip color='primary' variant='soft' startDecorator={<SettingsRoundedIcon />}>运行中</Chip>,
  <Chip color='success' startDecorator={<CheckRoundedIcon />}>已完成</Chip>,
  <Chip color='neutral' startDecorator={<StopCircleRoundedIcon />}>手动中止</Chip>,
  <Chip color='danger' startDecorator={<ReportRoundedIcon />}>异常中止</Chip>,
]