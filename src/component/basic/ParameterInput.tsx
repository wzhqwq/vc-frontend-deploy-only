import { EachTypeOfConfigParameter } from '@/types/config/parameter'
import {
  FormLabel,
  Chip,
  FormHelperText,
  Switch,
  Input,
  Select,
  Box,
  Option,
  Typography,
} from '@mui/joy'
import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { Tuple2Input } from './CustomInput'
import FormModal from './FormModal'
import FileUpload from './FileUpload'
import { ReactElement, useContext, useMemo } from 'react'
import { ReadonlyContext } from '@/component/context/ReadonlyContext'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any, any>
  prefix?: string
  simple?: boolean
}

export default function ParameterInput({ prefix, parameter, simple = false }: ParameterInputProps) {
  const { control } = useFormContext()
  const readonly = useContext(ReadonlyContext)
  const form = useWatch({
    control,
    name: prefix ?? '',
    disabled: !parameter.shown,
  })
  const show = parameter.shown ? parameter.shown(form) : true

  const renderInput = useMemo<(field: ControllerRenderProps) => ReactElement>(() => {
    const { type, selections, properties, key } = parameter
    if (readonly)
      return type == 'bool'
        ? (field: ControllerRenderProps) => (
            <Typography level="h6" color="primary">
              {field.value ? 'True' : 'False'}
            </Typography>
          )
        : type == 'tuple2'
        ? (field: ControllerRenderProps) => (
            <Typography level="h6" color="primary">
              {field.value.join(', ')}
            </Typography>
          )
        : properties
        ? () => (
            <FormModal
              name={(prefix ? prefix + '.' : '') + key}
              parameters={properties!}
              readonly={readonly}
            />
          )
        : type == 'file'
        ? (field: ControllerRenderProps) => (
            <FileUpload
              value={field.value}
              readonly={readonly}
              onChange={field.onChange}
              onRemove={() => field.onChange('')}
            />
          )
        : selections
        ? (field: ControllerRenderProps) => (
            <Chip sx={{ my: 0.5 }}>{type == 'int' ? selections[field.value] : field.value}</Chip>
          )
        : (field: ControllerRenderProps) => (
            <Typography level="h6" color="primary">
              {field.value}
            </Typography>
          )
    return type == 'bool'
      ? (field: ControllerRenderProps) => (
          <Switch {...field} onChange={field.onChange} checked={field.value} sx={{ my: 0.5 }} />
        )
      : type == 'tuple2'
      ? (field: ControllerRenderProps) => <Tuple2Input {...field} sx={{ my: 0.5 }} size="sm" />
      : properties
      ? () => <FormModal name={(prefix ? prefix + '.' : '') + key} parameters={properties!} />
      : type == 'file'
      ? (field: ControllerRenderProps) => (
          <FileUpload
            value={field.value}
            onChange={field.onChange}
            onRemove={() => field.onChange('')}
          />
        )
      : selections
      ? (field: ControllerRenderProps) => (
          <Select
            {...field}
            value={type == 'int' ? field.value : selections!.indexOf(field.value)}
            onChange={(_, value) =>
              field.onChange(type == 'int' ? parseInt(value) : selections![value])
            }
            sx={{ my: 0.5 }}
            size="sm"
          >
            {selections?.map((selection, index) => (
              <Option value={index} key={selection}>
                {selection}
              </Option>
            ))}
          </Select>
        )
      : type == 'int' || type == 'float'
      ? (field: ControllerRenderProps) => (
          <Input
            onChange={(e) => field.onChange(Number(e.target.value))}
            value={field.value}
            ref={field.ref}
            sx={{ my: 0.5 }}
            size="sm"
          />
        )
      : (field: ControllerRenderProps) => <Input {...field} sx={{ my: 0.5 }} size="sm" />
  }, [parameter, prefix, readonly])
  const renderBox = useMemo<ControllerProps['render']>(() => {
    const partialLabel = (
      <>
        {simple ? parameter.description : (parameter.key as string)}
        {!simple && (
          <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
            {parameter.type}
          </Chip>
        )}
      </>
    )
    const helperText = !simple && <FormHelperText>{parameter.description}</FormHelperText>
    return ({ field, fieldState }) => (
      <Box display={show ? 'block' : 'none'}>
        <FormLabel>
          {fieldState.isDirty && (
            <Box
              sx={(theme) => ({
                width: 8,
                height: 8,
                borderRadius: '50%',
                ml: '-10px',
                position: 'absolute',
                bgcolor: theme.vars.palette.primary[400],
              })}
            />
          )}
          {partialLabel}
        </FormLabel>
        {helperText}
        {renderInput(field)}
      </Box>
    )
  }, [show, parameter, prefix, renderInput])

  return (
    <Controller
      control={control}
      name={(prefix ? prefix + '.' : '') + parameter.key}
      defaultValue={parameter.default}
      render={renderBox}
    />
  )
}
