import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import { Badge, Box, Button, Chip, Sheet, Stack, Typography } from '@mui/joy'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '@/logo.svg'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <Stack alignItems="center" justifyContent="center" height="100%">
      <Stack alignItems="center" mt={4}>
        <img src={logo} alt="logo" width="200" />
        <Typography level="h4">多聚类可视化平台</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} mt={4}>
          <StepBlock step={1} title="上传数据集" badgeContent="3个在线公开数据集">
            <ul>
              <li>生物数据</li>
              <li>文本数据</li>
              <li>图像数据</li>
              <li>中间数据</li>
            </ul>
            <Button sx={{ mt: 1 }} fullWidth onClick={() => navigate('/explore/datasets')}>
              探索数据集
              <ChevronRightRounded />
            </Button>
          </StepBlock>
          <StepBlock step={2} title="预处理数据" badgeContent="4种方向的预处理">
            <ul>
              <li>序列编码压缩</li>
              <li>标点删除</li>
              <li>分词</li>
              <li>图片增强</li>
              <li>图片调整</li>
            </ul>
            <Button sx={{ mt: 1 }} fullWidth>
              了解更多
              <ChevronRightRounded />
            </Button>
          </StepBlock>
          <StepBlock step={3} title="运行模型" badgeContent="无数种可配置模型">
            <ul>
              <li>多双聚类</li>
              <li>深度多聚类</li>
              <li>原始空间聚类</li>
              <li>子空间多聚类</li>
              <li>深度学习</li>
              {/* <li>用户自上传模型</li> */}
            </ul>
            <Button sx={{ mt: 1 }} fullWidth onClick={() => navigate('/explore/models')}>
              探索模型
              <ChevronRightRounded />
            </Button>
          </StepBlock>
          <StepBlock step={4} title="可视化分析" badgeContent="3个可视化分析模块">
            <ul>
              <li>聚类结果可视化</li>
              <li>质量评估</li>
              <li>聚类结果导出</li>
            </ul>
            <Button sx={{ mt: 1 }} fullWidth>
              了解更多
              <ChevronRightRounded />
            </Button>
          </StepBlock>
        </Stack>
      </Stack>
    </Stack>
  )
}

interface StepBlockProps {
  step: number
  title: string
  badgeContent: string
  children?: React.ReactNode
}
const StepBlock = memo(({ step, title, badgeContent, children }: StepBlockProps) => (
  <>
    {step !== 1 && <ChevronRightRounded fontSize="large" color="primary" />}
    <Badge
      badgeContent={badgeContent}
      sx={{
        '.MuiBadge-badge': {
          transformOrigin: 'top right',
          ':not(.MuiBadge-invisible)': {
            transform: 'scale(1) translate(10px, -50%)',
          },
        },
      }}
    >
      <Sheet variant="soft" sx={{ p: 2 }}>
        <Typography level="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip color="neutral">{'Step ' + step}</Chip>
          {title}
        </Typography>
        {children}
      </Sheet>
    </Badge>
  </>
))
