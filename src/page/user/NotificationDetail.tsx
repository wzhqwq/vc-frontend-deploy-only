import { useMessage } from '@/api/message'
import { formatTime } from '@/utils/time'
import { Typography, Box, CircularProgress } from '@mui/joy'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Markdown from 'marked-react'

export default function NotificationDetail() {
  const { id } = useParams()
  const { message, fetchingMessage, setReadMessage } = useMessage(Number(id))
  useEffect(() => {
    setReadMessage()
  }, [setReadMessage])
  return (
    <Box sx={{ py: 2 }}>
      <Typography level="h4" noWrap sx={{ maxWidth: 300 }}>
        消息详情
      </Typography>
      <Typography level="body2" color="neutral">
        {message && formatTime(message.created_at)}
      </Typography>
      {fetchingMessage && <CircularProgress sx={{ mt: 2, mx: 'auto', display: 'block' }} />}
      {message && <Markdown value={message.message} />}
    </Box>
  )
}
