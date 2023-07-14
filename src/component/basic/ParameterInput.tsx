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
import ListModal from './ListModal'
import { ModelInput } from './ModelInput'

export interface ParameterInputProps {
  parameter: EachTypeOfConfigParameter<any, any>
  prefix: string
  simple?: boolean
}

export default function ParameterInput({ prefix, parameter, simple = false }: ParameterInputProps) {
  const { unregister, trigger, setValue } = useFormContext()
  const readonly = useContext(ReadonlyContext)
  const name = prefix + '.' + parameter.key

  const multiChoice = parameter.type == 'dict' && parameter.multiChoice
  const form = useWatch({
    name: prefix,
    disabled: !parameter.canShow && !multiChoice,
  })
  const { dirtyFields } = useFormState({ name: prefix })
  const show = parameter.canShow ? parameter.canShow(form) : true
  const selection = multiChoice ? parameter.getSelectionIndex(form) : undefined
  useEffect(() => {
    // console.log(multiChoice, selection)
    if (!multiChoice || selection == undefined) return
    if (!checkDirty(dirtyFields, prefix)) return
    // console.log('setValue', name, parameter.availableValues[selection].default)
    setValue(name, parameter.availableValues[selection].default, { shouldDirty: true })
  }, [selection])

  useEffect(() => {
    // console.log(parameter.key, show, form)
    if (!show) unregister(name)
    else trigger(name)
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
      const { type, selections } = parameter
      if (selections) {
        return readonly
          ? (field: ControllerRenderProps) => (
              <Chip sx={{ my: 0.5 }}>{type == 'int' ? selections[field.value] : field.value}</Chip>
            )
          : ({ value, onChange, ...field }: ControllerRenderProps) => (
              <Select
                {...field}
                value={type == 'int' ? value : selections!.indexOf(value)}
                onChange={(_, value) =>
                  onChange(type == 'int' ? parseInt(value) : selections![value])
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
      }
      switch (type) {
        case 'bool':
          return readonly
            ? (field: ControllerRenderProps) => (
                <Typography level="h6" color="primary">
                  {field.value ? 'True' : 'False'}
                </Typography>
              )
            : ({ value, ...field }: ControllerRenderProps) => (
                <Switch {...field} checked={value} sx={{ my: 0.5 }} />
              )
        case 'tuple2':
        case 'tuple3':
        case 'tuple4':
          return readonly
            ? (field: ControllerRenderProps) => (
                <Typography level="h6" color="primary">
                  {'(' + field.value.join(', ') + ')'}
                </Typography>
              )
            : (field: ControllerRenderProps) => (
                <TupleInput
                  {...field}
                  length={parseInt(type.at(-1) ?? '2')}
                  sx={{ my: 0.5 }}
                  size="sm"
                />
              )
        case 'dict':
          return ({ ref: _, ...field }: ControllerRenderProps) => (
            <FormModal
              {...field}
              parameter={multiChoice ? parameter.availableValues[selection!] : parameter}
              readonly={readonly}
            />
          )
        case 'list':
          return ({ ref: _, ...field }: ControllerRenderProps) => (
            <ListModal {...field} parameter={parameter} readonly={readonly} />
          )
        case 'file':
          return ({ ref: _, onBlur, ...field }: ControllerRenderProps) => (
            <FileUpload
              {...field}
              readonly={readonly}
              onRemove={() => {
                field.onChange('')
                onBlur()
              }}
            />
          )
        case 'model':
          return ({ ref: _, ...field }: ControllerRenderProps) => (
            <ModelInput {...field} readonly={readonly} />
          )
        case 'int':
        case 'float':
          return readonly
            ? (field: ControllerRenderProps) => (
                <Typography level="h6" color="primary">
                  {field.value}
                </Typography>
              )
            : ({ onChange, ...field }: ControllerRenderProps) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => onChange(Number(e.target.value))}
                  sx={{ my: 0.5 }}
                  size="sm"
                />
              )
        default:
          return readonly
            ? (field: ControllerRenderProps) => (
                <Typography level="h6" color="primary">
                  {field.value}
                </Typography>
              )
            : (field: ControllerRenderProps) => <Input {...field} sx={{ my: 0.5 }} size="sm" />
      }
    })()
    const helperText = !simple && <FormHelperText>{parameter.description}</FormHelperText>
    return ({ field, fieldState, formState }) => (
      <Box>
        <FormLabel
          sx={(theme) => ({
            color: fieldState.invalid ? theme.vars.palette.danger[400] : undefined,
          })}
        >
          {checkDirty(formState.dirtyFields, name) && (
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
  }, [parameter, name, readonly, multiChoice, selection])

  return show ? (
    <Controller
      name={name}
      defaultValue={parameter.default}
      render={renderBox}
      rules={{
        validate: (v) => v !== '',
      }}
    />
  ) : null
}
