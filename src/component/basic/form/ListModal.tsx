import AddIcon from '@mui/icons-material/Add'

import { DictConfigParameter, ListConfigParameter } from '@/types/config/parameter'
import { Box, Button, Card, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'
import { FormProvider, UseFieldArrayRemove, useFieldArray, useForm } from 'react-hook-form'
import MutationController from '../MutationController'

export interface ListModalProps {
  parameter: ListConfigParameter<any, any>
  readonly?: boolean
  value: any
  onChange?: (value: any) => void
  onBlur?: () => void
}

export default function ListModal({
  parameter,
  readonly,
  value,
  onChange,
  onBlur,
}: ListModalProps) {
  const [open, setOpen] = useState(false)
  const methods = useForm<{ list: any[] }>({ mode: 'onBlur' })
  const { append, fields, remove } = useFieldArray({ name: 'list', control: methods.control })

  useEffect(() => {
    methods.reset({ list: value })
  }, [value])
  const handleChange = useCallback(
    (data: { list: any[] }) => {
      onChange?.(data.list)
    },
    [onChange],
  )
  const handleClose = useCallback(() => {
    onBlur?.()
    setOpen(false)
  }, [onBlur])

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }}>
        {readonly ? '点击查看' : '点击编辑'}
      </Button>
      <Modal
        open={open}
        onClose={() => {
          onBlur?.()
          setOpen(false)
        }}
      >
        <ModalDialog sx={{ p: 2, minWidth: 200 }}>
          <Typography level="h5" sx={{ mb: 2 }}>
            编辑{parameter.key}列表
          </Typography>
          <FormProvider {...methods}>
            <Stack spacing={2}>
              {fields.map((item, index) => (
                <ListItemCard
                  key={item.id}
                  name="list"
                  index={index}
                  remove={remove}
                  parameter={parameter.model}
                />
              ))}
              {!readonly && (
                <Button onClick={() => append(parameter.model.default)} variant="soft" fullWidth>
                  <AddIcon />
                  添加元素
                </Button>
              )}
            </Stack>
            <Stack direction="row" mt={2} spacing={2}>
              <Box sx={{ flexGrow: 1 }} />
              <MutationController onChange={handleChange} readonly={readonly}>
                <Button onClick={handleClose} variant="soft" color="neutral">
                  关闭
                </Button>
              </MutationController>
            </Stack>
          </FormProvider>
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
