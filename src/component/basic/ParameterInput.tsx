import { EachTypeOfConfigParameter } from '@/types/config/parameter'
import { FormLabel, Chip, FormHelperText, Switch, Input, Select, Box, Option } from '@mui/joy'
import { Control, Controller, UseFormRegister } from 'react-hook-form'
import { Tuple2Input } from './CustomInput'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any>
  control: Control
  register: UseFormRegister<any>
}

export default function ParameterInput({ parameter, control, register }: ParameterInputProps) {
  return (
    <Box>
      <FormLabel>
        {parameter.key as string}
        <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
          {parameter.type}
        </Chip>
      </FormLabel>
      <FormHelperText>{parameter.description}</FormHelperText>
      {parameter.type == 'bool' ? (
        <Controller
          control={control}
          name={parameter.key as string}
          render={({ field: { onChange, value, ref } }) => (
            <Switch onChange={onChange} checked={value} ref={ref} sx={{ my: 0.5 }} />
          )}
        />
      ) : parameter.type == 'tuple2' ? (
        <Controller
          control={control}
          name={parameter.key as string}
          render={({ field }) => <Tuple2Input {...field} sx={{ my: 0.5 }} size="sm" />}
          rules={{ required: true }}
        />
      ) : parameter.selections ? (
        <Controller
          control={control}
          name={parameter.key as string}
          render={({ field: { onChange, value, ref } }) => (
            <Select onChange={(_, value) => onChange(value)} value={value} ref={ref} size="sm">
              {parameter.selections?.map((selection) => (
                <Option value={selection} key={selection}>
                  {selection}
                </Option>
              ))}
            </Select>
          )}
          rules={{ required: true }}
        />
      ) : parameter.type == 'int' || parameter.type == 'float' ? (
        <Input
          {...register(parameter.key as string, {
            required: true,
            valueAsNumber: true,
          })}
          size="sm"
        />
      ) : (
        <Input {...register(parameter.key as string, { required: true })} size="sm" />
      )}
    </Box>
  )
}
