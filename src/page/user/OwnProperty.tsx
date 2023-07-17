import { Box, ListItemDecorator, Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { useNavigate, useParams } from 'react-router-dom'
import Datasets from '@/component/cards/Datasets'
import Models from '@/component/cards/Models'
import Projects from '@/component/cards/Projects'

import ViewInAr from '@mui/icons-material/ViewInAr'
import AccountTree from '@mui/icons-material/AccountTree'
import Description from '@mui/icons-material/Description'

export default function OwnProperty() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()

  return (
    <Box pt={2}>
      <Tabs
        orientation="vertical"
        value={type}
        onChange={(_, value) => navigate(`/user/${value}`)}
        sx={{ gap: 2 }}
      >
        <TabList variant="soft" sx={{ flexShrink: 0 }}>
          <Tab value="projects">
            <ListItemDecorator>
              <AccountTree />
            </ListItemDecorator>
            项目
          </Tab>
          <Tab value="datasets">
            <ListItemDecorator>
              <ViewInAr />
            </ListItemDecorator>
            数据集
          </Tab>
          <Tab value="models">
            <ListItemDecorator>
              <Description />
            </ListItemDecorator>
            算法
          </Tab>
        </TabList>
        <TabPanel value="projects">
          <Projects isPublic={false} />
        </TabPanel>
        <TabPanel value="datasets">
          <Datasets isPublic={false} />
        </TabPanel>
        <TabPanel value="models">
          <Models isPublic={false} />
        </TabPanel>
      </Tabs>
    </Box>
  )
}
