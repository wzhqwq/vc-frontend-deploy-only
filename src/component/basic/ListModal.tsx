import { DictConfigParameter, ListConfigParameter } from '@/types/config/parameter'
import { Box, Button, Card, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'
import { UseFieldArrayRemove, useFieldArray } from 'react-hook-form'

export interface ListModalProps {
  name: string
  parameter: ListConfigParameter<any, any>
  readonly?: boolean
}

export default function ListModal({ name, parameter, readonly }: ListModalProps) {
  const [open, setOpen] = useState(false)
  const { append, fields, remove } = useFieldArray({ name })

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }}>
        {readonly ? '点击查看' : '点击编辑'}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ p: 2, minWidth: 200 }}>
          <Stack spacing={2}>
            {fields.map((item, index) => (
              <ListItemCard
                key={item.id}
                name={name}
                index={index}
                remove={remove}
                parameter={parameter.model}
              />
            ))}
            {!readonly && (
              <Button onClick={() => append(parameter.model.default)} variant="soft" fullWidth>
                添加
              </Button>
            )}
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  )
}

interface ListItemCardProps {
  name: string
  index: number
  remove: UseFieldArrayRemove
  parameter: DictConfigParameter<any, any>
  readonly?: boolean
}
function ListItemCard({
  name,
  index,
  remove,
  parameter: { properties },
  readonly,
}: ListItemCardProps) {
  const columns = properties.length > 3 ? Math.max(2, properties.length / 3).toFixed(0) : 1
  const parameterList = useMemo(
    () =>
      properties.map((parameter) => (
        <ParameterInput
          key={parameter.key as string}
          parameter={parameter}
          prefix={`${name}.${index}`}
        />
      )),
    [properties],
  )

  return (
    <Card
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
      })}
      variant="outlined"
    >
      <Stack direction="row">
        <Typography level="h4" sx={(theme) => ({ color: theme.vars.palette.neutral[300] })}>
          {index + 1}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {!readonly && (
          <Button onClick={() => remove(index)} variant="soft" color="danger">
            删除
          </Button>
        )}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 140px)`,
          gap: 2,
        }}
      >
        {parameterList}
      </Box>
    </Card>
  )
}
