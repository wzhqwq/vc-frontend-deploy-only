import { EachTypeOfConfigParameter } from '@/types/config/parameter'
import { FormLabel, Chip, FormHelperText, Switch, Input, Select, Box, Option } from '@mui/joy'
import { Control, Controller } from 'react-hook-form'
import { Tuple2Input } from './CustomInput'
import FormModal from './FormModal'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any>
  control: Control
  prefix?: string
}

export default function ParameterInput({ prefix, parameter, control }: ParameterInputProps) {
  return (
    <Box>
      <FormLabel>
        {parameter.key as string}
        <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
          {parameter.type}
        </Chip>
      </FormLabel>
      <FormHelperText>{parameter.description}</FormHelperText>
      {parameter.type == 'dict' && parameter.properties ? (
        <FormModal
          control={control}
          name={(prefix ? prefix + '.' : '') + parameter.key}
          parameters={parameter.properties}
          label={parameter.key as string}
          description={parameter.description}
        />
      ) : (
        <Controller
          control={control}
          name={(prefix ? prefix + '.' : '') + parameter.key}
          defaultValue={parameter.default}
          render={
            parameter.type == 'bool'
              ? ({ field: { onChange, value, ref } }) => (
                  <Switch onChange={onChange} checked={value} ref={ref} sx={{ my: 0.5 }} />
                )
              : parameter.type == 'tuple2'
              ? ({ field }) => <Tuple2Input {...field} sx={{ my: 0.5 }} size="sm" />
              : parameter.selections
              ? ({ field: { onChange, value, ref } }) => (
                  <Select
                    onChange={(_, value) =>
                      onChange(
                        parameter.type == 'int' ? parseInt(value) : parameter.selections![value],
                      )
                    }
                    value={value}
                    ref={ref}
                    size="sm"
                  >
                    {parameter.selections?.map((selection, index) => (
                      <Option value={index} key={selection}>
                        {selection}
                      </Option>
                    ))}
                  </Select>
                )
              : parameter.type == 'int' || parameter.type == 'float'
              ? ({ field: { onChange, value, ref } }) => (
                  <Input
                    onChange={(e) => onChange(Number(e.target.value))}
                    value={value}
                    ref={ref}
                    sx={{ my: 0.5 }}
                    size="sm"
                  />
                )
              : ({ field }) => <Input {...field} sx={{ my: 0.5 }} size="sm" />
          }
        />
      )}
    </Box>
  )
}
