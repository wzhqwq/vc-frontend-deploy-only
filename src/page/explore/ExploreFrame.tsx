import { Box, ListItemDecorator, Stack, Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import ViewInAr from '@mui/icons-material/ViewInAr'
import AccountTree from '@mui/icons-material/AccountTree'
import Description from '@mui/icons-material/Description'
import ExploreProjects from './ExploreProjects'

export default function ExploreFrame() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()

  return (
    <Box pt={2}>
      <Tabs
        orientation="vertical"
        value={type}
        onChange={(_, value) => navigate(`/explore/${value}`)}
        sx={{ gap: 2 }}
      >
        <TabList variant="soft">
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
          <ExploreProjects />
        </TabPanel>
        <TabPanel value="datasets">数据集</TabPanel>
        <TabPanel value="models">算法</TabPanel>
      </Tabs>
    </Box>
  )
}
