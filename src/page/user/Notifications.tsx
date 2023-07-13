import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import DeleteSweep from '@mui/icons-material/DeleteSweep'

import { useMessages } from '@/api/message'
import { formatTime } from '@/utils/time'
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from '@mui/joy'
import { markdown2plain } from '@/utils/string'
import InnerLinkListItemButton from '@/component/basic/innerLink/InnerLinkListItemButton'

export default function Notifications() {
  const { messages, fetchingMessages, setReadAllMessages, settingReadAllMessages } =
    useMessages(false)

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography level="h4" gutterBottom>
          通知
        </Typography>
        <Button
          color="danger"
          variant="soft"
          onClick={setReadAllMessages}
          loading={settingReadAllMessages}
          startDecorator={<DeleteSweep />}
        >
          全部已读
        </Button>
      </Stack>

      {fetchingMessages && <CircularProgress sx={{ mt: 2, mx: 'auto', display: 'block' }} />}
      <List
        variant="outlined"
        sx={{
          borderRadius: 'sm',
        }}
      >
        {messages?.map((message) => (
          <ListItem key={message.id} sx={{ py: 1 }}>
            <InnerLinkListItemButton component="a" to={`/user/notifications/${message.id}`}>
              <ListItemDecorator>
                {!message.read && (
                  <FiberManualRecordIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
                )}
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="body1" noWrap>
                  {markdown2plain(message.message)}
                </Typography>
                <Typography level="body2" color="neutral">
                  {formatTime(message.created_at)}
                </Typography>
              </ListItemContent>
            </InnerLinkListItemButton>
          </ListItem>
        ))}
        {messages?.length == 0 && <ListItem>暂无通知</ListItem>}
      </List>
    </Box>
  )
}
