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
  useFormState,
  useWatch,
} from 'react-hook-form'
import { TupleInput } from './CustomInput'
import { useContext, useEffect, useMemo } from 'react'
import { ReadonlyContext } from '@/component/context/ReadonlyContext'
import { checkDirty } from '@/utils/form'

import FormModal from './FormModal'
import FileUpload from './FileUpload'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any, any>
  prefix?: string
  simple?: boolean
}

export default function ParameterInput({ prefix, parameter, simple = false }: ParameterInputProps) {
  const { unregister, trigger, resetField } = useFormContext()
  const readonly = useContext(ReadonlyContext)
  const name = (prefix ? prefix + '.' : '') + parameter.key

  const multiChoice = parameter.type == 'dict' && parameter.multiChoice
  const form = useWatch({
    name: prefix ?? '',
    disabled: !parameter.canShow && !multiChoice,
  })
  const { dirtyFields } = useFormState({ name: prefix ?? '' })
  const show = parameter.canShow ? parameter.canShow(form) : true
  const selection = multiChoice ? form[parameter.boundSelectionKey] : undefined
  useEffect(() => {
    if (!multiChoice) return
    if (!checkDirty(dirtyFields, prefix ?? '')) return
    // console.log(parameter.availableValues[selection].default)
    resetField(name, { defaultValue: parameter.availableValues[selection].default })
  }, [selection])

  useEffect(() => {
    console.log(parameter.key, show, form)
    if (!show) unregister((prefix ? prefix + '.' : '') + parameter.key)
    else trigger((prefix ? prefix + '.' : '') + parameter.key)
  }, [show])
  // console.log(parameter.key, field.value)

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
    const renderInput = (() => {
      const { type, selections, key } = parameter
      if (readonly)
        return type == 'bool'
          ? (field: ControllerRenderProps) => (
              <Typography level="h6" color="primary">
                {field.value ? 'True' : 'False'}
              </Typography>
            )
          : type == 'tuple2' || type == 'tuple3'
          ? (field: ControllerRenderProps) => (
              <Typography level="h6" color="primary">
                {field.value.join(', ')}
              </Typography>
            )
          : type == 'dict'
          ? () => (
              <FormModal
                name={(prefix ? prefix + '.' : '') + key}
                parameters={
                  (multiChoice ? parameter.availableValues[selection] : parameter).properties
                }
                readonly
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
        ? (field: ControllerRenderProps) => (
            <TupleInput length={2} {...field} sx={{ my: 0.5 }} size="sm" />
          )
        : type == 'tuple3'
        ? (field: ControllerRenderProps) => (
            <TupleInput length={3} {...field} sx={{ my: 0.5 }} size="sm" />
          )
        : type == 'dict'
        ? () => (
            <FormModal
              name={(prefix ? prefix + '.' : '') + key}
              parameters={
                (multiChoice ? parameter.availableValues[selection] : parameter).properties
              }
            />
          )
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
              type="number"
              onChange={(e) => field.onChange(Number(e.target.value))}
              value={field.value}
              ref={field.ref}
              sx={{ my: 0.5 }}
              size="sm"
            />
          )
        : (field: ControllerRenderProps) => <Input {...field} sx={{ my: 0.5 }} size="sm" />
    })()
    const helperText = !simple && <FormHelperText>{parameter.description}</FormHelperText>
    return ({ field, fieldState, formState }) => (
      <Box>
        <FormLabel
          sx={(theme) => ({
            color: fieldState.invalid ? theme.vars.palette.danger[400] : undefined,
          })}
        >
          {checkDirty(formState.dirtyFields, (prefix ? prefix + '.' : '') + parameter.key) && (
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
  }, [parameter, prefix, readonly, multiChoice, selection])

  return show ? (
    <Controller
      name={(prefix ? prefix + '.' : '') + parameter.key}
      defaultValue={parameter.default}
      render={renderBox}
      rules={{
        validate: (v) => v !== '',
      }}
    />
  ) : null
}
