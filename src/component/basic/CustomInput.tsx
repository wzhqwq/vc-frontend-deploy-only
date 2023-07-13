import SearchRounded from '@mui/icons-material/SearchRounded'

import { Box, Input, InputProps, Switch, SwitchProps, Typography } from '@mui/joy'
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react'

export const SearchInput = (props: InputProps) => (
  <Input {...props} variant="soft" startDecorator={<SearchRounded />} />
)

export interface TupleInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  readonly value: number[]
  readonly length: number
  onChange: (value: number[]) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}
export const TupleInput = memo(
  forwardRef<HTMLInputElement, TupleInputProps>(
    (
      { value, onChange, onBlur, sx, size, length }: TupleInputProps,
      ref: React.Ref<HTMLInputElement>,
    ) => {
      const [values, setValues] = useState<string[]>([])
      const onChangeRef = useRef<(value: number[]) => void>()

      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues((values) => values.map((v, i) => (i === Number(name.slice(1)) ? value : v)))
      }, [])

      useEffect(() => {
        setValues((values) => {
          let newValues = value.map((v) => v.toString())
          if (newValues.length == values.length && newValues.every((v, i) => v === values[i]))
            return values
          return newValues
        })
      }, [value])
      useEffect(() => {
        onChangeRef.current = onChange
      }, [onChange])

      useEffect(() => {
        onChangeRef.current?.(values.map((v) => (v ? Number(v) : 0)))
      }, [values])

      return (
        <Box
          sx={{
            ...sx,
            display: 'grid',
            gridTemplateColumns: `repeat(${length}, 1fr)`,
            gap: 1,
          }}
        >
          {values.map((v, i) => (
            <Input
              name={`v${i}`}
              type="number"
              value={v}
              onChange={handleChange}
              onBlur={onBlur}
              size={size}
              ref={!i ? ref : undefined}
              key={i}
            />
          ))}
        </Box>
      )
    },
  ),
)

export interface BigSwitchProps extends SwitchProps {
  onLabel: string
  offLabel: string
}
export const BigSwitch = memo(
  forwardRef<HTMLDivElement, BigSwitchProps>(
    ({ onLabel, offLabel, ...rest }: BigSwitchProps, ref) => {
      return (
        <Switch
          {...rest}
          slotProps={{
            track: {
              children: (
                <>
                  <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                    {onLabel}
                  </Typography>
                  <Typography component="span" level="inherit" sx={{ mr: '10px' }}>
                    {offLabel}
                  </Typography>
                </>
              ),
            },
          }}
          sx={{
            '--Switch-thumbSize': '30px',
            '--Switch-thumbWidth': '36px',
            '--Switch-trackWidth': '80px',
            '--Switch-trackHeight': '36px',
          }}
          ref={ref}
        />
      )
    },
  ),
)
