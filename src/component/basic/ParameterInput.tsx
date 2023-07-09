import { EachTypeOfConfigParameter } from '@/types/config/parameter'
import { FormLabel, Chip, FormHelperText, Switch, Input, Select, Box, Option } from '@mui/joy'
import { Control, Controller, ControllerRenderProps, Field, useWatch } from 'react-hook-form'
import { Tuple2Input } from './CustomInput'
import FormModal from './FormModal'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any, any>
  control: Control<any>
  prefix?: string
}

export default function ParameterInput({ prefix, parameter, control }: ParameterInputProps) {
  const renderInput = (field: ControllerRenderProps) =>
    parameter.type == 'bool' ? (
      <Switch {...field} onChange={field.onChange} checked={field.value} sx={{ my: 0.5 }} />
    ) : parameter.type == 'tuple2' ? (
      <Tuple2Input {...field} sx={{ my: 0.5 }} size="sm" />
    ) : parameter.properties ? (
      <FormModal
        control={control}
        name={(prefix ? prefix + '.' : '') + parameter.key}
        parameters={parameter.properties}
        label={parameter.key as string}
        description={parameter.description}
      />
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
  const form = useWatch({
    control,
    name: prefix ?? '',
    disabled: !parameter.shown,
  })
  const show = parameter.shown ? parameter.shown(form) : true
  
  return (
    <Controller
      control={control}
      name={(prefix ? prefix + '.' : '') + parameter.key}
      defaultValue={parameter.default}
      render={({ field, fieldState }) => (
        <Box display={show ? 'block' : 'none'}>
          <FormLabel>
            {parameter.key as string}
            <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
              {parameter.type}
            </Chip>
            {fieldState.isDirty && (
              <Chip size="sm" variant="solid" sx={{ ml: 1 }}>
                已修改
              </Chip>
            )}
          </FormLabel>
          <FormHelperText>{parameter.description}</FormHelperText>
          {renderInput(field)}
        </Box>
      )}
    />
  )
}
