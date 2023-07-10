import { EachTypeOfConfigParameter } from '@/types/config/parameter'
import { FormLabel, Chip, FormHelperText, Switch, Input, Select, Box, Option } from '@mui/joy'
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
import { useCallback } from 'react'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any, any>
  prefix?: string
}

export default function ParameterInput({ prefix, parameter }: ParameterInputProps) {
  const { control } = useFormContext()
  const form = useWatch({
    control,
    name: prefix ?? '',
    disabled: !parameter.shown,
  })
  const show = parameter.shown ? parameter.shown(form) : true
  // console.log((prefix ? prefix + '.' : '') + parameter.key)
  const renderBox = useCallback<ControllerProps['render']>(
    ({ field, fieldState }) => (
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
          {parameter.key as string}
          <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
            {parameter.type}
          </Chip>
        </FormLabel>
        <FormHelperText>{parameter.description}</FormHelperText>
        {renderInput(field, parameter, prefix)}
      </Box>
    ),
    [show, parameter, prefix],
  )

  return (
    <Controller
      control={control}
      name={(prefix ? prefix + '.' : '') + parameter.key}
      defaultValue={parameter.default}
      render={renderBox}
    />
  )
}

const renderInput = (
  field: ControllerRenderProps,
  parameter: EachTypeOfConfigParameter<any, any>,
  prefix?: string,
) =>
  parameter.type == 'bool' ? (
    <Switch {...field} onChange={field.onChange} checked={field.value} sx={{ my: 0.5 }} />
  ) : parameter.type == 'tuple2' ? (
    <Tuple2Input {...field} sx={{ my: 0.5 }} size="sm" />
  ) : parameter.properties ? (
    <FormModal
      name={(prefix ? prefix + '.' : '') + parameter.key}
      parameters={parameter.properties}
    />
  ) : parameter.type == 'file' ? (
    <FileUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />
  ) : parameter.selections ? (
    <Select
      {...field}
      value={parameter.type == 'int' ? field.value : parameter.selections.indexOf(field.value)}
      onChange={(_, value) =>
        field.onChange(parameter.type == 'int' ? parseInt(value) : parameter.selections![value])
      }
      size="sm"
    >
      {parameter.selections?.map((selection, index) => (
        <Option value={index} key={selection}>
          {selection}
        </Option>
      ))}
    </Select>
  ) : parameter.type == 'int' || parameter.type == 'float' ? (
    <Input
      onChange={(e) => field.onChange(Number(e.target.value))}
      value={field.value}
      ref={field.ref}
      sx={{ my: 0.5 }}
      size="sm"
    />
  ) : (
    <Input {...field} sx={{ my: 0.5 }} size="sm" />
  )
