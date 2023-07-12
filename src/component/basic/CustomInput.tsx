import SearchRounded from '@mui/icons-material/SearchRounded'

import { Box, Input, InputProps } from '@mui/joy'
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react'

export const SearchInput = (props: InputProps) => (
  <Input {...props} variant="soft" startDecorator={<SearchRounded />} />
)

interface TupleInputProps extends Omit<InputProps, 'onChange' | 'value'> {
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
      }, [])

      useEffect(() => {
        setValues(value.map((v) => v.toString()))
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
            />
          ))}
        </Box>
      )
    },
  ),
)
